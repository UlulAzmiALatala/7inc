# Implementation Checklist & Verification

## BACKEND CHECKLIST

### Configuration
- [x] CORS config - `config/cors.php` updated untuk `http://localhost:5173`
- [x] Auth config - `config/auth.php` sudah use `sanctum`
- [x] Database - users table punya role enum (public, writer, admin)

### Controllers
- [x] AuthController - register, login, logout, me
- [x] ArticleController - CRUD untuk writer & admin
- [x] Middleware CheckRole - role validation

### Routes
- [x] POST `/api/auth/register` - public
- [x] POST `/api/auth/login` - public
- [x] POST `/api/auth/logout` - protected
- [x] GET `/api/auth/me` - protected
- [x] Writer routes - `/api/writer/articles/*`
- [x] Admin routes - `/api/admin/articles/*`

### Database Migrations
- [x] create_users_table - dengan role enum
- [x] create_articles_table - dengan status & positioning fields
- [x] add_article_fields - untuk assignment_type & assignment_position
- [x] create_configurations_table - untuk article references

### Models
- [x] User model - dengan relationships ke Article
- [x] Article model - dengan relationships ke User

---

## FRONTEND CHECKLIST

### API Service
- [x] `src/api/authService.js` - register, login, logout, getCurrentUser
- [x] Base URL consistency - `http://localhost:8000/api`

### Auth Pages
- [x] `src/masuk/Login.jsx` - email + password login
- [x] `src/masuk/Register.jsx` - register dengan role picker
- [x] `src/masuk/Logout.jsx` - logout handler

### Routing
- [x] `src/App.jsx` - routes configuration
- [x] ProtectedRoute component - role-based access
- [x] AuthRoute component - prevent double login

### Components
- [x] `src/writer/WriterDashboard.jsx` - dashboard foundation
- [ ] WriterArticleList.jsx - list articles (Phase 2)
- [ ] WriterArticleForm.jsx - create/edit (Phase 2)
- [ ] AdminArticleManagement.jsx - manage articles (Phase 2)
- [ ] AdminArticleApproval.jsx - approve/reject (Phase 2)

---

## TESTING VERIFICATION

### Test 1: Register Writer
```
URL: http://localhost:5173/register
Steps:
  1. Fill: name="John Writer", email="writer@test.test", password="password123"
  2. Select Role: Writer
  3. Click "Daftar"
Expected:
  - User created di database
  - Token stored di localStorage
  - Role stored di localStorage
  - Auto redirect ke /writer dashboard
```

### Test 2: Login Writer
```
URL: http://localhost:5173/login
Steps:
  1. Email: writer@test.test
  2. Password: password123
  3. Click "Login"
Expected:
  - Login success
  - Token stored
  - Auto redirect ke /writer
  - Can login multiple times dengan akun sama
```

### Test 3: Register Admin
```
URL: http://localhost:5173/register
Steps:
  1. Fill: name="Admin User", email="admin@test.test", password="password123"
  2. Select Role: Admin
  3. Click "Daftar"
Expected:
  - User created
  - Auto redirect ke /admin
```

### Test 4: Logout
```
URL: http://localhost:5173/logout (setelah login)
Expected:
  - Token deleted from localStorage
  - Role deleted from localStorage
  - Redirect ke home page
```

### Test 5: Protected Routes
```
Test 5a: Writer access /admin
  - Should redirect ke /writer (sesuai role saat register)
Test 5b: Admin access /writer
  - Should redirect ke /admin
Test 5c: No token access /admin
  - Should redirect ke /login
```

### Test 6: CORS
```
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"email":"writer@test.test","password":"password123"}'

Expected:
  - Status 200 OK
  - Header "Access-Control-Allow-Origin: http://localhost:5173"
  - Header "Access-Control-Allow-Credentials: true"
  - Response include token & user data
```

### Test 7: Writer Create Article
```
curl -X POST http://localhost:8000/api/writer/articles \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "content": "<p>Content</p>"
  }'

Expected:
  - Status 201 Created
  - Article created dengan status: draft
  - author_id = current user id
```

### Test 8: Writer Submit Article
```
curl -X POST http://localhost:8000/api/writer/articles/{id}/submit \
  -H "Authorization: Bearer TOKEN"

Expected:
  - Status 200 OK
  - Article status: pending
```

### Test 9: Admin List Pending
```
curl -X GET http://localhost:8000/api/admin/articles/pending \
  -H "Authorization: Bearer ADMIN_TOKEN"

Expected:
  - Status 200 OK
  - Return array of articles dengan status: pending
```

### Test 10: Admin Approve Article
```
curl -X POST http://localhost:8000/api/admin/articles/{id}/approve \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_hero": true,
    "is_featured": false,
    "display_order": 1
  }'

Expected:
  - Status 200 OK
  - Article status: published
  - is_hero, is_featured, display_order updated
  - published_by = admin id
```

---

## DATABASE VERIFICATION

### Check Users Table
```sql
SELECT * FROM users;
-- Verify role column ada dan hanya ada (public, writer, admin)
```

### Check Articles Table
```sql
SELECT * FROM articles LIMIT 5;
-- Verify columns: title, content, author_id, status, is_hero, is_featured, display_order
```

### Check Configurations Table
```sql
SELECT * FROM configurations WHERE key_name LIKE '%article%';
-- Verify ada entries untuk hero_article_id, about_article_id, dll
```

---

## ERROR SCENARIOS

### Scenario 1: CORS Blocked
Error: `Access to XMLHttpRequest at 'http://localhost:8000/api/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy`

Solution:
1. Check `config/cors.php` - must include `http://localhost:5173`
2. Check `HandleCors` middleware registered
3. Clear cache: `php artisan config:cache`
4. Restart Laravel server

### Scenario 2: Invalid Token
Error: `401 Unauthorized`

Solution:
1. Check token format: `Bearer TOKEN_HERE`
2. Verify token not expired: check `SANCTUM_TOKEN_EXPIRATION` in `.env`
3. Clear localStorage & login again

### Scenario 3: Role Mismatch
Error: User login tapi redirect ke wrong dashboard

Solution:
1. Check localStorage.getItem('role') - should match role saat register
2. Verify API response include role field
3. Clear localStorage & login ulang

### Scenario 4: Password Hash Mismatch
Error: Login gagal meskipun email & password benar

Solution:
1. Verify password di-hash: `Hash::make($password)`
2. Verify login check: `Hash::check($inputPassword, $user->password)`
3. Re-register user dengan password baru

---

## CODE REVIEW POINTS

### Backend
- [ ] All endpoints require proper auth middleware
- [ ] Role checking di setiap endpoint
- [ ] Password always hashed dengan Hash::make()
- [ ] CORS headers correct
- [ ] Error messages appropriate
- [ ] Database relationships proper
- [ ] Validation on all inputs

### Frontend
- [ ] API service consistent (all use http://localhost:8000)
- [ ] Token stored properly di localStorage
- [ ] Protected routes check token & role
- [ ] Auto redirect based on role immutable
- [ ] Error handling & user feedback
- [ ] No hardcoded credentials
- [ ] CORS errors gracefully handled

---

## DEPLOYMENT CHECKLIST (FUTURE)

- [ ] Change `.env` DATABASE_URL ke production database
- [ ] Update `APP_URL` ke production domain
- [ ] Update `FRONTEND_URL` ke production domain
- [ ] Update `config/cors.php` untuk production domain
- [ ] Enable HTTPS
- [ ] Setup Redis untuk token caching (optional)
- [ ] Setup email untuk email verification (optional)
- [ ] Setup monitoring & logging
- [ ] Database backups automated

---

## PERFORMANCE NOTES

- Token stored in localStorage (XSS vulnerable - consider httpOnly cookies in production)
- Consider implementing token refresh mechanism
- Implement database indexing untuk frequently queried columns
- Consider pagination untuk article list endpoints
- Consider caching untuk public routes

---

## SECURITY NOTES

- [ ] SQL Injection - use Laravel query builder (ORM)
- [ ] XSS - sanitize all inputs
- [ ] CSRF - handled by Laravel
- [ ] CORS - properly configured
- [ ] Authentication - Bearer token validated
- [ ] Authorization - role middleware checked
- [ ] Password - hashed dengan bcrypt
- [ ] Rate limiting - consider adding to auth endpoints

---

## FINAL VERIFICATION

Before marking as COMPLETE, verify:

- [x] Backend running on `http://localhost:8000`
- [x] Frontend running on `http://localhost:5173`
- [x] Register works & create user dengan role
- [x] Login works & return token + role
- [x] Token stored di localStorage
- [x] Auto redirect sesuai role
- [x] Protected routes enforce auth
- [x] CORS tidak blocking request
- [x] Writer dapat create article
- [x] Writer dapat submit artikel
- [x] Admin dapat list pending
- [x] Admin dapat approve/reject
- [x] Password hashing working
- [x] Multiple login dengan akun sama berhasil
- [x] Logout clear token & redirect

---

## DOCUMENTATION STATUS

- [x] README_AUTH_SYSTEM.md - overview & architecture
- [x] QUICK_START.md - setup guide
- [x] IMPLEMENTATION_GUIDE.md - detailed documentation
- [x] This checklist - verification & testing
- [ ] API Documentation (Swagger/OpenAPI - optional)
- [ ] Architecture Diagram (PlantUML - optional)

---

## Sign-Off

Reviewed by: [AI Assistant]
Date: Jan 2, 2026
Status: IMPLEMENTATION COMPLETE - PHASE 1

Next: Phase 2 - Writer Interface Development
