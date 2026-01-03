<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',     // role tetap ada
        'role_id',  // foreign key ke roles table
        'avatar'
    ];

    protected $hidden = [
        'password',
        'remember_token', // opsional, tapi sangat umum
    ];

    /**
     * Cek apakah user memiliki role tertentu.
     *
     * Contoh:
     * $user->hasRole('admin')
     * $user->hasRole(['admin', 'superadmin'])
     */
    public function hasRole($roles)
    {
        if (is_array($roles)) {
            return in_array($this->role, $roles);
        }

        return $this->role === $roles;
    }
}
