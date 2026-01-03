<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    /**
     * Determine if the user can view any articles
     */
    public function viewAny(User $user): bool
    {
        // Admins and writers can view any articles (for management purposes)
        return in_array($user->role, ['admin', 'writer']);
    }

    /**
     * Determine if the user can view a specific article
     */
    public function view(User $user, Article $article): bool
    {
        // Public can view published articles (but this is handled by scopes in controller)
        // Admins can view any article
        if ($user->role === 'admin') {
            return true;
        }
        
        // Writers can view their own articles
        if ($user->role === 'writer') {
            return $user->id === $article->author_id;
        }

        return false;
    }

    /**
     * Determine if the user can create an article
     */
    public function create(User $user): bool
    {
        // Only writers can create articles
        return $user->role === 'writer';
    }

    /**
     * Determine if the user can update an article
     */
    public function update(User $user, Article $article): bool
    {
        // Admins can update any article
        if ($user->role === 'admin') {
            return true;
        }

        // Writers can only update their own articles
        if ($user->role === 'writer') {
            return $user->id === $article->author_id;
        }

        return false;
    }

    /**
     * Determine if the user can delete an article
     */
    public function delete(User $user, Article $article): bool
    {
        // Admins can delete any article except published ones
        if ($user->role === 'admin') {
            return $article->status !== 'published';
        }

        // Writers can only delete their own draft articles
        if ($user->role === 'writer') {
            return $user->id === $article->author_id && $article->status === 'draft';
        }

        return false;
    }

    /**
     * Determine if the user can submit an article
     */
    public function submit(User $user, Article $article): bool
    {
        // Only the author can submit their own article
        return $user->role === 'writer' && $user->id === $article->author_id;
    }

    /**
     * Determine if the user can approve an article
     */
    public function approve(User $user, Article $article): bool
    {
        // Only admins can approve articles
        return $user->role === 'admin';
    }

    /**
     * Determine if the user can reject an article
     */
    public function reject(User $user, Article $article): bool
    {
        // Only admins can reject articles
        return $user->role === 'admin';
    }

    /**
     * Determine if the user can set article distribution (hero, featured, etc.)
     */
    public function distribute(User $user, Article $article): bool
    {
        // Only admins can set distribution
        return $user->role === 'admin';
    }
}
