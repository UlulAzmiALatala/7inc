# 📚 Article Workflow System - Backend Implementation Guide

## Status: ✅ Phase 1 Complete - Backend API Ready

### What's Been Implemented

#### 1. **Enhanced Article Model** (`app/Models/Article.php`)
- **Relationships**: author, rejections, category
- **Status Scopes**: draft(), pending(), published(), rejected()
- **Distribution Scopes**: featured(), hero(), bySection(), forWriter()
- **Status Checks**: isDraft(), isPending(), isPublished(), isRejected()
- **Workflow Methods**:
  - `submit()` - Writer submits for review (draft → pending)
  - `approve(User)` - Admin approves (pending → published)
  - `reject(User, reason)` - Admin rejects (pending → rejected)
  - `getLatestRejectionReason()` - Get last rejection feedback
- **Authorization**: canBeEditedBy(), canBeDeletedBy(), canBeSubmittedBy(), canBeApprovedBy(), canBeRejectedBy()
- **Utilities**: incrementViews(), slug generation on create

#### 2. **ArticleRejection Model** (`app/Models/ArticleRejection.php`)
- Tracks rejection history with reasons
- Relationships to Article and rejecting User
- Allows multiple rejection attempts

#### 3. **Three REST API Endpoints**

##### Writer API (`/api/writer/articles`)
**Requires**: Authentication + `writer` role

```
GET    /api/writer/articles           - List own articles (paginated)
GET    /api/writer/articles/{id}      - View own article
POST   /api/writer/articles           - Create new draft article
PUT    /api/writer/articles/{id}      - Edit draft/rejected article
DELETE /api/writer/articles/{id}      - Delete draft article only
POST   /api/writer/articles/{id}/submit - Submit for admin review
GET    /api/writer/articles/stats     - My article statistics
```

**Writer Permissions**:
- ✅ Create articles (always start as draft)
- ✅ Edit own draft or rejected articles
- ✅ Delete own draft articles only
- ✅ Submit own articles for review
- ✅ View rejection reasons with edit suggestions
- ❌ Cannot delete/edit pending or published articles
- ❌ Cannot approve or reject

##### Admin API (`/api/admin/articles`)
**Requires**: Authentication + `admin` role

```
GET    /api/admin/articles            - List all articles (filtered)
GET    /api/admin/articles/review/pending - Pending articles only
GET    /api/admin/articles/{id}       - View any article
POST   /api/admin/articles/{id}/approve - Approve for publication
POST   /api/admin/articles/{id}/reject  - Reject with feedback
PATCH  /api/admin/articles/{id}/distribution - Set hero/featured/order
DELETE /api/admin/articles/{id}       - Delete article
GET    /api/admin/articles/stats      - Dashboard statistics
```

**Admin Permissions**:
- ✅ Review pending articles
- ✅ Approve articles for publication
- ✅ Reject articles with detailed feedback
- ✅ Set distribution (hero, featured, order, section)
- ✅ View all articles from all writers
- ✅ Delete articles (except published ones)
- ✅ View admin dashboard statistics

##### Public API (`/api/articles`)
**Requires**: No authentication (public)

```
GET    /api/articles                   - List published articles (filtered)
GET    /api/articles/hero              - Get hero articles
GET    /api/articles/featured          - Get featured articles
GET    /api/articles/section/{section} - Get articles by section
GET    /api/articles/{slug}            - View article by slug
GET    /api/articles/author/{id}       - Get articles by author
GET    /api/articles/category/{id}     - Get articles by category
GET    /api/articles/stats             - Public statistics
```

**Features**:
- ✅ Returns only published articles
- ✅ Automatic view count increment
- ✅ Search by title/excerpt
- ✅ Filter by author, category, section
- ✅ Hero and featured collections
- ✅ Paginated results

#### 4. **Request Validation**
- `StoreArticleRequest.php` - Create article validation
- `UpdateArticleRequest.php` - Update article validation
- Validates title, excerpt, content, category_id, featured_image

#### 5. **API Response Resource**
- `ArticleResource.php` - Transforms Article model to JSON
- Includes all article data, author, category, rejection count
- Consistent response format across all endpoints

#### 6. **Authorization Policies**
- `ArticlePolicy.php` - Role-based authorization rules
- Integrated with Laravel Gate/authorize system
- Separate permissions for each action

#### 7. **Routing**
- `api-articles.php` - Dedicated article routes with role middleware
- Grouped by role: writer, admin, public
- Imported in main `api.php`

#### 8. **Middleware**
- Uses existing `CheckRole.php` middleware already in system
- Registered in `Kernel.php` as 'role'
- Syntax: `middleware('auth:sanctum', 'role:writer')`

---

## 🚀 Next Steps - Frontend Implementation

### Phase 2: Writer Dashboard Components

Files to create:
```
src/writer/
├── WriterDashboard.jsx         - Main dashboard page
├── ArticleList.jsx             - Table of writer's articles
├── ArticleForm.jsx             - Create/Edit article form
├── ArticleSubmit.jsx           - Confirmation dialog for submit
└── RejectionReasons.jsx        - Show feedback on rejected article
```

### Phase 3: Admin Dashboard Components

Files to create:
```
src/admin/
├── ArticleManagement.jsx       - Article admin overview
├── ArticleList.jsx             - All articles table
├── ArticleReview.jsx           - Review pending articles
├── ArticleApprove.jsx          - Approve & set distribution dialog
├── ArticleReject.jsx           - Reject with feedback dialog
└── ArticleDistribution.jsx     - Manage hero/featured/sections
```

---

## 📊 Database Schema

### articles table (enhanced)
```sql
id
author_id (FK) - Writer who created
title
slug (unique)
excerpt
content (long text)
featured_image
category_id (FK, nullable)

status enum(draft, pending, published, rejected)
is_hero boolean
is_featured boolean
display_order integer
section string(nullable) - which section on public site

submitted_at timestamp (when submitted for review)
published_at timestamp (when approved)
rejected_at timestamp (when rejected)
published_by (FK to users, nullable)

views count
created_at, updated_at

Indexes: author_id, status, is_hero, is_featured, section, display_order
```

### article_rejections table (tracks feedback)
```sql
id
article_id (FK)
rejected_by (FK to users)
reason (longText) - detailed feedback for writer
created_at
updated_at
```

---

## ✅ Checklist - What's Working

### Backend
- [x] Enhanced Article model with all workflow methods
- [x] ArticleRejection model for tracking feedback
- [x] WriterArticleController (CRUD + submit)
- [x] AdminArticleController (review + approve/reject + distribute)
- [x] PublicArticleController (read-only published articles)
- [x] Request validation (StoreArticleRequest, UpdateArticleRequest)
- [x] API Response resource (ArticleResource)
- [x] Authorization policies (ArticlePolicy)
- [x] Role-based middleware integration
- [x] API routes (three separate namespaces)
- [x] AuthServiceProvider for policy registration

### Testing
- [ ] Unit tests for Article model methods
- [ ] Feature tests for Writer API endpoints
- [ ] Feature tests for Admin API endpoints
- [ ] Feature tests for Public API endpoints
- [ ] Authorization tests for policies
- [ ] Database migration tests

### Frontend (Coming Next)
- [ ] Writer Dashboard
- [ ] Writer Article Management (CRUD)
- [ ] Admin Dashboard
- [ ] Admin Article Management (Review/Approve/Reject)
- [ ] Admin Distribution Management

---

## 🔧 Testing the API

### 1. Start Laravel Server
```bash
cd backend
php artisan serve
```

### 2. Register & Login as Writer
```bash
POST /api/auth/register
{
  "name": "John Writer",
  "email": "writer@example.com",
  "password": "password",
  "role": "writer"
}

POST /api/auth/login
{
  "email": "writer@example.com",
  "password": "password"
}
# Returns: { "token": "..." }
```

### 3. Test Writer API
```bash
# List own articles
GET /api/writer/articles
Header: Authorization: Bearer {token}

# Create article
POST /api/writer/articles
Header: Authorization: Bearer {token}
{
  "title": "My First Article",
  "excerpt": "This is about...",
  "content": "Full content here with at least 100 characters...",
  "category_id": 1
}

# Submit article
POST /api/writer/articles/1/submit
Header: Authorization: Bearer {token}
```

### 4. Test Admin API
```bash
# List pending articles
GET /api/admin/articles/review/pending
Header: Authorization: Bearer {admin-token}

# Approve article
POST /api/admin/articles/1/approve
Header: Authorization: Bearer {admin-token}
{
  "make_hero": true,
  "make_featured": true,
  "display_order": 1,
  "section": "featured"
}

# Reject article
POST /api/admin/articles/1/reject
Header: Authorization: Bearer {admin-token}
{
  "reason": "Please improve the introduction and add more sources"
}
```

### 5. Test Public API
```bash
# Get published articles
GET /api/articles

# Get hero articles
GET /api/articles/hero

# Get featured articles
GET /api/articles/featured

# Get article by slug
GET /api/articles/my-first-article

# Get articles by section
GET /api/articles/section/news
```

---

## 📝 API Response Format

All responses follow consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "id": 1,
    "title": "...",
    "status": "draft",
    ...
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Cannot approve article. Only pending articles...",
  "error": "Exception details (in debug mode)"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 50,
    "count": 15,
    "per_page": 15,
    "current_page": 1,
    "last_page": 4
  }
}
```

---

## 🔐 Authorization Summary

| Action | Writer | Admin | Public |
|--------|--------|-------|--------|
| List own articles | ✅ | - | - |
| Create draft | ✅ | - | - |
| Edit own draft/rejected | ✅ | - | - |
| Delete own draft | ✅ | - | - |
| Submit for review | ✅ | - | - |
| List all articles | - | ✅ | - |
| Review pending | - | ✅ | - |
| Approve article | - | ✅ | - |
| Reject article | - | ✅ | - |
| Set distribution | - | ✅ | - |
| View published | ✅ | ✅ | ✅ |
| Search published | - | - | ✅ |
| Get stats | ✅ | ✅ | ✅ |

---

## 📚 File Structure Created

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── WriterArticleController.php      ✅ NEW
│   │   │       ├── AdminArticleController.php       ✅ NEW
│   │   │       └── PublicArticleController.php      ✅ NEW
│   │   ├── Requests/
│   │   │   ├── StoreArticleRequest.php              ✅ NEW
│   │   │   └── UpdateArticleRequest.php             ✅ NEW
│   │   ├── Resources/
│   │   │   └── ArticleResource.php                  ✅ NEW
│   │   └── Controllers/
│   │       └── Controller.php                        ✅ UPDATED
│   ├── Models/
│   │   ├── Article.php                              ✅ ENHANCED
│   │   └── ArticleRejection.php                     ✅ NEW
│   ├── Policies/
│   │   └── ArticlePolicy.php                        ✅ NEW
│   └── Providers/
│       └── AuthServiceProvider.php                  ✅ NEW
├── routes/
│   ├── api-articles.php                             ✅ NEW
│   └── api.php                                       ✅ UPDATED
└── bootstrap/
    └── providers.php                                 ✅ UPDATED
```

---

## 🎯 Key Architectural Decisions

1. **Three Separate Namespaces**: Writer, Admin, Public APIs are completely separate with different endpoints and authorization
2. **Status Machine**: Clear workflow (draft → pending → published/rejected) prevents invalid state transitions
3. **Rejection Tracking**: Multiple rejections stored with reasons for detailed feedback
4. **Distribution Control**: Only admin can set hero/featured/order/section for published articles
5. **View Counting**: Automatic tracking when public accesses published articles
6. **Role-Based Access**: Middleware checks `role` field on User model
7. **Policy Pattern**: Laravel Gates/Policies for fine-grained authorization
8. **Slug Generation**: Automatic from title on model creation
9. **Soft Deletes**: Not used (hard delete to keep database clean)

---

## 🚨 Important Notes

1. **Database Migration**: Run migrations before testing
   ```bash
   php artisan migrate
   ```

2. **Authentication**: All API tests require Bearer token in Authorization header

3. **Admin User**: Need to set role='admin' on user creation for admin endpoints

4. **CORS**: Already configured - frontend can access API from different origin

5. **View Count**: Automatically increments when public accesses article by slug

6. **Slug Uniqueness**: System prevents duplicate slugs

---

## 📞 Support

For issues with the Article Workflow API:
1. Check the controller's authorize() method calls
2. Verify user role is set correctly (admin, writer, public)
3. Ensure Bearer token is included in request header
4. Check request validation rules in Request classes
5. Verify article status matches operation (e.g., can only approve pending)

