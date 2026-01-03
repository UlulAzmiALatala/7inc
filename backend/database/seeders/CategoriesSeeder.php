<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Berita', 'slug' => 'berita', 'description' => 'Berita terkini perusahaan'],
            ['name' => 'Artikel', 'slug' => 'artikel', 'description' => 'Artikel informatif'],
            ['name' => 'Pengumuman', 'slug' => 'pengumuman', 'description' => 'Pengumuman resmi perusahaan'],
            ['name' => 'Tips Karir', 'slug' => 'tips-karir', 'description' => 'Tips pengembangan karir dan profesional'],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->updateOrInsert(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
