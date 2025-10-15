import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/posts',
    },
];
interface Post {
    id: number;
    title: string;
    content: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    user?: {
        name: string;
        email: string;
    };
}
export default function Posts({ posts }: { posts: Post[] }) {
    console.log(posts);
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className='container ms-auto p-4'>
                <div className='flex justify-between items-center mb-4'>
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                        Blog post
                    </h1>
                    <Link href={'/posts/create'} className='bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700'>
                        Create Post
                    </Link>
                </div>
                <div className='overflow-x-auto'>
                    <table className="table-auto">
                        <thead>
                            <tr>
                                <th>
                                    ID
                                </th>
                                <th >
                                    Title
                                </th>
                                <th>
                                    Content
                                </th>
                                <th >
                                    Created By
                                </th>
                                <th >
                                    Created At
                                </th>
                                <th >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className='border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-gray-500 dark:text-gray-400'>
                                        No posts found. Create your first post!
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id} className='hover:bg-gray-50 dark:hover:bg-gray-800'>
                                        <td className='border border-gray-300 dark:border-gray-700 px-4 py-2'>
                                            {post.id}
                                        </td>
                                        <td className='border border-gray-300 dark:border-gray-700 px-4 py-2'>
                                            {post.title}
                                        </td>
                                        <td className='border border-gray-300 dark:border-gray-700 px-4 py-2'>
                                            {post.content.substring(0, 50)}...
                                        </td>
                                        <td className='border border-gray-300 dark:border-gray-700 px-4 py-2'>
                                            {post.user?.name || 'Unknown'}
                                        </td>
                                        <td className='border border-gray-300 dark:border-gray-700 px-4 py-2'>
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </td>
                                        <td className='border border-gray-300 dark:border-gray-700 px-4 py-2'>
                                            <div className='flex gap-2'>
                                                <Link
                                                    href={`/posts/${post.id}/edit`}
                                                    className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/posts/${post.id}`}
                                                    method="delete"
                                                    as="button"
                                                    className='text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                                                    onBefore={() => confirm('Are you sure you want to delete this post?')}
                                                >
                                                    Delete
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}