<?php

namespace App\Http\Controllers;

use App\Models\Post;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        return Inertia::render('Posts/Index', ['posts' => Post::with('user')->get(),]);
    }
    public function create()
    {
        return Inertia::render('Posts/Create');
    }
    public function store(Request $request)
    {
        $validate = $request->validate(['title' => ['required', 'max:255'], 'content' => ['required']]);
        Post::create([...$validate, 'user_id' => Auth::id()]);

        return redirect()->route('posts.index');
    }
    public function edit(Post $post)
    {
        return Inertia::render('Posts/Edit', ['post' => $post]);
    }
    public function update(Request $request, Post $post)
    {
        $request->validate(['title' => ['required', 'max:255'], 'content' => ['required']]);
        $post->update($request->all());

        return redirect()->route('posts.index');
    }
    public function destroy(Post $post)
    {
        $post->delete();
        return redirect()->route('posts.index');
    }
}
