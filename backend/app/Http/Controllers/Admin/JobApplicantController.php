<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{JobApplicant, ActivityLog, JobVacancy};
// use Maatwebsite\Excel\Facades\Excel;
// use App\Imports\JobApplicantImport;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class JobApplicantController extends Controller
{
    public function index($jobId)
    {
        $applicants = JobApplicant::where('job_vacancy_id', $jobId)
            ->orderBy('ranking')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $applicants
        ], 200);
    }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_vacancy_id' => 'required|exists:job_vacancies,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'cv_file' => 'nullable|string',
            'cover_letter' => 'nullable|string',
            'education_score' => 'required|numeric|min:0|max:100',
            'experience_score' => 'required|numeric|min:0|max:100',
            'skill_score' => 'required|numeric|min:0|max:100',
            'interview_score' => 'required|numeric|min:0|max:100',
            'attitude_score' => 'required|numeric|min:0|max:100'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Calculate final score (Simple Average)
        $scores = [
            $request->education_score,
            $request->experience_score,
            $request->skill_score,
            $request->interview_score,
            $request->attitude_score
        ];
        $finalScore = array_sum($scores) / count($scores);
        
        $applicant = JobApplicant::create([
            ...$request->all(),
            'final_score' => $finalScore,
            'status' => 'pending' // Default status
        ]);

        // Recalculate ranking for this job vacancy
        $this->recalculateRanking($request->job_vacancy_id);
        
        // Refresh to get the new ranking
        $applicant->refresh();
        
        ActivityLog::logAction('create', 'JobApplicant', $applicant->id, "Added applicant: {$applicant->name}");
        
        return response()->json([
            'success' => true,
            'message' => 'Applicant added successfully',
            'data' => $applicant
        ], 201);
    }

    public function show($id)
    {
        $applicant = JobApplicant::with('vacancy')->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $applicant
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $applicant = JobApplicant::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email',
            'phone' => 'sometimes|required|string|max:20',
            'education_score' => 'sometimes|required|numeric|min:0|max:100',
            'experience_score' => 'sometimes|required|numeric|min:0|max:100',
            'skill_score' => 'sometimes|required|numeric|min:0|max:100',
            'interview_score' => 'sometimes|required|numeric|min:0|max:100',
            'attitude_score' => 'sometimes|required|numeric|min:0|max:100',
            'status' => 'sometimes|in:pending,reviewed,accepted,rejected'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        
        $oldValues = $applicant->toArray();
        
        // Update basic fields
        $applicant->fill($request->all());

        // Recalculate final score if any score field is updated
        if ($request->hasAny(['education_score', 'experience_score', 'skill_score', 'interview_score', 'attitude_score'])) {
            $scores = [
                $applicant->education_score,
                $applicant->experience_score,
                $applicant->skill_score,
                $applicant->interview_score,
                $applicant->attitude_score
            ];
            $applicant->final_score = array_sum($scores) / count($scores);
        }

        $applicant->save();

        // Recalculate ranking if scores changed
        if ($request->hasAny(['education_score', 'experience_score', 'skill_score', 'interview_score', 'attitude_score'])) {
            $this->recalculateRanking($applicant->job_vacancy_id);
            $applicant->refresh();
        }
        
        ActivityLog::logAction('update', 'JobApplicant', $applicant->id, "Updated applicant: {$applicant->name}", $oldValues, $applicant->fresh()->toArray());
        
        return response()->json([
            'success' => true,
            'message' => 'Applicant updated successfully',
            'data' => $applicant
        ], 200);
    }

    public function destroy($id)
    {
        $applicant = JobApplicant::findOrFail($id);
        $jobId = $applicant->job_vacancy_id;
        $name = $applicant->name;
        
        $applicant->delete();

        // Recalculate ranking after deletion
        $this->recalculateRanking($jobId);
        
        ActivityLog::logAction('delete', 'JobApplicant', $id, "Deleted applicant: {$name}");
        
        return response()->json([
            'success' => true,
            'message' => 'Applicant deleted successfully'
        ], 200);
    }

    /*
    public function import(Request $request) 
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:xlsx,xls,csv',
            'job_vacancy_id' => 'required|exists:job_vacancies,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            // Excel::import(new JobApplicantImport($request->job_vacancy_id), $request->file('file'));
            
            // Recalculate ranking after import
            $this->recalculateRanking($request->job_vacancy_id);

            return response()->json(['success' => true, 'message' => 'Applicants imported successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Import failed: ' . $e->getMessage()], 500);
        }
    }
    */

    private function recalculateRanking($jobVacancyId)
    {
        $applicants = JobApplicant::where('job_vacancy_id', $jobVacancyId)
            ->orderByDesc('final_score')
            ->get();
            
        $rank = 1;
        foreach ($applicants as $applicant) {
            if ($applicant->ranking !== $rank) {
                $applicant->ranking = $rank;
                $applicant->saveQuietly(); // Avoid triggering update events/logs if not needed
            }
            $rank++;
        }
        
        // Log the SPK calculation
        ActivityLog::logAction('calculate_spk', 'JobVacancy', $jobVacancyId, "Recalculated rankings for Job ID: {$jobVacancyId}");
    }
}
