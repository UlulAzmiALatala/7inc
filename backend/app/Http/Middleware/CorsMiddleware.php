<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Debug logging
        \Log::debug('CorsMiddleware executing', [
            'method' => $request->method(),
            'origin' => $request->header('Origin'),
            'path' => $request->path(),
        ]);

        // List of allowed origins
        $allowedOrigins = [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
        ];

        $origin = $request->header('Origin');

        // Always add CORS headers
        $corsHeaders = [
            'Access-Control-Allow-Origin' => 'http://localhost:5173',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, Accept, Origin, X-Requested-With, X-CSRF-TOKEN',
            'Access-Control-Expose-Headers' => 'Content-Length, X-Total-Count, X-Total-Pages, Authorization',
            'Access-Control-Allow-Credentials' => 'true',
            'Access-Control-Max-Age' => '3600',
        ];

        // Set origin from request if in allowed list
        if (in_array($origin, $allowedOrigins)) {
            $corsHeaders['Access-Control-Allow-Origin'] = $origin;
        }

        // Handle preflight (OPTIONS) requests
        if ($request->isMethod('OPTIONS')) {
            \Log::debug('Handling OPTIONS preflight request');
            $response = response('', 200);
            foreach ($corsHeaders as $key => $value) {
                $response->header($key, $value);
            }
            return $response;
        }

        // Handle actual requests
        $response = $next($request);
        
        foreach ($corsHeaders as $key => $value) {
            $response->header($key, $value);
        }

        return $response;
    }
}
