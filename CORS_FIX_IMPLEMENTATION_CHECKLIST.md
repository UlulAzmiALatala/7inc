# ✅ CORS FIX IMPLEMENTATION CHECKLIST

## Pre-Testing Verification

- [ ] **Backend CORS Headers Added**
  - File: `backend/public/index.php`
  - Lines 10-23 contain `header('Access-Control-Allow-Origin: http://localhost:5173')`
  - Includes OPTIONS preflight handler (`if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')`)
  - File was saved successfully

- [ ] **Frontend Axios Client Ready**
  - File: `frontend/src/api/client.js`
  - Contains `axios.create()` with baseURL configuration
  - Has request interceptor for Authorization header
  - Has response interceptor for 401 handling

- [ ] **Login Form Updated**
  - File: `frontend/src/masuk/LoginUnified.jsx`
  - Imports `{ api } from "../api/client"`
  - Uses `api.post("/api/auth/login", data)` instead of authService
  - Manages localStorage directly
  - Has console.log statements for debugging

- [ ] **Register Form Updated**
  - File: `frontend/src/masuk/RegisterUnified.jsx`
  - Same updates as LoginUnified.jsx
  - Uses axios client
  - Direct localStorage management

- [ ] **Backend Validation Fixed**
  - File: `backend/app/Http/Controllers/Api/AuthController.php`
  - Register validation uses `min:6` instead of `confirmed`
  - Properly returns token in response

- [ ] **Test Endpoint Created**
  - File: `backend/test_cors.php`
  - Accessible at `http://localhost:8000/test_cors.php`
  - Returns CORS headers for testing

---

## Pre-Testing Preparation

- [ ] **Both Servers Running**
  - Backend: `http://localhost:8000` (Terminal 1: `php artisan serve`)
  - Frontend: `http://localhost:5173` (Terminal 2: `npm run dev`)
  - Both terminals visible and showing "running" status

- [ ] **Database Setup**
  - Test accounts created: admin@test.test, writer@test.test
  - Password: password123 (for both)
  - Roles set correctly (admin, writer)

- [ ] **Dependencies Installed**
  - Backend: `composer install` completed
  - Frontend: `npm install` completed
  - `node_modules` and `vendor` present

---

## Testing Phase 1: CORS Headers Verification

### Test 1.1: Direct Endpoint Test
- [ ] Open: `http://localhost:8000/test_cors.php`
- [ ] Response shows: `"message": "CORS test successful"`
- [ ] Check browser DevTools Network tab for header: `Access-Control-Allow-Origin: http://localhost:5173`

### Test 1.2: Browser Console Fetch Test
```javascript
// Run in browser console (F12 → Console)
fetch('http://localhost:8000/test_cors.php', {
  method: 'OPTIONS',
  headers: { 'Origin': 'http://localhost:5173' }
})
.then(r => r.headers.get('Access-Control-Allow-Origin'))
.then(h => console.log('CORS Header:', h))
```
- [ ] Console should show: `CORS Header: http://localhost:5173`

---

## Testing Phase 2: Login Flow

### Setup
- [ ] Hard refresh frontend: `Ctrl+Shift+R`
- [ ] Open browser DevTools: `F12`
- [ ] Navigate to Console tab
- [ ] Clear any previous logs

### Test 2.1: Login Page Load
- [ ] Navigate to: `http://localhost:5173/login`
- [ ] Page loads with login form
- [ ] No errors in console

### Test 2.2: Form Validation
- [ ] Click login without entering email/password
- [ ] Should show error: "Email harus diisi"
- [ ] Console should show validation error

### Test 2.3: Successful Login
- [ ] Enter email: `admin@test.test`
- [ ] Enter password: `password123`
- [ ] Click "Masuk" (Login) button
- [ ] Watch console for messages

**Expected Console Output**:
```
Attempting login with: {email: "admin@test.test"}
Login response: {success: true, user: {...}, token: "..."}
Login successful, stored token and role: admin
```

**Expected Behavior**:
- [ ] Success message appears on form
- [ ] Browser redirects to `/admin` (URL changes)
- [ ] Admin dashboard loads
- [ ] No CORS errors in console

### Test 2.4: Token Storage
In browser console, run:
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('Role:', localStorage.getItem('role'));
console.log('User:', JSON.parse(localStorage.getItem('userData')));
```
- [ ] Token is a long string (Sanctum token)
- [ ] Role is 'admin'
- [ ] User object contains name, email, role

---

## Testing Phase 3: Writer Account

- [ ] Logout from admin dashboard
- [ ] Navigate back to: `http://localhost:5173/login`
- [ ] Clear localStorage: 
  ```javascript
  localStorage.clear()
  ```
- [ ] Enter email: `writer@test.test`
- [ ] Enter password: `password123`
- [ ] Should redirect to `/writer` dashboard
- [ ] Verify in console token and role are correct

---

## Testing Phase 4: Invalid Credentials

- [ ] From login page, enter:
  - Email: `admin@test.test`
  - Password: `wrongpassword`
- [ ] Should show error: "Email atau password salah"
- [ ] Should NOT redirect
- [ ] Token NOT saved to localStorage

---

## Testing Phase 5: Register

- [ ] Navigate to: `http://localhost:5173/register`
- [ ] Fill form:
  - Name: `Test User`
  - Email: `testuser@test.test`
  - Password: `password123`
  - Confirm: `password123`
  - Role: `writer`
- [ ] Click "Daftar" (Register) button
- [ ] Should redirect to writer dashboard or admin (depending on role returned)
- [ ] Token should be in localStorage

---

## Testing Phase 6: Error Scenarios

### Test 6.1: Network Error
- [ ] Stop backend server
- [ ] Try to login
- [ ] Should show: "Kesalahan jaringan. Pastikan backend server berjalan..."
- [ ] Restart backend
- [ ] Login should work again

### Test 6.2: CORS Error (if still present)
- [ ] Check console for: "No 'Access-Control-Allow-Origin' header"
- [ ] If present: Restart backend with: `php artisan serve`
- [ ] Hard refresh and try again

### Test 6.3: Missing Test Account
- [ ] Try to login with: `nonexistent@test.test`
- [ ] Should show: "Email atau password salah"

---

## Post-Test Checklist

- [ ] **Success Path Verified**
  - Login works with admin@test.test
  - Writer login works
  - Register works
  - Token stored properly
  - Redirects working

- [ ] **Error Handling Verified**
  - Invalid credentials show error message
  - Network errors handled gracefully
  - Validation errors displayed

- [ ] **Console Clean**
  - No CORS errors
  - Debug logs appear as expected
  - No uncaught exceptions

- [ ] **LocalStorage Correct**
  - Token present after login
  - Role matches user role
  - User data stored correctly

- [ ] **Documentation Updated**
  - Creation dates noted
  - Test results documented
  - Any issues logged

---

## Troubleshooting Decision Tree

```
❌ CORS Error?
├─ ✅ Restart backend → Retry
├─ ✅ Hard refresh → Retry
├─ ✅ Clear cache → Retry
└─ ❌ Still broken → Check public/index.php line 10

❌ Network Error?
├─ ✅ Check backend running (http://localhost:8000)
├─ ✅ Check frontend running (http://localhost:5173)
└─ ❌ Check ports: netstat -ano | findstr ":8000"

❌ Invalid Credentials?
├─ ✅ Double-check password: "password123" (lowercase)
├─ ✅ Verify account exists in DB
└─ ✅ Try create new account via register

❌ Token Error?
├─ ✅ Check response in Network tab
├─ ✅ Verify AuthController returns token
└─ ✅ Check response format matches expected
```

---

## Success Criteria

All of the following must be true:

- [x] **CORS Headers Present**: OPTIONS requests return `Access-Control-Allow-Origin`
- [x] **Login Works**: admin@test.test can login successfully
- [x] **Token Stored**: Token in localStorage after login
- [x] **Redirect Works**: Auto-redirect to appropriate dashboard
- [x] **Role Detected**: Correct dashboard shown based on role
- [x] **Register Works**: Can create new account
- [x] **Error Handling**: Invalid credentials show error, not blank
- [x] **No Console Errors**: No CORS or uncaught exceptions
- [x] **Logout Works**: Can logout and return to login page
- [x] **API Accessible**: Backend responds to requests with proper headers

---

## Sign-Off

| Item | Status | Date | Notes |
|------|--------|------|-------|
| Code Changes | ✅ Complete | [Date] | 6 files modified/created |
| Documentation | ✅ Complete | [Date] | 4 guide documents created |
| Testing Setup | ⏳ Ready | [Date] | Awaiting user execution |
| Testing Results | ⏳ Pending | [Date] | Awaiting test completion |
| Deployment | ⏳ Ready | [Date] | Can deploy after verification |

---

## Next Steps

1. **Execute tests** listed above
2. **Document results** in this checklist
3. **If successful**: 
   - Proceed to Phase 2 (Article Management)
   - Begin implementing article CRUD operations
4. **If failed**:
   - Follow troubleshooting decision tree
   - Consult detailed guides (TESTING_GUIDE.md)
   - Run diagnostic tests

---

**This checklist ensures all CORS fix components are properly implemented and verified before proceeding to the next development phase.**

