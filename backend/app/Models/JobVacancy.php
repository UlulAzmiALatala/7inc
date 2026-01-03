<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobVacancy extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'title', 'description', 'requirements', 'location', 'job_type',
        'salary_range', 'deadline', 'status', 'google_form_url', 'created_by'
    ];
    
    protected $casts = [
        'deadline' => 'date'
    ];
    
    public function creator()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }
    
    public function applicants()
    {
        return $this->hasMany(JobApplicant::class);
    }
    
    public function scopeOpen($query)
    {
        return $query->where('status', 'open')->where('deadline', '>=', now());
    }
}
