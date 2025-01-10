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
