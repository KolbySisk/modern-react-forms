import { OptimisticComments } from './optimistic-comments';

export default async function AddCommentPage() {
  const comments = await getComments();

  return <OptimisticComments comments={comments} />;
}

async function getComments(): Promise<string[]> {
  const response = await fetch('http://localhost:3000/api/comments', {
    next: { tags: ['comments'] },
  });

  return await response.json();
}
