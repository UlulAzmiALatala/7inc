<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('internship_applicants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internship_id')->constrained('internships')->onDelete('cascade');
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('university')->nullable();
            $table->string('major')->nullable();
            $table->string('cv_file')->nullable();
            $table->text('cover_letter')->nullable();
            
            // Kriteria SPK SAW untuk Magang (0-100)
            $table->decimal('gpa_score', 5, 2)->default(0)->comment('C1: IPK');
            $table->decimal('skill_score', 5, 2)->default(0)->comment('C2: Keahlian');
            $table->decimal('motivation_score', 5, 2)->default(0)->comment('C3: Motivasi');
            $table->decimal('availability_score', 5, 2)->default(0)->comment('C4: Ketersediaan Waktu');
            $table->decimal('communication_score', 5, 2)->default(0)->comment('C5: Komunikasi');
            
            // Hasil SPK SAW (auto-calculated)
            $table->decimal('final_score', 10, 4)->nullable();
            $table->integer('ranking')->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->text('notes')->nullable();
            
            $table->timestamps();
            
            $table->index(['internship_id', 'status']);
            $table->index(['internship_id', 'ranking']);
            $table->index(['internship_id', 'final_score']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internship_applicants');
    }
};
