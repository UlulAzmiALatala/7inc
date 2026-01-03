# QUICK START - Windows Setup & Testing

## Status: ✅ READY TO TEST

Backend: `http://localhost:8000` ✅ Running
Frontend: `http://localhost:5173` ✅ Running
Database: ✅ Migrated with test accounts

## Prerequisites
- PHP 8.2+
- Node.js 18+
- MySQL/MariaDB
- Composer

---

## BACKEND SETUP

### Step 1: Install Dependencies
```bash
cd backend
composer install
```

### Step 2: Environment Configuration
```bash
cp .env.example .env
php artisan key:generate
```

Update `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=7inc_db
DB_USERNAME=root
DB_PASSWORD=

APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

### Step 3: Create Database
```bash
mysql -u root -p
> CREATE DATABASE 7inc_db;
> EXIT;
```

### Step 4: Run Migrations
```bash
php artisan migrate
php artisan db:seed   // optional, jika ada seeders
```

### Step 5: Start Backend Server
```bash
php artisan serve --host=localhost --port=8000
```

Backend akan accessible di: `http://localhost:8000`

---

## FRONTEND SETUP

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

Frontend akan accessible di: `http://localhost:5173`

---

## TESTING AUTH SYSTEM

### 1. Register New Writer Account
- Go to: `http://localhost:5173/register`
- Fill form:
  - Name: John Doe
  - Email: john@example.test
  - Password: password123
  - Role: Writer
- Click "Daftar"
- Should auto-redirect to dashboard (writer page - to be built)

### 2. Register New Admin Account
- Go to: `http://localhost:5173/register`
- Fill form:
  - Name: Admin User
  - Email: admin@example.test
  - Password: password123
  - Role: Admin
- Click "Daftar"
- Should auto-redirect to `/admin` dashboard

### 3. Login with Registered Account
- Go to: `http://localhost:5173/login`
- Email: john@example.test
- Password: password123
- Click "Login"
- Should redirect sesuai role saat register

### 4. Logout
- Go to: `http://localhost:5173/logout`
- Should redirect ke home page dan clear token

---

## VERIFY CORS WORKING

### Test dengan curl:

```bash
// Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "name": "Test User",
    "email": "test@example.test",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "writer"
  }'

// Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "email": "test@example.test",
    "password": "password123"
  }'
```

Expected response header:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
```

---

## TROUBLESHOOTING

### CORS Error
1. Check `config/cors.php` - must include `http://localhost:5173`
2. Check Laravel middleware - `HandleCors` must be registered
3. Check browser console - verify preflight request (OPTIONS) succeeds
4. Clear cache: `php artisan config:cache`

### 404 Not Found on API
1. Check routes registered: `php artisan route:list | grep api`
2. Verify controller path in routes
3. Check namespace in controller file

### Login tidak working
1. Verify database credentials di `.env`
2. Check user tersimpan di database: `SELECT * FROM users;`
3. Verify password hashing: `php artisan tinker` → `Hash::check('password123', user->password)`
4. Check token generated: look at login response

### Token expired/invalid
1. Check Bearer token di request header
2. Verify token generated dari login response
3. Check `SANCTUM_TOKEN_EXPIRATION` di `.env` (default: no expiration)

---

## FILE CHECKLIST

### Backend
- [x] `app/Http/Controllers/Api/AuthController.php` - Auth logic
- [x] `app/Http/Controllers/Api/ArticleController.php` - Article CRUD
- [x] `app/Http/Middleware/CheckRole.php` - Role middleware
- [x] `config/cors.php` - CORS configuration
- [x] `routes/api.php` - API routes
- [x] `database/migrations/` - All migrations updated
- [ ] `config/sanctum.php` - Check token config

### Frontend
- [x] `src/api/authService.js` - Auth API service
- [x] `src/masuk/Login.jsx` - Login page
- [x] `src/masuk/Register.jsx` - Register page
- [x] `src/masuk/Logout.jsx` - Logout page
- [x] `src/App.jsx` - Main routing & protection
- [ ] `src/writer/` - Writer dashboard (TO BUILD)
- [ ] `src/admin/pages/articles/` - Article management (TO BUILD)

---

## NEXT PHASES

### Phase 1: Core Auth System (DONE)
- [x] Email + password auth
- [x] Register dengan role selection
- [x] Login dengan automatic redirect
- [x] CORS properly configured
- [x] Token-based authentication

### Phase 2: Writer Interface (TO DO)
- [ ] WriterDashboard.jsx - statistics & navigation
- [ ] ArticleList.jsx - list my articles dengan filter
- [ ] ArticleForm.jsx - create/edit article
- [ ] ArticleSubmit.jsx - submit untuk approval
- [ ] Writer API service calls

### Phase 3: Admin Article Management (TO DO)
- [ ] ArticleManagement.jsx - tabs (pending, published, rejected)
- [ ] ArticleApproval.jsx - approve modal
- [ ] ArticleAssignment.jsx - assign ke sections
- [ ] ConfigurationUpdate.jsx - update dengan article reference
- [ ] Admin API service calls

### Phase 4: Notifications & Polish (TO DO)
- [ ] Badge count untuk pending articles
- [ ] Real-time notification (optional: websocket)
- [ ] Better error messages
- [ ] Success toast notifications
- [ ] Loading states & skeleton loaders

---

## IMPORTANT REMINDERS

1. **API Base URL**: Always use `http://localhost:8000` (not 127.0.0.1)
2. **Frontend URL**: Always use `http://localhost:5173` (not 127.0.0.1)
3. **Role Immutable**: Role tidak bisa diubah setelah register
4. **Public Users**: Role 'public' tidak support login (public page only)
5. **Token Storage**: Stored di localStorage for session duration
6. **Password Hashing**: Always use Hash::make() & Hash::check()
7. **CORS Credentials**: Enabled untuk Bearer token authentication

---

For detailed documentation, see: IMPLEMENTATION_GUIDE.md
