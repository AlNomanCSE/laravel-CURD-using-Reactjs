import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Post',
        href: '/posts/edit',
    }
];

interface Post {
    id: number;
    title: string;
    content: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export default function EditPost({ post: postData }: { post: Post }) {
    const { data, setData, put, processing, errors } = useForm({
        title: postData.title,
        content: postData.content,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/posts/${postData.id}`,
            // optional
            // {
            // onSuccess: () => {
            // Optionally handle success (e.g., redirect or show a message)
            // },
            // }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Post" /> {/* Updated title to match the page */}
            <div className='p-6 flex items-center justify-center min-h-screen relative '>
                <div className='max-w-lg w-full p-6 dark:border rounded-lg shadow-md'>
                    <Link
                        href="/posts"
                        className='absolute top-6 right-6 inline-flex items-center px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm'
                    >
                        Back to Posts
                    </Link>
                    <h1 className='text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center'>Edit Post</h1>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div>
                            <label htmlFor="title" className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Title</label>
                            <input
                                type="text"
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500'
                            />
                            {errors.title && <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.title}</p>}
                        </div>
                        <div>
                            <label htmlFor="content" className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Content</label>
                            <textarea
                                id="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500'
                                rows={6}
                            />
                            {errors.content && <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.content}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className='w-full px-4 py-2 bg-amber-400 text-white rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-200 text-lg'
                        >
                            {processing ? ' Updaing ...' : ' Update Post'}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}