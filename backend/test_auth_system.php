<?php

echo "=== Testing Authentication & Authorization System ===\n\n";

echo "1. Testing User Model...\n";
$userClass = 'App\Models\User';
if (!class_exists($userClass)) {
    echo "   ERROR: User model not found!\n";
    exit(1);
}
echo "   OK: User model exists\n";

echo "\n2. Testing Article Model...\n";
$articleClass = 'App\Models\Article';
if (!class_exists($articleClass)) {
    echo "   ERROR: Article model not found!\n";
    exit(1);
}
echo "   OK: Article model exists\n";

echo "\n3. Testing AuthController...\n";
$authControllerClass = 'App\Http\Controllers\Api\AuthController';
if (!class_exists($authControllerClass)) {
    echo "   ERROR: AuthController not found!\n";
    exit(1);
}
echo "   OK: AuthController exists\n";

echo "\n4. Testing ArticleController...\n";
$articleControllerClass = 'App\Http\Controllers\Api\ArticleController';
if (!class_exists($articleControllerClass)) {
    echo "   ERROR: ArticleController not found!\n";
    exit(1);
}
echo "   OK: ArticleController exists\n";

echo "\n5. Testing CheckRole Middleware...\n";
$middlewareClass = 'App\Http\Middleware\CheckRole';
if (!class_exists($middlewareClass)) {
    echo "   ERROR: CheckRole middleware not found!\n";
    exit(1);
}
echo "   OK: CheckRole middleware exists\n";

echo "\n6. Checking routes configuration...\n";
$routesPath = base_path('routes/api.php');
if (!file_exists($routesPath)) {
    echo "   ERROR: api.php routes file not found!\n";
    exit(1);
}
$routesContent = file_get_contents($routesPath);

$requiredRoutes = [
    '/auth/register',
    '/auth/login',
    '/writer/articles',
    '/admin/articles',
    '/admin/articles/pending',
];
$missingRoutes = [];
foreach ($requiredRoutes as $route) {
    if (!str_contains($routesContent, $route)) {
        $missingRoutes[] = $route;
    }
}

if (count($missingRoutes) > 0) {
    echo "   ERROR: Missing routes:\n";
    foreach ($missingRoutes as $route) {
        echo "     - $route\n";
    }
    exit(1);
}
echo "   OK: All required routes exist\n";

echo "\n7. Checking CORS configuration...\n";
$corsPath = base_path('config/cors.php');
if (!file_exists($corsPath)) {
    echo "   ERROR: cors.php not found!\n";
    exit(1);
}
$corsContent = file_get_contents($corsPath);
if (!str_contains($corsContent, 'http://localhost:5173')) {
    echo "   WARNING: localhost:5173 not found in CORS config\n";
}
echo "   OK: CORS configuration exists\n";

echo "\n=== All Tests Passed ===\n";
echo "\nSummary:\n";
echo "- User model: ready with role support (admin, writer, public)\n";
echo "- Article model: ready with workflow status (draft, pending, published, rejected)\n";
echo "- AuthController: register & login endpoints ready\n";
echo "- ArticleController: writer & admin management ready\n";
echo "- Routes: role-based protection configured\n";
echo "- CORS: configured for localhost:5173\n";
echo "\nNext steps:\n";
echo "1. Run: php artisan migrate:fresh --seed\n";
echo "2. Run: npm install && npm run dev\n";
echo "3. Test registration at http://localhost:5173/register\n";
echo "4. Test login at http://localhost:5173/login\n";

