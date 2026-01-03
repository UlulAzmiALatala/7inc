<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->text('excerpt')->nullable();
            $table->string('featured_image')->nullable();

            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();

            $table->enum('status', ['draft', 'pending', 'rejected', 'published'])->default('draft');
            $table->text('rejection_reason')->nullable();

            $table->boolean('is_hero')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->integer('display_order')->default(0);

            $table->timestamp('published_at')->nullable();
            $table->foreignId('published_by')->nullable()->constrained('users')->nullOnDelete();

            $table->unsignedBigInteger('views')->default(0);
            $table->timestamps();

            $table->index('status');
            $table->index('published_at');
            $table->index('author_id');
            $table->index('is_hero');
            $table->index('is_featured');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
