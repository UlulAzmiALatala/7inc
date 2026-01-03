<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please login first.'
            ], 401);
        }

        $userRole = $request->user()->role;

        if (is_string($roles) && str_contains($roles, ',')) {
            $roles = explode(',', $roles);
        }

        if (!in_array($userRole, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Your role: ' . $userRole . '. Required: ' . implode(' or ', (array)$roles)
            ], 403);
        }

        return $next($request);
    }
}
