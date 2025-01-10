'use server';

import { readFile, writeFile } from 'node:fs/promises';
import { revalidateTag } from 'next/cache';

export async function submitComment(formData: FormData) {
  const existingComments = JSON.parse(await readFile('comments.json', 'utf8'));

  const comment = formData.get('comment') as string;

  await writeFile('comments.json', JSON.stringify([...(existingComments as string[]), comment]));

  revalidateTag('comments');
}
