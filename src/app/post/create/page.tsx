'use client'
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation'

const style = {
  container: "max-w-xl mx-auto p-6"
}

interface IPOST {
  title: string;
  content: string;
  image: File | null;
}

const CreatePost = () => {
  const router = useRouter()
  const [post, setPost] = useState<IPOST>({
    title: '',
    content: '',
    image: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value
    });
  };

  const handleChangeImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPost({
        ...post,
        image: e.target.files[0]
      });
    }
  };

  async function createPost(post: IPOST) {
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.content);
    if (post.image) {
      formData.append('image', post.image);
    }

    try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
            throw new Error('Server error');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating post:', error);
    }
}


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createPost(post);
    router.push('/')
  }

  return (
    <div className={style.container}>
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Create New Post</h1>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#DB4A2B]"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-lg font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              name="content"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-[#DB4A2B]"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-lg font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChangeImg}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#DB4A2B]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#DB4A2B] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#DB4A2B]/80 transition-colors"
          >
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default CreatePost;
