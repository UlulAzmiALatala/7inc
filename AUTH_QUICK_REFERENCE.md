# 🔐 AUTHENTICATION SYSTEM - QUICK REFERENCE

**Status**: ✅ WORKING  
**Test**: Login works - admin@test.test / password123  

---

## 📍 Current Authentication Flow

```
User Login Form
       ↓
api.post('/api/auth/login', { email, password })
       ↓
Backend: AuthController.login()
       ↓
Token generated (Sanctum)
       ↓
Token + User Data returned to frontend
       ↓
Token stored in localStorage
       ↓
Auto-redirect to /admin or /writer
```

---

## 🗂️ Key Files (DO NOT MODIFY)

| File | Role | Location |
|------|------|----------|
| LoginUnified.jsx | Login form UI | `frontend/src/masuk/` |
| AuthController.php | Auth logic | `backend/app/Http/Controllers/Api/` |
| client.js | Axios config | `frontend/src/api/` |
| HandleCorsRequests.php | CORS headers | `backend/app/Http/Middleware/` |
| config/cors.php | CORS config | `backend/config/` |

---

## 📊 Current Test Accounts

```
ADMIN:
  Email: admin@test.test
  Password: password123
  Role: admin
  Redirects to: /admin

WRITER:
  Email: writer@test.test
  Password: password123
  Role: writer
  Redirects to: /writer
```

---

## 🔑 How Token Works

### Frontend
```javascript
// 1. Save token after login
localStorage.setItem('token', response.data.token);

// 2. Axios auto-adds to all requests
// (via interceptor in src/api/client.js)

// 3. Every request has:
// Authorization: Bearer <token>
```

### Backend
```php
// Protected routes use middleware
Route::middleware('auth:sanctum')->group(function () {
    // Only authenticated users can access
    Route::get('/articles', [ArticleController::class, 'index']);
});

// Get current user
$user = $request->user();
$role = $user->role;
```

---

## ✅ Auth System Components

### What's Protected
- ✅ `/api/auth/logout` - Protected
- ✅ `/api/auth/me` - Protected
- ✅ `/api/articles/*` - Protected (add middleware)

### What's Public
- ✅ `/api/auth/login` - Public
- ✅ `/api/auth/register` - Public

---

## 🧪 How to Test Auth

### Test 1: Login Works
```bash
1. Go to http://localhost:5173/login
2. Enter: admin@test.test / password123
3. Should redirect to /admin
4. Check localStorage has 'token'
```

### Test 2: Token Sent
```bash
1. Open DevTools (F12)
2. Go to Network tab
3. Try login
4. Click on POST /api/auth/login
5. Check Headers section
6. Should see: Authorization: Bearer <token>
```

### Test 3: Protected Route
```bash
1. Logout (clear localStorage)
2. Try to access /admin directly
3. Should redirect to /login
```

### Test 4: Protected API
```bash
// In browser console:
fetch('http://localhost:8000/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(d => console.log(d))
```

---

## ⚠️ Things NOT to Change

```
❌ DO NOT CHANGE:
  - Login form layout
  - Token storage mechanism
  - CORS headers
  - Auth routes
  - Token generation method
  - Authorization header format
```

---

## ✅ Things You CAN Change

```
✅ YOU CAN CHANGE:
  - Admin dashboard layout
  - Writer dashboard layout
  - Add new routes for new features
  - Add new controllers
  - Add new React components
  - Database migrations for new features
```

---

## 🚨 If Something Goes Wrong

| Problem | Solution |
|---------|----------|
| CORS error | Restart backend, hard refresh |
| Login page blank | Clear cache, restart frontend |
| Token not saving | Check browser's localStorage allowed |
| Protected route accessible | Check middleware on route |
| API returns 401 | Token expired or invalid, login again |

---

## 📝 Development Checklist

Before pushing new role feature:

- [ ] Login still works
- [ ] Token still saves
- [ ] Logout still works
- [ ] No CORS errors
- [ ] No console errors
- [ ] Protected routes still protected
- [ ] API calls include token

---

## 🎯 Next Steps for Role Development

1. **Create Admin Dashboard** (`src/admin/AdminDashboard.jsx`)
2. **Create Writer Dashboard** (`src/writer/WriterDashboard.jsx`)
3. **Add Protected Routes** in `src/App.jsx`
4. **Create Article Controller** in backend
5. **Create Article Model & Migration**
6. **Add Article Management Components**

---

**Remember**: Auth system is STABLE. Focus on role features, not auth!

