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
