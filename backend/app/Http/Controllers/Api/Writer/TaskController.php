<?php

namespace App\Http\Controllers\Api\Writer;

use App\Http\Controllers\Controller;
use App\Models\ArticleTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = ArticleTask::where('assigned_to', Auth::id())->with(['createdBy', 'article']);
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $tasks = $query->latest()->paginate(10);
        return response()->json($tasks);
    }

    public function updateStatus(Request $request, $id)
    {
        $task = ArticleTask::where('assigned_to', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:in_progress,completed',
            'created_article_id' => 'nullable|exists:articles,id'
        ]);

        $task->status = $validated['status'];
        
        if (isset($validated['created_article_id'])) {
            $task->created_article_id = $validated['created_article_id'];
        }

        $task->save();

        return response()->json(['message' => 'Task updated', 'data' => $task]);
    }
}
