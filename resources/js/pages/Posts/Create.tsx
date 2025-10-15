import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Post',
        href: '/posts/create',
    }
];

export default function Dashboard() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/posts', {
            onSuccess: () => {
                // Optionally handle success (e.g., redirect or show a message)
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Post" />
            <div className='container ms-auto p-4 flex items-center justify-center min-h-screen relative'>
                <div className='max-w-lg w-full'>
                    <Link
                        href="/posts"
                        className='absolute top-4 right-4 inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400'
                    >
                        Back to Posts
                    </Link>
                    <h1 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 text-center'>Create New Post</h1>
                    <form onSubmit={handleSubmit} className='max-w-lg w-full'>
                        <div className='mb-4'>
                            <label htmlFor="title" className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Title</label>
                            <input
                                type="text"
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className='mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-100'
                            />
                            {errors.title && <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.title}</p>}
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="content" className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Content</label>
                            <textarea
                                id="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className='mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-100'
                                rows={4}
                            />
                            {errors.content && <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.content}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className='inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 w-full text-center'
                        >
                            Submit Post
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}