<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('configurations', function (Blueprint $table) {
            $table->id();
            $table->string('key_name')->unique();
            $table->text('value')->nullable();
            $table->enum('type', ['text', 'textarea', 'image', 'json', 'boolean', 'article_reference'])->default('text');
            $table->string('group_name')->comment('website|navbar|hero|social|company|about|business|contact');
            $table->string('label')->comment('Label untuk form admin');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('group_name');
            $table->index('key_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configurations');
    }
};
