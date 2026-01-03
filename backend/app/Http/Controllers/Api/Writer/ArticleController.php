<?php

namespace App\Http\Controllers\Api\Writer;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        // Writer sees their own articles
        $query = Article::where('author_id', Auth::id());

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $articles = $query->latest()->paginate(10);
        return response()->json($articles);
    }

    public function show($id)
    {
        $article = Article::where('author_id', Auth::id())->findOrFail($id);
        return response()->json($article);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'featured_image' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $article = new Article($validated);
        $article->author_id = Auth::id();
        $article->status = 'draft'; // Always draft initially
        $article->save();

        return response()->json(['message' => 'Article draft created', 'data' => $article], 201);
    }

    public function update(Request $request, $id)
    {
        $article = Article::where('author_id', Auth::id())->findOrFail($id);

        if ($article->status === 'published') {
            return response()->json(['message' => 'Cannot edit published article'], 403);
        }

        $validated = $request->validate([
            'title' => 'string|max:255',
            'content' => 'string',
            'featured_image' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $article->update($validated);

        return response()->json(['message' => 'Article updated', 'data' => $article]);
    }

    public function submit($id)
    {
        $article = Article::where('author_id', Auth::id())->findOrFail($id);
        
        if ($article->status === 'published') {
             return response()->json(['message' => 'Already published'], 400);
        }

        $article->status = 'pending';
        $article->save();

        return response()->json(['message' => 'Article submitted for review', 'data' => $article]);
    }
}
