<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ArticleTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ArticleTaskController extends Controller
{
    public function index(Request $request)
    {
        $query = ArticleTask::with(['assignedTo', 'createdBy', 'article']);
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $tasks = $query->latest()->paginate(10);
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_section' => 'nullable|string',
            'priority' => 'in:low,medium,high',
            'deadline' => 'nullable|date',
            'assigned_to' => 'required|exists:users,id',
        ]);

        $task = new ArticleTask($validated);
        $task->created_by = Auth::id();
        $task->status = 'pending';
        $task->save();

        return response()->json(['message' => 'Task assigned successfully', 'data' => $task], 201);
    }

    public function update(Request $request, $id)
    {
        $task = ArticleTask::findOrFail($id);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'target_section' => 'nullable|string',
            'priority' => 'in:low,medium,high',
            'deadline' => 'nullable|date',
            'status' => 'in:pending,in_progress,completed,cancelled',
            'assigned_to' => 'exists:users,id',
        ]);

        $task->update($validated);

        return response()->json(['message' => 'Task updated successfully', 'data' => $task]);
    }

    public function destroy($id)
    {
        $task = ArticleTask::findOrFail($id);
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }
}
