<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    // Proteksi semua endpoint dengan auth:sanctum
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $articles = Article::with(['author:id,name,email', 'category:id,name'])
                ->orderBy('created_at', 'desc')
                ->paginate(20);
        } elseif ($user->isWriter()) {
            $articles = Article::with(['category:id,name'])
                ->where('author_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate(20);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $articles
        ]);
    }

    public function myArticles(Request $request)
    {
        $user = $request->user();

        if (!$user->isWriter()) {
            return response()->json([
                'success' => false,
                'message' => 'Only writers can access this endpoint'
            ], 403);
        }

        $articles = Article::with(['category:id,name'])
            ->where('author_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $articles
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required',
            'excerpt' => 'nullable|string|max:500',
            'featured_image' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'nullable|in:draft,pending',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if (!$user->isWriter() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        try {
            DB::beginTransaction();

            $slug = Str::slug($request->title) . '-' . time();

            $status = $request->status ?? 'draft';

            $article = Article::create([
                'title' => $request->title,
                'slug' => $slug,
                'content' => $request->content,
                'excerpt' => $request->excerpt,
                'featured_image' => $request->featured_image,
                'category_id' => $request->category_id,
                'author_id' => $user->id,
                'status' => $status,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Article created successfully',
                'data' => $article->load(['category:id,name', 'author:id,name,email'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create article: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Article $article)
    {
        $user = request()->user();

        if ($user->isAdmin()) {
            return response()->json([
                'success' => true,
                'data' => $article->load(['category', 'author:id,name,email', 'publisher:id,name,email'])
            ]);
        }

        if ($user->isWriter() && $article->author_id === $user->id) {
            return response()->json([
                'success' => true,
                'data' => $article->load(['category', 'author:id,name,email'])
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Access denied'
        ], 403);
    }

    public function update(Request $request, Article $article)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes',
            'excerpt' => 'nullable|string|max:500',
            'featured_image' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'sometimes|in:draft,pending,rejected,published',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if ($user->isAdmin()) {
            $article->update($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Article updated successfully',
                'data' => $article->fresh()
            ]);
        }

        if ($user->isWriter() && $article->author_id === $user->id) {
            if (!in_array($article->status, ['draft', 'rejected'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot edit article with status: ' . $article->status
                ], 422);
            }

            $article->update($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Article updated successfully',
                'data' => $article->fresh()
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Access denied'
        ], 403);
    }

    public function destroy(Article $article)
    {
        $user = request()->user();

        if ($user->isAdmin()) {
            $article->delete();
            return response()->json([
                'success' => true,
                'message' => 'Article deleted successfully'
            ]);
        }

        if ($user->isWriter() && $article->author_id === $user->id) {
            if ($article->status !== 'draft') {
                return response()->json([
                    'success' => false,
                    'message' => 'Can only delete draft articles'
                ], 422);
            }
            $article->delete();
            return response()->json([
                'success' => true,
                'message' => 'Article deleted successfully'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Access denied'
        ], 403);
    }

    public function submit(Request $request, Article $article)
    {
        $user = $request->user();

        if (!$user->isWriter() || $article->author_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        if (!in_array($article->status, ['draft', 'rejected'])) {
            return response()->json([
                'success' => false,
                'message' => 'Can only submit draft or rejected articles'
            ], 422);
        }

        $article->update(['status' => 'pending']);

        return response()->json([
            'success' => true,
            'message' => 'Article submitted for approval',
            'data' => $article->fresh()
        ]);
    }

    public function pendingApproval()
    {
        $user = request()->user();

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        $articles = Article::with(['author:id,name,email', 'category:id,name'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $articles,
            'count' => $articles->count()
        ]);
    }

    public function approve(Request $request, Article $article)
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        if ($article->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending articles can be approved'
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'is_hero' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'display_order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $article->update([
            'status' => 'published',
            'published_by' => $user->id,
            'published_at' => now(),
            'is_hero' => $request->is_hero ?? false,
            'is_featured' => $request->is_featured ?? false,
            'display_order' => $request->display_order ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Article approved and published',
            'data' => $article->fresh()->load(['author:id,name,email', 'publisher:id,name,email'])
        ]);
    }

    public function reject(Request $request, Article $article)
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        if ($article->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending articles can be rejected'
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'rejection_reason' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $article->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Article rejected',
            'data' => $article->fresh()
        ]);
    }

    public function updatePosition(Request $request, Article $article)
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        if ($article->status !== 'published') {
            return response()->json([
                'success' => false,
                'message' => 'Only published articles can be repositioned'
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'is_hero' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'display_order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $article->update([
            'is_hero' => $request->is_hero ?? $article->is_hero,
            'is_featured' => $request->is_featured ?? $article->is_featured,
            'display_order' => $request->display_order ?? $article->display_order,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Article position updated',
            'data' => $article->fresh()
        ]);
    }

    public function published()
    {
        $user = request()->user();

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        $articles = Article::with(['author:id,name,email', 'category:id,name', 'publisher:id,name,email'])
            ->where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $articles
        ]);
    }

    public function rejected()
    {
        $user = request()->user();

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        $articles = Article::with(['author:id,name,email', 'category:id,name'])
            ->where('status', 'rejected')
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $articles
        ]);
    }

    public function drafts()
    {
        $user = request()->user();

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        $articles = Article::with(['author:id,name,email', 'category:id,name'])
            ->where('status', 'draft')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $articles
        ]);
    }
}

