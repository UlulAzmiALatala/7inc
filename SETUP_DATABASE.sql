-- SQL Script untuk memastikan struktur database sesuai dengan sistem Auth & Article Workflow
-- Jalankan jika sudah melakukan migrate

-- 1. Pastikan users table sudah punya role enum dengan 3 value saja
-- Query untuk check:
-- SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'role';

-- 2. Jika ada articles table, pastikan memiliki semua kolom yang diperlukan
-- Query untuk add missing columns jika ada:

ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS assignment_type ENUM('hero', 'about', 'business', 'homepage', 'none') DEFAULT 'none',
ADD COLUMN IF NOT EXISTS assignment_position VARCHAR(100) NULL;

-- 3. Pastikan configurations table ada untuk menyimpan artikel references
-- Jika belum ada, create:

CREATE TABLE IF NOT EXISTS configurations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(255) NOT NULL UNIQUE,
    value LONGTEXT NULL,
    type VARCHAR(100) DEFAULT 'string',
    group_name VARCHAR(100) NULL,
    label VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_key_name (key_name),
    INDEX idx_group_name (group_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Seeding role enum configuration entries untuk artikel references
INSERT INTO configurations (key_name, value, type, group_name, label, created_at, updated_at) VALUES
('hero_article_id', NULL, 'article_reference', 'hero', 'Artikel untuk Hero Section', NOW(), NOW()),
('about_article_id', NULL, 'article_reference', 'about', 'Artikel untuk Tentang Kami', NOW(), NOW()),
('business_article_id', NULL, 'article_reference', 'business', 'Artikel untuk Bisnis Kami', NOW(), NOW()),
('homepage_featured_articles', '[]', 'json', 'website', 'Artikel Unggulan Homepage (JSON array)', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 5. Indexes untuk performa query article
ALTER TABLE articles
ADD INDEX IF NOT EXISTS idx_author_id (author_id),
ADD INDEX IF NOT EXISTS idx_published_by (published_by),
ADD INDEX IF NOT EXISTS idx_status (status),
ADD INDEX IF NOT EXISTS idx_is_hero (is_hero),
ADD INDEX IF NOT EXISTS idx_is_featured (is_featured),
ADD INDEX IF NOT EXISTS idx_display_order (display_order);

-- 6. Update existing admin users ke role 'admin' jika ada superadmin
-- Jangan jalankan jika sudah pake migration dengan migration:fresh
-- UPDATE users SET role = 'admin' WHERE role IN ('superadmin', 'super_admin');

-- Done! Database siap untuk sistem auth & article workflow
