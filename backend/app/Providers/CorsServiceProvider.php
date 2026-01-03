<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class CorsServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Add CORS headers to all responses
        $this->app['Illuminate\Http\Response']->macro('cors', function () {
            $this->header('Access-Control-Allow-Origin', 'http://localhost:5173');
            $this->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            $this->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With, X-CSRF-TOKEN');
            $this->header('Access-Control-Expose-Headers', 'Content-Length, X-Total-Count, X-Total-Pages, Authorization');
            $this->header('Access-Control-Allow-Credentials', 'true');
            return $this;
        });

        // Hook into response to add CORS headers automatically
        if ($this->app->runningInConsole() === false) {
            $this->app->make('Illuminate\Http\Response');
        }
    }
}
