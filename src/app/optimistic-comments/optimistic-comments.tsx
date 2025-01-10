'use client';

import { type KeyboardEvent, useOptimistic } from 'react';
import { submitComment } from './action';

export function OptimisticComments({ comments }: { comments: string[] }) {
  const [optimisticComments, addOptimisticComment] = useOptimistic(comments, (state, newComment: string) => [
    ...state,
    newComment,
  ]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      event.currentTarget.form?.requestSubmit();
    }
  }

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
          <textarea name="comment" placeholder="write your comment here" required onKeyDown={handleKeyDown} />
          <button type="submit">Submit</button>
        </form>
      </section>
    </>
  );
}
