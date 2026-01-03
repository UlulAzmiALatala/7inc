<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Internship;
use Illuminate\Support\Facades\Auth;

class InternshipController extends Controller
{
    public function index()
    {
        $internships = Internship::orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $internships]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'location' => 'required|string',
            'duration' => 'required|string',
            'start_date' => 'required|date',
            'deadline' => 'required|date',
            'status' => 'required|in:open,closed',
            'google_form_url' => 'nullable|url'
        ]);

        $internship = Internship::create([
            ...$validated,
            'created_by' => Auth::id()
        ]);

        return response()->json(['success' => true, 'data' => $internship]);
    }

    public function show($id)
    {
        $internship = Internship::findOrFail($id);
        return response()->json(['success' => true, 'data' => $internship]);
    }

    public function update(Request $request, $id)
    {
        $internship = Internship::findOrFail($id);
        $internship->update($request->all());
        return response()->json(['success' => true, 'data' => $internship]);
    }

    public function destroy($id)
    {
        Internship::destroy($id);
        return response()->json(['success' => true, 'message' => 'Deleted successfully']);
    }
}
