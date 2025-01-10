import { readFile } from 'node:fs/promises';

export async function GET() {
  const comments = await readFile('comments.json');
  return new Response(comments);
}
