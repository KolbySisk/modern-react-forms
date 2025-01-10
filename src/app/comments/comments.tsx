'use client';

import type { KeyboardEvent } from 'react';
import { submitComment } from './action';

export function Comments({ comments }: { comments: string[] }) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      event.currentTarget.form?.requestSubmit();
    }
  }

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
        <form action={submitComment}>
          <textarea name="comment" placeholder="write your comment here" required onKeyDown={handleKeyDown} />
          <button type="submit">Submit</button>
        </form>
      </section>
    </>
  );
}
