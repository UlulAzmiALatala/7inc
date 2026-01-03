# 7inc - Sistem Auth & Article Workflow

Sistem terintegrasi penuh untuk autentikasi dan workflow pengelolaan artikel antara Writer dan Admin.

## Fitur Utama

### 1. Authentication System
- **Email + Password Login**: Tidak menggunakan username
- **Role-based Registration**: 3 roles - Public, Writer, Admin (merged dari admin + superadmin)
- **Token-based Auth**: Menggunakan Laravel Sanctum
- **Secure CORS**: Fixed untuk localhost:5173

### 2. Role System
| Role | Login | Create Article | Edit Article | Publish | Approve | Position |
|------|-------|-----------------|--------------|---------|---------|----------|
| Public | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Writer | ✅ | ✅ | ✅* | ❌ | ❌ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

*Writer hanya bisa edit article dengan status draft atau rejected

### 3. Article Workflow
```
Writer Side:
  Draft (simpan) → Edit → Submit untuk approval

Admin Side:
  Pending → Review → Approve/Reject
                    ↓ Approve
                  Published → Set positioning (hero, featured, display order)
```

---

## Installation & Setup

### Prerequisites
```
- PHP 8.2+
- Laravel 12
- Node.js 18+
- MySQL/MariaDB
- Composer
```

### Quick Start

#### 1. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure database di .env
php artisan migrate
php artisan serve --host=localhost --port=8000
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Backend: `http://localhost:8000`
Frontend: `http://localhost:5173`

---

## Architecture

### Backend Structure
```
backend/
├── app/Http/Controllers/Api/
│   ├── AuthController.php      (login, register, logout)
│   └── ArticleController.php   (article CRUD & workflow)
├── app/Http/Middleware/
│   └── CheckRole.php           (role validation)
├── app/Models/
│   ├── User.php                (auth user, 3 roles only)
│   └── Article.php             (article dengan status workflow)
├── config/
│   ├── cors.php                (CORS untuk localhost:5173)
│   └── sanctum.php             (token configuration)
└── routes/
    └── api.php                 (semua endpoints)
```

### Frontend Structure
```
frontend/src/
├── api/
│   └── authService.js          (API calls untuk auth)
├── masuk/
│   ├── Login.jsx               (unified login page)
│   ├── Register.jsx            (register dengan role picker)
│   └── Logout.jsx              (clear token & redirect)
├── writer/
│   └── WriterDashboard.jsx     (writer interface - phase 2)
├── admin/
│   ├── AdminApp.jsx            (admin layout)
│   └── pages/articles/         (kelola berita - phase 2)
└── App.jsx                     (routing & protection)
```

---

## API Endpoints

### Authentication (Public)
```
POST   /api/auth/register         Register user dengan role
POST   /api/auth/login            Login dengan email + password
POST   /api/auth/logout           Logout (protected)
GET    /api/auth/me               Get current user info (protected)
```

### Writer Routes (Protected - role:writer)
```
GET    /api/writer/articles              List my articles
POST   /api/writer/articles              Create draft article
GET    /api/writer/articles/{id}         Get article detail
PUT    /api/writer/articles/{id}         Update draft/rejected
DELETE /api/writer/articles/{id}         Delete draft
POST   /api/writer/articles/{id}/submit  Submit for approval
```

### Admin Routes (Protected - role:admin)
```
GET    /api/admin/articles               List all articles
GET    /api/admin/articles/pending       List pending articles
GET    /api/admin/articles/published     List published
GET    /api/admin/articles/rejected      List rejected
GET    /api/admin/articles/drafts        List all drafts
POST   /api/admin/articles/{id}/approve  Approve & publish
POST   /api/admin/articles/{id}/reject   Reject dengan alasan
PUT    /api/admin/articles/{id}/position Update positioning
DELETE /api/admin/articles/{id}          Delete article
```

---

## Usage Examples

### Register (Frontend)
```javascript
// Di src/masuk/Register.jsx
const response = await authAPI.register(
  'John Doe',
  'john@example.test',
  'password123',
  'writer' // atau 'admin'
);

// Response
{
  success: true,
  user: { id: 1, name: 'John Doe', email: 'john@example.test', role: 'writer' },
  token: 'token_string_here'
}

// Token & role disimpan di localStorage
localStorage.setItem('token', response.token);
localStorage.setItem('role', response.user.role);

// Auto redirect sesuai role
// writer → /writer
// admin → /admin
```

### Login (Frontend)
```javascript
const response = await authAPI.login('john@example.test', 'password123');

// Token & role disimpan
// Auto redirect sesuai role saat register (immutable)
```

### Create Article (Backend - Writer)
```bash
curl -X POST http://localhost:8000/api/writer/articles \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Artikel Baru",
    "content": "<p>Konten artikel</p>",
    "category_id": 1
  }'
```

### Approve Article (Backend - Admin)
```bash
curl -X POST http://localhost:8000/api/admin/articles/{id}/approve \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_hero": true,
    "is_featured": false,
    "display_order": 1
  }'
```

---

## Database Schema Highlights

### users table
```
id, name, email, password (hashed), role (enum: public|writer|admin), avatar, timestamps
```

### articles table
```
id, title, slug, content, excerpt, featured_image,
author_id (FK users), published_by (FK users),
status (enum: draft|pending|rejected|published),
rejection_reason, is_hero, is_featured, display_order,
assignment_type (hero|about|business|homepage|none),
assignment_position, views, timestamps
```

### configurations table
```
id, key_name (unique), value, type, group_name, label, timestamps
// Untuk store references: hero_article_id, about_article_id, dll
```

---

## CORS Configuration

File: `backend/config/cors.php`

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,  // Important untuk Bearer token
'max_age' => 86400,
```

### Troubleshoot CORS
1. Pastikan BASE URL di frontend adalah `http://localhost:8000` (bukan 127.0.0.1)
2. Pastikan browser menggunakan `http://localhost:5173` (bukan 127.0.0.1)
3. Pastikan `Access-Control-Allow-Origin` header di response
4. Jika OPTIONS request gagal, cek middleware order di `bootstrap/app.php`

---

## Important Security Notes

1. **Password Hashing**: Selalu gunakan `Hash::make()` untuk hash password
2. **Password Verification**: Gunakan `Hash::check()` untuk verifikasi
3. **Token Storage**: Stored di localStorage (acceptable untuk SPA)
4. **HTTPS**: Gunakan HTTPS di production
5. **CORS Credentials**: Enabled untuk auth flow
6. **Role Immutable**: Role tidak bisa diubah setelah register - hanya saat register
7. **Token Expiration**: Configure di `.env` jika diperlukan (default: no expiration)

---

## Testing Checklist

- [ ] Register sebagai Writer dengan email unik
- [ ] Register sebagai Admin dengan email unik
- [ ] Login dengan email + password (bukan username)
- [ ] Token tersimpan di localStorage
- [ ] Auto redirect ke `/writer` saat login sebagai writer
- [ ] Auto redirect ke `/admin` saat login sebagai admin
- [ ] Login berulang kali dengan akun sama (consistent)
- [ ] Logout & clear token
- [ ] CORS tidak blocking request
- [ ] Writer bisa create article (status: draft)
- [ ] Writer bisa submit article (draft → pending)
- [ ] Admin bisa list pending articles
- [ ] Admin bisa approve article (pending → published)
- [ ] Admin bisa reject article dengan alasan
- [ ] Admin bisa update positioning (is_hero, is_featured, display_order)

---

## File Structure Summary

### Modified Files
```
backend/
  config/cors.php
  routes/api.php
  app/Http/Controllers/Api/ArticleController.php
  app/Http/Middleware/CheckRole.php
  database/migrations/*

frontend/
  src/App.jsx
  src/api/authService.js
  src/masuk/Login.jsx
  src/masuk/Register.jsx
  src/masuk/Logout.jsx
```

### New Files
```
backend/
  database/migrations/2026_01_02_000001_add_article_fields_to_articles_table.php

frontend/
  src/writer/WriterDashboard.jsx
  IMPLEMENTATION_GUIDE.md
  QUICK_START.md
  SETUP_DATABASE.sql
```

---

## Next Phases

### Phase 1: Core Auth System ✅ DONE
- [x] Register dengan role selection
- [x] Login dengan email + password
- [x] Token-based authentication
- [x] CORS properly configured
- [x] Auto redirect based on role

### Phase 2: Writer Interface
- [ ] WriterDashboard dengan statistik
- [ ] ArticleList dengan filter status
- [ ] ArticleForm dengan rich text editor
- [ ] Submit untuk approval workflow

### Phase 3: Admin Article Management
- [ ] ArticleManagement dengan tabs
- [ ] ArticleApproval dengan positioning options
- [ ] ArticleAssignment untuk configuration sections
- [ ] Rejection reason modal

### Phase 4: Notifications & Polish
- [ ] Badge count untuk pending articles
- [ ] Toast notifications
- [ ] Better error messages
- [ ] Loading states & skeletons
- [ ] Real-time notification (optional)

---

## Troubleshooting

### CORS Error: "No 'Access-Control-Allow-Origin' header"
1. Check `config/cors.php` include `http://localhost:5173`
2. Check base URL di `src/api/authService.js`
3. Clear browser cache & cookies
4. Restart Laravel server

### Login tidak working
1. Verify user exist di database: `SELECT * FROM users;`
2. Verify password hashing: `php artisan tinker` → `Hash::check(password, user->password)`
3. Check API response di browser console

### Token invalid/expired
1. Check token di `localStorage.getItem('token')`
2. Verify token di request header
3. Check `SANCTUM_TOKEN_EXPIRATION` di `.env`

### Protected route redirect looping
1. Check localStorage token & role
2. Verify ProtectedRoute logic di `App.jsx`
3. Check if role in `allowedRoles` array

---

## References

- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Laravel CORS](https://laravel.com/docs/configuration#cors)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)

---

## Version
- Laravel: 12
- React: 18+
- Node: 18+
- PHP: 8.2+

---

## License
Proprietary - 7inc Internal Use Only

---

## Support
For issues or questions, please refer to:
- QUICK_START.md - for quick setup guide
- IMPLEMENTATION_GUIDE.md - for detailed documentation

Last Updated: Jan 2, 2026
