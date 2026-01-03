<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConfigurationsSeeder extends Seeder
{
    public function run(): void
    {
        $configs = [
            // Group 1: Website (General)
            [
                'key_name' => 'site_name',
                'value' => 'Seven INC',
                'type' => 'text',
                'group_name' => 'website',
                'label' => 'Nama Website',
                'description' => 'Nama perusahaan yang tampil di title bar'
            ],
            [
                'key_name' => 'site_description',
                'value' => 'Perusahaan Teknologi Terdepan di Indonesia',
                'type' => 'textarea',
                'group_name' => 'website',
                'label' => 'Deskripsi Website',
                'description' => 'Meta description untuk SEO'
            ],
            [
                'key_name' => 'site_keywords',
                'value' => 'lowongan kerja, magang, IT, teknologi, software development',
                'type' => 'text',
                'group_name' => 'website',
                'label' => 'Keywords SEO',
                'description' => 'Meta keywords untuk SEO'
            ],

            // Group 2: Navbar & Logo
            [
                'key_name' => 'navbar_logo',
                'value' => '/images/logo.png',
                'type' => 'image',
                'group_name' => 'navbar',
                'label' => 'Logo Perusahaan',
                'description' => 'Logo yang tampil di navbar (recommended: 200x60px)'
            ],
            [
                'key_name' => 'navbar_tagline',
                'value' => 'Building Future Together',
                'type' => 'text',
                'group_name' => 'navbar',
                'label' => 'Tagline',
                'description' => 'Tagline di samping logo'
            ],

            // Group 3: Hero Section
            [
                'key_name' => 'hero_title',
                'value' => 'Bergabunglah Dengan Tim Kami',
                'type' => 'text',
                'group_name' => 'hero',
                'label' => 'Hero Title',
                'description' => 'Judul utama hero section'
            ],
            [
                'key_name' => 'hero_subtitle',
                'value' => 'Temukan peluang karir terbaik di perusahaan teknologi terdepan',
                'type' => 'textarea',
                'group_name' => 'hero',
                'label' => 'Hero Subtitle',
                'description' => 'Subtitle hero section'
            ],
            [
                'key_name' => 'hero_image',
                'value' => '/images/hero-bg.jpg',
                'type' => 'image',
                'group_name' => 'hero',
                'label' => 'Hero Background Image',
                'description' => 'Background image hero section (recommended: 1920x1080px)'
            ],
            [
                'key_name' => 'hero_cta_text',
                'value' => 'Lihat Lowongan',
                'type' => 'text',
                'group_name' => 'hero',
                'label' => 'CTA Button Text',
                'description' => 'Text tombol call-to-action'
            ],
            [
                'key_name' => 'hero_cta_link',
                'value' => '/jobs',
                'type' => 'text',
                'group_name' => 'hero',
                'label' => 'CTA Button Link',
                'description' => 'Link tujuan tombol CTA'
            ],
            [
                'key_name' => 'hero_article_id',
                'value' => null,
                'type' => 'article_reference',
                'group_name' => 'hero',
                'label' => 'Artikel Hero (Opsional)',
                'description' => 'Artikel yang ditampilkan di hero section (pilih dari artikel published)'
            ],

            // Group 4: Social Media
            [
                'key_name' => 'social_facebook',
                'value' => 'https://facebook.com/seveninc',
                'type' => 'text',
                'group_name' => 'social',
                'label' => 'Facebook URL',
                'description' => 'Link halaman Facebook perusahaan'
            ],
            [
                'key_name' => 'social_twitter',
                'value' => 'https://twitter.com/seveninc',
                'type' => 'text',
                'group_name' => 'social',
                'label' => 'Twitter/X URL',
                'description' => 'Link akun Twitter/X perusahaan'
            ],
            [
                'key_name' => 'social_instagram',
                'value' => 'https://instagram.com/seveninc',
                'type' => 'text',
                'group_name' => 'social',
                'label' => 'Instagram URL',
                'description' => 'Link Instagram perusahaan'
            ],
            [
                'key_name' => 'social_linkedin',
                'value' => 'https://linkedin.com/company/seveninc',
                'type' => 'text',
                'group_name' => 'social',
                'label' => 'LinkedIn URL',
                'description' => 'Link halaman LinkedIn perusahaan'
            ],
            [
                'key_name' => 'social_youtube',
                'value' => 'https://youtube.com/@seveninc',
                'type' => 'text',
                'group_name' => 'social',
                'label' => 'YouTube URL',
                'description' => 'Link channel YouTube perusahaan'
            ],

            // Group 5: Info Perusahaan (Company)
            [
                'key_name' => 'company_name',
                'value' => 'PT Seven INC Indonesia',
                'type' => 'text',
                'group_name' => 'company',
                'label' => 'Nama Perusahaan',
                'description' => 'Nama resmi perusahaan'
            ],
            [
                'key_name' => 'company_address',
                'value' => 'Jl. Teknologi No. 123, Jakarta Selatan 12345',
                'type' => 'textarea',
                'group_name' => 'company',
                'label' => 'Alamat',
                'description' => 'Alamat lengkap kantor'
            ],
            [
                'key_name' => 'company_phone',
                'value' => '+62 21 1234 5678',
                'type' => 'text',
                'group_name' => 'company',
                'label' => 'Telepon',
                'description' => 'Nomor telepon kantor'
            ],
            [
                'key_name' => 'company_email',
                'value' => 'info@seveninc.com',
                'type' => 'text',
                'group_name' => 'company',
                'label' => 'Email',
                'description' => 'Email perusahaan'
            ],
            [
                'key_name' => 'company_whatsapp',
                'value' => '+62 812 3456 7890',
                'type' => 'text',
                'group_name' => 'company',
                'label' => 'WhatsApp',
                'description' => 'Nomor WhatsApp bisnis'
            ],

            // Group 6: Tentang Kami (About)
            [
                'key_name' => 'about_title',
                'value' => 'Tentang Kami',
                'type' => 'text',
                'group_name' => 'about',
                'label' => 'Judul Halaman',
                'description' => 'Judul section Tentang Kami'
            ],
            [
                'key_name' => 'about_content',
                'value' => 'Seven INC adalah perusahaan teknologi yang berfokus pada pengembangan solusi software inovatif. Kami percaya bahwa teknologi dapat mengubah dunia menjadi lebih baik.',
                'type' => 'textarea',
                'group_name' => 'about',
                'label' => 'Konten Utama',
                'description' => 'Deskripsi lengkap tentang perusahaan'
            ],
            [
                'key_name' => 'about_vision',
                'value' => 'Menjadi perusahaan teknologi terdepan di Asia Tenggara yang menciptakan dampak positif bagi masyarakat',
                'type' => 'textarea',
                'group_name' => 'about',
                'label' => 'Visi',
                'description' => 'Visi perusahaan'
            ],
            [
                'key_name' => 'about_mission',
                'value' => 'Memberikan solusi teknologi berkualitas tinggi yang membantu klien mencapai tujuan bisnis mereka',
                'type' => 'textarea',
                'group_name' => 'about',
                'label' => 'Misi',
                'description' => 'Misi perusahaan'
            ],
            [
                'key_name' => 'about_article_id',
                'value' => null,
                'type' => 'article_reference',
                'group_name' => 'about',
                'label' => 'Artikel Tentang Kami (Opsional)',
                'description' => 'Artikel yang ditampilkan di halaman Tentang Kami'
            ],

            // Group 7: Bisnis Kami (Business)
            [
                'key_name' => 'business_title',
                'value' => 'Bisnis Kami',
                'type' => 'text',
                'group_name' => 'business',
                'label' => 'Judul Halaman',
                'description' => 'Judul section Bisnis Kami'
            ],
            [
                'key_name' => 'business_content',
                'value' => 'Kami menyediakan berbagai layanan teknologi untuk membantu bisnis Anda berkembang, mulai dari pengembangan web hingga aplikasi mobile.',
                'type' => 'textarea',
                'group_name' => 'business',
                'label' => 'Konten Bisnis',
                'description' => 'Deskripsi layanan atau bisnis perusahaan'
            ]
        ];

        foreach ($configs as $config) {
            DB::table('configurations')->updateOrInsert(
                ['key_name' => $config['key_name']],
                $config
            );
        }
    }
}
