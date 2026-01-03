# Panduan Implementasi - Sistema Auth & Article Workflow

## Ringkasan Perubahan

Sistem ini merekonstruksi keseluruhan autentikasi dan workflow artikel dengan:

1. **3 Roles saja**: public, writer, admin (merged admin + superadmin)
2. **Auth berbasis Email + Password**: tanpa username
3. **Satu endpoint login untuk semua role**: role ditentukan saat register
4. **Article workflow**: writer create → submit → admin approve → admin position
5. **CORS fixed**: localhost:5173 dengan consistent domain

---

## A. BACKEND SETUP

### 1. Environment Configuration

Update `.env`:
```
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

### 2. Database Migration

Jalankan migration untuk update article fields:
```bash
php artisan migrate
```

Migration akan menambahkan:
- `assignment_type` (enum: hero, about, business, homepage, none)
- `assignment_position` (string nullable)

### 3. Authentication Middleware

File sudah disiapkan:
- `app/Http/Middleware/CheckRole.php` - verifikasi role user

Register di `bootstrap/app.php`:
```php
use App\Http\Middleware\CheckRole;

->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => CheckRole::class,
    ]);
})
```

### 4. CORS Configuration

File `config/cors.php` sudah updated untuk:
- Allow `http://localhost:5173`
- Support credentials (untuk token auth)
- Proper headers configuration

### 5. API Routes Structure

Routes di `routes/api.php` sudah configured untuk:

**Auth Routes (Public)**:
- `POST /api/auth/register` - register user dengan role
- `POST /api/auth/login` - login dengan email + password
- `POST /api/auth/logout` - logout (protected)
- `GET /api/auth/me` - get current user (protected)

**Writer Routes (Protected)**:
```
GET /api/writer/articles - list my articles
POST /api/writer/articles - create draft
PUT /api/writer/articles/{id} - update draft/rejected
POST /api/writer/articles/{id}/submit - submit for approval
DELETE /api/writer/articles/{id} - delete draft
```

**Admin Routes (Protected)**:
```
GET /api/admin/articles - list all articles
GET /api/admin/articles/pending - pending approval
GET /api/admin/articles/published - published
GET /api/admin/articles/rejected - rejected
GET /api/admin/articles/drafts - all drafts
POST /api/admin/articles/{id}/approve - approve + publish
POST /api/admin/articles/{id}/reject - reject dengan alasan
PUT /api/admin/articles/{id}/position - update positioning
DELETE /api/admin/articles/{id} - delete article
```

---

## B. FRONTEND SETUP

### 1. Authentication Service

File: `src/api/authService.js`

Provides:
- `register(name, email, password, role)` - register user
- `login(email, password)` - login user
- `logout(token)` - logout user
- `getCurrentUser(token)` - verify token

**Base URL**: `http://localhost:8000/api` (konsisten, jangan 127.0.0.1)

### 2. Auth Pages

#### Login Page: `src/masuk/Login.jsx`
- Email + password input
- Login button dengan loading state
- Automatic redirect berdasarkan role
- Error handling dengan CORS awareness

#### Register Page: `src/masuk/Register.jsx`
- Name, email, password inputs
- Role selector (Writer / Admin)
- Password confirmation
- Automatic redirect after register

#### Logout Page: `src/masuk/Logout.jsx`
- Notify server
- Clear localStorage
- Redirect ke home

### 3. Routing & Protection

File: `src/App.jsx`

**Protected Routes**:
- `/admin` - hanya admin
- `/writer` - hanya writer (to be implemented)

**Auth Routes** (redirect jika sudah login):
- `/login` - login page
- `/register` - register page

**Public Routes**:
- `/` - landing page (public)

---

## C. WORKFLOW

### Flow 1: Writer Create & Submit Article

1. Writer login dengan email + password
2. Redirect otomatis ke `/writer` dashboard
3. Writer buat artikel baru (status: draft)
4. Writer dapat edit artikel (hanya jika draft atau rejected)
5. Writer submit untuk approval (draft → pending)
6. Admin notifikasi ada artikel pending
7. Status: Pending Approval

### Flow 2: Admin Review & Approve

1. Admin login dengan email + password
2. Redirect ke `/admin` dashboard
3. Admin buka "Kelola Berita" menu
4. Tab "Pending Approval" menunjukkan artikel dari writer
5. Admin preview artikel
6. Admin klik "Approve & Publish"
7. Admin set positioning:
   - [ ] Is Hero Article
   - [ ] Is Featured
   - Display Order: 1
8. Artikel publish (status: published)
9. Artikel muncul di website public sesuai positioning

### Flow 3: Admin Reject Article

1. Admin buka artikel pending
2. Admin klik "Reject"
3. Admin tulis alasan reject
4. Artikel status: rejected
5. Writer notifikasi dan bisa edit ulang
6. Writer submit ulang untuk approval

---

## D. TESTING GUIDE

### Backend Testing

1. **Register Writer**:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Writer",
    "email": "john@writer.test",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "writer"
  }'
```

Response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Writer",
    "email": "john@writer.test",
    "role": "writer"
  },
  "token": "token_string_here"
}
```

2. **Login Writer**:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@writer.test",
    "password": "password123"
  }'
```

3. **Create Article** (gunakan token dari login):
```bash
curl -X POST http://localhost:8000/api/writer/articles \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Judul Artikel",
    "content": "<p>Konten artikel...</p>",
    "category_id": 1
  }'
```

### Frontend Testing

1. **Start frontend dev server**:
```bash
npm run dev
```
Open `http://localhost:5173`

2. **Register new account**:
   - Go to `/register`
   - Fill: name, email, password, role (writer)
   - Submit
   - Should redirect to `/writer` (atau `/admin` jika register as admin)

3. **Login with registered account**:
   - Go to `/login`
   - Enter email + password (sama seperti saat register)
   - Should redirect otomatis ke dashboard sesuai role

4. **Logout**:
   - Go to `/logout`
   - Should clear token & redirect ke `/`

---

## E. COMMON ISSUES & SOLUTIONS

### CORS Error: "No 'Access-Control-Allow-Origin' header"

**Cause**: Origin mismatch atau config CORS tidak tepat

**Solution**:
1. Pastikan BASE URL di `authService.js` adalah `http://localhost:8000/api` (not 127.0.0.1)
2. Pastikan `config/cors.php` include `http://localhost:5173`
3. Pastikan Laravel middleware include `HandleCors`
4. Clear browser cache

### Login berulang kali dengan akun sama

**Expected**: User dapat login berkali-kali dengan email + password yang sama, akan masuk ke dashboard sesuai role saat register

**If error**:
- Check password hashing di `User.php` model
- Verify `Hash::check()` di login controller
- Check token generation di `createToken()`

### Role tidak persistent saat login

**Expected**: Role ditentukan saat register dan tidak berubah saat login

**If error**:
- Check localStorage: `localStorage.getItem('role')`
- Verify API response include `role` field
- Check ProtectedRoute logic di `App.jsx`

### Token expiration

**Note**: Laraver Sanctum tokens tidak punya expiration default. Untuk production:
- Set `SANCTUM_TOKEN_EXPIRATION` di `.env`
- Implement token refresh mechanism di frontend

---

## F. FILE STRUCTURE SUMMARY

### Backend Files Modified/Created:

```
backend/
├── config/
│   └── cors.php (UPDATED)
├── app/Http/
│   ├── Controllers/Api/
│   │   └── ArticleController.php (UPDATED)
│   │   └── AuthController.php (SUDAH OK)
│   └── Middleware/
│       └── CheckRole.php (SUDAH OK)
└── database/migrations/
    └── 2026_01_02_000001_add_article_fields_to_articles_table.php (NEW)
```

### Frontend Files Created/Modified:

```
frontend/src/
├── api/
│   └── authService.js (CREATED)
├── masuk/
│   ├── Login.jsx (UPDATED)
│   ├── Register.jsx (UPDATED)
│   ├── Logout.jsx (UPDATED)
│   ├── LoginAdmin.jsx (deprecated)
│   └── RegisterAdmin.jsx (deprecated)
└── App.jsx (UPDATED)
```

---

## G. NEXT STEPS

1. **Run migrations**: `php artisan migrate`
2. **Start backend**: `php artisan serve --host=localhost --port=8000`
3. **Start frontend**: `npm run dev`
4. **Test register**: http://localhost:5173/register
5. **Test login**: http://localhost:5173/login
6. **Build writer dashboard**: `frontend/src/writer/WriterDashboard.jsx` (next phase)
7. **Build admin article management**: `frontend/src/admin/pages/articles/` (next phase)

---

## H. IMPORTANT NOTES

- Role tidak bisa diubah setelah register (immutable)
- Public users TIDAK bisa login (role == public tidak support auth)
- Token disimpan di localStorage untuk durasi session
- CORS allow credentials untuk auth headers
- All API calls harus gunakan Bearer token di header
- Password selalu di-hash dengan Hash::make() sebelum disimpan

---

Created: Jan 2, 2026
Last Updated: Jan 2, 2026
