<?php

namespace App\Http\Controllers\Api;

use App\Models\Article;
use App\Http\Resources\ArticleResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Public Article Controller
 * 
 * Provides read-only access to published articles.
 * No authentication required.
 * Tracks view counts.
 */
class PublicArticleController extends Controller
{
    /**
     * List published articles with filtering and pagination
     * 
     * GET /api/articles?section=news&featured=true&hero=true&search=query
     */
    public function index(Request $request): JsonResponse
    {
        $query = Article::published()
            ->with(['author', 'category'])
            ->latest('published_at');

        // Filter by section (e.g., news, featured)
        if ($request->filled('section')) {
            $query->where('section', $request->section);
        }

        // Filter by hero articles
        if ($request->boolean('hero')) {
            $query->where('is_hero', true);
        }

        // Filter by featured articles
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        // Search by title or excerpt
        if ($request->filled('search')) {
            $searchTerm = "%{$request->search}%";
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', $searchTerm)
                  ->orWhere('excerpt', 'like', $searchTerm);
            });
        }

        // Filter by author
        if ($request->filled('author_id')) {
            $query->where('author_id', $request->author_id);
        }

        $articles = $query->paginate(12);

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
     * Get hero articles (featured on homepage)
     * 
     * GET /api/articles/hero
     */
    public function getHeroArticles(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 5);

        $articles = Article::hero()
            ->take($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => ArticleResource::collection($articles)
        ]);
    }

    /**
     * Get featured articles
     * 
     * GET /api/articles/featured
     */
    public function getFeaturedArticles(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 6);

        $articles = Article::featured()
            ->take($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => ArticleResource::collection($articles)
        ]);
    }

    /**
     * Get articles by section
     * 
     * GET /api/articles/section/{section}
     */
    public function getBySection(string $section, Request $request): JsonResponse
    {
        $limit = $request->get('limit', 10);

        $articles = Article::bySection($section)
            ->take($limit)
            ->get();

        return response()->json([
            'success' => true,
            'section' => $section,
            'data' => ArticleResource::collection($articles)
        ]);
    }

    /**
     * Get a single article by slug
     * Increments view count
     * 
     * GET /api/articles/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $article = Article::published()
            ->where('slug', $slug)
            ->with(['author', 'category'])
            ->firstOrFail();

        // Increment view count
        $article->incrementViews();

        return response()->json([
            'success' => true,
            'data' => new ArticleResource($article)
        ]);
    }

    /**
     * Get articles by author
     * 
     * GET /api/authors/{author_id}/articles
     */
    public function getByAuthor(int $authorId, Request $request): JsonResponse
    {
        $articles = Article::published()
            ->where('author_id', $authorId)
            ->with(['author', 'category'])
            ->latest('published_at')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'author_id' => $authorId,
            'data' => ArticleResource::collection($articles),
            'meta' => [
                'total' => $articles->total(),
                'count' => $articles->count(),
            ]
        ]);
    }

    /**
     * Get articles by category
     * 
     * GET /api/categories/{category_id}/articles
     */
    public function getByCategory(int $categoryId, Request $request): JsonResponse
    {
        $articles = Article::published()
            ->where('category_id', $categoryId)
            ->with(['author', 'category'])
            ->latest('published_at')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'category_id' => $categoryId,
            'data' => ArticleResource::collection($articles),
            'meta' => [
                'total' => $articles->total(),
                'count' => $articles->count(),
            ]
        ]);
    }

    /**
     * Get article statistics (public data only)
     * 
     * GET /api/articles/stats
     */
    public function getStats(): JsonResponse
    {
        $stats = [
            'total_published' => Article::published()->count(),
            'total_views' => Article::published()->sum('views'),
            'hero_articles_count' => Article::hero()->count(),
            'featured_articles_count' => Article::featured()->count(),
            'total_authors' => Article::published()
                ->distinct('author_id')
                ->count('author_id'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
