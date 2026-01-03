# TODO - Authentication & Authorization System - COMPLETED

## Phase 1: Backend - Database & Models
- [x] 1.1 Update migration users table (role column)
- [x] 1.2 Update User model dengan method role checking
- [x] 1.3 Hapus tabel admins (drop migration if needed)

## Phase 2: Backend - Auth Controller
- [x] 2.1 Perbaiki register endpoint (validasi role, auto-hash password)
- [x] 2.2 Perbaiki login endpoint (Hash::check, return token + user + role)

## Phase 3: Backend - API Routes
- [x] 3.1 Update routes/api.php dengan role middleware
- [x] 3.2 Buat Writer routes (CRUD artikel dengan status)
- [x] 3.3 Buat Admin routes (Kelola Berita - approve/reject/assign)
- [x] 3.4 Update route protection untuk public, writer, admin

## Phase 4: Backend - Controllers
- [x] 4.1 Buat ArticleController untuk Writer
- [x] 4.2 Buat CategoryController
- [x] 4.3 Buat ConfigurationController
- [x] 4.4 Perbarui CheckRole middleware

## Phase 5: Frontend - API Client
- [x] 5.1 Update api/client.js (satu token, satu role)
- [x] 5.2 Update api/setupAxios.js

## Phase 6: Frontend - Login/Register
- [x] 6.1 Perbaiki LoginAdmin.jsx
- [x] 6.2 Perbaiki RegisterAdmin.jsx
- [x] 6.3 Hapus duplicate storage (adminToken, adminData)

## Phase 7: Frontend - Routing & Redirect
- [x] 7.1 Update App.jsx dengan route protection
- [x] 7.2 Redirect berdasarkan role (/admin, /writer, /)
- [x] 7.3 Update ProtectedRouteAdmin untuk multiple roles

## Phase 8: Frontend - Writer Interface
- [x] 8.1 Buat Writer Dashboard
- [x] 8.2 Buat Writer Article List
- [x] 8.3 Buat Writer Article Form
- [x] 8.4 Buat Writer routes di App.jsx

## Phase 9: Frontend - Admin Interface
- [x] 9.1 Update Admin sidebar dengan menu "Kelola Berita"
- [x] 9.2 Buat Article Management page untuk Admin
- [x] 9.3 Buat Approval modal dengan positioning options
- [x] 9.4 Update Configuration forms (Hero, About, Bisnis) dengan article dropdown

## Phase 10: Testing & Verification
- [x] 10.1 Test register sebagai writer
- [x] 10.2 Test register sebagai admin
- [x] 10.3 Test login dan redirect sesuai role
- [x] 10.4 Test Writer workflow (create -> submit)
- [x] 10.5 Test Admin workflow (approve -> reject)
- [x] 10.6 Verifikasi tidak ada CORS error

## Completion Criteria: DONE
- [x] User bisa register dengan email + password + role
- [x] User bisa login dengan email + password yang sama
- [x] Redirect otomatis berdasarkan role
- [x] Writer bisa buat & submit artikel
- [x] Admin bisa approve/reject & assign artikel ke section
- [x] Tidak ada error CORS

## Servers Running
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

## Default Accounts
- Admin: admin@seveninc.com / password
- Writer: writer@seveninc.com / password

