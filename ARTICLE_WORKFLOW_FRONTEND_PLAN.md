# 🎨 ARTICLE WORKFLOW SYSTEM - FRONTEND IMPLEMENTATION PLAN

## Overview

The React frontend will have three separate dashboards accessible via role-based routing:

1. **Writer Dashboard** (`/writer/*`) - Content creator interface
2. **Admin Dashboard** (`/admin/*`) - Content manager interface  
3. **Public Pages** (`/articles/*`) - Public-facing article reader

---

## Architecture

### Directory Structure
```
src/
├── writer/                           # Writer-only routes & components
│   ├── WriterDashboard.jsx          # Main layout
│   ├── ArticleList.jsx              # Table view of articles
│   ├── ArticleForm.jsx              # Create/Edit form
│   ├── ArticleSubmit.jsx            # Submit confirmation
│   └── RejectionReasons.jsx         # Feedback display
│
├── admin/                            # Admin-only routes & components
│   ├── AdminDashboard.jsx           # Main layout with stats
│   ├── ArticleManagement.jsx        # Article management
│   ├── ArticleReviewQueue.jsx       # Pending articles
│   ├── ArticleApprove.jsx           # Approve dialog
│   ├── ArticleReject.jsx            # Reject dialog
│   └── ArticleDistribution.jsx      # Distribution settings
│
├── pages/                            # Public pages
│   ├── ArticlesPublic.jsx           # Published articles list
│   ├── ArticleDetail.jsx            # Article viewer
│   └── ArticlesBySection.jsx        # Section-based views
│
├── api/                              # API client
│   ├── client.js                    # Already exists
│   └── articleService.js            # NEW - Article API calls
│
└── components/                       # Shared components
    ├── Navigation.jsx               # Updated with new routes
    ├── PrivateRoute.jsx             # Protected routes
    └── RoleRoute.jsx                # Role-based routes
```

---

## API Integration Layer

### New File: `src/api/articleService.js`

```javascript
import client from './client';

// WRITER API
export const writerAPI = {
  // List
  getArticles: (page = 1, filters = {}) => 
    client.get('/writer/articles', { params: { page, ...filters } }),
  
  getArticle: (id) => 
    client.get(`/writer/articles/${id}`),
  
  // CRUD
  createArticle: (data) => 
    client.post('/writer/articles', data),
  
  updateArticle: (id, data) => 
    client.put(`/writer/articles/${id}`, data),
  
  deleteArticle: (id) => 
    client.delete(`/writer/articles/${id}`),
  
  // Workflow
  submitArticle: (id) => 
    client.post(`/writer/articles/${id}/submit`),
  
  // Stats
  getStats: () => 
    client.get('/writer/articles/stats'),
};

// ADMIN API
export const adminAPI = {
  // List
  getArticles: (page = 1, filters = {}) => 
    client.get('/admin/articles', { params: { page, ...filters } }),
  
  getPendingArticles: (page = 1) => 
    client.get('/admin/articles/review/pending', { params: { page } }),
  
  getArticle: (id) => 
    client.get(`/admin/articles/${id}`),
  
  // Workflow
  approveArticle: (id, distribution = {}) => 
    client.post(`/admin/articles/${id}/approve`, distribution),
  
  rejectArticle: (id, reason) => 
    client.post(`/admin/articles/${id}/reject`, { reason }),
  
  // Distribution
  updateDistribution: (id, settings) => 
    client.patch(`/admin/articles/${id}/distribution`, settings),
  
  // Admin
  deleteArticle: (id) => 
    client.delete(`/admin/articles/${id}`),
  
  // Stats
  getStats: () => 
    client.get('/admin/articles/stats'),
};

// PUBLIC API
export const publicAPI = {
  // List
  getArticles: (page = 1, filters = {}) => 
    client.get('/articles', { params: { page, ...filters } }),
  
  getHeroArticles: (limit = 5) => 
    client.get('/articles/hero', { params: { limit } }),
  
  getFeaturedArticles: (limit = 6) => 
    client.get('/articles/featured', { params: { limit } }),
  
  // Read
  getArticleBySlug: (slug) => 
    client.get(`/articles/${slug}`),
  
  getArticlesByAuthor: (authorId, page = 1) => 
    client.get(`/articles/author/${authorId}`, { params: { page } }),
  
  getArticlesByCategory: (categoryId, page = 1) => 
    client.get(`/articles/category/${categoryId}`, { params: { page } }),
  
  getArticlesBySection: (section, limit = 10) => 
    client.get(`/articles/section/${section}`, { params: { limit } }),
  
  // Stats
  getStats: () => 
    client.get('/articles/stats'),
};
```

---

## Writer Dashboard Components

### 1. WriterDashboard.jsx
**Purpose**: Main layout for writer interface

**Features**:
- Navigation bar (updated)
- Article statistics panel
- Quick action buttons (New Article)
- Main content area (router outlet)

**State**:
- User info
- Quick stats (draft count, pending count, etc)

**Layout**:
```
┌─────────────────────────────────┐
│  Navigation                     │
├─────────────────────────────────┤
│  Stats Panel: Drafts | Pending  │
│  | Published | Rejected         │
├─────────────────────────────────┤
│  [New Article] [Filters]        │
│                                 │
│  Content Area (Router)          │
│                                 │
└─────────────────────────────────┘
```

### 2. ArticleList.jsx
**Purpose**: Display writer's articles in table

**Features**:
- Table with columns: Title, Status, Date, Actions
- Status badges (Draft, Pending, Published, Rejected)
- Pagination
- Filters (status, date range)
- Actions menu (Edit, Delete, Submit, View)
- Rejection reason indicator
- Empty state message

**Props**:
- `articles` - Array of article objects
- `isLoading` - Loading state
- `onEdit` - Edit handler
- `onDelete` - Delete handler
- `onSubmit` - Submit handler
- `onRejectionsClick` - View rejections handler

### 3. ArticleForm.jsx
**Purpose**: Create/Edit article form

**Features**:
- Form fields:
  - Title (required, 5-255 chars)
  - Excerpt (required, 10-500 chars)
  - Content (required, 100+ chars, rich text editor)
  - Category (dropdown)
  - Featured Image (URL input or upload)
- Rich text editor (use `react-quill` or `slate`)
- Real-time validation
- Save draft button
- Submit button
- Cancel button
- Auto-save (optional)

**Props**:
- `article` - Article to edit (null for new)
- `isLoading` - Submission state
- `onSave` - Save handler
- `onCancel` - Cancel handler
- `error` - Error message

### 4. ArticleSubmit.jsx
**Purpose**: Confirmation dialog before submitting

**Features**:
- Article preview (title, excerpt, status)
- Confirmation message
- Warning about editing restrictions post-submit
- Submit button
- Cancel button

**Props**:
- `article` - Article to submit
- `isLoading` - Submission state
- `onSubmit` - Submit handler
- `onCancel` - Cancel handler

### 5. RejectionReasons.jsx
**Purpose**: Display rejection feedback

**Features**:
- Timeline of rejections
- Each rejection shows:
  - Admin name who rejected
  - Rejection date
  - Detailed feedback reason
- Latest rejection highlighted
- "Edit & Resubmit" button
- Close button

**Props**:
- `rejections` - Array of rejection objects
- `onEdit` - Edit handler

---

## Admin Dashboard Components

### 1. AdminDashboard.jsx
**Purpose**: Main admin interface with overview

**Features**:
- Navigation bar (updated for admin)
- Statistics dashboard:
  - Total articles
  - Pending review count (prominent)
  - Published count
  - Draft count
  - Rejected count
  - Hero articles count
  - Featured articles count
  - Total views
  - Top writers list
- Quick action buttons (View Pending)
- Main content area

**Layout**:
```
┌────────────────────────────────────┐
│  Admin Navigation                  │
├────────────────────────────────────┤
│  [Pending: 5] [Published: 25]      │
│  [Hero: 3] [Featured: 8]           │
│  [Total Views: 2,341]              │
├────────────────────────────────────┤
│  [Review Queue] [All Articles]     │
│  Content Area (Router)             │
│                                    │
└────────────────────────────────────┘
```

### 2. ArticleManagement.jsx
**Purpose**: Main article management interface

**Features**:
- Article list table
- Filter options:
  - By status (Draft, Pending, Published, Rejected)
  - By author
  - By date range
  - Search by title
- Sorting options
- Actions menu for each article
- Bulk actions (optional)

### 3. ArticleReviewQueue.jsx
**Purpose**: Dedicated pending articles review

**Features**:
- Pending articles only
- Large article preview
- Navigation between pending articles (Previous/Next)
- Quick approve/reject buttons
- Submitted date and author info
- View full article button
- Approval/Rejection panels (side-by-side or modal)

**Layout**:
```
Pending Articles Queue: 5

[Previous Article] [1/5] [Next Article]

┌──────────────────────────────────┐
│ Article Title                    │
│ By: John Writer                  │
│ Submitted: Jan 15, 2026          │
│                                  │
│ Excerpt: ...                     │
│                                  │
│ [View Full] [Preview]            │
└──────────────────────────────────┘

[Approve] [Reject with Feedback]
```

### 4. ArticleApprove.jsx
**Purpose**: Approval dialog/form

**Features**:
- Article preview (title, excerpt, first 200 chars)
- Distribution settings:
  - Make Hero checkbox
  - Make Featured checkbox
  - Display Order input
  - Section dropdown
- Preview of how article will appear
- Approve button
- Cancel button
- Success message

**Props**:
- `article` - Article to approve
- `isLoading` - Submission state
- `onApprove` - Approval handler
- `onCancel` - Cancel handler

### 5. ArticleReject.jsx
**Purpose**: Rejection feedback form

**Features**:
- Article preview
- Reason input (textarea, min 10 chars)
- Rejection history (if any)
- Guidance for writers
- Reject button
- Cancel button
- Success message

**Props**:
- `article` - Article to reject
- `rejectionHistory` - Previous rejections
- `isLoading` - Submission state
- `onReject` - Rejection handler
- `onCancel` - Cancel handler

### 6. ArticleDistribution.jsx
**Purpose**: Manage published article distribution

**Features**:
- Article selector (dropdown)
- Current distribution status
- Update controls:
  - Hero toggle
  - Featured toggle
  - Display order input
  - Section selector
- Preview of changes
- Save button
- Bulk distribution update (optional)

---

## Public Components

### 1. ArticlesPublic.jsx
**Purpose**: Published articles listing page

**Features**:
- Articles list with pagination
- Search bar
- Filters:
  - Category
  - Author
  - Date range
- Sorting options
- Hero articles carousel (top)
- Featured articles section (below)
- Regular articles list below

**Layout**:
```
┌────────────────────────────────┐
│  Hero Articles Carousel        │
│  [Article 1] > [Article 2]     │
└────────────────────────────────┘

Featured Articles:
┌─────────┬─────────┬─────────┐
│Article 1│Article 2│Article 3│
└─────────┴─────────┴─────────┘

Search & Filters
┌────────────────────────────────┐
│  Articles List                 │
│  [Article 1]                   │
│  [Article 2]                   │
│  ...                           │
│  Pagination                    │
└────────────────────────────────┘
```

### 2. ArticleDetail.jsx
**Purpose**: Single article viewer

**Features**:
- Full article content
- Article metadata (author, date, views)
- Author info & link to author's articles
- Recommended/Related articles
- Navigation (Previous/Next article)
- Share buttons
- Print/Save options

### 3. ArticlesBySection.jsx
**Purpose**: Articles filtered by section

**Features**:
- Section name as title
- Articles list for that section
- Pagination
- Sorting
- Author filter

---

## Routing Setup

### Update App.jsx with new routes

```jsx
// Protected routes for Writer
<Route path="/writer" element={<PrivateRoute><WriterDashboard /></PrivateRoute>}>
  <Route path="articles" element={<ArticleList />} />
  <Route path="articles/new" element={<ArticleForm />} />
  <Route path="articles/:id/edit" element={<ArticleForm />} />
  <Route path="articles/:id/rejections" element={<RejectionReasons />} />
</Route>

// Protected routes for Admin
<Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>}>
  <Route path="articles" element={<ArticleManagement />} />
  <Route path="articles/pending" element={<ArticleReviewQueue />} />
  <Route path="articles/:id/approve" element={<ArticleApprove />} />
  <Route path="articles/:id/reject" element={<ArticleReject />} />
  <Route path="articles/:id/distribution" element={<ArticleDistribution />} />
</Route>

// Public routes
<Route path="/articles" element={<ArticlesPublic />} />
<Route path="/articles/:slug" element={<ArticleDetail />} />
<Route path="/section/:section" element={<ArticlesBySection />} />
```

---

## State Management

### Option 1: Context API (Recommended)
```jsx
// ArticleContext.js
export const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Load articles
  const loadArticles = useCallback(async (filter) => {
    setLoading(true);
    try {
      const data = await writerAPI.getArticles(...);
      setArticles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return (
    <ArticleContext.Provider value={{ articles, loading, error, loadArticles }}>
      {children}
    </ArticleContext.Provider>
  );
};
```

### Option 2: Redux (For complex state)
```javascript
// slices/articleSlice.js
- writerArticles state
- adminArticles state
- publicArticles state
- filters
- loading states
- error states
```

---

## Component Lifecycle

### Writer Article Creation Flow
```
WriterDashboard
  ↓
  [New Article] button
  ↓
ArticleForm (Create mode)
  ↓
  Form submitted
  ↓
API: POST /api/writer/articles
  ↓
Article created (draft status)
  ↓
Redirect to ArticleList
  ↓
Show success message
```

### Admin Approval Flow
```
AdminDashboard
  ↓
  [Review Pending] button
  ↓
ArticleReviewQueue (shows pending)
  ↓
User clicks article
  ↓
Article preview + [Approve] button
  ↓
ArticleApprove modal opens
  ↓
User sets distribution
  ↓
API: POST /api/admin/articles/{id}/approve
  ↓
Article published (status = published)
  ↓
Remove from pending queue
  ↓
Show success message
```

### Public Article Read Flow
```
User visits site
  ↓
ArticlesPublic component loads
  ↓
API: GET /api/articles?search=...&category=...
  ↓
List displayed with pagination
  ↓
User clicks article
  ↓
Redirect to /articles/{slug}
  ↓
ArticleDetail loads
  ↓
API: GET /api/articles/{slug}
  ↓
View count incremented server-side
  ↓
Article displayed with metadata
```

---

## Form Validation

### ArticleForm Validation Rules
```javascript
const validationSchema = {
  title: {
    required: 'Title is required',
    minLength: { value: 5, message: 'At least 5 characters' },
    maxLength: { value: 255, message: 'Max 255 characters' },
    pattern: { value: /^[a-zA-Z0-9\s\-]+$/, message: 'Invalid characters' }
  },
  excerpt: {
    required: 'Excerpt is required',
    minLength: { value: 10, message: 'At least 10 characters' },
    maxLength: { value: 500, message: 'Max 500 characters' }
  },
  content: {
    required: 'Content is required',
    minLength: { value: 100, message: 'At least 100 characters' }
  },
  category_id: {
    type: 'number'
  }
};
```

---

## UI/UX Considerations

1. **Status Badges**: Color-coded (Draft=Gray, Pending=Orange, Published=Green, Rejected=Red)
2. **Loading States**: Spinners for async operations
3. **Error Messages**: Clear, actionable messages
4. **Success Messages**: Toast notifications
5. **Confirmation Dialogs**: Before destructive actions
6. **Responsive Design**: Mobile-friendly layouts
7. **Accessibility**: ARIA labels, keyboard navigation
8. **Dark Mode**: Optional (if design supports)

---

## Dependencies to Install

```bash
npm install react-hook-form         # Form handling
npm install yup                     # Validation schema
npm install react-quill            # Rich text editor
npm install react-router-dom       # Routing (already installed)
npm install axios                  # HTTP client (already installed)
npm install date-fns               # Date formatting
npm install react-hot-toast        # Toast notifications
npm install react-icons            # Icon library
```

---

## Testing Strategy

### Component Tests
```javascript
// ArticleForm.test.jsx
- Test form submission
- Test validation
- Test cancel button
- Test edit mode vs create mode

// ArticleList.test.jsx
- Test article list rendering
- Test pagination
- Test filters
- Test delete confirmation
```

### Integration Tests
```javascript
// Writer flow
- Create article
- Edit article
- Submit article
- View rejection reasons
- Resubmit after rejection

// Admin flow
- View pending articles
- Approve article with distribution
- Reject article with reason
- Update distribution of published article

// Public flow
- View articles list
- Search articles
- View article by slug
- View stats
```

### E2E Tests (Cypress/Playwright)
```javascript
// Full user journey
- Register as writer
- Create article
- Submit for review
- Register as admin
- Approve article
- View published article
- Verify view count increased
```

---

## Performance Optimization

1. **Lazy Loading**: Code-split dashboard components
2. **Pagination**: Load articles in chunks
3. **Image Optimization**: Compress/resize featured images
4. **Memoization**: Use React.memo for article cards
5. **Caching**: Cache article lists locally
6. **Debouncing**: Search input debouncing
7. **Virtual Scrolling**: For long article lists (optional)

---

## Deployment Considerations

1. **Environment Variables**: API endpoint configuration
2. **Build Optimization**: Minify and bundle
3. **CDN**: Serve static assets from CDN
4. **Error Tracking**: Integrate Sentry for error monitoring
5. **Analytics**: Track user actions for insights
6. **SEO**: Meta tags for article pages

---

## Next Steps

1. ✅ Backend API implementation (DONE)
2. 🔄 Frontend setup (START HERE)
3. Create ArticleService API integration
4. Build Writer Dashboard components
5. Build Admin Dashboard components
6. Build Public article pages
7. Connect components to API
8. Test complete workflows
9. Style and polish UI
10. Deploy to production

---

## Development Timeline

- **Week 1**: Setup, Writer Dashboard, ArticleForm
- **Week 2**: Writer features complete, Admin Dashboard start
- **Week 3**: Admin features, approval/rejection workflow
- **Week 4**: Public pages, search/filtering, styling
- **Week 5**: Testing, optimization, bug fixes
- **Week 6**: Polish, documentation, deployment

---

