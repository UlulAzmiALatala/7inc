<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'featured_image' => $this->featured_image,
            
            // Author information
            'author' => [
                'id' => $this->author?->id,
                'name' => $this->author?->name,
                'email' => $this->author?->email,
            ],
            
            // Category
            'category' => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
            ],
            
            // Status and workflow
            'status' => $this->status,
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'published_at' => $this->published_at?->toIso8601String(),
            'rejected_at' => $this->rejected_at?->toIso8601String(),
            
            // Latest rejection reason (if any)
            'latest_rejection_reason' => $this->getLatestRejectionReason(),
            'rejection_count' => $this->rejections?->count() ?? 0,
            
            // Distribution settings
            'is_hero' => (bool) $this->is_hero,
            'is_featured' => (bool) $this->is_featured,
            'display_order' => $this->display_order,
            'section' => $this->section,
            
            // Views
            'views' => $this->views,
            
            // Timestamps
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
