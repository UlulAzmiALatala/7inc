<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobApplicant extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'job_vacancy_id', 'name', 'email', 'phone', 'cv_file', 'cover_letter',
        'education_score', 'experience_score', 'skill_score', 'interview_score', 'attitude_score',
        'final_score', 'ranking', 'status', 'notes'
    ];
    
    public function vacancy()
    {
        return $this->belongsTo(JobVacancy::class, 'job_vacancy_id');
    }
}
