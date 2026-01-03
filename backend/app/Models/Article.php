<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'title', 'slug', 'content', 'excerpt', 'featured_image',
        'category_id', 'author_id', 'status', 'rejection_reason',
        'is_hero', 'is_featured', 'display_order', 'assignment_type', 'assignment_position',
        'published_at', 'published_by', 'views'
    ];
    
    protected $casts = [
        'published_at' => 'datetime',
        'is_hero' => 'boolean',
        'is_featured' => 'boolean',
        'views' => 'integer',
        'display_order' => 'integer'
    ];
    
    // Auto-generate slug from title
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }
            
            if (empty($article->excerpt)) {
                $article->excerpt = Str::limit(strip_tags($article->content), 200);
            }
        });
        
        static::updating(function ($article) {
            // Auto-set published_at when status changes to published
            if ($article->isDirty('status') && $article->status === 'published' && empty($article->published_at)) {
                $article->published_at = now();
            }
        });
    }
    
    // ===========================
    // RELATIONSHIPS
    // ===========================
    
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
    
    public function rejections()
    {
        return $this->hasMany(ArticleRejection::class);
    }
    
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    
    // ===========================
    // SCOPES - STATUS FILTERS
    // ===========================
    
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }
    
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
    
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
    
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
    
    // ===========================
    // SCOPES - DISTRIBUTION FILTERS
    // ===========================
    
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true)->where('status', 'published')->orderBy('display_order');
    }
    
    public function scopeHero($query)
    {
        return $query->where('is_hero', true)->where('status', 'published')->latest('published_at');
    }
    
    public function scopeBySection($query, $section)
    {
        return $query->where('section', $section)->where('status', 'published')->orderBy('display_order');
    }
    
    public function scopeForWriter($query, $userId)
    {
        return $query->where('author_id', $userId);
    }
    
    // ===========================
    // STATUS CHECKS
    // ===========================
    
    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }
    
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
    
    public function isPublished(): bool
    {
        return $this->status === 'published';
    }
    
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }
    
    // ===========================
    // WORKFLOW ACTIONS
    // ===========================
    
    /**
     * Submit article for admin review
     * Status: draft → pending
     */
    public function submit(): bool
    {
        if (!$this->isDraft()) {
            return false;
        }
        
        $this->status = 'pending';
        $this->submitted_at = now();
        return $this->save();
    }
    
    /**
     * Admin approves article for publication
     * Status: pending → published
     */
    public function approve(User $approver): bool
    {
        if (!$this->isPending()) {
            return false;
        }
        
        $this->status = 'published';
        $this->published_at = now();
        $this->published_by = $approver->id;
        return $this->save();
    }
    
    /**
     * Admin rejects article with reason
     * Status: pending → rejected (writer can edit and resubmit)
     */
    public function reject(User $rejector, string $reason): bool
    {
        if (!$this->isPending()) {
            return false;
        }
        
        // Create rejection record
        $this->rejections()->create([
            'rejected_by' => $rejector->id,
            'reason' => $reason
        ]);
        
        $this->status = 'rejected';
        $this->rejected_at = now();
        return $this->save();
    }
    
    /**
     * Get the most recent rejection reason
     */
    public function getLatestRejectionReason(): ?string
    {
        return $this->rejections()
            ->latest()
            ->first()
            ?->reason;
    }
    
    // ===========================
    // AUTHORIZATION CHECKS
    // ===========================
    
    public function canBeEditedBy(User $user): bool
    {
        // Admin can edit anything
        if ($user->role === 'admin') {
            return true;
        }
        
        // Writer can only edit own draft or rejected articles
        if ($user->role === 'writer' && $user->id === $this->author_id) {
            return in_array($this->status, ['draft', 'rejected']);
        }
        
        return false;
    }
    
    public function canBeDeletedBy(User $user): bool
    {
        // Admin can delete anything except published
        if ($user->role === 'admin') {
            return $this->status !== 'published';
        }
        
        // Writer can only delete own draft articles
        if ($user->role === 'writer' && $user->id === $this->author_id) {
            return $this->status === 'draft';
        }
        
        return false;
    }
    
    public function canBeSubmittedBy(User $user): bool
    {
        // Only the author can submit
        if ($user->id !== $this->author_id) {
            return false;
        }
        
        // Can only submit draft or rejected articles
        return in_array($this->status, ['draft', 'rejected']);
    }
    
    public function canBeApprovedBy(User $user): bool
    {
        // Only admins can approve
        // Can only approve pending articles
        return $user->role === 'admin' && $this->isPending();
    }
    
    public function canBeRejectedBy(User $user): bool
    {
        // Only admins can reject
        // Can only reject pending articles
        return $user->role === 'admin' && $this->isPending();
    }
    
    // ===========================
    // UTILITY METHODS
    // ===========================
    
    /**
     * Increment view count
     */
    public function incrementViews(): void
    {
        $this->increment('views');
    }
    
    /**
     * Generate slug from title if not set
     */
}
