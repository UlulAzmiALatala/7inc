<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ArticleTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'target_section', 'priority', 'deadline',
        'status', 'assigned_to', 'created_by', 'created_article_id'
    ];

    protected $casts = [
        'deadline' => 'date',
    ];

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function article()
    {
        return $this->belongsTo(Article::class, 'created_article_id');
    }
}
