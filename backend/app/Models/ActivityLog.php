<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Auth;

class ActivityLog extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'causer_id', 'causer_type', 'user_role', 'action_type', 'entity_type', 'entity_id',
        'old_values', 'new_values', 'description', 'ip_address', 'user_agent'
    ];
    
    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array'
    ];
    public const UPDATED_AT = null; // No updated_at column

    public function causer()
    {
        return $this->morphTo();
    }

    public static function logAction($actionType, $entityType, $entityId, $description = null, $oldValues = null, $newValues = null)
    {
        $user = Auth::user();
        return self::create([
            'causer_id' => $user?->id,
            'causer_type' => $user ? get_class($user) : null,
            'user_role' => $user?->role,
            'action_type' => $actionType,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'description' => $description,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);
    }
}
