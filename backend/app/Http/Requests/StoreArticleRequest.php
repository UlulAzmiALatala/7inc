<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreArticleRequest extends FormRequest
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
            'title' => 'required|string|min:5|max:255',
            'excerpt' => 'required|string|min:10|max:500',
            'content' => 'required|string|min:100',
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
            'title.required' => 'Article title is required',
            'title.min' => 'Title must be at least 5 characters',
            'excerpt.required' => 'Article excerpt is required',
            'excerpt.min' => 'Excerpt must be at least 10 characters',
            'content.required' => 'Article content is required',
            'content.min' => 'Content must be at least 100 characters',
            'category_id.exists' => 'Selected category does not exist',
            'featured_image.url' => 'Featured image must be a valid URL',
        ];
    }
}
