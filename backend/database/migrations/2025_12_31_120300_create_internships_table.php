<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('internships', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('requirements');
            $table->string('location');
            $table->string('duration', 100);
            $table->date('start_date');
            $table->date('deadline');
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->string('google_form_url', 500)->default('https://docs.google.com/forms/d/1SkaS-5FX9mx3qFLJHB1acJepUXkUisky-v1THo1R0Hs/viewform?edit_requested=true');
            $table->unsignedBigInteger('created_by');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->index(['status', 'deadline'], 'idx_status_deadline_internships');
            $table->index('created_by', 'idx_created_by_internships');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internships');
    }
};

