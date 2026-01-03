<?php

use Illuminate\Support\Facades\DB;
use App\Models\Role;
use App\Models\Admin;
use App\Models\User;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Roles:\n";
$roles = Role::all();
foreach ($roles as $role) {
    echo "ID: {$role->id}, Name: {$role->name}\n";
}

echo "\nAdmins Table Info:\n";
$columns = DB::select('SHOW COLUMNS FROM admins');
foreach ($columns as $col) {
    echo "Field: {$col->Field}, Type: {$col->Type}, Null: {$col->Null}, Default: {$col->Default}\n";
}

echo "\nExisting Admins:\n";
$admins = Admin::all();
foreach ($admins as $admin) {
    // We access role_id via raw attribute if model doesn't have it
    $roleId = $admin->getAttribute('role_id');
    echo "ID: {$admin->id}, Email: {$admin->email}, Role: {$admin->role}, RoleID: {$roleId}\n";
}

echo "\nExisting Users:\n";
$users = User::all();
foreach ($users as $user) {
    echo "ID: {$user->id}, Email: {$user->email}, Role: {$user->role}\n";
}
