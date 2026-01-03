# Authentication & Authorization System - Seven INC

## Deskripsi
Sistem authentication dan authorization berbasis REST API dengan role-based access control (RBAC) untuk menghubungkan Writer dan Admin dalam workflow artikel/berita.

## Struktur Role
- **admin**: Akses penuh ke semua fitur admin
- **writer**: Buat dan kelola artikel sendiri
- **public**: Tidak bisa login ke panel admin

## Tech Stack
- **Backend**: Laravel 12 + Sanctum
- **Frontend**: React + Vite
- **Database**: MySQL

## Install & Setup

### 1. Backend Setup
```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate key
php artisan key:generate

# Setup database di .env:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=seveninc
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations dan seeders
php artisan migrate:fresh --seed

# Test authentication system
php artisan tinker --execute="require 'test_auth_system.php';"
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user baru |
| POST | /api/auth/login | Login (admin/writer only) |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current user |

### Writer Routes (role:writer)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/writer/articles | List artikel penulis |
| POST | /api/writer/articles | Buat artikel baru |
| GET | /api/writer/articles/{id} | Detail artikel |
| PUT | /api/writer/articles/{id} | Update artikel |
| DELETE | /api/writer/articles/{id} | Hapus artikel (draft only) |
| POST | /api/writer/articles/{id}/submit | Submit untuk review |

### Admin Routes (role:admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/articles | Semua artikel |
| GET | /api/admin/articles/pending | Artikel pending approval |
| GET | /api/admin/articles/published | Artikel published |
| GET | /api/admin/articles/rejected | Artikel rejected |
| POST | /api/admin/articles/{id}/approve | Approve artikel |
| POST | /api/admin/articles/{id}/reject | Reject artikel |
| PUT | /api/admin/articles/{id}/position | Update posisi |

## Article Workflow

### Writer Flow
1. Writer buat artikel (status: draft)
2. Writer submit artikel (status: pending)
3. Tunggu approval dari admin

### Admin Flow
1. Admin review artikel di "Kelola Berita"
2. Approve atau reject dengan alasan
3. Artikel published tampil di website

## Default Accounts (after seed)
| Role | Email | Password |
|------|-------|----------|
| admin | admin@seveninc.com | password |
| writer | writer@seveninc.com | password |
| public | public@seveninc.com | password |

## CORS Configuration
Frontend berjalan di: `http://localhost:5173`
Backend berjalan di: `http://localhost:8000`

CORS sudah dikonfigurasi untuk mengizinkan request dari localhost:5173.

## Testing

### Test Registration
```bash
# Register sebagai admin
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin Test","email":"admin2@test.com","password":"password123","password_confirmation":"password123","role":"admin"}'
```

### Test Login
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@seveninc.com","password":"password"}'
```

### Test Protected Route
```bash
# With token
curl -X GET http://localhost:8000/api/admin/articles \
  -H "Authorization: Bearer <token>"
```

## File Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php
│   │   │       ├── ArticleController.php
│   │   │       ├── CategoryController.php
│   │   │       └── ConfigurationController.php
│   │   └── Middleware/
│   │       └── CheckRole.php
│   └── Models/
│       ├── User.php
│       └── Article.php
├── routes/
│   └── api.php
└── database/
    ├── migrations/
    └── seeders/

frontend/
└── src/
    ├── api/
    │   ├── client.js
    │   └── setupAxios.js
    ├── masuk/
    │   ├── LoginAdmin.jsx
    │   └── RegisterAdmin.jsx
    ├── admin/
    │   ├── AdminApp.jsx
    │   ├── layouts/
    │   │   └── AdminLayout.jsx
    │   ├── components/
    │   │   └── Sidebar.jsx
    │   └── pages/
    │       ├── writer/
    │       └── articles/
    │           └── ArticleManagement.jsx
    └── components/
        └── ProtectedRouteAdmin.jsx
```

## Catatan
- Role admin dan superadmin sudah digabungkan menjadi satu role "admin"
- Gunakan email asli untuk register (password akan di-hash dengan Hash::make)
- Login memverifikasi password menggunakan Hash::check
- Token disimpan di localStorage frontend
- Redirect otomatis berdasarkan role setelah login

