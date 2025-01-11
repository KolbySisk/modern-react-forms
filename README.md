# Here's what we'll be exploring

- Server Actions: asynchronous functions that are executed on the server.
- useActionState: a Hook that allows you to update state based on the result of a form action.
- useOptimistic: optimistically update your UI after submitting a form.
- revalidateTag: purge cached data after a mutation.
- Form: a Next.js component that provides prefetching, client-side navigation on submission, and progressive enhancement.

# Server Actions

A Server Action is an asynchronous function that runs on a server. They can be called in Server and Client Components to handle form submissions and data mutations.

Here's a basic example of a Server Action.
```
'use server';

import { revalidateTag } from 'next/cache';

export async function submitComment(formData: FormData) {
  const comment = formData.get('comment') as string;

  await postComment(comment);

  revalidateTag('comments');
}
```

And this is how we would use that Server Action.
```
'use client';

import { submitComment } from './action';

export function CommentForm() {
  return (
    <form action={submitComment}>
      <textarea name="comment" placeholder="write your comment here" required />
      <button type="submit">Submit</button>
    </form>
  );
}
```

Our submitComment Server Action can be imported directly into our Client Component and passed as the action for the form element. When the form is submitted it calls the function and provides the formData as a param. This Server Action is performing a mutation by creating a record in a database. After a mutation you'll typically need to purge the cache of previously cached requests, which we can do by calling revalidateTag.

# useActionState

Now let's expand on this and build a more complex form. This form will include data validation, error states, and pending states. We can facilitate all of these with React's useActionState hook.
```
'use client';

import { useActionState } from 'react';
import { submitFeedback } from './action';

export function FeedbackForm() {
  const [state, formAction, pending] = useActionState(submitFeedback, null);

  return (
    <form action={formAction}>
      <fieldset>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" placeholder="name" defaultValue={state?.values?.name ?? ''} required />
        {state?.errors?.name && <p aria-live="polite">{state.errors.name}</p>}
      </fieldset>
      <fieldset>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder="email" defaultValue={state?.values?.email ?? ''} required />
        {state?.errors?.email && <p aria-live="polite">{state.errors.email}</p>}
      </fieldset>
      <fieldset>
        <label htmlFor="feedback">Feedback</label>
        <textarea name="feedback" placeholder="write your feedback here" defaultValue={state?.values?.feedback ?? ''} />
        {state?.errors?.feedback && <p aria-live="polite">{state.errors.feedback}</p>}
      </fieldset>

      {state?.success && (
        <p aria-live="polite" className="text-green-700">
          Feedback submitted successfully!
        </p>
      )}

      <button type="submit" disabled={pending}>
        Submit
      </button>
    </form>
  );
}
```

Notice that instead of providing the Server Action to form element, we provide it to the useActionState hook. It also accepts initial values, which this form doesn't include, so we pass null.

The state value returned from the hook is the data that is returned from our Server Action, and the hook provides a pending state which we can use to disable our button while the Server Action is executing.

```
'use server';

import { z } from 'zod';

const feedbackSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  feedback: z.string().min(10).max(1000),
});

export async function submitFeedback(_: unknown, formData: FormData) {
  const formValues = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    feedback: formData.get('feedback') as string,
  };

  const { success, error, data } = feedbackSchema.safeParse(formValues);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      values: formValues,
    };
  }

  // Do something with data
  console.log(data);

  return {
    success: true,
  };
}
```

In this example the Server Action includes validation via Zod. If the data provided doesn't pass Zod's validation it'll provide errors which we can return to client. These become available via the state value, and we can render an error message by accessing that state: `{state?.errors?.name && <p aria-live="polite">{state.errors.name}</p>}`

You'll also notice that we return the values provided to the Server Action. By default, our form is reset after submitting it. To prevent this, we add a defaultState to our inputs, and set it to the values returned from the Server Action `defaultValue={state?.values?.name ?? ''}`.

# useOptimistic
Optimistic Updates is a technique used to improve the user experience by immediately showing UI updates to the user, rather than waiting for the Server State to be updated and cache revalidated. React now provides a hook to make Optimistic Updates much easier.
```
'use client';

import { useOptimistic } from 'react';
import { submitComment } from './action';

export function OptimisticComments({ comments }: { comments: string[] }) {
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment: string) => [...state, newComment]
  );

  async function handleFormSubmit(formData: FormData) {
    addOptimisticComment(formData.get('comment') as string);
    await submitComment(formData);
  }

  return (
    <>
      <section className="m-auto w-fit my-10">
        <h1>Comments</h1>
        <ol>
          {optimisticComments.map((comment) => (
            <li key={comment}>{comment}</li>
          ))}
        </ol>
      </section>
      <section>
        <form action={handleFormSubmit}>
          <textarea name="comment" placeholder="write your comment here" required />
          <button type="submit">Submit</button>
        </form>
      </section>
    </>
  );
}
```

We start by providing the hook with the current state. In this case, a list of comments. The hook provides a way to get the optimistic value, and a way to update it. We use optimisticComments to render out list of comments. After submitting the form we call addOptimisticComment and provide it with our new comment. Immediately, the UI is updated to show the new comment in the list. Meanwhile, we've called our Server Action to update the Server State and revlidate the cache. If an error was to occur while running our Server Action, the UI would fallback and undo the optimistic update.

# Form
The Form component provide by Next.js is a handy way to prefetch data, update Search Params in the URL, or provide progress enhancements. In this example, we'll use it to facilitate searching through a list of comments by updating a Search Param in the URL.
```
import { Search } from './search';

export default async function SearchPage(props: {
  searchParams: Promise<{ query: string }>;
}) {
  const searchParams = await props.searchParams;
  const comments = await getComments(searchParams.query);

  return <Search comments={comments} />;
}
```

First, in our Server Component, we use a Search Param named query when fetching our comments.
```
import Form from 'next/form';

export function Search({ comments }: { comments: string[] }) {
  return (
    <>
      <section className="m-auto w-fit my-10">
        <h1>Comments</h1>
        <ol>
          {comments.map((comment) => (
            <li key={comment}>{comment}</li>
          ))}
        </ol>
      </section>
      <section>
        <Form action="/search">
          <input name="query" placeholder="search for comment" />
          <button type="submit">Submit</button>
        </Form>
      </section>
    </>
  );
}
```
In our UI component we use Next.js' Form component and provide it the path that we want to prefetch. In this example we are on the search route already so it will refetch the data for the page. The name provided to the input will become the name of the Search Param that is updated, and the value of the input will be the Search Param value. When the form is submitted it will use the Search Param when fetching the comments to return results that match our query.
