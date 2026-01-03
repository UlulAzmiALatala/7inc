<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\LogoController;
use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\BisnisKamiFullController;
use App\Http\Controllers\Api\WorksController;
use App\Http\Controllers\Api\JobWorksController;
use App\Http\Controllers\Api\SocialLinkController;
use App\Http\Controllers\Api\RequirementController;
use App\Http\Controllers\Api\InternshipHeroController;
use App\Http\Controllers\Api\InternshipCoreValueController;
use App\Http\Controllers\Api\InternshipTermsController;
use App\Http\Controllers\Api\InternshipFormationController;
use App\Http\Controllers\Api\InternshipFacilityController;
use App\Http\Controllers\Api\HeroSectionController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ConfigurationController;

/*
|--------------------------------------------------------------------------
| AUTHENTICATION ROUTES (Public)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
});

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (No Authentication Required)
|--------------------------------------------------------------------------
*/
Route::get('/admin/logo', [LogoController::class, 'show']);
Route::get('/about', [AboutController::class, 'show']);

Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{idOrSlug}', [NewsController::class, 'show']);

Route::get('/bisnis-kami-full', [BisnisKamiFullController::class, 'show']);
Route::get('/works/latest', [WorksController::class, 'latest']);
Route::get('/social-links', [SocialLinkController::class, 'publicIndex']);

Route::get('/internship/hero', [InternshipHeroController::class, 'show']);
Route::get('/internship/core-values', [InternshipCoreValueController::class, 'index']);
Route::get('/internship/terms', [InternshipTermsController::class, 'show']);
Route::get('/internship/formations', [InternshipFormationController::class, 'index']);
Route::get('/internship/facilities', [InternshipFacilityController::class, 'index']);
Route::get('/hero', [HeroSectionController::class, 'show']);

Route::get('/job-works', [JobWorksController::class, 'index']);
Route::get('/job-works/{id}', [JobWorksController::class, 'show']);

Route::get('/requirements/by-job/{jobWorkId}', [RequirementController::class, 'showById']);
Route::get('/requirements/{id}', [RequirementController::class, 'showPublicById']);

Route::get('/categories', [CategoryController::class, 'publicIndex']);
Route::get('/articles/published', [ArticleController::class, 'published']);

/*
|--------------------------------------------------------------------------
| CONFIGURATION PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
Route::get('/configurations', [ConfigurationController::class, 'publicIndex']);
Route::get('/configurations/{key}', [ConfigurationController::class, 'publicShow']);

use App\Http\Controllers\Api\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Api\Admin\ArticleTaskController as AdminTaskController;
use App\Http\Controllers\Api\Writer\ArticleController as WriterArticleController;
use App\Http\Controllers\Api\Writer\TaskController as WriterTaskController;

/*
|--------------------------------------------------------------------------
| WRITER ROUTES (Authentication Required)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:writer'])->prefix('writer')->group(function () {
    // Articles
    Route::get('/articles', [WriterArticleController::class, 'index']);
    Route::post('/articles', [WriterArticleController::class, 'store']);
    Route::get('/articles/{article}', [WriterArticleController::class, 'show']);
    Route::put('/articles/{article}', [WriterArticleController::class, 'update']);
    Route::post('/articles/{article}/submit', [WriterArticleController::class, 'submit']);
    
    // Tasks
    Route::get('/tasks', [WriterTaskController::class, 'index']);
    Route::patch('/tasks/{id}', [WriterTaskController::class, 'updateStatus']);
});

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES (Authentication + Role:admin Required)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {

    // Article Tasks (Berita & Artikel Task Management)
    Route::apiResource('tasks', AdminTaskController::class);

    // Articles Management (Kelola Berita)
    Route::apiResource('articles', AdminArticleController::class);
    // Route::get('/articles/pending', [AdminArticleController::class, 'pendingApproval']); // Use filter ?status=pending
    // Route::post('/articles/{article}/approve', [AdminArticleController::class, 'approve']); // Use update status=published
    // Route::post('/articles/{article}/reject', [AdminArticleController::class, 'reject']); // Use update status=rejected

    // Categories
    Route::apiResource('categories', \App\Http\Controllers\Api\CategoryController::class);

    // General Content
    Route::post('/logo', [LogoController::class, 'store']);
    Route::post('/about', [AboutController::class, 'store']);
    Route::post('/about/paragraph', [AboutController::class, 'updateParagraph']);
    Route::post('/about/core-text', [AboutController::class, 'updateCoreText']);

    // News
    Route::get('/news', [NewsController::class, 'adminIndex']);
    Route::post('/news', [NewsController::class, 'store']);
    Route::patch('/news/{idOrSlug}', [NewsController::class, 'update']);
    Route::delete('/news/{idOrSlug}', [NewsController::class, 'destroy']);
    Route::post('/news/{idOrSlug}/publish', [NewsController::class, 'togglePublish']);

    // Job Vacancies
    Route::apiResource('vacancies', \App\Http\Controllers\Admin\JobVacancyController::class);

    // Job Applicants
    Route::get('vacancies/{jobId}/applicants', [\App\Http\Controllers\Admin\JobApplicantController::class, 'index']);
    Route::post('applicants', [\App\Http\Controllers\Admin\JobApplicantController::class, 'store']);
    Route::get('applicants/{id}', [\App\Http\Controllers\Admin\JobApplicantController::class, 'show']);
    Route::put('applicants/{id}', [\App\Http\Controllers\Admin\JobApplicantController::class, 'update']);
    Route::delete('applicants/{id}', [\App\Http\Controllers\Admin\JobApplicantController::class, 'destroy']);

    // Works/Bisnis
    Route::put('/bisnis-kami-full/text', [BisnisKamiFullController::class, 'updateText']);
    Route::post('/bisnis-kami-full/image', [BisnisKamiFullController::class, 'updateImage']);
    Route::post('/works', [WorksController::class, 'store']);
    Route::patch('/works/{work}', [WorksController::class, 'update']);

    // Social Links
    Route::get('/social-links', [SocialLinkController::class, 'adminIndex']);
    Route::put('/social-links', [SocialLinkController::class, 'bulkUpsert']);

    // Job Works
    Route::post('/job-works', [JobWorksController::class, 'store']);
    Route::put('/job-works/{id}', [JobWorksController::class, 'update']);
    Route::delete('/job-works/{id}', [JobWorksController::class, 'destroy']);

    // Requirements
    Route::post('/requirements', [RequirementController::class, 'store']);
    Route::get('/requirements/{id}', [RequirementController::class, 'showAdmin']);
    Route::patch('/requirements/{id}', [RequirementController::class, 'update']);
    Route::delete('/requirements/{id}', [RequirementController::class, 'destroy']);

    Route::post('/requirements/{id}/items', [RequirementController::class, 'storeItem']);
    Route::patch('/requirements/{id}/items/{itemId}', [RequirementController::class, 'updateItem']);
    Route::delete('/requirements/{id}/items/{itemId}', [RequirementController::class, 'destroyItem']);
    Route::put('/requirements/{id}/items/bulk', [RequirementController::class, 'bulkUpsertItems']);
    Route::put('/requirements/{id}/items/reorder', [RequirementController::class, 'reorderItems']);

    // Internship
    Route::put('/internship/hero', [InternshipHeroController::class, 'updateText']);
    Route::post('/internship/hero/image', [InternshipHeroController::class, 'updateImage']);

    Route::put('/internship/core-values/header', [InternshipCoreValueController::class, 'updateHeader']);
    Route::put('/internship/core-values/cards/{card}', [InternshipCoreValueController::class, 'updateCard']);
    Route::post('/internship/core-values/cards/{card}/image', [InternshipCoreValueController::class, 'updateCardImage']);
    Route::put('/internship/core-values/cards/reorder', [InternshipCoreValueController::class, 'reorder']);

    Route::put('/internship/terms/header', [InternshipTermsController::class, 'updateHeader']);
    Route::put('/internship/terms/items/{index}', [InternshipTermsController::class, 'updateItem']);

    Route::put('/internship/formations/header', [InternshipFormationController::class, 'updateHeader']);
    Route::put('/internship/formations/cards/{card}', [InternshipFormationController::class, 'updateCard']);
    Route::post('/internship/formations/cards/{card}/image', [InternshipFormationController::class, 'updateCardImage']);

    Route::put('/internship/facilities/header', [InternshipFacilityController::class, 'updateHeader']);
    Route::put('/internship/facilities/items/{index}', [InternshipFacilityController::class, 'updateItem']);

    // Internship Listings (Batches)
    Route::apiResource('internships', \App\Http\Controllers\Api\Admin\InternshipController::class);

    // Internship Applicants
    Route::get('/internships/{internshipId}/applicants', [\App\Http\Controllers\Api\Admin\InternshipApplicantController::class, 'index']);
    Route::post('/internship-applicants', [\App\Http\Controllers\Api\Admin\InternshipApplicantController::class, 'store']);
    Route::get('/internship-applicants/{id}', [\App\Http\Controllers\Api\Admin\InternshipApplicantController::class, 'show']);
    Route::put('/internship-applicants/{id}', [\App\Http\Controllers\Api\Admin\InternshipApplicantController::class, 'update']);
    Route::delete('/internship-applicants/{id}', [\App\Http\Controllers\Api\Admin\InternshipApplicantController::class, 'destroy']);

    // Hero Section
    Route::post('/hero', [HeroSectionController::class, 'store']);
    Route::get('/hero/{id}', [HeroSectionController::class, 'showAdmin']);
    Route::patch('/hero/{id}', [HeroSectionController::class, 'update']);
    Route::delete('/hero/{id}', [HeroSectionController::class, 'destroy']);

    // Configuration
    Route::get('/configurations', [ConfigurationController::class, 'index']);
    Route::put('/configurations/{key}', [ConfigurationController::class, 'update']);
    Route::post('/configurations/bulk', [ConfigurationController::class, 'bulkUpdate']);
});

/*
|--------------------------------------------------------------------------
| SUPERADMIN ONLY ROUTES (merged with admin, kept for reference)
|--------------------------------------------------------------------------
| NOTE: superadmin and admin roles are now merged into 'admin' role.
| All admin routes above apply to both former superadmin and admin.
*/

/*
|--------------------------------------------------------------------------
| ARTICLE MANAGEMENT ROUTES
|--------------------------------------------------------------------------
| Three separate namespaces with role-based access control:
| - Writer endpoints: /api/writer/articles (auth + writer role)
| - Admin endpoints: /api/admin/articles (auth + admin role)
| - Public endpoints: /api/articles (no auth required, read-only)
*/
require __DIR__ . '/api-articles.php';
