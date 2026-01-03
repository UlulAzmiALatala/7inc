# ⚠️ DEVELOPER GUIDELINES - AUTHENTICATION SYSTEM

**⚠️ CRITICAL**: Jangan modifikasi authentication system tanpa koordinasi!

---

## 🔒 PROTECTED COMPONENTS - DO NOT MODIFY

Komponen berikut **SUDAH BEKERJA DENGAN SEMPURNA** dan tidak boleh diubah:

### Frontend Authentication
```
❌ JANGAN UBAH:
  - src/masuk/LoginUnified.jsx
  - src/masuk/RegisterUnified.jsx  
  - src/masuk/LogoutUnified.jsx
  - src/api/client.js
  - src/api/authService.js (jika ada)

⚠️ JIKA HARUS UBAH:
  - Lakukan backup terlebih dahulu
  - Test login flow setelah perubahan
  - Update dokumentasi
  - Hubungi tech lead
```

### Backend Authentication
```
❌ JANGAN UBAH:
  - app/Http/Middleware/HandleCorsRequests.php
  - app/Http/Controllers/Api/AuthController.php
  - config/cors.php
  - routes/api.php (bagian auth)
  - app/Http/Kernel.php (middleware order)

⚠️ JIKA HARUS UBAH:
  - Lakukan backup terlebih dahulu
  - Test login/register setelah perubahan
  - Restart server
  - Update dokumentasi
  - Hubungi tech lead
```

---

## ✅ SAFE TO MODIFY - GO AHEAD!

Komponen ini boleh diubah untuk development role-based features:

### Admin Dashboard
```
✅ AMAN UNTUK UBAH:
  - src/admin/                      (new components)
  - src/admin/AdminDashboard.jsx    (new or modify)
  - src/admin/AdminNavbar.jsx       (new or modify)
  - src/admin/ArticleManagement.jsx (new)
  - src/admin/UserManagement.jsx    (new)
  - etc...

⚠️ JANGAN UBAH:
  - Login form di /login
  - Token handling
  - Authorization headers
```

### Writer Dashboard
```
✅ AMAN UNTUK UBAH:
  - src/writer/                       (new components)
  - src/writer/WriterDashboard.jsx    (new or modify)
  - src/writer/WriterArticles.jsx     (new)
  - src/writer/WriteArticle.jsx       (new)
  - etc...

⚠️ JANGAN UBAH:
  - Login form di /login
  - Token handling
  - Authorization headers
```

### Backend Role Features
```
✅ AMAN UNTUK UBAH:
  - app/Http/Controllers/ArticleController.php  (new or modify)
  - app/Http/Controllers/AdminController.php    (new)
  - app/Http/Controllers/WriterController.php   (new)
  - app/Models/Article.php                      (new or modify)
  - database/migrations/                        (new migrations)
  - routes/api.php (tambah route baru, jangan ubah auth routes)

⚠️ JANGAN UBAH:
  - Auth routes (/api/auth/*)
  - CORS middleware
  - Token validation
```

---

## 🚀 WORKFLOW UNTUK DEVELOPMENT ROLE

### Saat Menambah Role-Based Feature:

1. **Buat route baru** di `routes/api.php`
   ```php
   Route::middleware('auth:sanctum')->group(function () {
       // ✅ OK - menambah route baru
       Route::get('/articles', [ArticleController::class, 'index']);
       
       // ❌ JANGAN - ubah route auth
       // Route::post('/auth/login', ...);
   });
   ```

2. **Buat controller baru**
   ```php
   // ✅ OK - controller baru
   class ArticleController extends Controller { ... }
   
   // ❌ JANGAN - modifikasi AuthController
   ```

3. **Buat component React baru**
   ```jsx
   // ✅ OK - component baru
   export default function AdminDashboard() { ... }
   
   // ❌ JANGAN - modifikasi LoginUnified
   ```

4. **Test setelah perubahan**
   ```bash
   # 1. Pastikan login masih bisa
   # 2. Pastikan token masih tersimpan
   # 3. Pastikan protected routes masih terproteksi
   # 4. Baru test role feature baru
   ```

---

## 📋 AUTHENTICATION CHECKLIST SAAT DEVELOPMENT

Sebelum submit role feature, pastikan checklist ini terpenuhi:

- [ ] Login page masih bisa diakses: `http://localhost:5173/login`
- [ ] Login dengan `admin@test.test / password123` masih berhasil
- [ ] Login dengan `writer@test.test / password123` masih berhasil
- [ ] Redirect ke role yang benar terjadi
- [ ] Token tersimpan di localStorage
- [ ] Role tersimpan di localStorage
- [ ] Protected routes (yang memerlukan auth) masih terproteksi
- [ ] Logout masih bekerja
- [ ] Browser console tidak ada error CORS
- [ ] Network tab di DevTools menunjukkan Authorization header

---

## 🔐 TOKEN & AUTHORIZATION REFERENCE

Jangan pernah ubah cara ini:

### Frontend - Token Management
```javascript
// ✅ BENAR - cara yang sudah tested dan working
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

// Mengirim request dengan token
api.post('/api/articles', data);  // Token auto-added via interceptor

// ❌ JANGAN - ubah cara ini
// token = window.sessionStorage.getItem(...);
// axios.post(..., { headers: { 'X-Token': token } });
```

### Backend - Token Validation
```php
// ✅ BENAR - middleware auth:sanctum sudah tested
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/articles', [ArticleController::class, 'index']);
});

// ❌ JANGAN - ubah middleware auth
// Route::middleware('custom-auth')->group(function () { ... });
```

### API Response Format
```json
// ✅ BENAR - format yang sudah tested
{
  "success": true,
  "message": "...",
  "token": "...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@test.test",
    "role": "admin"
  }
}

// ❌ JANGAN - ubah format ini
// { "data": { ... }, "access_token": "..." }
```

---

## ⚡ QUICK CHECKLIST SEBELUM PUSH CODE

```bash
# 1. Restart backend
cd backend
php artisan serve --host=localhost --port=8000

# 2. Hard refresh frontend
Ctrl+Shift+R

# 3. Test login
email: admin@test.test
password: password123
✓ Should redirect to /admin

# 4. Test console
F12 → Console
✓ No errors
✓ No CORS warnings

# 5. Test localStorage
F12 → Application → Storage → Local Storage
✓ Token present
✓ Role present
✓ User data present

# 6. Test protected route
// Try access /admin without login
✓ Should redirect to /login

# 7. Test logout
✓ localStorage should be cleared
✓ Should redirect to /login
```

---

## 🛑 IF SOMETHING BREAKS

### Login Tidak Bisa Masuk

```bash
# 1. Clear browser cache
Ctrl+Shift+Delete → All time → Clear

# 2. Clear localStorage
// Di browser console:
localStorage.clear()

# 3. Restart backend
cd backend
php artisan serve --host=localhost --port=8000

# 4. Hard refresh frontend
Ctrl+Shift+R

# 5. Try login again
```

### CORS Error Muncul Lagi

```
⚠️ ALERT: Jangan modifikasi public/index.php atau middleware!
```

```bash
# Jika CORS error muncul:
# 1. Pastikan HandleCorsRequests middleware tidak diubah
# 2. Pastikan config/cors.php tidak diubah
# 3. Restart backend
# 4. Hard refresh frontend
```

### Token Not Persisting

```bash
# Jika token tidak tersimpan:
# 1. Check LoginUnified.jsx tidak diubah
# 2. Check localStorage.setItem() masih ada
# 3. Check localStorage tidak di-clear
# 4. Lihat browser console untuk error
```

---

## 📞 GETTING HELP

Sebelum menghubungi tech lead, pastikan sudah:

1. ✅ Clear browser cache
2. ✅ Restart backend
3. ✅ Hard refresh frontend
4. ✅ Check browser console (F12)
5. ✅ Check network tab (XHR requests)
6. ✅ Check Authorization header present
7. ✅ Test dengan fresh browser window

Jika masih error, screenshot:
- [ ] Browser console (F12 → Console)
- [ ] Network tab (F12 → Network, then try login)
- [ ] Request headers (Network → Click login request → Headers)
- [ ] Response (Network → Click login request → Response)

---

## 📚 REFERENCE FILES

**Authentication System Files**:
- `LOGIN_PROBLEM_SOLUTION.md` - Full problem/solution documentation
- `backend/app/Http/Middleware/HandleCorsRequests.php` - CORS handling
- `backend/app/Http/Controllers/Api/AuthController.php` - Auth logic
- `frontend/src/masuk/LoginUnified.jsx` - Login form
- `frontend/src/api/client.js` - Axios client config

**Never modify these without reading the docs first!**

---

## ✨ GOLDEN RULES

```
1. ✅ Tambah route baru
   ❌ Ubah /api/auth/* routes

2. ✅ Buat controller baru
   ❌ Modifikasi AuthController

3. ✅ Buat component React baru
   ❌ Modifikasi LoginUnified.jsx

4. ✅ Tambah middleware baru
   ❌ Ubah HandleCorsRequests

5. ✅ Tambah database column
   ❌ Ubah token mechanism

6. ✅ Test role feature baru
   ❌ Lupa test login masih bisa
```

---

**PENTING**: Authentication system sudah **FULLY TESTED** dan **WORKING**.  
Fokus development pada role-based features, bukan auth system!

**Last Updated**: January 1, 2026  
**Status**: ✅ Authentication System STABLE

