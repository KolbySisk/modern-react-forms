import Link from 'next/link';

export default function Home() {
  return (
    <ul className="flex flex-col m-auto w-fit content-center h-screen justify-center gap-2">
      <Link className="hover:underline" href="/comments">
        Revalidate Example
      </Link>
      <Link className="hover:underline" href="/optimistic-comments">
        Optimistic Example
      </Link>
      <Link className="hover:underline" href="/feedback">
        Error handling Example
      </Link>
      <Link className="hover:underline" href="/search">
        Next.js Search component
      </Link>
    </ul>
  );
}
