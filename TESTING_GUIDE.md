# 🧪 CORS & LOGIN TESTING GUIDE

## Status
**CORS Solution Implemented**: Public/index.php with native PHP headers + Axios API client  
**Next Step**: Test if solution resolves the issue

---

## ✅ What Was Fixed

### 1. **Backend CORS Headers** (`public/index.php`)
- Added native PHP `header()` calls at the very start of execution
- These run **before** routing/middleware/framework logic
- Headers sent for all requests including OPTIONS preflight

### 2. **Frontend API Client** (`src/api/client.js`)
- Axios client configured with proper baseURL
- Request/response interceptors for auth token handling
- Error handling for CORS and API errors

### 3. **Frontend Login & Register** 
- Updated to use axios API client directly
- Removed dependency on authService2.js
- Improved error messages showing network status
- Added console logging for debugging

### 4. **Backend Validation**
- Fixed register endpoint validation (removed 'confirmed' requirement)
- Accepts password directly from frontend
- Returns proper token and user data structure

---

## 🚀 Quick Test Steps

### Step 1: Hard Refresh Frontend
```
Press: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```
This clears browser cache and ensures latest code is loaded.

### Step 2: Test CORS Headers (Optional Verification)
Open browser console and run:
```javascript
fetch('http://localhost:8000/test_cors.php', {
  method: 'OPTIONS',
  headers: { 'Origin': 'http://localhost:5173' }
})
.then(r => {
  console.log('Status:', r.status);
  console.log('CORS Header:', r.headers.get('Access-Control-Allow-Origin'));
  return r.json();
})
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e));
```

Expected output:
```
Status: 200
CORS Header: http://localhost:5173
Response: {success: true, message: 'CORS test successful', ...}
```

### Step 3: Test Login
1. Go to: `http://localhost:5173/login`
2. Enter credentials:
   - **Email**: `admin@test.test`
   - **Password**: `password123`
3. Click "Masuk" button
4. Check browser console (F12) for messages

### Step 4: Monitor Console Output

**Success Case**:
```
Attempting login with: {email: "admin@test.test"}
Login response: {success: true, user: {...}, token: "..."}
Login successful, stored token and role: admin
```
→ You should be redirected to `/admin` dashboard

**CORS Error Case**:
```
Error: Network Error
Network error message in red box
```
→ Backend not responding with CORS headers

**Wrong Credentials Case**:
```
Error message: "Email atau password salah"
```
→ Check credentials, use test accounts above

---

## 📝 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@test.test` | `password123` |
| Writer | `writer@test.test` | `password123` |

---

## 🔍 Detailed Troubleshooting

### Issue 1: CORS Error Still Appears
**Error Message**: "No 'Access-Control-Allow-Origin' header is present on the requested resource"

**Solutions**:
1. **Restart Backend**:
   ```powershell
   # Stop current server (Ctrl+C in terminal)
   # Restart it
   cd backend
   php artisan serve --host=localhost --port=8000
   ```

2. **Clear Browser Cache**:
   - Ctrl+Shift+Delete
   - Select "All time"
   - Check: Cookies and other site data
   - Click Clear data

3. **Verify public/index.php has CORS headers**:
   - Open: `d:\PROJECT\New folder\7inc\backend\public\index.php`
   - Lines 10-23 should have `header()` calls
   - If missing, file didn't save properly

### Issue 2: Network Error
**Error Message**: "Kesalahan jaringan. Pastikan backend server berjalan di http://localhost:8000"

**Solutions**:
1. Check backend is running: Open `http://localhost:8000` in browser
   - Should see Laravel welcome page or error
   - If blank/refuses connection: Backend not running

2. Check frontend is running: Open `http://localhost:5173` in browser
   - Should show login form
   - If 404: Frontend not running

3. Check both servers are on correct ports:
   ```powershell
   # Check ports in use
   netstat -ano | findstr ":8000"
   netstat -ano | findstr ":5173"
   ```

### Issue 3: "Email atau password salah"
**Cause**: Credentials incorrect or user doesn't exist

**Solutions**:
1. Verify test account exists in database:
   ```powershell
   cd backend
   php artisan tinker
   # In tinker shell:
   > App\Models\User::where('email', 'admin@test.test')->first()
   # Should show user object
   ```

2. Create test user if missing:
   ```powershell
   cd backend
   php artisan tinker
   # In tinker shell:
   > App\Models\User::create([
   >   'name' => 'Admin',
   >   'email' => 'admin@test.test',
   >   'password' => 'password123',
   >   'role' => 'admin'
   > ])
   ```

3. Reset password if needed:
   ```powershell
   cd backend
   php artisan tinker
   # In tinker shell:
   > $user = App\Models\User::find(1)
   > $user->password = 'password123'
   > $user->save()
   ```

### Issue 4: Token Errors
**Error Message**: "Token tidak diterima dari server" or token-related errors

**Causes**: 
- Backend not returning token in response
- Token format incorrect
- Sanctum not configured properly

**Solutions**:
1. Check API response manually:
   ```powershell
   # PowerShell
   $body = @{
       email = 'admin@test.test'
       password = 'password123'
   } | ConvertTo-Json
   
   Invoke-WebRequest -Uri "http://localhost:8000/api/auth/login" `
     -Method POST `
     -Headers @{'Content-Type'='application/json'} `
     -Body $body
   ```
   
   Should return:
   ```json
   {
     "success": true,
     "message": "Login successful",
     "user": {...},
     "token": "..."
   }
   ```

2. Check AuthController returns token:
   - File: `backend/app/Http/Controllers/Api/AuthController.php`
   - Should have `'token' => $token` in response
   - If missing, add it back

---

## 🎯 Success Indicators

When login works correctly, you should see:

1. ✅ No CORS errors in browser console
2. ✅ Login request completes (no network errors)
3. ✅ Token stored in localStorage
4. ✅ Auto-redirect to `/admin` or `/writer` dashboard
5. ✅ Dashboard shows user info and articles

---

## 📊 Architecture Summary

```
Frontend (React on localhost:5173)
    ↓
  axios client (src/api/client.js)
    ↓
Backend API (Laravel on localhost:8000)
    ↓
public/index.php (CORS headers)
    ↓
Routes → Controllers → Database
```

CORS headers in `public/index.php` allow the cross-origin request to proceed.

---

## 🔧 Files Modified

1. **`backend/public/index.php`**
   - Added CORS header() calls at lines 10-23
   - Added OPTIONS preflight handler

2. **`frontend/src/api/client.js`**
   - Axios client with interceptors
   - Error handling for auth failures

3. **`frontend/src/masuk/LoginUnified.jsx`**
   - Uses api.post() instead of authService2
   - Direct axios calls with localStorage management
   - Detailed error messages

4. **`frontend/src/masuk/RegisterUnified.jsx`**
   - Same updates as LoginUnified

5. **`backend/app/Http/Controllers/Api/AuthController.php`**
   - Register validation fixed (password min:6 instead of confirmed)

6. **`backend/test_cors.php`**
   - New CORS test endpoint for verification

---

## ⚠️ Common Mistakes

1. ❌ **Using old cached JavaScript** → Use Ctrl+Shift+R
2. ❌ **Wrong password** → Use `password123` (all lowercase)
3. ❌ **Backend not running** → Terminal might have scrolled, check it's visible
4. ❌ **Port already in use** → Close other processes on 8000/5173
5. ❌ **Not clearing localStorage** → If having issues, clear browser data

---

## 🎓 Next Steps After Login Works

1. Test writer login (writer@test.test)
2. Verify different dashboards for different roles
3. Test logout functionality
4. Test register endpoint
5. Begin article management features

---

**Last Updated**: When LoginUnified.jsx and public/index.php were modified  
**Status**: Ready for testing - solution should resolve CORS issue

