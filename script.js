// 1. DATA PRODUK
const products = JSON.parse(localStorage.getItem("products")) || [
  { id: 1, name: "Sayur Brokoli", price: 25000, category: "Sayur Bunga", icon: "assets/laptop gaming.jpg", description: "Brokoli segar kaya serat dan vitamin C, cocok untuk tumisan." },
  { id: 2, name: "Terong Ungu", price: 17000, category: "Elektronik", icon: "assets/smartphone.png", description: "Terong Ungu Super Fresh! 🍆 Baru datang hari ini! Terongnya panjang-panjang, warna ungu pekat (tanda masih muda & segar), dan dijamin tidak pahit.." },
  { id: 3, name: "Daun Kelor", price: 20700, category: "Elektronik", icon: "assets/headphone.png", description: "Daun Kelor Segar, Baru Petik! 🌿 Kelor kita baru dipanen pagi ini, daunnya hijau royo-royo dan masih sangat segar. Cocok banget buat sayur bening segar atau jamu kesehatan.." },
  { id: 4, name: "Kacang Panjang", price: 27000, category: "Elektronik", icon: "assets/kamera.png", description: "Kacang Panjang Kualitas Super: Rahasia Tumisan Lezat! ✨." },
  { id: 5, name: "Bayam", price: 20500, category: "Fashion", icon: "assets/sepatu.png", description: "Dapatkan Energi Alami dari Si Hijau Bayam! 💪✨." },
  { id: 6, name: "Selada", price: 20000, category: "Fashion", icon: "assets/jam.png", description: "Bikin Salad Ala Resto Sendiri di Rumah! 🥗." },
  { id: 7, name: "Daun Singkong", price: 16000, category: "Fashion", icon: "assets/tas.png", description: "Rahasia Gulai Daun Singkong ala Resto Padang! 🥘✨." },
  { id: 8, name: "Sayur Oyong", price: 18000, category: "Fashion", icon: "assets/jaket.png", description: "Oyong/Gambas Muda – Masak Bening Jadi Makin Segar! 🥣✨." },
  { id: 9, name: "Jagung Manis", price: 15000, category: "Buku", icon: "assets/buku1.png", description: "Jagung Manis Madu – Baru Petik Tadi Pagi! 🌽✨." },
  { id: 10, name: "Paprika Merah", price: 60000, category: "Buku", icon: "assets/buku2.png", description: "Booster Imun Alami dalam Satu Buah Paprika Merah! ❤️✨." },
];

let cart = [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let currentCategory = "Semua";
let currentOrderFilter = "all";
let currentUser = null;
let selectedPaymentMethod = "";

// --- FUNGSI HELPER ---
function formatRupiah(angka) {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDate(date) {
  const options = { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(date).toLocaleDateString("id-ID", options);
}

function generateOrderId() {
  return "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

// --- LOGIKA PRODUK & KATEGORI ---
function getCategories() {
  return ["Semua", ...new Set(products.map((p) => p.category))];
}

function renderCategories() {
  const filterDiv = document.getElementById("categoryFilter");
  if (!filterDiv) return;
  filterDiv.innerHTML = getCategories()
    .map(cat => `<button class="category-btn ${cat === currentCategory ? "active" : ""}" onclick="filterByCategory('${cat}')">${cat}</button>`)
    .join("");
}

function filterByCategory(category) {
  currentCategory = category;
  renderCategories();
  filterProducts();
}

function renderProducts(productsToShow) {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;
  grid.innerHTML = productsToShow
    .map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.icon}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div> 
                <div class="product-price">Rp ${formatRupiah(product.price)}</div>
                <button class="detail-btn" onclick="showProductDetail('${product.name}', '${product.description || 'Produk berkualitas tinggi.'}')" 
                style="background: none; border: 1px solid #27ae60; color: #27ae60; padding: 4px 8px; border-radius: 4px; font-size: 0.75em; margin: 5px 0; cursor: pointer; width: 100%;">
                    Lihat Detail
                </button>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
        </div>
    `).join("");
}

function filterProducts() {
  const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
  let filtered = products;
  if (currentCategory !== "Semua") filtered = filtered.filter(p => p.category === currentCategory);
  if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm));
  renderProducts(filtered);
}

// Fungsi untuk menampilkan deskripsi
function showProductDetail(name, desc) {
  alert("Detail Produk " + name + ":\n\n" + desc);
}

// --- LOGIKA KERANJANG ---
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) { existingItem.quantity++; } 
  else { cart.push({ ...product, quantity: 1 }); }
  updateCart();
}

function updateCart() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const totalPrice = document.getElementById("totalPrice");

  if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    if (cartItems) cartItems.innerHTML = '<div class="empty-cart">Keranjang Anda kosong</div>';
    if (cartTotal) cartTotal.style.display = "none";
  } else {
    if (cartItems) {
      cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${item.icon}" width="30" height="30" style="object-fit: cover;">
                    <div style="font-weight: bold;">${item.name}</div>
                </div>
                <div style="color: #e74c3c;">Rp ${formatRupiah(item.price)}</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Hapus</button>
            </div>
        </div>`).join("");
    }
    if (totalPrice) totalPrice.textContent = formatRupiah(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    if (cartTotal) cartTotal.style.display = "block";
  }
}

function updateQuantity(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) removeFromCart(productId);
    else updateCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

function toggleCart() {
  const modal = document.getElementById("cartModal");
  if (modal) modal.style.display = (modal.style.display === "block" || modal.style.display === "flex") ? "none" : "flex";
}

// --- LOGIKA PEMBAYARAN & DETAIL ALAMAT ---
function checkout() {
  if (cart.length === 0) return alert("Keranjang Anda kosong!");
  
  toggleCart();
  const paymentModal = document.getElementById("paymentModal");
  const summary = document.getElementById("paymentSummary");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (paymentModal) {
    paymentModal.style.display = "flex";
    summary.innerHTML = `<strong>Total Belanja: Rp ${formatRupiah(total)}</strong>`;
  }
}

function selectPayment(method) {
  selectedPaymentMethod = method;
  const items = document.querySelectorAll('.payment-item');
  items.forEach(item => {
    item.classList.remove('active');
    if (item.innerText.includes(method)) item.classList.add('active');
  });
}

function confirmOrder() {
  if (!selectedPaymentMethod) return alert("Silakan pilih metode pembayaran!");

  const address = document.getElementById("shippingAddress")?.value.trim();
  const phone = document.getElementById("shippingPhone")?.value.trim();

  if (!address || !phone) {
    return alert("Mohon lengkapi Alamat Pengiriman dan Nomor Telepon!");
  }

  const orderTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = generateOrderId();

  const newOrder = {
    id: orderId,
    date: new Date().toISOString(),
    customer: currentUser ? currentUser.name : "Guest",
    username: currentUser ? currentUser.username : "guest",
    items: [...cart],
    total: orderTotal,
    paymentMethod: selectedPaymentMethod,
    address: address,
    phone: phone,
    status: "pending",
  };

  // 1. Simpan pesanan ke LocalStorage agar admin bisa melihatnya
  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));
  
  // 2. LOGIKA REDIRECT (Pengalihan Berdasarkan Metode)
  if (selectedPaymentMethod.includes("Bank Transfer")) {
      // Alihkan ke halaman Virtual Account
      alert("Pesanan diterima! Anda akan diarahkan ke halaman Virtual Account.");
      window.location.href = `pembayaran.html?id=${orderId}&total=${orderTotal}&method=VA`;
  } else if (selectedPaymentMethod.includes("E-Wallet")) {
      // Alihkan ke halaman E-Wallet
      alert("Pesanan diterima! Anda akan diarahkan ke halaman pembayaran E-Wallet.");
      window.location.href = `pembayaran.html?id=${orderId}&total=${orderTotal}&method=EWALLET`;
  } else {
      // Untuk COD hanya muncul notifikasi
      alert(`Pesanan Berhasil!\nID: ${newOrder.id}\nMetode: COD`);
  }
  
  // 3. Reset Keranjang & UI
  cart = [];
  updateCart();
  closePayment();
  updateOrdersCount();
}

function closePayment() {
  const modal = document.getElementById("paymentModal");
  if (modal) modal.style.display = "none";
  selectedPaymentMethod = ""; 
  if(document.getElementById("shippingAddress")) document.getElementById("shippingAddress").value = "";
  if(document.getElementById("shippingPhone")) document.getElementById("shippingPhone").value = "";
}

// --- LOGIKA PESANAN ---
function showOrders() {
  const modal = document.getElementById("ordersModal");
  if (modal) {
    modal.style.display = "flex";
    renderOrders();
  }
}

function closeOrders() {
  const modal = document.getElementById("ordersModal");
  if (modal) modal.style.display = "none";
}

function filterOrders(status) {
  currentOrderFilter = status;
  document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      if(btn.getAttribute('onclick').includes(status)) btn.classList.add('active');
  });
  renderOrders();
}

function renderOrders() {
  const ordersList = document.getElementById("ordersList");
  if (!ordersList) return;

  let filteredOrders = orders;
  if (currentOrderFilter !== "all") filteredOrders = orders.filter(o => o.status === currentOrderFilter);

  if (filteredOrders.length === 0) {
    ordersList.innerHTML = '<div class="empty-orders" style="text-align:center; padding:20px;">Belum ada pesanan</div>';
    return;
  }

  ordersList.innerHTML = filteredOrders.map(order => {
    const statusText = { pending: "Diproses", shipped: "Dikirim", completed: "Selesai" }[order.status];
    return `
      <div class="order-card" style="border:1px solid #ddd; margin-bottom:10px; padding:15px; border-radius:8px;">
          <div class="order-header" style="display:flex; justify-content:space-between;">
              <div>
                  <div class="order-id" style="font-weight:bold;">${order.id}</div>
                  <div class="order-date" style="font-size:0.8em; color:gray;">${formatDate(order.date)}</div>
                  <div style="font-size:0.8em; color:#27ae60;">Pembayaran: ${order.paymentMethod}</div>
                  <div style="font-size:0.8em; color:#34495e;">Kirim ke: ${order.address || 'Alamat tidak diisi'} (${order.phone || '-'})</div>
              </div>
              <span class="order-status status-${order.status}" style="padding:5px 10px; border-radius:5px; font-size:0.8em;">${statusText}</span>
          </div>
          <div class="order-items" style="margin: 10px 0;">
              ${order.items.map(item => `
                  <div style="display:flex; justify-content:space-between; font-size:0.9em;">
                      <span>${item.name} x${item.quantity}</span>
                      <span>Rp ${formatRupiah(item.price * item.quantity)}</span>
                  </div>`).join("")}
          </div>
          <div style="text-align:right; font-weight:bold; border-top:1px solid #eee; pt:5px;">Total: Rp ${formatRupiah(order.total)}</div>
      </div>`;
  }).join("");
}

function updateOrdersCount() {
  const countDisplay = document.getElementById("ordersCount");
  if (countDisplay) countDisplay.textContent = orders.length;
}

// --- AUTH & INIT ---
function logout() {
  if (confirm("Apakah Anda yakin ingin logout?")) {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }
  const userNameEl = document.getElementById("userName");
  if (userNameEl) userNameEl.textContent = currentUser.name;
  
  renderCategories();
  renderProducts(products);
  updateOrdersCount();
  updateCart();
});