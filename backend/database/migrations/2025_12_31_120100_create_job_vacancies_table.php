<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_vacancies', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('requirements');
            $table->string('location');
            $table->enum('job_type', ['full-time', 'part-time', 'contract', 'freelance']);
            $table->string('salary_range', 100)->nullable();
            $table->date('deadline');
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->string('google_form_url', 500)->default('https://docs.google.com/forms/d/1SkaS-5FX9mx3qFLJHB1acJepUXkUisky-v1THo1R0Hs/viewform?edit_requested=true');
            $table->unsignedBigInteger('created_by');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('created_by')->references('id')->on('admins')->onDelete('cascade');
            $table->index(['status', 'deadline'], 'idx_status_deadline');
            $table->index('created_by', 'idx_created_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_vacancies');
    }
};

