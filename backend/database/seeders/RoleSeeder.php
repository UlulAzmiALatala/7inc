<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Role bawaan sistem
        Role::firstOrCreate(['id' => 1], ['name' => 'super_admin']);
        Role::firstOrCreate(['id' => 2], ['name' => 'admin']);
        Role::firstOrCreate(['id' => 3], ['name' => 'writer']);
    }
}
