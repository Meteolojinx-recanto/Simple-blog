'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'

interface IPost {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
}

const PostId = ({ params }) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{ title: string; content: string; image?: File | null }>({
    title: '',
    content: '',
    image: null,
  });
  const [post, setPost] = useState<IPost | null>(null);

  async function fetchPost(id: number) {
    const response = await fetch(`/api/posts?id=${id}`);
    const data = await response.json();
    setPost(data);
    setFormData({ title: data.title, content: data.content, image: null });
  }

  useEffect(() => {
    fetchPost(params.id);
  }, [params.id]);

  const handleEdit = () => setIsEditing(true);

  const handleDelete = async () => {
    if (params.id) {
      await fetch(`/api/posts?id=${params.id}`, {
        method: 'DELETE',
      });
      router.push('/')
    }
  };

  const handleSave = async () => {
    if (params.id) {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('content', formData.content);
      if (formData.image) {
        form.append('image', formData.image);
      }

      await fetch(`/api/posts?id=${params.id}`, {
        method: 'PATCH',
        body: form,
      });

      setIsEditing(false);
      fetchPost(params.id);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <>
      <Link className='text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-[#DB4A2B]/10 transition-color' href='/'>
        Back
      </Link>
      <div className='max-w-4xl px-10 my-4 py-6 bg-white rounded-lg shadow-md'>
        <div className='mt-2'>
          <span className='font-light text-gray-600 text-xs'>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        {isEditing ? (
          <div>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              className='block w-full mb-4 border rounded p-2'
            />
            <textarea
              name='content'
              value={formData.content}
              onChange={handleInputChange}
              className='block w-full mb-4 border rounded p-2'
            />
            <input type='file' onChange={handleChangeImg} className='block mb-4' />
            {post.image && (
              <Image
                className='object-cover w-full h-64 mt-4'
                src={post.image}
                width={800}
                height={400}
                alt={post.title || 'Post Image'}
              />
            )}
            <button onClick={handleSave} className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className='ml-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600'
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <h1 className='text-2xl font-bold text-gray-700'>{post.title}</h1>
            {post.image && (
              <div className='relative w-full h-64 mt-4'>
                <Image
                  className='object-cover w-full h-full'
                  src={post.image}
                  layout='fill'
                  alt={post.title || 'Post Image'}
                />
              </div>
            )}
            <p className='mt-4 text-gray-600'>{post.content}</p>
            <div className='flex my-3'>
              <button onClick={handleEdit} className='bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600'>
                Edit
              </button>
              <button onClick={handleDelete} className='ml-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600'>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PostId;
