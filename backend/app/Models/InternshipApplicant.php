<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InternshipApplicant extends Model
{
    use HasFactory;

    protected $fillable = [
        'internship_id',
        'name',
        'email',
        'phone',
        'university',
        'major',
        'cv_file',
        'cover_letter',
        'gpa_score',
        'skill_score',
        'motivation_score',
        'availability_score',
        'communication_score',
        'final_score',
        'ranking',
        'status',
        'notes'
    ];

    public function internship()
    {
        return $this->belongsTo(Internship::class);
    }
}
