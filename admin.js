/**
 * Digital Heroes Admin Panel Logic
 * Handles real-time data fetching and CRUD operations via Spring Boot API
 */

document.addEventListener("DOMContentLoaded", () => {
  fetchDashboardStats();
  // Default to dashboard
  switchTab("dashboard");
});

const API_BASE = "/api";

// Tab Switching System
function switchTab(tabName) {
  const tabs = [
    "dashboard",
    "inventory",
    "vendors",
    "orders",
    "customers",
    "analytics",
    "promotions",
    "settings",
  ];
  tabs.forEach((t) => {
    const section = document.getElementById(t + "-section");
    const nav = document.getElementById("nav-" + t);
    if (t === tabName) {
      if (section) section.classList.remove("hidden");
      if (nav) nav.classList.add("active");
    } else {
      if (section) section.classList.add("hidden");
      if (nav) nav.classList.remove("active");
    }
  });

  if (tabName === "dashboard") fetchDashboardStats();
  if (tabName === "inventory") fetchInventory();
  if (tabName === "orders") fetchOrders();
  if (tabName === "customers") fetchCustomers();
  if (tabName === "analytics") fetchAnalytics();
  if (tabName === "vendors") fetchVendorRequests();
  if (tabName === "promotions") populatePromotions();
}

// 1. Dashboard Logic
async function fetchDashboardStats() {
  try {
    const productRes = await fetch(`${API_BASE}/products`);
    const orderRes = await fetch(`${API_BASE}/orders`);

    const products = await productRes.json();
    const orders = await orderRes.json();

    // Calculate Stats
    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Update DOM (Check for existence to avoid errors if not on dashboard)
    const revEl = document.querySelector(
      ".stats-grid .stat-card:nth-child(1) .stat-value",
    );
    if (revEl) {
      revEl.innerText = `$${revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
      document.querySelector(
        ".stats-grid .stat-card:nth-child(2) .stat-value",
      ).innerText = orders.length;
      document.querySelector(
        ".stats-grid .stat-card:nth-child(3) .stat-value",
      ).innerText = new Set(orders.map((o) => o.customer?.email)).size;
    }
  } catch (e) {
    console.error("Dashboard Sync Error:", e);
  }
}

let allAdminOrders = [];

async function fetchOrders() {
  const tableBody = document.querySelector("#orders-table tbody");
  if (!tableBody) return;
  tableBody.innerHTML = '<tr><td colspan="6">Loading orders...</td></tr>';
  try {
    const response = await fetch(`${API_BASE}/orders`);
    allAdminOrders = await response.json();
    tableBody.innerHTML = "";
    if (allAdminOrders.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="6" style="text-align:center;">No orders yet.</td></tr>';
      return;
    }
    allAdminOrders.forEach((o) => {
      const row = document.createElement("tr");
      const status = o.status || "Processing";
      const statusStyle =
        status === "Delivered"
          ? "color: #166534; background: #dcfce7;"
          : status === "Shipped"
            ? "color: #854d0e; background: #fef08a;"
            : status === "Cancelled"
              ? "color: #991b1b; background: #fee2e2;"
              : "color: #0284c7; background: #e0f2fe;";

      row.innerHTML = `
                <td>#${o._id ? o._id.slice(-6).toUpperCase() : "N/A"}</td>
                <td><div style="font-weight: 500;">${o.customer?.name || "Guest"}</div><div style="font-size: 0.85rem; color: var(--text-gray);">${o.customer?.email || "No email"}</div></td>
                <td><div style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${o.customer?.address || "N/A"}">${o.customer?.address || "N/A"}</div></td>
                <td>${new Date().toLocaleDateString()}</td>
                <td>$${o.totalAmount?.toFixed(2) || "0.00"}</td>
                <td><span style="padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; ${statusStyle}">${status}</span></td>
                <td><button class="cta-button btn-small" style="background:#3b82f6;" onclick="viewOrder('${o._id}')"><i class="fas fa-eye"></i> View</button></td>
            `;
      tableBody.appendChild(row);
    });
  } catch (e) {
    tableBody.innerHTML =
      '<tr><td colspan="6" style="color:red;">Error loading orders.</td></tr>';
  }
}

function viewOrder(orderId) {
  const order = allAdminOrders.find((o) => o._id === orderId);
  if (!order) return;

  document.getElementById("od-title").textContent =
    "Order #" + orderId.slice(-6).toUpperCase();
  document.getElementById("od-name").textContent =
    order.customer?.name || "Guest";
  document.getElementById("od-email").textContent =
    order.customer?.email || "N/A";
  document.getElementById("od-payment").textContent =
    order.paymentMethod || "Credit Card (Default)";
  document.getElementById("od-date").textContent = order.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : new Date().toLocaleString();
  document.getElementById("od-address").textContent =
    order.customer?.address || "No address provided";
  document.getElementById("od-total").textContent =
    "$" + (order.totalAmount || 0).toFixed(2);

  // Set Order Status selectors
  document.getElementById("od-active-id").value = order._id;
  const statusSelect = document.getElementById("od-status");
  if (statusSelect) {
    statusSelect.value = order.status || "Processing";
  }

  const itemsContainer = document.getElementById("od-items");
  itemsContainer.innerHTML = "";

  if (order.items && order.items.length > 0) {
    order.items.forEach((item) => {
      itemsContainer.innerHTML += `
                <div style="display: flex; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                    <img src="${item.imageUrl}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 15px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 600;">${item.name}</div>
                        <div style="font-size: 0.9rem; color: var(--text-gray);">Qty: ${item.quantity} x $${item.price.toFixed(2)}</div>
                    </div>
                    <div style="font-weight: bold;">$${(item.quantity * item.price).toFixed(2)}</div>
                </div>
            `;
    });
  } else {
    itemsContainer.innerHTML = "<p>No items found.</p>";
  }

  document.getElementById("order-details-modal").classList.add("active");
}

async function updateOrderStatus(newStatus) {
  const orderId = document.getElementById("od-active-id").value;
  if (!orderId) return;

  try {
    const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      adminNotify(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh table
    } else {
      adminNotify("Failed to update status");
    }
  } catch (err) {
    adminNotify("Network error while updating status");
  }
}

async function fetchCustomers() {
  const tableBody = document.querySelector("#customers-table tbody");
  if (!tableBody) return;
  tableBody.innerHTML = '<tr><td colspan="4">Loading customers...</td></tr>';
  try {
    const response = await fetch(`${API_BASE}/orders`);
    const orders = await response.json();

    // Group orders by email to calculate customer stats
    const customersMap = {};
    orders.forEach((o) => {
      if (!o.customer || !o.customer.email) return;
      const email = o.customer.email;
      if (!customersMap[email]) {
        customersMap[email] = {
          name: o.customer.name,
          email: email,
          address: o.customer.address,
          orders: 0,
          spent: 0,
        };
      }
      // Always take the most recent address (assuming orders are fetched newest first or vice versa, this simply takes the latest iteration)
      if (o.customer.address) customersMap[email].address = o.customer.address;
      customersMap[email].orders += 1;
      customersMap[email].spent += o.totalAmount || 0;
    });

    tableBody.innerHTML = "";
    const customers = Object.values(customersMap);
    if (customers.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="5" style="text-align:center;">No customers yet.</td></tr>';
      return;
    }
    customers.forEach((c) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td style="font-weight: 500;">${c.name}</td>
                <td><a href="mailto:${c.email}" style="color: var(--accent-color); text-decoration: none;">${c.email}</a></td>
                <td><div style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${c.address || "N/A"}">${c.address || "N/A"}</div></td>
                <td><span style="background: #f1f5f9; padding: 4px 10px; border-radius: 20px; font-weight: 600;">${c.orders}</span></td>
                <td style="font-weight: bold; color: var(--secondary-color);">$${c.spent.toFixed(2)}</td>
            `;
      tableBody.appendChild(row);
    });
  } catch (e) {
    tableBody.innerHTML =
      '<tr><td colspan="5" style="color:red;">Error loading customers.</td></tr>';
  }
}

let analyticsChart = null;

async function fetchAnalytics() {
  try {
    const response = await fetch(`${API_BASE}/orders`);
    const orders = await response.json();

    const filter = document.getElementById("analytics-filter")
      ? document.getElementById("analytics-filter").value
      : "week";
    const now = new Date();
    const dNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let labels = [];
    let revenues = [];

    if (filter === "today") {
      for (let i = 0; i <= now.getHours(); i++) {
        labels.push(i + ":00");
        revenues.push(0);
      }
      orders.forEach((o) => {
        const od = new Date(o.createdAt || new Date());
        if (od.toDateString() === now.toDateString()) {
          const h = od.getHours();
          if (h <= now.getHours()) revenues[h] += o.totalAmount || 0;
        }
      });
    } else if (filter === "week") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(dNow);
        d.setDate(d.getDate() - i);
        labels.push(
          d.toLocaleDateString("default", { month: "short", day: "numeric" }),
        );
        revenues.push(0);
      }
      orders.forEach((o) => {
        const od = new Date(o.createdAt || new Date());
        const dOd = new Date(od.getFullYear(), od.getMonth(), od.getDate());
        const diffDays = Math.round((dNow - dOd) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 6) {
          const idx = 6 - diffDays;
          revenues[idx] += o.totalAmount || 0;
        }
      });
    } else if (filter === "month") {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(dNow);
        d.setDate(d.getDate() - i);
        labels.push(
          d.toLocaleDateString("default", { month: "short", day: "numeric" }),
        );
        revenues.push(0);
      }
      orders.forEach((o) => {
        const od = new Date(o.createdAt || new Date());
        const dOd = new Date(od.getFullYear(), od.getMonth(), od.getDate());
        const diffDays = Math.round((dNow - dOd) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 29) {
          const idx = 29 - diffDays;
          revenues[idx] += o.totalAmount || 0;
        }
      });
    } else if (filter === "year") {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(
          d.toLocaleString("default", { month: "short", year: "numeric" }),
        );
        revenues.push(0);
      }
      orders.forEach((o) => {
        const od = new Date(o.createdAt || new Date());
        const monthsAgo =
          (now.getFullYear() - od.getFullYear()) * 12 +
          (now.getMonth() - od.getMonth());
        if (monthsAgo >= 0 && monthsAgo <= 11) {
          const idx = 11 - monthsAgo;
          revenues[idx] += o.totalAmount || 0;
        }
      });
    }

    // Calculate total sales for the selected period
    let totalSales = revenues.reduce((a, b) => a + b, 0);
    document.getElementById("analytics-total").textContent =
      `Total Sales: $${totalSales.toFixed(2)}`;

    const ctx = document.getElementById("revenueChart").getContext("2d");
    if (analyticsChart) {
      analyticsChart.destroy();
    }

    let labelText = "Daily Revenue ($)";
    if (filter === "today") labelText = "Hourly Revenue ($)";
    if (filter === "year") labelText = "Monthly Revenue ($)";

    analyticsChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: labelText,
            data: revenues,
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  } catch (e) {
    console.error("Error loading analytics:", e);
  }
}

// 2. Inventory Logic (Fetch/Delete)
let allAdminProducts = []; // Store products globally for editing

async function fetchInventory() {
  const tableBody = document.querySelector("#inventory-table tbody");
  if (!tableBody) return;
  tableBody.innerHTML = '<tr><td colspan="6">Loading inventory...</td></tr>';

  try {
    const response = await fetch(`${API_BASE}/products?includePending=true`);
    allAdminProducts = await response.json();

    tableBody.innerHTML = "";
    if (allAdminProducts.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="6" style="text-align:center;">No inventory items loaded.</td></tr>';
      return;
    }

    allAdminProducts.forEach((p) => {
      const row = document.createElement("tr");
      const isApproved = p.isApproved !== false;
      const nameBadge = isApproved
        ? ""
        : ' <span style="font-size:0.7rem; background:#fef3c7; color:#92400e; padding:2px 6px; border-radius:10px; font-weight:bold;">PENDING</span>';

      row.innerHTML = `
                <td>#${p._id ? p._id.slice(-4).toUpperCase() : "N/A"}</td>
                <td><div style="font-weight:600;">${p.name}${nameBadge}</div><div style="font-size:0.8rem; color:var(--text-gray);">Rating: ${p.rating?.toFixed(1) || "N/A"} ⭐</div></td>
                <td>${p.category}</td>
                <td>$${p.price.toFixed(2)}</td>
                <td><span style="color:var(--accent-color); font-weight:500;">${p.vendorName || "Digital Heroes"}</span></td>
                <td>
                    ${
                      !isApproved
                        ? `
                    <button class="cta-button btn-small" style="background:#10b981; margin-right:5px;" onclick="approveProduct('${p._id}')" title="Approve Submission">
                        <i class="fas fa-check-circle"></i>
                    </button>`
                        : ""
                    }
                    <button class="cta-button btn-small" style="background:#3b82f6; margin-right: 5px;" onclick="editProduct('${p._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="cta-button btn-small" style="background:#ef4444;" onclick="deleteProduct('${p._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  } catch (e) {
    tableBody.innerHTML =
      '<tr><td colspan="6" style="color:red;">Error connecting to API.</td></tr>';
  }

  // Also update promotions dropdowns
  populatePromotions();
}

async function populatePromotions() {
  const highlightsSelect = document.getElementById("admin-highlights-select");
  const dealSelect = document.getElementById("admin-deal-select");
  if (!highlightsSelect || !dealSelect) return;

  if (allAdminProducts.length === 0) {
    try {
      const res = await fetch(`${API_BASE}/products`);
      allAdminProducts = await res.json();
    } catch (e) {
      console.error("Failed to load products for promotions", e);
      return;
    }
  }

  let savedHighlights = [];
  let savedDeal = "auto";
  try {
    savedHighlights =
      JSON.parse(localStorage.getItem("dh_admin_highlights")) || [];
    savedDeal = localStorage.getItem("dh_admin_deal") || "auto";
  } catch (e) {}

  highlightsSelect.innerHTML = "";
  dealSelect.innerHTML =
    '<option value="auto">Automatic (Daily Mathematical Rotation)</option>';

  allAdminProducts.forEach((p) => {
    const optH = document.createElement("option");
    optH.value = p._id;
    optH.textContent = `${p.name} ($${p.price.toFixed(2)})`;
    if (savedHighlights.includes(p._id)) optH.selected = true;
    highlightsSelect.appendChild(optH);

    const optD = document.createElement("option");
    optD.value = p._id;
    optD.textContent = `${p.name} ($${p.price.toFixed(2)})`;
    if (savedDeal === p._id) optD.selected = true;
    dealSelect.appendChild(optD);
  });
}

function savePromotions(event) {
  event.preventDefault();
  const highlightsSelect = document.getElementById("admin-highlights-select");
  const dealSelect = document.getElementById("admin-deal-select");

  if (highlightsSelect) {
    const selected = Array.from(highlightsSelect.selectedOptions).map(
      (opt) => opt.value,
    );
    if (selected.length > 4) {
      adminNotify("You can only select up to 4 highlights!");
      return;
    }
    localStorage.setItem("dh_admin_highlights", JSON.stringify(selected));
  }

  if (dealSelect) {
    localStorage.setItem("dh_admin_deal", dealSelect.value);
  }

  adminNotify("Promotions saved successfully!");
}

async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Product deleted successfully");
      fetchInventory();
    }
  } catch (e) {
    showToast("Error deleting product");
  }
}

async function approveProduct(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: true }),
    });
    if (res.ok) {
      showToast("Listing approved successfully!");
      fetchInventory(); // Refresh listing to drop 'pending' badge and approval icon
    }
  } catch (e) {
    showToast("System failed to authorize item.");
  }
}

// 3. Add Product Modal & Submission
let editingProductId = null;

function toggleAddProductModal(isEdit = false) {
  const modal = document.getElementById("add-product-modal");
  const title = modal.querySelector(".modal-title");

  if (!modal.classList.contains("active")) {
    // We are opening it
    if (!isEdit) {
      title.textContent = "Add New Product";
      document.getElementById("add-product-form").reset();
      editingProductId = null;
    }
  }

  modal.classList.toggle("active");
}

function editProduct(id) {
  const product = allAdminProducts.find((p) => p._id === id);
  if (!product) return;

  document.getElementById("p-name").value = product.name;
  document.getElementById("p-category").value = product.category;
  document.getElementById("p-price").value = product.price;
  document.getElementById("p-image").value = product.imageUrl;

  editingProductId = id;

  const modal = document.getElementById("add-product-modal");
  modal.querySelector(".modal-title").textContent = "Edit Product";
  toggleAddProductModal(true);
}

async function handleProductSubmission(event) {
  event.preventDefault();

  const product = {
    name: document.getElementById("p-name").value,
    category: document.getElementById("p-category").value,
    price: parseFloat(document.getElementById("p-price").value),
    imageUrl: document.getElementById("p-image").value,
    originalPrice: parseFloat(document.getElementById("p-price").value) * 1.2,
    rating: 4.5,
    reviews: 0,
  };

  try {
    let res;
    if (editingProductId) {
      // Update existing
      res = await fetch(`${API_BASE}/products/${editingProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
    } else {
      // Add new
      res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
    }

    if (res.ok) {
      showToast(
        editingProductId
          ? "Product updated successfully!"
          : "Product added successfully!",
      );
      toggleAddProductModal(true); // close it
      fetchInventory();
    }
  } catch (e) {
    showToast("Error saving product");
  }
}

// Utility to notify (inherited from script.js if available)
function adminNotify(msg) {
  if (typeof showToast === "function") {
    showToast(msg);
  } else {
    alert(msg);
  }
}

async function fetchVendorRequests() {
  const tableBody = document.querySelector("#vendors-table tbody");
  if (!tableBody) return;
  tableBody.innerHTML =
    '<tr><td colspan="5" style="text-align:center; padding:20px;"><i class="fas fa-spinner fa-spin" style="font-size:1.5rem; color:var(--accent-color);"></i><br>Loading vendor submissions...</td></tr>';

  let pendings = [];

  // Primary: Try to load from the live API
  try {
    const response = await fetch(`${API_BASE}/products?includePending=true`);
    if (response.ok) {
      const products = await response.json();
      // Fix: use != true to catch false, null, undefined - all count as pending
      pendings = products.filter(
        (p) =>
          p.isApproved != true &&
          p.vendorName &&
          p.vendorName !== "Digital Heroes Official",
      );
    }
  } catch (e) {
    console.warn("API offline, falling back to localStorage submissions.");
  }

  // Fallback: Load from localStorage (submissions stored by sell.html when offline)
  try {
    const localSubmissions = JSON.parse(
      localStorage.getItem("dh_vendor_submissions") || "[]",
    );
    // Merge, avoiding duplicates by name
    const existingNames = pendings.map((p) => p.name);
    localSubmissions.forEach((s) => {
      if (!existingNames.includes(s.name)) pendings.push(s);
    });
  } catch (e) {}

  tableBody.innerHTML = "";

  if (pendings.length === 0) {
    tableBody.innerHTML = `
            <tr><td colspan="5" style="text-align:center; padding:40px;">
                <div style="font-size:2.5rem; margin-bottom:10px;">✅</div>
                <div style="font-weight:bold; color:var(--text-gray);">No pending vendor submissions</div>
                <div style="font-size:0.9rem; color:var(--text-gray); margin-top:5px;">All applications have been reviewed. New requests will appear here automatically.</div>
            </td></tr>
        `;
    return;
  }

  pendings.forEach((p, index) => {
    const row = document.createElement("tr");
    const submitted =
      p.submittedAt || p.createdAt
        ? new Date(p.submittedAt || p.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

    row.innerHTML = `
            <td>
                <div style="font-weight:600;">${submitted}</div>
                <div style="font-size:0.8rem; color:var(--text-gray);">ID: ${p._id ? p._id.slice(-6).toUpperCase() : "REQ" + index.toString().padStart(3, "0")}</div>
            </td>
            <td>
                <div style="font-weight:bold; color:var(--accent-color); font-size:1rem;">${p.vendorName || p.vendor || "Unknown Vendor"}</div>
                <div style="font-size:0.8rem; color:var(--text-gray);">${p.vendorEmail || "No email provided"}</div>
            </td>
            <td>
                <div style="font-weight:600;">${p.name}</div>
                <div style="margin-top:3px;"><span style="font-weight:bold; color:#10b981; font-size:0.95rem;">$${parseFloat(p.price).toFixed(2)}</span></div>
            </td>
            <td><span style="background:#e0f2fe; color:#0284c7; padding:4px 10px; border-radius:20px; font-size:0.82rem; font-weight:600;">${p.category}</span></td>
            <td>
                <button class="cta-button btn-small" style="background:#10b981; color:#fff; margin-right:5px; margin-bottom:5px;" onclick="executePartnerAction('${p._id || ""}', 'approve', '${p.name.replace(/'/g, "\\'")}')">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="cta-button btn-small" style="background:#ef4444; color:#fff;" onclick="executePartnerAction('${p._id || ""}', 'reject', '${p.name.replace(/'/g, "\\'")}')">
                    <i class="fas fa-times"></i> Reject
                </button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

async function executePartnerAction(id, action, prodName) {
  if (
    action === "reject" &&
    !confirm("Rejecting this submission will permanently remove it. Proceed?")
  )
    return;

  try {
    // Path A: Real Database Entity
    if (id && id.length > 5) {
      const method = action === "approve" ? "PUT" : "DELETE";
      const opts =
        method === "PUT"
          ? {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ isApproved: true }),
            }
          : { method };

      const res = await fetch(`${API_BASE}/products/${id}`, opts);
      if (res.ok) {
        adminNotify(
          action === "approve"
            ? "✅ Vendor listing approved & now LIVE!"
            : "🗑️ Submission rejected.",
        );
        fetchVendorRequests();
        return;
      }
    }

    // Path B: Local Submission Recovery System
    if (prodName) {
      const subs = JSON.parse(
        localStorage.getItem("dh_vendor_submissions") || "[]",
      );
      const localIdx = subs.findIndex((s) => s.name === prodName);

      if (localIdx !== -1) {
        const targetSub = subs[localIdx];

        if (action === "approve") {
          // Propagate to physical datastore if possible
          try {
            await fetch(`${API_BASE}/products`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...targetSub, isApproved: true }),
            });
          } catch (netErr) {
            console.warn(
              "Upstream propagation failed, handling locally.",
              netErr,
            );
          }
        }

        // Excise from pending buffer post-resolution
        subs.splice(localIdx, 1);
        localStorage.setItem("dh_vendor_submissions", JSON.stringify(subs));

        adminNotify(
          action === "approve"
            ? "✅ Locally approved and released!"
            : "🗑️ Local submission deleted.",
        );
        fetchVendorRequests();
        return;
      }
    }

    adminNotify("⚠️ Item context was lost. Refresh and try again.");
  } catch (e) {
    console.error(e);
    adminNotify("Action failed. Contact administrator.");
  }
}

// --- NEW FEATURES ---

function filterTable(tableId, query) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const rows = table.querySelectorAll("tbody tr");
  const lowerQuery = query.toLowerCase();

  rows.forEach((row) => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(lowerQuery) ? "" : "none";
  });
}

function exportTableToCSV(tableId, filename) {
  const table = document.getElementById(tableId);
  if (!table) return;

  let csv = [];
  const rows = table.querySelectorAll("tr");

  for (let i = 0; i < rows.length; i++) {
    if (rows[i].style.display === "none") continue;

    let row = [],
      cols = rows[i].querySelectorAll("td, th");

    for (let j = 0; j < cols.length; j++) {
      let data = cols[j].innerText
        .replace(/(\r\n|\n|\r)/gm, " ")
        .replace(/"/g, '""');
      if (data.toLowerCase() === "actions") continue;
      // Skip action buttons
      if (
        i > 0 &&
        cols.length === rows[0].querySelectorAll("th").length &&
        j === cols.length - 1 &&
        tableId !== "customers-table"
      )
        continue;
      row.push('"' + data + '"');
    }
    csv.push(row.join(","));
  }

  const csvFile = new Blob([csv.join("\\n")], { type: "text/csv" });
  const downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

document.addEventListener("DOMContentLoaded", () => {
  const sn = localStorage.getItem("dh_store_name");
  const se = localStorage.getItem("dh_store_email");
  if (sn) {
    const nameInput = document.getElementById("store-name-input");
    if (nameInput) nameInput.value = sn;
    const logos = document.querySelectorAll(".logo");
    logos.forEach((l) => {
      if (l.tagName !== "A") l.textContent = sn;
    });
  }
  if (se) {
    const emailInput = document.getElementById("store-email-input");
    if (emailInput) emailInput.value = se;
  }
});

function saveSettings(e) {
  e.preventDefault();
  const sn = document.getElementById("store-name-input").value;
  const se = document.getElementById("store-email-input").value;
  localStorage.setItem("dh_store_name", sn);
  localStorage.setItem("dh_store_email", se);

  const logos = document.querySelectorAll(".logo");
  logos.forEach((l) => {
    if (l.tagName !== "A") l.textContent = sn;
  });

  adminNotify("Settings saved successfully!");
}
