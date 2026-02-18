// 1. Inisialisasi & Auth Check
document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role !== "admin") {
        alert("Anda harus login sebagai admin!");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("adminName").textContent = currentUser.name;

    loadProducts();
    loadOrders();
    updateDashboard();
    updateClock();
    setInterval(updateClock, 1000);
});

// 2. Data Management
let products = JSON.parse(localStorage.getItem("products")) || [
    { id: 1, name: "Laptop Gaming", price: 15000000, category: "Elektronik", icon: "assets/laptop gaming.jpg" },
    { id: 2, name: "Smartphone", price: 8000000, category: "Elektronik", icon: "assets/smartphone.png" },
    { id: 3, name: "Headphone", price: 1200000, category: "Elektronik", icon: "assets/headphone.png" },
    { id: 4, name: "Kamera", price: 12000000, category: "Elektronik", icon: "assets/kamera.png" },
    { id: 5, name: "Sepatu Sneakers", price: 1500000, category: "Fashion", icon: "assets/sepatu.png" },
    { id: 6, name: "Jam Tangan", price: 2500000, category: "Fashion", icon: "assets/jam.png" },
    { id: 7, name: "Tas Ransel", price: 800000, category: "Fashion", icon: "assets/tas.png" },
    { id: 8, name: "Jaket", price: 1800000, category: "Fashion", icon: "assets/jaket.png" },
    { id: 9, name: "Buku Novel", price: 95000, category: "Buku", icon: "assets/buku1.png" },
    { id: 10, name: "Buku Resep", price: 120000, category: "Buku", icon: "assets/buku2.png" },
];

let orders = JSON.parse(localStorage.getItem("orders")) || [];
let currentOrderFilter = "all";

function saveProducts() { localStorage.setItem("products", JSON.stringify(products)); }
function saveOrders() { localStorage.setItem("orders", JSON.stringify(orders)); }

// 3. Helper Functions
function formatRupiah(angka) { return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
function formatDate(date) {
    return new Date(date).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
}

function updateClock() {
    const now = new Date();
    document.getElementById("currentTime").textContent = now.toLocaleDateString("id-ID", {
        weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
}

// 4. UI Navigation
function showSection(sectionName) {
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    if (event) {
        const activeItem = [...document.querySelectorAll(".nav-item")].find(item => item.getAttribute('onclick').includes(sectionName));
        if (activeItem) activeItem.classList.add("active");
    }

    document.querySelectorAll(".content-section").forEach(section => section.classList.remove("active"));
    document.getElementById(sectionName).classList.add("active");

    const titles = { dashboard: "Dashboard", products: "Kelola Produk", orders: "Database Pesanan", customers: "Daftar Pelanggan" };
    document.getElementById("pageTitle").textContent = titles[sectionName];
    
    if (sectionName === "customers") loadCustomers();
}

// 5. Dashboard Logic
function updateDashboard() {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const uniqueCustomers = new Set(orders.map(o => o.customer)).size;

    document.getElementById("totalProducts").textContent = products.length;
    document.getElementById("totalOrders").textContent = orders.length;
    document.getElementById("totalCustomers").textContent = uniqueCustomers;
    document.getElementById("totalRevenue").textContent = "Rp " + formatRupiah(totalRevenue);

    const recentOrders = orders.slice(-5).reverse();
    const list = document.getElementById("recentOrdersList");
    list.innerHTML = recentOrders.length === 0 ? '<div class="empty-state">Belum ada pesanan</div>' :
        recentOrders.map(order => `
            <div class="order-item">
                <div><strong>${order.id}</strong><p style="color: #7f8c8d; font-size: 12px;">${formatDate(order.date)}</p></div>
                <div><strong>Rp ${formatRupiah(order.total)}</strong><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></div>
            </div>
        `).join("");
}

// 6. Product Management (CRUD)
function loadProducts() {
    const tbody = document.getElementById("productsTableBody");
    tbody.innerHTML = products.length === 0 ? '<tr><td colspan="6" class="empty-state">Belum ada produk</td></tr>' :
        products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><img src="${product.icon}" width="40" height="40" style="object-fit: contain;" onerror="this.src='https://via.placeholder.com/40'"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>Rp ${formatRupiah(product.price)}</td>
            <td class="table-actions">
                <button class="btn-warning" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn-danger" onclick="deleteProduct(${product.id})">Hapus</button>
            </td>
        </tr>
    `).join("");
}

function addProduct(event) {
    event.preventDefault();
    const id = document.getElementById("editProductId").value;
    const productData = {
        name: document.getElementById("productName").value,
        price: parseInt(document.getElementById("productPrice").value),
        category: document.getElementById("productCategory").value,
        icon: document.getElementById("productIcon").value || "assets/default.png"
    };

    if (id) {
        const index = products.findIndex(p => p.id == id);
        products[index] = { ...products[index], ...productData };
    } else {
        const newProduct = { id: Date.now(), ...productData };
        products.push(newProduct);
    }

    saveProducts(); loadProducts(); updateDashboard(); hideAddProductForm();
    alert(id ? "Produk berhasil diperbarui!" : "Produk berhasil ditambahkan!");
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById("productName").value = product.name;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productCategory").value = product.category;
        document.getElementById("productIcon").value = product.icon;
        document.getElementById("editProductId").value = product.id; 
        document.querySelector("#addProductForm h3").textContent = "Edit Produk";
        document.getElementById("addProductForm").style.display = "block";
    }
}

function deleteProduct(productId) {
    if (confirm("Hapus produk ini?")) {
        products = products.filter(p => p.id !== productId);
        saveProducts(); loadProducts(); updateDashboard();
    }
}

function showAddProductForm() {
    document.getElementById("editProductId").value = "";
    document.querySelector("#addProductForm h3").textContent = "Tambah Produk Baru";
    document.getElementById("addProductForm").style.display = "block";
}

function hideAddProductForm() {
    document.getElementById("addProductForm").style.display = "none";
    const form = document.querySelector("#addProductForm form");
    if(form) form.reset();
}

// 7. Orders & Customers - UPDATED WITH PAYMENT METHOD
function loadOrders() {
    const tbody = document.getElementById("ordersTableBody");
    let filtered = currentOrderFilter === "all" ? orders : orders.filter(o => o.status === currentOrderFilter);

    tbody.innerHTML = filtered.length === 0 ? '<tr><td colspan="7" class="empty-state">Belum ada pesanan</td></tr>' :
        filtered.map(order => {
            // Tentukan warna label berdasarkan metode pembayaran
            let paymentBadgeStyle = "background: #7f8c8d;"; // Default (abu-abu)
            if (order.paymentMethod === 'COD') paymentBadgeStyle = "background: #e67e22;"; // Oranye
            if (order.paymentMethod === 'Bank Transfer') paymentBadgeStyle = "background: #2980b9;"; // Biru
            if (order.paymentMethod === 'E-Wallet (OVO/Dana)') paymentBadgeStyle = "background: #8e44ad;"; // Ungu

            return `
            <tr>
                <td>${order.id}</td>
                <td>${formatDate(order.date)}</td>
                <td>${order.customer || "Guest"}</td>
                <td style="font-size: 0.85em; max-width: 250px; line-height: 1.4;">
                    <div style="margin-bottom: 4px;">
                        <span style="${paymentBadgeStyle} color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 0.8em;">
                           💳 ${order.paymentMethod || "Belum dipilih"}
                        </span>
                    </div>
                    <div style="font-weight: bold; color: #2c3e50;">${order.address || "Alamat tidak tersedia"}</div>
                    <div style="color: #27ae60; font-size: 0.9em;">📞 ${order.phone || "-"}</div>
                </td>
                <td>Rp ${formatRupiah(order.total)}</td>
                <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                <td class="table-actions">
                    ${order.status === 'pending' ? `<button class="btn-success" onclick="updateOrderStatus('${order.id}', 'shipped')">Kirim</button>` : ''}
                    ${order.status === 'shipped' ? `<button class="btn-success" onclick="updateOrderStatus('${order.id}', 'completed')">Selesai</button>` : ''}
                    <button class="btn-danger" onclick="deleteOrder('${order.id}')">Hapus</button>
                </td>
            </tr>
            `;
        }).join("");
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) { order.status = newStatus; saveOrders(); loadOrders(); updateDashboard(); }
}

function deleteOrder(orderId) {
    if (confirm("Hapus pesanan ini?")) {
        orders = orders.filter(o => o.id !== orderId);
        saveOrders(); loadOrders(); updateDashboard();
    }
}

function loadCustomers() {
    const tbody = document.getElementById("customersTableBody");
    const customerStats = {};
    orders.forEach(order => {
        const c = order.customer || "Guest";
        if (!customerStats[c]) customerStats[c] = { name: c, count: 0, spent: 0 };
        customerStats[c].count++; customerStats[c].spent += order.total;
    });

    const customers = Object.values(customerStats);
    tbody.innerHTML = customers.length === 0 ? '<tr><td colspan="4" class="empty-state">Belum ada pelanggan</td></tr>' :
        customers.map(c => `<tr><td>${c.name}</td><td>${c.name}</td><td>${c.count}</td><td>Rp ${formatRupiah(c.spent)}</td></tr>`).join("");
}

function filterAdminOrders(status) {
    currentOrderFilter = status;
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    if(event) event.target.classList.add("active");
    loadOrders();
}

function getStatusText(status) {
    return { pending: "Diproses", shipped: "Dikirim", completed: "Selesai" }[status] || status;
}

function logout() {
    if (confirm("Apakah Anda yakin ingin logout?")) {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    }
}