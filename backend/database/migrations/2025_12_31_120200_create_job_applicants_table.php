<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_applicants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('job_vacancy_id');
            $table->string('name');
            $table->string('email');
            $table->string('phone', 20);
            $table->string('cv_file')->nullable();
            $table->text('cover_letter')->nullable();
            $table->decimal('education_score', 5, 2)->default(0);
            $table->decimal('experience_score', 5, 2)->default(0);
            $table->decimal('skill_score', 5, 2)->default(0);
            $table->decimal('interview_score', 5, 2)->default(0);
            $table->decimal('attitude_score', 5, 2)->default(0);
            $table->decimal('final_score', 10, 4)->nullable();
            $table->integer('ranking')->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('job_vacancy_id')->references('id')->on('job_vacancies')->onDelete('cascade');
            $table->index(['job_vacancy_id', 'status'], 'idx_job_status');
            $table->index(['job_vacancy_id', 'ranking'], 'idx_ranking');
            $table->index(['job_vacancy_id', 'final_score'], 'idx_final_score');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applicants');
    }
};

