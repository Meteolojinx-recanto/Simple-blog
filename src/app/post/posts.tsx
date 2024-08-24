import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import IPost from '../interfaces/post';

interface PostsProps {
  post: IPost;
  key: number
}

const Posts: React.FC<PostsProps> = ({ post, key }) => {
  return (
    <div key={key} className='max-w-4xl  bg-white rounded-lg shadow-md'>
      {post.image && (
        <div className='relative w-full h-24'>
          <Image
            className='max-h-80 rounded-lg w-full object-cover transition-transform duration-300 transform group-hover:scale-105'
            src={post.image}
            layout='fill'
            alt={post.title || 'Post Image'}
          />
        </div>
      )}
      <div className='mt-2 p-2'>
        <Link href={`/post/${post.id}`} className='text-2xl text-gray-700 font-bold hover:text-gray-600'>
          {post.title}
        </Link>
      </div>
      <div className='m-2 w-10'>
      <span className='font-light text-gray-600 text-xs'>
        {new Date(post.createdAt).toLocaleDateString()}
      </span>
    </div>
    </div>
  );
};

export default Posts;
