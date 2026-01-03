<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::table('admins', function (Blueprint $table) {
            // Tambah kolom role_id hanya jika belum ada
            if (!Schema::hasColumn('admins', 'role_id')) {
                $table->unsignedBigInteger('role_id')
                      ->default(1)
                      ->after('id');
            }
        });

        // Pastikan semua admin punya role_id valid
        DB::table('admins')->update(['role_id' => 1]);

        // Tambahkan foreign key dengan try-catch untuk hindari error double
        try {
            Schema::table('admins', function (Blueprint $table) {
                $table->foreign('role_id')
                    ->references('id')
                    ->on('roles')
                    ->onDelete('cascade');
            });
        } catch (\Exception $e) {
            // Abaikan error jika foreign key sudah ada
        }
    }

    public function down()
    {
        Schema::table('admins', function (Blueprint $table) {
            // Drop FK aman tanpa doctrine
            try {
                $table->dropForeign(['role_id']);
            } catch (\Exception $e) {}

            if (Schema::hasColumn('admins', 'role_id')) {
                $table->dropColumn('role_id');
            }
        });
    }
};
