<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Super Admin
        Admin::updateOrCreate(
            ['email' => 'super@seveninc.com'],
            [
                'name' => 'Super Administrator',
                'password' => Hash::make('password123'),
                'role_id' => 1, // super_admin
                'avatar' => null,
            ]
        );

        // 2. Admin Konten
        Admin::updateOrCreate(
            ['email' => 'admin@seveninc.com'],
            [
                'name' => 'Admin Konten',
                'password' => Hash::make('password123'),
                'role_id' => 2, // admin
                'avatar' => null,
            ]
        );

        // 3. Writer
        Admin::updateOrCreate(
            ['email' => 'writer@seveninc.com'],
            [
                'name' => 'Writer Berita',
                'password' => Hash::make('password123'),
                'role_id' => 3,
                'avatar' => null,
            ]
        );
    }
}
