<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateArticleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->role === 'writer';
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|min:5|max:255',
            'excerpt' => 'sometimes|string|min:10|max:500',
            'content' => 'sometimes|string|min:100',
            'category_id' => 'nullable|exists:categories,id',
            'featured_image' => 'nullable|string|url',
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'title.min' => 'Title must be at least 5 characters',
            'excerpt.min' => 'Excerpt must be at least 10 characters',
            'content.min' => 'Content must be at least 100 characters',
            'category_id.exists' => 'Selected category does not exist',
            'featured_image.url' => 'Featured image must be a valid URL',
        ];
    }
}
