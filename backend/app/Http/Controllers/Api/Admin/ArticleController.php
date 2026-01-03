<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::with('author');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $articles = $query->latest()->paginate(10);
        return response()->json($articles);
    }

    public function show($id)
    {
        $article = Article::with('author')->findOrFail($id);
        return response()->json($article);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'featured_image' => 'nullable|string',
            'status' => 'in:draft,pending,published,rejected',
            'is_hero' => 'boolean',
            'is_featured' => 'boolean',
            'display_order' => 'integer',
            'assignment_type' => 'nullable|string',
            'assignment_position' => 'nullable|string',
        ]);

        $article = new Article($validated);
        $article->author_id = Auth::id();
        
        if ($request->status === 'published') {
            $article->published_at = now();
            $article->published_by = Auth::id();
        }

        $article->save();

        return response()->json(['message' => 'Article created successfully', 'data' => $article], 201);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'content' => 'string',
            'featured_image' => 'nullable|string',
            'status' => 'in:draft,pending,published,rejected',
            'rejection_reason' => 'nullable|string',
            'is_hero' => 'boolean',
            'is_featured' => 'boolean',
            'display_order' => 'integer',
            'assignment_type' => 'nullable|string',
            'assignment_position' => 'nullable|string',
        ]);

        if (isset($validated['status']) && $validated['status'] === 'published' && $article->status !== 'published') {
            $article->published_at = now();
            $article->published_by = Auth::id();
        }

        $article->update($validated);

        return response()->json(['message' => 'Article updated successfully', 'data' => $article]);
    }

    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        $article->delete();
        return response()->json(['message' => 'Article deleted successfully']);
    }
}
