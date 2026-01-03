<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@seveninc.com'],
            [
                'name' => 'Super Admin',
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                'role' => 'admin',
                'avatar' => null,
                'email_verified_at' => null,
                'remember_token' => null,
            ]
        );

        DB::table('users')->updateOrInsert(
            ['email' => 'writer@seveninc.com'],
            [
                'name' => 'Writer User',
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                'role' => 'writer',
                'avatar' => null,
                'email_verified_at' => null,
                'remember_token' => null,
            ]
        );

        DB::table('users')->updateOrInsert(
            ['email' => 'public@seveninc.com'],
            [
                'name' => 'Public User',
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                'role' => 'public',
                'avatar' => null,
                'email_verified_at' => null,
                'remember_token' => null,
            ]
        );
    }
}

