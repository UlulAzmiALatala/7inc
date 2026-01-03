<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Tambah kolom untuk menghubungkan artikel ke configuration sections
    public function up(): void
    {
        // Cek apakah tabel articles sudah ada
        if (Schema::hasTable('articles')) {
            Schema::table('articles', function (Blueprint $table) {
                // Tambah kolom jika belum ada
                if (!Schema::hasColumn('articles', 'assignment_type')) {
                    $table->enum('assignment_type', ['hero', 'about', 'business', 'homepage', 'none'])->default('none')->after('display_order');
                }
                if (!Schema::hasColumn('articles', 'assignment_position')) {
                    $table->string('assignment_position')->nullable()->after('assignment_type');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('articles')) {
            Schema::table('articles', function (Blueprint $table) {
                if (Schema::hasColumn('articles', 'assignment_type')) {
                    $table->dropColumn('assignment_type');
                }
                if (Schema::hasColumn('articles', 'assignment_position')) {
                    $table->dropColumn('assignment_position');
                }
            });
        }
    }
};
