<?php

return [

    // Path yang boleh di-access dari cross-origin
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // HTTP methods yang diizinkan untuk preflight requests
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    // Origins yang diizinkan (client frontend)
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],

    // Pattern-based origins (jika diperlukan untuk production)
    'allowed_origins_patterns' => [
        '#^http://localhost(:\d+)?$#',
    ],

    // Headers yang diizinkan dalam request
    'allowed_headers' => [
        'Content-Type',
        'Authorization',
        'Accept',
        'Origin',
        'X-Requested-With',
        'X-CSRF-TOKEN',
    ],

    // Headers yang di-expose ke client
    'exposed_headers' => [
        'Content-Length',
        'X-Total-Count',
        'X-Total-Pages',
        'Authorization',
    ],

    // Max age untuk preflight cache (dalam seconds)
    'max_age' => 3600,

    // Izinkan credentials (cookies, authorization headers) - PENTING untuk Bearer token
    'supports_credentials' => true,
];
