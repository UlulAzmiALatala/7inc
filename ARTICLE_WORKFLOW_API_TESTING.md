# 🚀 ARTICLE WORKFLOW API - QUICK START TESTING GUIDE

## Prerequisites

1. **Backend running**: `php artisan serve` (usually on http://localhost:8000)
2. **Database migrated**: `php artisan migrate`
3. **Test client**: Postman, Insomnia, or cURL
4. **Test users**: Create via registration endpoint or seeder

---

## Step 1: Register Test Users

### Create a Writer User
```bash
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "name": "John Writer",
  "email": "writer@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "YOUR_WRITER_TOKEN",
  "user": { ... }
}
```

### Create an Admin User
```bash
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "name": "Jane Admin",
  "email": "admin@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Then manually set role to admin in database:**
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

---

## Step 2: Test Writer API

**Save the writer token from registration as: `WRITER_TOKEN`**

### 2.1: Create an Article (Draft)
```bash
POST http://localhost:8000/api/writer/articles
Authorization: Bearer WRITER_TOKEN
Content-Type: application/json

{
  "title": "My First Article About Technology",
  "excerpt": "An introduction to modern web development and its challenges",
  "content": "This is a detailed article about web development. It contains more than 100 characters to meet validation requirements. We discuss various technologies, best practices, and real-world examples that developers encounter daily.",
  "category_id": 1
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Article created successfully as draft",
  "data": {
    "id": 1,
    "title": "My First Article About Technology",
    "status": "draft",
    "author": {
      "id": 1,
      "name": "John Writer",
      "email": "writer@example.com"
    },
    "created_at": "2026-01-15T10:00:00Z"
  }
}
```

### 2.2: List My Articles
```bash
GET http://localhost:8000/api/writer/articles
Authorization: Bearer WRITER_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "My First Article About Technology",
      "status": "draft",
      "rejection_count": 0,
      ...
    }
  ],
  "meta": {
    "total": 1,
    "count": 1,
    "per_page": 15,
    "current_page": 1,
    "last_page": 1
  }
}
```

### 2.3: View My Article
```bash
GET http://localhost:8000/api/writer/articles/1
Authorization: Bearer WRITER_TOKEN
```

### 2.4: Edit My Article
```bash
PUT http://localhost:8000/api/writer/articles/1
Authorization: Bearer WRITER_TOKEN
Content-Type: application/json

{
  "title": "My First Article About Modern Technology",
  "excerpt": "An introduction to modern web development and its challenges in 2026",
  "content": "Updated content with more details..."
}
```

### 2.5: Submit Article for Review
```bash
POST http://localhost:8000/api/writer/articles/1/submit
Authorization: Bearer WRITER_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Article submitted for review. An admin will review it soon.",
  "data": {
    "id": 1,
    "status": "pending",
    "submitted_at": "2026-01-15T10:05:00Z"
  }
}
```

### 2.6: Get My Statistics
```bash
GET http://localhost:8000/api/writer/articles/stats
Authorization: Bearer WRITER_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "total": 1,
    "draft": 0,
    "pending": 1,
    "published": 0,
    "rejected": 0,
    "total_views": 0
  }
}
```

---

## Step 3: Test Admin API

**Save the admin token from registration as: `ADMIN_TOKEN`**

### 3.1: View Pending Articles
```bash
GET http://localhost:8000/api/admin/articles/review/pending
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "My First Article About Modern Technology",
      "status": "pending",
      "author": {
        "id": 1,
        "name": "John Writer"
      },
      "submitted_at": "2026-01-15T10:05:00Z",
      "rejection_count": 0
    }
  ],
  "meta": {
    "total": 1,
    "pending_count": 1
  }
}
```

### 3.2: Approve & Publish Article
```bash
POST http://localhost:8000/api/admin/articles/1/approve
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "make_hero": true,
  "make_featured": true,
  "display_order": 1,
  "section": "featured"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Article approved and published successfully",
  "data": {
    "id": 1,
    "status": "published",
    "is_hero": true,
    "is_featured": true,
    "display_order": 1,
    "section": "featured",
    "published_at": "2026-01-15T10:10:00Z"
  }
}
```

### 3.3: View All Articles (with filters)
```bash
GET http://localhost:8000/api/admin/articles?status=published&sort=-created_at
Authorization: Bearer ADMIN_TOKEN
```

### 3.4: Get Admin Dashboard Statistics
```bash
GET http://localhost:8000/api/admin/articles/stats
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "total_articles": 1,
    "pending_review": 0,
    "published": 1,
    "draft": 0,
    "rejected": 0,
    "hero_articles": 1,
    "featured_articles": 1,
    "total_views": 0,
    "top_writers": [
      {
        "id": 1,
        "name": "John Writer",
        "email": "writer@example.com",
        "articles_count": 1
      }
    ]
  }
}
```

---

## Step 4: Test Rejection Workflow

### 4.1: Create Another Article
```bash
POST http://localhost:8000/api/writer/articles
Authorization: Bearer WRITER_TOKEN
Content-Type: application/json

{
  "title": "Article About AI and Machine Learning",
  "excerpt": "Understanding modern AI technologies",
  "content": "Comprehensive guide about AI, machine learning, and deep learning technologies. This content must be at least 100 characters long to pass validation..."
}
```

Save the ID as `ARTICLE_2_ID`

### 4.2: Submit for Review
```bash
POST http://localhost:8000/api/writer/articles/{ARTICLE_2_ID}/submit
Authorization: Bearer WRITER_TOKEN
```

### 4.3: Reject Article (as Admin)
```bash
POST http://localhost:8000/api/admin/articles/{ARTICLE_2_ID}/reject
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "reason": "Please expand the introduction section with more real-world examples. Also add citations for the AI statistics mentioned."
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Article rejected. Writer has been notified and can edit and resubmit.",
  "data": {
    "id": 2,
    "status": "rejected",
    "rejection_count": 1,
    "latest_rejection_reason": "Please expand the introduction section..."
  }
}
```

### 4.4: Writer Edits and Resubmits
```bash
PUT http://localhost:8000/api/writer/articles/{ARTICLE_2_ID}
Authorization: Bearer WRITER_TOKEN
Content-Type: application/json

{
  "title": "Article About AI and Machine Learning - Updated",
  "excerpt": "Understanding modern AI technologies with real examples",
  "content": "Comprehensive guide... [expanded content with more examples and citations]"
}
```

### 4.5: Resubmit
```bash
POST http://localhost:8000/api/writer/articles/{ARTICLE_2_ID}/submit
Authorization: Bearer WRITER_TOKEN
```

### 4.6: Admin Approves
```bash
POST http://localhost:8000/api/admin/articles/{ARTICLE_2_ID}/approve
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "make_featured": true,
  "display_order": 2,
  "section": "news"
}
```

---

## Step 5: Test Public API

**No authentication needed for public endpoints**

### 5.1: List Published Articles
```bash
GET http://localhost:8000/api/articles
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "My First Article About Modern Technology",
      "excerpt": "An introduction to modern web development...",
      "status": "published",
      "is_hero": true,
      "is_featured": true,
      "views": 0,
      "author": {
        "id": 1,
        "name": "John Writer"
      }
    },
    {
      "id": 2,
      "title": "Article About AI and Machine Learning - Updated",
      "status": "published",
      "is_featured": true,
      "views": 0
    }
  ],
  "meta": {
    "total": 2,
    "count": 2,
    "per_page": 12
  }
}
```

### 5.2: Get Hero Articles
```bash
GET http://localhost:8000/api/articles/hero?limit=5
```

### 5.3: Get Featured Articles
```bash
GET http://localhost:8000/api/articles/featured?limit=6
```

### 5.4: Get Articles by Section
```bash
GET http://localhost:8000/api/articles/section/news
```

### 5.5: View Article by Slug (Increments Views)
```bash
GET http://localhost:8000/api/articles/my-first-article-about-modern-technology
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "My First Article About Modern Technology",
    "slug": "my-first-article-about-modern-technology",
    "content": "Full article content...",
    "views": 1,  // Incremented from 0
    "author": { ... }
  }
}
```

**Check views increment:**
```bash
GET http://localhost:8000/api/articles/my-first-article-about-modern-technology
```
Views should be 2 now.

### 5.6: Get Articles by Author
```bash
GET http://localhost:8000/api/articles/author/1
```

### 5.7: Search Articles
```bash
GET http://localhost:8000/api/articles?search=technology
```

### 5.8: Get Public Statistics
```bash
GET http://localhost:8000/api/articles/stats
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "total_published": 2,
    "total_views": 3,
    "hero_articles_count": 1,
    "featured_articles_count": 2,
    "total_authors": 1
  }
}
```

---

## Authorization Testing

### Test 401 Unauthorized (No Token)
```bash
GET http://localhost:8000/api/writer/articles

# Expected: 401 Unauthenticated
{
  "success": false,
  "message": "Unauthenticated"
}
```

### Test 403 Forbidden (Wrong Role)
```bash
POST http://localhost:8000/api/admin/articles/1/approve
Authorization: Bearer WRITER_TOKEN

# Expected: 403 Forbidden
{
  "success": false,
  "message": "Access denied. Your role: writer. Required: admin"
}
```

### Test Cannot Edit Published Article
```bash
PUT http://localhost:8000/api/writer/articles/1
Authorization: Bearer WRITER_TOKEN
Content-Type: application/json

{
  "title": "Updated Title"
}

# Expected: 403
{
  "success": false,
  "message": "Cannot edit article. Article must be in draft or rejected status."
}
```

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthenticated | Missing bearer token | Add `Authorization: Bearer {token}` header |
| 403 Forbidden | Wrong role | Use admin token for `/admin/articles` |
| 403 Forbidden | Cannot edit | Article must be draft or rejected |
| 422 Validation Error | Missing/invalid fields | Check required fields and min length |
| 404 Not Found | Article doesn't exist | Check article ID |
| 400 Bad Request | Status transition invalid | Can only approve pending articles |

---

## Testing Summary

✅ Writer can create, edit, submit articles
✅ Admin can review and approve articles  
✅ Admin can reject articles and provide feedback
✅ Writer can see rejection reasons and resubmit
✅ Admin can set distribution (hero, featured, order, section)
✅ Public can view published articles
✅ Public can search and filter articles
✅ View count increments on public access
✅ Authorization prevents unauthorized actions
✅ Validation prevents invalid data

---

## Complete Test Sequence (5 minutes)

1. Register writer ✅
2. Register admin ✅
3. Create article (draft) ✅
4. Edit article ✅
5. Submit article ✅
6. Admin views pending ✅
7. Admin rejects with feedback ✅
8. Writer edits and resubmits ✅
9. Admin approves and distributes ✅
10. Public views published article ✅
11. Check view counter increased ✅
12. Check statistics updated ✅

**Time to complete: ~5-10 minutes**

---

## Next: Frontend Implementation

After successfully testing the API, proceed to:
1. Create Writer Dashboard component
2. Create Admin Dashboard component
3. Build Article management UI
4. Connect frontend to API endpoints

Frontend will use the same tokens and follow the same authorization flow!

