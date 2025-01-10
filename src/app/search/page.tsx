import { Search } from './search';

export default async function SearchPage(props: {
  searchParams: Promise<{ query: string }>;
}) {
  const searchParams = await props.searchParams;
  const comments = await getComments(searchParams.query);

  return <Search comments={comments} />;
}

async function getComments(searchQuery?: string): Promise<string[]> {
  const response = await fetch('http://localhost:3000/api/comments', {
    next: { tags: ['comments'] },
  });

  const comments = await response.json();

  if (!searchQuery) return comments;

  return comments.filter((comment: string) => comment.toLowerCase().includes(searchQuery.toLowerCase()));
}
