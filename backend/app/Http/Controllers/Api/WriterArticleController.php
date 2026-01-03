<?php

namespace App\Http\Controllers\Api;

use App\Models\Article;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Resources\ArticleResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Writer Article Controller
 * 
 * Handles CRUD operations for articles owned by the authenticated writer.
 * Writers can create, edit, and delete their own draft articles,
 * and submit pending review to admins.
 */
class WriterArticleController extends Controller
{
    /**
     * List all articles for the authenticated writer (with pagination)
     * 
     * GET /api/writer/articles
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('view-any', Article::class);

        $articles = Article::forWriter($request->user()->id)
            ->with(['author', 'category', 'rejections'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => ArticleResource::collection($articles),
            'meta' => [
                'total' => $articles->total(),
                'count' => $articles->count(),
                'per_page' => $articles->perPage(),
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
            ]
        ]);
    }

    /**
     * Get a single article
     * 
     * GET /api/writer/articles/{id}
     */
    public function show(Article $article, Request $request): JsonResponse
    {
        $this->authorize('view', $article);

        return response()->json([
            'success' => true,
            'data' => new ArticleResource($article->load(['author', 'category', 'rejections']))
        ]);
    }

    /**
     * Create a new draft article
     * 
     * POST /api/writer/articles
     * 
     * @body {
     *   "title": "Article Title",
     *   "excerpt": "Brief summary",
     *   "content": "Full content...",
     *   "category_id": 1,
     *   "featured_image": "url or file"
     * }
     */
    public function store(StoreArticleRequest $request): JsonResponse
    {
        $this->authorize('create', Article::class);

        try {
            $validated = $request->validated();
            $validated['author_id'] = $request->user()->id;
            $validated['status'] = 'draft'; // Always start as draft

            $article = Article::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Article created successfully as draft',
                'data' => new ArticleResource($article->load(['author', 'category']))
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create article',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Update an article (only draft or rejected articles)
     * 
     * PUT /api/writer/articles/{id}
     * 
     * @body {
     *   "title": "Updated Title",
     *   "excerpt": "Updated summary",
     *   "content": "Updated content...",
     *   "category_id": 1
     * }
     */
    public function update(UpdateArticleRequest $request, Article $article): JsonResponse
    {
        $this->authorize('update', $article);

        if (!$article->canBeEditedBy($request->user())) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot edit article. Article must be in draft or rejected status.',
            ], 403);
        }

        try {
            $validated = $request->validated();
            $article->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Article updated successfully',
                'data' => new ArticleResource($article->load(['author', 'category']))
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update article',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Delete an article (only draft articles)
     * 
     * DELETE /api/writer/articles/{id}
     */
    public function destroy(Article $article, Request $request): JsonResponse
    {
        $this->authorize('delete', $article);

        if (!$article->canBeDeletedBy($request->user())) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete article. Only draft articles can be deleted.',
            ], 403);
        }

        try {
            $article->delete();

            return response()->json([
                'success' => true,
                'message' => 'Article deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete article',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Submit an article for admin review
     * Changes status from draft/rejected → pending
     * 
     * POST /api/writer/articles/{id}/submit
     * 
     * @body {
     *   "notes": "Optional notes for admin review"
     * }
     */
    public function submit(Article $article, Request $request): JsonResponse
    {
        $this->authorize('submit', $article);

        if (!$article->canBeSubmittedBy($request->user())) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot submit article. Article must be in draft or rejected status.',
            ], 403);
        }

        try {
            $article->submit();

            return response()->json([
                'success' => true,
                'message' => 'Article submitted for review. An admin will review it soon.',
                'data' => new ArticleResource($article->load(['author', 'category', 'rejections']))
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit article',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Get statistics for writer's articles
     * 
     * GET /api/writer/articles/stats
     */
    public function getStats(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $stats = [
            'total' => Article::forWriter($userId)->count(),
            'draft' => Article::forWriter($userId)->draft()->count(),
            'pending' => Article::forWriter($userId)->pending()->count(),
            'published' => Article::forWriter($userId)->published()->count(),
            'rejected' => Article::forWriter($userId)->rejected()->count(),
            'total_views' => Article::forWriter($userId)->published()->sum('views'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
