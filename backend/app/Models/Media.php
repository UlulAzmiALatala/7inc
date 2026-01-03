<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Media extends Model
{
    use HasFactory;
    
    protected $fillable = ['file_name', 'file_path', 'file_type', 'file_size', 'uploaded_by'];
    
    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
