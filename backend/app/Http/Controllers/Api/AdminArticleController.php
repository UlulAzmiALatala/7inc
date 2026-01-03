<?php

namespace App\Http\Controllers\Api;

use App\Models\Article;
use App\Models\User;
use App\Http\Resources\ArticleResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Admin Article Controller
 * 
 * Handles article management for admins:
 * - Review pending articles
 * - Approve articles for publication
 * - Reject articles with feedback
 * - Manage article distribution (hero, featured, ordering)
 * - View all articles across all writers
 */
class AdminArticleController extends Controller
{
    /**
     * List all articles with filters
     * 
     * GET /api/admin/articles?status=pending&sort=-created_at
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Article::class);

        $query = Article::with(['author', 'category', 'rejections']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by author
        if ($request->filled('author_id')) {
            $query->where('author_id', $request->author_id);
        }

        // Search by title
        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        // Sort (default: most recent first)
        $sortField = $request->get('sort', '-created_at');
        $sortOrder = str_starts_with($sortField, '-') ? 'desc' : 'asc';
        $sortField = ltrim($sortField, '-');
        
        $query->orderBy($sortField, $sortOrder);

        $articles = $query->paginate(20);

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
     * Get pending articles for review
     * 
     * GET /api/admin/articles/review/pending
     */
    public function getPending(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Article::class);

        $articles = Article::pending()
            ->with(['author', 'category', 'rejections'])
            ->orderBy('submitted_at', 'asc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => ArticleResource::collection($articles),
            'meta' => [
                'total' => $articles->total(),
                'pending_count' => Article::pending()->count(),
            ]
        ]);
    }

    /**
     * Get a single article
     * 
     * GET /api/admin/articles/{id}
     */
    public function show(Article $article, Request $request): JsonResponse
    {
        $this->authorize('view', $article);

        return response()->json([
            'success' => true,
            'data' => new ArticleResource($article->load([
                'author', 
                'category', 
                'rejections.rejector'
            ]))
        ]);
    }

    /**
     * Approve an article for publication
     * Status: pending → published
     * 
     * POST /api/admin/articles/{id}/approve
     * 
     * @body {
     *   "make_hero": false,
     *   "make_featured": false,
     *   "display_order": 0,
     *   "section": "news"
     * }
     */
    public function approve(Article $article, Request $request): JsonResponse
    {
        $this->authorize('approve', $article);

        if (!$article->canBeApprovedBy($request->user())) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot approve article. Only pending articles can be approved.',
            ], 403);
        }

        try {
            $validated = $request->validate([
                'make_hero' => 'boolean',
                'make_featured' => 'boolean',
                'display_order' => 'integer|min:0',
                'section' => 'nullable|string|max:50',
            ]);

            // Approve the article
            $article->approve($request->user());

            // Set distribution if provided
            if ($validated['make_hero'] ?? false) {
                $article->is_hero = true;
            }
            if ($validated['make_featured'] ?? false) {
                $article->is_featured = true;
            }
            if (isset($validated['display_order'])) {
                $article->display_order = $validated['display_order'];
            }
            if (isset($validated['section'])) {
                $article->section = $validated['section'];
            }

            $article->save();

            return response()->json([
                'success' => true,
                'message' => 'Article approved and published successfully',
                'data' => new ArticleResource($article->load(['author', 'category']))
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve article',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Reject an article and return to writer
     * Status: pending → rejected
     * 
     * POST /api/admin/articles/{id}/reject
     * 
     * @body {
     *   "reason": "Please improve the introduction and add more sources"
     * }
     */
    public function reject(Article $article, Request $request): JsonResponse
    {
        $this->authorize('reject', $article);

        if (!$article->canBeRejectedBy($request->user())) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot reject article. Only pending articles can be rejected.',
            ], 403);
        }

        try {
            $validated = $request->validate([
                'reason' => 'required|string|min:10|max:1000',
            ]);

            $article->reject($request->user(), $validated['reason']);

            return response()->json([
                'success' => true,
                'message' => 'Article rejected. Writer has been notified and can edit and resubmit.',
                'data' => new ArticleResource($article->load(['author', 'category', 'rejections']))
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject article',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Update article distribution settings
     * 
     * PATCH /api/admin/articles/{id}/distribution
     * 
     * @body {
     *   "is_hero": true,
     *   "is_featured": true,
     *   "display_order": 1,
     *   "section": "featured"
     * }
     */
    public function updateDistribution(Article $article, Request $request): JsonResponse
    {
        $this->authorize('distribute', $article);

        if (!$article->isPublished()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot set distribution for unpublished article. Publish the article first.',
            ], 403);
        }

        try {
            $validated = $request->validate([
                'is_hero' => 'boolean',
                'is_featured' => 'boolean',
                'display_order' => 'integer|min:0',
                'section' => 'nullable|string|max:50',
            ]);

            $article->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Article distribution updated successfully',
                'data' => new ArticleResource($article)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update distribution',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Delete an article
     * 
     * DELETE /api/admin/articles/{id}
     */
    public function destroy(Article $article, Request $request): JsonResponse
    {
        $this->authorize('delete', $article);

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
     * Get admin dashboard statistics
     * 
     * GET /api/admin/articles/stats
     */
    public function getStats(Request $request): JsonResponse
    {
        $stats = [
            'total_articles' => Article::count(),
            'pending_review' => Article::pending()->count(),
            'published' => Article::published()->count(),
            'draft' => Article::draft()->count(),
            'rejected' => Article::rejected()->count(),
            'hero_articles' => Article::hero()->count(),
            'featured_articles' => Article::featured()->count(),
            'total_views' => Article::published()->sum('views'),
            'top_writers' => User::where('role', 'writer')
                ->withCount(['articles' => function ($q) {
                    $q->where('status', 'published');
                }])
                ->orderBy('articles_count', 'desc')
                ->take(5)
                ->get(['id', 'name', 'email'])
                ->makeHidden('role'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
