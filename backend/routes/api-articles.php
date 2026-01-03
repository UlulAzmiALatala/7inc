<?php

/**
 * Article API Routes
 * 
 * Three separate API namespaces:
 * 1. /api/writer/articles - Writer-only endpoints (requires auth + writer role)
 * 2. /api/admin/articles - Admin-only endpoints (requires auth + admin role)
 * 3. /api/articles - Public read-only endpoints (no auth required)
 */

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WriterArticleController;
use App\Http\Controllers\Api\AdminArticleController;
use App\Http\Controllers\Api\PublicArticleController;

// ============================================
// WRITER ARTICLES - Private (Requires Auth + Writer Role)
// ============================================
Route::middleware(['auth:sanctum', 'role:writer'])->group(function () {
    Route::prefix('writer/articles')->controller(WriterArticleController::class)->group(function () {
        // CRUD
        Route::get('/', 'index')->name('writer.articles.index');
        Route::get('/{article}', 'show')->name('writer.articles.show');
        Route::post('/', 'store')->name('writer.articles.store');
        Route::put('/{article}', 'update')->name('writer.articles.update');
        Route::delete('/{article}', 'destroy')->name('writer.articles.destroy');
        
        // Workflow
        Route::post('/{article}/submit', 'submit')->name('writer.articles.submit');
        
        // Statistics
        Route::get('/stats', 'getStats')->name('writer.articles.stats');
    });
});

// ============================================
// ADMIN ARTICLES - Private (Requires Auth + Admin Role)
// ============================================
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::prefix('admin/articles')->controller(AdminArticleController::class)->group(function () {
        // List and retrieve
        Route::get('/', 'index')->name('admin.articles.index');
        Route::get('/review/pending', 'getPending')->name('admin.articles.pending');
        Route::get('/{article}', 'show')->name('admin.articles.show');
        
        // Workflow
        Route::post('/{article}/approve', 'approve')->name('admin.articles.approve');
        Route::post('/{article}/reject', 'reject')->name('admin.articles.reject');
        
        // Distribution
        Route::patch('/{article}/distribution', 'updateDistribution')->name('admin.articles.distribution');
        
        // Delete
        Route::delete('/{article}', 'destroy')->name('admin.articles.destroy');
        
        // Statistics
        Route::get('/stats', 'getStats')->name('admin.articles.stats');
    });
});

// ============================================
// PUBLIC ARTICLES - Read-Only (No Auth Required)
// ============================================
Route::prefix('articles')->controller(PublicArticleController::class)->group(function () {
    // List published articles
    Route::get('/', 'index')->name('articles.index');
    Route::get('/hero', 'getHeroArticles')->name('articles.hero');
    Route::get('/featured', 'getFeaturedArticles')->name('articles.featured');
    Route::get('/section/{section}', 'getBySection')->name('articles.section');
    Route::get('/author/{authorId}', 'getByAuthor')->name('articles.author');
    Route::get('/category/{categoryId}', 'getByCategory')->name('articles.category');
    
    // Single article by slug
    Route::get('/{slug}', 'show')->name('articles.show');
    
    // Statistics
    Route::get('/stats', 'getStats')->name('articles.stats');
});
