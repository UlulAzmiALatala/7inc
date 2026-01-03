# 📋 ARTICLE WORKFLOW SYSTEM - DEVELOPMENT PLAN

**Status**: Planning Phase  
**Date**: January 2, 2026  
**Scope**: Complete role-based article management for Writer + Admin roles

---

## 🎯 Project Overview

Membangun sistem manajemen artikel terintegrasi dengan workflow:
- **Writer**: Content Creator (create, edit, submit articles)
- **Admin**: Content Manager (review, approve, publish, distribute)
- **Public**: Reader (view published articles only)

---

## 📊 Data Architecture

### 1. Database Schema

#### Articles Table
```sql
articles
  - id (PK)
  - author_id (FK to users)
  - title (string)
  - slug (string, unique)
  - content (text)
  - excerpt (text)
  - featured_image (string/url)
  - status (enum: draft, pending, published, rejected)
  - is_hero (boolean) - tampil di hero section
  - is_featured (boolean) - tampil di featured articles
  - display_order (integer) - urutan tampilan
  - section (enum: news, featured, hero, etc)
  - created_at
  - updated_at
  - submitted_at (nullable)
  - published_at (nullable)
  - rejected_at (nullable)
```

#### Article Rejections Table
```sql
article_rejections
  - id (PK)
  - article_id (FK)
  - reason (text) - alasan penolakan
  - rejected_by (FK to users)
  - created_at
```

#### Article Revisions Table (optional)
```sql
article_revisions
  - id (PK)
  - article_id (FK)
  - title
  - content
  - changed_by (FK to users)
  - action (created, updated, submitted, approved, rejected)
  - created_at
```

#### Configuration Table (untuk hero, featured, etc)
```sql
configurations
  - id (PK)
  - key (string) - 'hero_article', 'featured_articles', etc
  - article_id (nullable, FK to articles)
  - value (json/text)
  - section (string)
  - display_order (integer)
  - created_at
  - updated_at
```

---

## 🔄 Article Status Workflow

```
Writer Side:
  Draft → Submit → Pending (waiting for admin review)
    ↓ (if rejected)
    ← Back to Draft

Admin Side:
  Pending → Review → Approve → Published
           ↓
           Reject → Rejected (with reason)

Final State:
  Published → Can be hero/featured/ordered
  Rejected → Writer can edit and resubmit
  Draft → Only author can access/edit
```

---

## 🌐 API Endpoints Structure

### Writer APIs (Protected: auth:sanctum + role:writer)

#### Article Management
```
POST   /api/writer/articles              - Create draft
GET    /api/writer/articles              - List own articles (all statuses)
GET    /api/writer/articles/{id}         - View single article
PUT    /api/writer/articles/{id}         - Update article (only draft/rejected)
DELETE /api/writer/articles/{id}         - Delete article (only draft)
POST   /api/writer/articles/{id}/submit  - Submit for approval (draft→pending)
GET    /api/writer/articles/{id}/reject  - Get rejection reason
```

### Admin APIs (Protected: auth:sanctum + role:admin)

#### Article Review & Approval
```
GET    /api/admin/articles               - List all articles (with filters)
GET    /api/admin/articles?status=pending - List pending review
GET    /api/admin/articles/{id}          - View article detail
PUT    /api/admin/articles/{id}          - Edit article
DELETE /api/admin/articles/{id}          - Delete article
POST   /api/admin/articles/{id}/approve  - Approve (pending→published)
POST   /api/admin/articles/{id}/reject   - Reject with reason
```

#### Article Distribution
```
PUT    /api/admin/articles/{id}/hero      - Set as hero
PUT    /api/admin/articles/{id}/featured  - Set as featured
PUT    /api/admin/articles/{id}/order     - Set display order
PUT    /api/admin/articles/{id}/section   - Assign to section
```

#### Configuration Management
```
GET    /api/admin/config/hero             - Get hero articles
GET    /api/admin/config/featured         - Get featured articles
GET    /api/admin/config/sections         - Get articles per section
PUT    /api/admin/config/hero             - Update hero config
PUT    /api/admin/config/featured         - Update featured config
```

### Public APIs (No Auth)
```
GET    /api/articles                      - List published articles
GET    /api/articles/{slug}               - View single article
GET    /api/articles?section=hero         - Get hero articles
GET    /api/articles?is_featured=true     - Get featured articles
GET    /api/config/hero-section           - Get hero section content
```

---

## 💻 Frontend Structure

### Writer Module (`src/writer/`)
```
writer/
  ├── WriterDashboard.jsx          ← Main dashboard (overview)
  ├── ArticleList.jsx              ← List all own articles
  ├── ArticleForm.jsx              ← Create/edit article
  ├── ArticleDetail.jsx            ← View single article
  ├── ArticleSubmit.jsx            ← Review before submit
  ├── RejectionReason.jsx          ← View rejection reason
  └── components/
      ├── ArticleCard.jsx
      ├── StatusBadge.jsx
      ├── EditorToolbar.jsx
      └── SubmitModal.jsx
```

### Admin Module (`src/admin/`)
```
admin/
  ├── AdminDashboard.jsx           ← Analytics & overview
  ├── ArticleManagement.jsx        ← Main article management
  ├── ArticleReview.jsx            ← Review pending articles
  ├── ArticleList.jsx              ← List with filters
  ├── ArticleDetail.jsx            ← View & edit article
  ├── ArticleApprove.jsx           ← Approve/reject modal
  ├── ArticleDistribution.jsx      ← Hero/featured/order settings
  ├── ConfigurationManagement.jsx  ← Manage hero section config
  └── components/
      ├── ArticleCard.jsx
      ├── StatusFilter.jsx
      ├── ApprovalModal.jsx
      ├── RejectionModal.jsx
      ├── HeroSelector.jsx
      └── FeatureSelector.jsx
```

---

## 🔐 Authorization & Middleware

### Backend
```php
// Middleware: auth:sanctum
// Route: /api/writer/* → role:writer only
// Route: /api/admin/* → role:admin only
// Route: /api/articles → public (no auth)

// Policy checks:
- Writer can only CRUD own articles
- Writer can only edit draft/rejected status
- Writer can submit draft to pending
- Admin can view/edit/approve/reject any article
- Admin can set distribution settings
```

### Frontend
```javascript
// Protected routes:
/writer/* → Check role === 'writer'
/admin/* → Check role === 'admin'
/articles/* → Public (no check)

// API client: Auto add token to all requests
// Interceptor: Handle 403 (unauthorized role)
```

---

## 📈 Implementation Phases

### Phase 1: Database & Models (Backend)
- [ ] Create Article migration
- [ ] Create ArticleRejection migration
- [ ] Create Configuration migration
- [ ] Create Article model with relationships
- [ ] Create ArticleStatus enum/constants

### Phase 2: Backend APIs
- [ ] Writer API endpoints (CRUD own articles)
- [ ] Admin API endpoints (manage all articles)
- [ ] Admin distribution APIs (hero, featured, order)
- [ ] Public article endpoints
- [ ] Authorization policies

### Phase 3: Writer Frontend
- [ ] Writer Dashboard (stub)
- [ ] Article List component
- [ ] Article Form (create/edit)
- [ ] Article Submit modal
- [ ] Status display & rejection reasons

### Phase 4: Admin Frontend
- [ ] Admin Dashboard (stub)
- [ ] Article Management interface
- [ ] Article Review panel
- [ ] Approval/Rejection modals
- [ ] Distribution & Configuration management

### Phase 5: Integration & Testing
- [ ] Writer flow end-to-end test
- [ ] Admin review & approval flow test
- [ ] Public article display test
- [ ] Error handling & validation

---

## 🔒 Authorization Matrix

| Feature | Writer | Admin | Public |
|---------|--------|-------|--------|
| Create Article | ✅ Own | ✅ Any | ❌ |
| Edit Draft | ✅ Own | ✅ Any | ❌ |
| Edit Rejected | ✅ Own | ✅ Any | ❌ |
| Edit Published | ❌ | ✅ | ❌ |
| Delete Draft | ✅ Own | ✅ Any | ❌ |
| Delete Any Status | ❌ | ✅ | ❌ |
| Submit for Review | ✅ Own | ❌ | ❌ |
| Approve Article | ❌ | ✅ | ❌ |
| Reject Article | ❌ | ✅ | ❌ |
| Set Hero/Featured | ❌ | ✅ | ❌ |
| View Own Draft | ✅ | ❌ | ❌ |
| View All Articles | ❌ | ✅ | ❌ |
| View Published | ✅ | ✅ | ✅ |

---

## 📝 Key Constraints

1. **Writer**:
   - Can only see own articles
   - Can only edit draft/rejected articles
   - Cannot delete published articles
   - Cannot approve own articles
   - Cannot change distribution settings

2. **Admin**:
   - Can see all articles
   - Can edit/delete at any status
   - Can approve/reject articles
   - Can set distribution (hero, featured, order)
   - Can manage configuration

3. **Public**:
   - Can only see published articles
   - No authentication required
   - Read-only access

---

## 🗂️ File Structure Summary

```
backend/
  ├── migrations/
  │   ├── create_articles_table.php
  │   ├── create_article_rejections_table.php
  │   └── create_configurations_table.php
  ├── app/Models/
  │   ├── Article.php
  │   ├── ArticleRejection.php
  │   └── Configuration.php
  ├── app/Http/Controllers/Api/
  │   ├── WriterArticleController.php
  │   ├── AdminArticleController.php
  │   ├── AdminConfigController.php
  │   └── PublicArticleController.php
  ├── app/Policies/
  │   └── ArticlePolicy.php
  └── routes/api.php (updated)

frontend/
  ├── src/writer/
  │   ├── WriterDashboard.jsx
  │   ├── ArticleList.jsx
  │   ├── ArticleForm.jsx
  │   └── components/
  ├── src/admin/
  │   ├── AdminDashboard.jsx
  │   ├── ArticleManagement.jsx
  │   ├── ArticleApprove.jsx
  │   └── components/
  └── src/pages/
      ├── PublicArticles.jsx
      └── PublicArticleDetail.jsx
```

---

## ✅ Success Criteria

- [x] Database schema designed
- [x] API endpoints planned
- [x] Authorization rules defined
- [x] Frontend structure planned
- [ ] Backend implementation complete
- [ ] Frontend implementation complete
- [ ] Full workflow testing done
- [ ] Error handling implemented
- [ ] Documentation complete

---

**Next Step**: Start Phase 1 - Create database migrations and models

