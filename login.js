// 1. Konfigurasi Keamanan
// Ganti kode ini dengan kode rahasia Anda sendiri
const ADMIN_SECRET_KEY = "RAHASIA_ADMIN_2024"; 

// 2. Akun Demo Bawaan
const demoAccounts = {
  user: {
    username: "user",
    password: "user123",
    role: "user",
    name: "Pengguna Demo",
  },
  admin: {
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Admin Toko",
  },
};

// 3. Fungsi untuk berpindah antara Form Login dan Registrasi
function toggleForm() {
  const loginSection = document.getElementById("loginFormSection");
  const registerSection = document.getElementById("registerFormSection");
  const header = document.getElementById("formHeader");

  if (loginSection.style.display === "none") {
    loginSection.style.display = "block";
    registerSection.style.display = "none";
    header.innerHTML = `<h1>🛒 Toko Fresh Market Online</h1><p>Selamat datang di Fresh Market Online! Silakan login untuk melanjutkan</p>`;
  } else {
    loginSection.style.display = "none";
    registerSection.style.display = "block";
    header.innerHTML = `<h1>📝 Daftar Akun</h1><p>Buat akun baru Anda di sini</p>`;
  }
}

// 4. Cek sesi login saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    const user = JSON.parse(currentUser);
    redirectToDashboard(user.role);
  }
});

// 5. Handle Registrasi Akun Pembeli (Halaman Publik)
function handleRegister(event) {
  event.preventDefault();

  const fullName = document.getElementById("regFullName").value;
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;

  let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {};

  if (demoAccounts[username] || registeredUsers[username]) {
    alert("Username sudah digunakan!");
    return;
  }

  // Role dikunci otomatis sebagai "user" demi keamanan
  registeredUsers[username] = {
    username: username,
    password: password,
    role: "user", 
    name: fullName,
  };

  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  alert("Registrasi Berhasil! Silakan login.");
  toggleForm();
}

// 6. Handle Registrasi Admin (Khusus Halaman Terpisah/Secret)
function handleAdminRegister(event) {
  event.preventDefault();

  const fullName = document.getElementById("regFullName").value;
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;
  const secretKey = document.getElementById("adminSecretKey").value;

  // Validasi Kode Rahasia
  if (secretKey !== ADMIN_SECRET_KEY) {
    alert("KODE RAHASIA SALAH! Anda tidak diizinkan mendaftar sebagai admin.");
    return;
  }

  let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {};

  if (demoAccounts[username] || registeredUsers[username]) {
    alert("Username admin sudah terdaftar!");
    return;
  }

  registeredUsers[username] = {
    username: username,
    password: password,
    role: "admin", 
    name: fullName,
  };

  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  alert("Akun Admin Berhasil Dibuat! Mengalihkan ke halaman login...");
  window.location.href = "login.html";
}

// 7. Handle Login
function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {};
  const allAccounts = { ...demoAccounts, ...registeredUsers };
  const account = allAccounts[username];

  if (!account) {
    alert("Username tidak ditemukan!");
    return;
  }

  if (account.password !== password) {
    alert("Password salah!");
    return;
  }

  if (account.role !== role) {
    alert(`Username "${username}" bukan terdaftar sebagai ${role === "admin" ? "Admin" : "Pengguna"}!`);
    return;
  }

  const userData = {
    username: account.username,
    name: account.name,
    role: account.role,
    loginTime: new Date().toISOString(),
  };

  localStorage.setItem("currentUser", JSON.stringify(userData));
  alert(`Login berhasil! Selamat datang, ${account.name}`);
  redirectToDashboard(account.role);
}

// 8. Logout
function handleLogout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// 9. Redirect
function redirectToDashboard(role) {
  if (role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }
}