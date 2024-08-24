'use client';
import { useEffect, useState } from 'react';
import IPost from './interfaces/post';
import Link from 'next/link';
import Posts from './post/posts';

export default function Home() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [search, setSearch] = useState<string>('');

  async function fetchPosts(query: string = '') {
    const response = await fetch(`/api/posts?search=${encodeURIComponent(query)}`);
    const data = await response.json();
    setPosts(data);
  }

  useEffect(() => {
    fetchPosts(search);
  }, [search]);

  return (
    <main className='flex min-h-screen flex-col bg-gray-100'>
      <div className='flex justify-end p-6'>
        <Link
          href='/post/create'
          className='bg-[#DB4A2B] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#DB4A2B]/80 transition-colors'
        >
          Create Post
        </Link>
      </div>
      <section className='flex flex-col items-center'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Posts</h1>
        <input
          type='text'
          placeholder='Search by title...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='mb-4 p-2 border border-gray-300 rounded-lg'
        />
        <div className='w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {posts.length > 0 ? (
            posts.map((post) => <Posts key={post.id} post={post} />)
          ) : (
            <p className='text-gray-600'>No posts available.</p>
          )}
        </div>
      </section>
    </main>
  );
}
