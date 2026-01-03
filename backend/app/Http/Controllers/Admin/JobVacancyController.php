<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{JobVacancy, ActivityLog};
use Illuminate\Support\Facades\Validator;

class JobVacancyController extends Controller
{
    public function index()
    {
        $vacancies = JobVacancy::with('creator')->latest()->get();
        
        return response()->json([
            'success' => true,
            'data' => $vacancies
        ], 200);
    }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'location' => 'required|string|max:255',
            'job_type' => 'required|in:full-time,part-time,contract,freelance',
            'salary_range' => 'nullable|string|max:100',
            'deadline' => 'required|date|after:today',
            'google_form_url' => 'required|url'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $vacancy = JobVacancy::create([
            ...$request->all(),
            'created_by' => $request->user()?->id,
            'status' => 'open'
        ]);
        
        ActivityLog::logAction('create', 'JobVacancy', $vacancy->id, "Created job vacancy: {$vacancy->title}");
        
        return response()->json([
            'success' => true,
            'message' => 'Job vacancy created successfully',
            'data' => $vacancy
        ], 201);
    }
    
    public function show($id)
    {
        $vacancy = JobVacancy::with(['creator', 'applicants' => function($q) {
            $q->orderBy('ranking');
        }])->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $vacancy
        ], 200);
    }
    
    public function update(Request $request, $id)
    {
        $vacancy = JobVacancy::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'requirements' => 'sometimes|required|string',
            'location' => 'sometimes|required|string|max:255',
            'job_type' => 'sometimes|required|in:full-time,part-time,contract,freelance',
            'salary_range' => 'nullable|string|max:100',
            'deadline' => 'sometimes|required|date',
            'status' => 'sometimes|in:open,closed',
            'google_form_url' => 'sometimes|required|url'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        
        $oldValues = $vacancy->toArray();
        $vacancy->update($request->all());
        
        ActivityLog::logAction('update', 'JobVacancy', $vacancy->id, "Updated job vacancy: {$vacancy->title}", $oldValues, $vacancy->fresh()->toArray());
        
        return response()->json([
            'success' => true,
            'message' => 'Job vacancy updated successfully',
            'data' => $vacancy
        ], 200);
    }
    
    public function destroy($id)
    {
        $vacancy = JobVacancy::findOrFail($id);
        $title = $vacancy->title;
        
        $vacancy->delete();
        
        ActivityLog::logAction('delete', 'JobVacancy', $id, "Deleted job vacancy: {$title}");
        
        return response()->json([
            'success' => true,
            'message' => 'Job vacancy deleted successfully'
        ], 200);
    }
}
