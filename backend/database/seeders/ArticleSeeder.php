<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Article;
use App\Models\Category;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan ada user penulis dan admin
        $writer = User::where('role', 'writer')->first();
        if (!$writer) {
            $writer = User::factory()->create(['role' => 'writer']);
        }

        $admin = User::where('role', 'admin')->first();
        if (!$admin) {
            $admin = User::factory()->create(['role' => 'admin']);
        }

        // Pastikan ada kategori
        $category = Category::first();
        if (!$category) {
            $category = Category::create([
                'name' => 'Teknologi',
                'slug' => 'teknologi',
                'description' => 'Artikel seputar teknologi terkini.'
            ]);
        }

        // Buat artikel dummy
        Article::create([
            'title' => 'Perkembangan AI di Tahun 2025',
            'content' => '<p>AI semakin canggih...</p>',
            'category_id' => $category->id,
            'author_id' => $writer->id,
            'status' => 'published',
            'is_hero' => true,
            'published_at' => now(),
            'published_by' => $admin->id,
        ]);

        Article::create([
            'title' => 'Tutorial Laravel 12',
            'content' => '<p>Laravel 12 membawa fitur baru...</p>',
            'category_id' => $category->id,
            'author_id' => $writer->id,
            'status' => 'draft',
        ]);
    }
}
