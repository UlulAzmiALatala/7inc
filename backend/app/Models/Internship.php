<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Internship extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'requirements',
        'location',
        'duration',
        'start_date',
        'deadline',
        'status',
        'google_form_url',
        'created_by'
    ];

    public function applicants()
    {
        return $this->hasMany(InternshipApplicant::class);
    }
}
