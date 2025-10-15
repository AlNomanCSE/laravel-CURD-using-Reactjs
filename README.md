# Laravel + Inertia.js + React Blog

A full-stack blog application built with Laravel (backend), Inertia.js (bridge), and React with TypeScript (frontend). This project demonstrates how to build a modern SPA experience without writing a separate REST API.

## 🚀 Tech Stack

- **Backend**: Laravel 11.x
- **Frontend**: React 18 with TypeScript
- **Bridge**: Inertia.js
- **Styling**: Tailwind CSS
- **Database**: SQLite (easily switchable to MySQL/PostgreSQL)
- **Authentication**: Laravel Breeze

## 📋 Features

- ✅ User Authentication (Login/Register)
- ✅ Create, Read, Update, Delete (CRUD) blog posts
- ✅ Posts are associated with users
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Form validation
- ✅ Protected routes (authentication required)

## 🏗️ Project Structure

```
project-root/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── PostController.php    # Handles all post operations
│   └── Models/
│       ├── Post.php                  # Post model
│       └── User.php                  # User model
├── database/
│   └── migrations/
│       └── xxxx_create_posts_table.php
├── resources/
│   └── js/
│       ├── pages/
│       │   ├── Posts/
│       │   │   ├── Index.tsx         # List all posts
│       │   │   ├── Create.tsx        # Create new post
│       │   │   └── Edit.tsx          # Edit existing post
│       │   └── dashboard.tsx
│       └── layouts/
│           └── app-layout.tsx        # Main layout with nav
└── routes/
    └── web.php                       # All routes defined here
```

## 🔄 How It Works

### The Inertia.js Magic

Unlike traditional approaches where you build a separate REST API, Inertia.js creates a bridge:

```
Traditional SPA:
React → REST API (Laravel) → Database → JSON → React

With Inertia.js:
React → Laravel Routes → Database → JSON → React (no page reload)
```

**Key Benefits:**
- No need to build separate API endpoints
- Server-side routing (Laravel)
- Client-side rendering (React)
- No page reloads (SPA experience)

---

## 📖 Understanding the Request Flow

### Example: Creating a Blog Post

#### 1️⃣ **User clicks "Create Post"**
```tsx
// Posts/Index.tsx
<Link href={'/posts/create'}>Create Post</Link>
```
- Inertia intercepts the click
- Sends: `GET /posts/create`

#### 2️⃣ **Laravel routes the request**
```php
// routes/web.php
Route::resource('posts', PostController::class)->middleware('auth');
// This creates 7 RESTful routes automatically
```

#### 3️⃣ **Controller returns the form**
```php
// PostController.php
public function create()
{
    return Inertia::render('Posts/Create');
}
```
- Returns JSON with component name
- Inertia renders React component

#### 4️⃣ **User fills form and submits**
```tsx
// Posts/Create.tsx
const { data, post } = useForm({
    title: '',
    content: '',
});

const handleSubmit = (e) => {
    e.preventDefault();
    post('/posts'); // Sends POST request
};
```

#### 5️⃣ **Laravel validates and saves**
```php
public function store(Request $request)
{
    $request->validate([
        'title' => ['required', 'max:255'],
        'content' => ['required']
    ]);
    
    Post::create([
        'title' => $request->title,
        'content' => $request->content,
        'user_id' => Auth::id()
    ]);
    
    return redirect()->route('posts.index');
}
```

#### 6️⃣ **Redirects to posts list**
- Inertia fetches: `GET /posts`
- Controller returns all posts
- React re-renders with new data

---

## 🛣️ Routes Explained

### What `Route::resource()` Creates

```php
Route::resource('posts', PostController::class);
```

This **single line** creates **7 routes**:

| HTTP Method | URL | Controller Method | Purpose |
|-------------|-----|-------------------|---------|
| GET | `/posts` | `index()` | List all posts |
| GET | `/posts/create` | `create()` | Show create form |
| POST | `/posts` | `store()` | Save new post |
| GET | `/posts/{id}` | `show()` | Show single post |
| GET | `/posts/{id}/edit` | `edit()` | Show edit form |
| PUT/PATCH | `/posts/{id}` | `update()` | Update post |
| DELETE | `/posts/{id}` | `destroy()` | Delete post |

### How Laravel Knows Which Method to Call

**Example 1: Edit vs Delete (same URL, different HTTP method)**

```tsx
// Edit button - Uses GET
<Link href={`/posts/${post.id}/edit`}>Edit</Link>
// Sends: GET /posts/5/edit → calls edit()

// Delete button - Uses DELETE
<Link href={`/posts/${post.id}`} method="delete">Delete</Link>
// Sends: DELETE /posts/5 → calls destroy()
```

**Example 2: Route Model Binding**

```php
public function edit(Post $post)
{
    // Laravel automatically does this:
    // $post = Post::findOrFail($id);
    
    return Inertia::render('Posts/Edit', ['post' => $post]);
}
```

When you visit `/posts/5/edit`:
1. Laravel extracts `5` from the URL
2. Runs `Post::findOrFail(5)` automatically
3. Passes the Post object to your method

---

## 🗄️ Database Models

### Post Model

```php
// app/Models/Post.php
class Post extends Model
{
    protected $fillable = [
        'title',
        'content',
        'user_id',  // Important: Must be in fillable!
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

### Migration

```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('content');
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->timestamps();
});
```

---

## 🎨 Frontend Components

### Receiving Data in React

```tsx
// Posts/Index.tsx
interface Post {
    id: number;
    title: string;
    content: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    user?: {
        name: string;
    };
}

export default function Posts({ posts }: { posts: Post[] }) {
    return (
        <div>
            {posts.map((post) => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <small>By {post.user?.name}</small>
                </div>
            ))}
        </div>
    );
}
```

### Form Handling with Inertia

```tsx
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, errors } = useForm({
    title: '',
    content: '',
});

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/posts');
};
```

**Key Points:**
- `data`: Form state
- `setData()`: Update form fields
- `post()`: Submit form
- `processing`: Loading state
- `errors`: Validation errors from Laravel

---

## 🔒 Authentication & Middleware

### Protecting Routes

```php
// routes/web.php
Route::resource('posts', PostController::class)
    ->middleware('auth');
```

**What happens:**
- Unauthenticated users are redirected to login
- `Auth::id()` is available in controllers
- Similar to Spring Security or Passport.js

### Getting Current User

```php
// In Controller
Auth::id()           // Get user ID
Auth::user()         // Get full user object
Auth::check()        // Check if authenticated
```

---

## 🚦 Common Operations

### Create a New Post

**Frontend:**
```tsx
post('/posts', {
    onSuccess: () => {
        // Handle success
    },
    onError: (errors) => {
        // Handle validation errors
    }
});
```

**Backend:**
```php
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => ['required', 'max:255'],
        'content' => ['required']
    ]);
    
    Post::create([
        ...$validated,
        'user_id' => Auth::id()
    ]);
    
    return redirect()->route('posts.index');
}
```

### Update a Post

**Frontend:**
```tsx
put(`/posts/${post.id}`, {
    onSuccess: () => {
        // Handle success
    }
});
```

**Backend:**
```php
public function update(Request $request, Post $post)
{
    $validated = $request->validate([
        'title' => ['required', 'max:255'],
        'content' => ['required']
    ]);
    
    $post->update($validated);
    
    return redirect()->route('posts.index');
}
```

### Delete a Post

**Frontend:**
```tsx
<Link 
    href={`/posts/${post.id}`} 
    method="delete"
    as="button"
    onBefore={() => confirm('Are you sure?')}
>
    Delete
</Link>
```

**Backend:**
```php
public function destroy(Post $post)
{
    $post->delete();
    return redirect()->route('posts.index');
}
```

---

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd project-name

# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create SQLite database
touch database/database.sqlite
```

### 3. Database Setup

```bash
# Run migrations
php artisan migrate

# (Optional) Seed with sample data
php artisan db:seed
```

### 4. Run Development Servers

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

Visit: `http://localhost:8000`

---

## 📝 Key Differences from Other Frameworks

### vs Spring Boot + React

**Spring Boot:**
```java
@RestController
@RequestMapping("/api/posts")
public class PostController {
    @GetMapping
    public List<Post> index() {
        return postRepository.findAll();
    }
}
```

**Laravel + Inertia:**
```php
public function index()
{
    return Inertia::render('Posts/Index', [
        'posts' => Post::all()
    ]);
}
```

**Key Difference:** No separate `/api` routes needed!

### vs Express + React

**Express:**
```javascript
app.get('/api/posts', (req, res) => {
    res.json(posts);
});
```

**Laravel + Inertia:**
```php
return Inertia::render('Posts/Index', [
    'posts' => Post::all()
]);
```

**Key Difference:** Props passed directly to React components!

---

## 🐛 Common Issues & Solutions

### Issue 1: `NOT NULL constraint failed: posts.user_id`

**Problem:** `user_id` not in `$fillable` array

**Solution:**
```php
// app/Models/Post.php
protected $fillable = [
    'title',
    'content',
    'user_id', // Add this!
];
```

### Issue 2: Posts not showing in Index

**Problem:** Not passing props to component

**Solution:**
```tsx
// Make sure to accept props
export default function Posts({ posts }: { posts: Post[] }) {
    // ...
}
```

### Issue 3: Validation errors not displaying

**Problem:** Not showing `errors` from `useForm`

**Solution:**
```tsx
{errors.title && (
    <p className="text-red-600">{errors.title}</p>
)}
```

---

## 📚 Useful Commands

```bash
# View all routes
php artisan route:list

# Create a new controller
php artisan make:controller PostController --resource

# Create a new model with migration
php artisan make:model Post -m

# Clear all caches
php artisan optimize:clear

# Run tests
php artisan test
```

---

## 🔗 Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---



## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

**Happy Coding! 🚀**