<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InternshipApplicant;
use App\Models\Internship;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class InternshipApplicantController extends Controller
{
    public function index($internshipId)
    {
        $applicants = InternshipApplicant::where('internship_id', $internshipId)
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
            'internship_id' => 'required|exists:internships,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'university' => 'nullable|string',
            'major' => 'nullable|string',
            'cv_file' => 'nullable|string',
            'gpa_score' => 'required|numeric|min:0|max:100',
            'skill_score' => 'required|numeric|min:0|max:100',
            'motivation_score' => 'required|numeric|min:0|max:100',
            'availability_score' => 'required|numeric|min:0|max:100',
            'communication_score' => 'required|numeric|min:0|max:100'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Calculate final score (Weighted Average - Example weights)
        // C1: GPA (20%), C2: Skill (25%), C3: Motivation (20%), C4: Availability (15%), C5: Communication (20%)
        // Adjust weights as per requirement
        $weights = [
            'gpa' => 0.20,
            'skill' => 0.25,
            'motivation' => 0.20,
            'availability' => 0.15,
            'communication' => 0.20
        ];

        $finalScore = (
            ($request->gpa_score * $weights['gpa']) +
            ($request->skill_score * $weights['skill']) +
            ($request->motivation_score * $weights['motivation']) +
            ($request->availability_score * $weights['availability']) +
            ($request->communication_score * $weights['communication'])
        );
        
        $applicant = InternshipApplicant::create([
            ...$request->all(),
            'final_score' => $finalScore,
            'status' => 'pending'
        ]);

        $this->recalculateRanking($request->internship_id);
        
        $applicant->refresh();
        
        return response()->json([
            'success' => true,
            'message' => 'Applicant added successfully',
            'data' => $applicant
        ], 201);
    }

    public function show($id)
    {
        $applicant = InternshipApplicant::with('internship')->findOrFail($id);
        return response()->json(['success' => true, 'data' => $applicant]);
    }

    public function update(Request $request, $id)
    {
        $applicant = InternshipApplicant::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'gpa_score' => 'sometimes|numeric|min:0|max:100',
            'skill_score' => 'sometimes|numeric|min:0|max:100',
            'motivation_score' => 'sometimes|numeric|min:0|max:100',
            'availability_score' => 'sometimes|numeric|min:0|max:100',
            'communication_score' => 'sometimes|numeric|min:0|max:100',
            'status' => 'sometimes|in:pending,accepted,rejected',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $applicant->fill($request->all());

        if ($request->hasAny(['gpa_score', 'skill_score', 'motivation_score', 'availability_score', 'communication_score'])) {
             $weights = [
                'gpa' => 0.20,
                'skill' => 0.25,
                'motivation' => 0.20,
                'availability' => 0.15,
                'communication' => 0.20
            ];

            $gpa = $applicant->gpa_score;
            $skill = $applicant->skill_score;
            $motivation = $applicant->motivation_score;
            $availability = $applicant->availability_score;
            $communication = $applicant->communication_score;

            $finalScore = (
                ($gpa * $weights['gpa']) +
                ($skill * $weights['skill']) +
                ($motivation * $weights['motivation']) +
                ($availability * $weights['availability']) +
                ($communication * $weights['communication'])
            );
            $applicant->final_score = $finalScore;
        }

        $applicant->save();

        if ($request->hasAny(['gpa_score', 'skill_score', 'motivation_score', 'availability_score', 'communication_score'])) {
            $this->recalculateRanking($applicant->internship_id);
        }

        return response()->json(['success' => true, 'data' => $applicant]);
    }

    public function destroy($id)
    {
        $applicant = InternshipApplicant::findOrFail($id);
        $internshipId = $applicant->internship_id;
        $applicant->delete();
        $this->recalculateRanking($internshipId);
        return response()->json(['success' => true, 'message' => 'Applicant deleted']);
    }

    private function recalculateRanking($internshipId)
    {
        $applicants = InternshipApplicant::where('internship_id', $internshipId)
            ->orderByDesc('final_score')
            ->get();

        $rank = 1;
        foreach ($applicants as $app) {
            $app->update(['ranking' => $rank++]);
        }
    }
}
