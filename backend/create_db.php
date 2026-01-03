<?php
/**
 * Script untuk membuat database MySQL
 * Jalankan: php create_db.php
 */

try {
    // Connect ke MySQL server tanpa database
    $pdo = new PDO(
        'mysql:host=127.0.0.1;port=3306',
        'root',
        '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    echo "✓ Connected to MySQL Server\n";
    
    // Drop database jika ada
    $pdo->exec("DROP DATABASE IF EXISTS article_workflow");
    echo "✓ Old database dropped (if existed)\n";
    
    // Create database baru
    $pdo->exec("CREATE DATABASE article_workflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✓ Database 'article_workflow' created successfully\n";
    
    // Grant permissions
    $pdo->exec("GRANT ALL PRIVILEGES ON article_workflow.* TO 'root'@'localhost'");
    $pdo->exec("FLUSH PRIVILEGES");
    echo "✓ Permissions granted\n";
    
    echo "\n✅ Database setup complete!\n";
    echo "You can now run: php artisan migrate\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Make sure MySQL is running and accessible at 127.0.0.1:3306\n";
    exit(1);
}
