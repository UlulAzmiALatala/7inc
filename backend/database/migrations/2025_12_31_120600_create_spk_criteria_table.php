<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('spk_criteria', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['job', 'internship']);
            $table->string('criteria_name');
            $table->string('criteria_field');
            $table->decimal('weight', 5, 2); // Persentase, total harus 100
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['type', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('spk_criteria');
    }
};
