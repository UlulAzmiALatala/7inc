<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Log, Hash};
use App\Models\{User, ActivityLog};

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);
        
        // CRITICAL: Check if user exists in MySQL
        $user = User::where('email', $validated['email'])->first();
        
        if (!$user) {
            Log::warning('Login failed - user not found', [
                'email' => $validated['email'],
                'ip' => $request->ip()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'User not found. Please check your email or register first.'
            ], 404);
        }
        
        // CRITICAL: Check password manually to avoid session creation/guard issues in API
        if (!Hash::check($validated['password'], $user->password)) {
            Log::warning('Login failed - invalid password', [
                'email' => $validated['email'],
                'ip' => $request->ip()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials. Please check your password.'
            ], 401);
        }
        
        // Set user for this request so ActivityLog works
        Auth::setUser($user);
        
        // Generate token with abilities based on role
        $tokenAbilities = match($user->role) {
            'admin' => ['admin:*'],
            'writer' => ['writer:*'],
            'public' => ['public:*'],
            default => ['public:*']
        };
        
        // Token expires in 30 days
        $token = $user->createToken('auth_token', $tokenAbilities, now()->addDays(30))->plainTextToken;
        
        // Log activity
        ActivityLog::logAction('login', 'User', $user->id, "User {$user->name} logged in");
        
        Log::info('Login successful', [
            'user_id' => $user->id,
            'role' => $user->role,
            'email' => $user->email
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $user->only(['id', 'name', 'email', 'role', 'avatar']),
                'token' => $token,
                'role' => $user->role,
                'expires_at' => now()->addDays(30)->toISOString()
            ]
        ], 200);
    }
    
    public function logout(Request $request)
    {
        $user = $request->user();
        
        // Log before deleting token to ensure user context is available
        ActivityLog::logAction('logout', 'User', $user->id, "User {$user->name} logged out");

        // Delete current access token
        $request->user()->currentAccessToken()?->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ], 200);
    }
}
