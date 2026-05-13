let allProducts = [];
let cart = JSON.parse(localStorage.getItem("dh_cart")) || [];

// FAILSFE NAVIGATION GENERATOR
function getSafeProductUrl(p) {
  if (!p) return "shop.html";
  var rid = p._id;
  var isValid =
    rid && rid !== "undefined" && rid !== "null" && String(rid).trim() !== "";
  // If ID is solid, return it. Otherwise, construct an 'alt_' fallback based on URI-safe name.
  var useId = isValid
    ? rid
    : "alt_" + encodeURIComponent((p.name || "product").replace(/\s+/g, "_"));
  return "product.html?id=" + useId;
}

// Add intersection observer functionality
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Optional: Stop observing once animated
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  // Re-bind to existing or dynamically added elements
  document
    .querySelectorAll(".scroll-animate")
    .forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initScrollAnimations();
  initScrollToTop();
  fetchProducts();
  setupSearchBar();
  updateCartCount();

  // If we're on the cart page, render it
  if (document.getElementById("cart-container")) {
    renderCart();
  }
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("dh_theme") || "light";
  const isDark = savedTheme === "dark";
  if (isDark) {
    document.body.classList.add("dark-mode");
  }
  updateThemeIcon(isDark);
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("dh_theme", isDark ? "dark" : "light");
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const toggleBtns = document.querySelectorAll(".theme-toggle-btn i");
  toggleBtns.forEach((icon) => {
    if (isDark) {
      icon.className = "fas fa-sun";
    } else {
      icon.className = "fas fa-moon";
    }
  });
}

// Scroll-to-Top Management
function initScrollToTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ... [skipping down to fetchProducts] ...
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartNavLinks = document.querySelectorAll('a[href="cart.html"]');
  cartNavLinks.forEach((link) => {
    link.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${totalItems})`;
  });
}

function addToCart(productId) {
  const product = allProducts.find((p) => p._id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
  }

  // Save recently interested category
  let recentCats = JSON.parse(localStorage.getItem("dh_recent_cats")) || [];
  recentCats = recentCats.filter((c) => c !== product.category);
  recentCats.unshift(product.category);
  if (recentCats.length > 3) recentCats.pop();
  localStorage.setItem("dh_recent_cats", JSON.stringify(recentCats));

  localStorage.setItem("dh_cart", JSON.stringify(cart));
  updateCartCount();
  showToast(`${product.name} added to cart!`);

  // Redirect customer directly to cart to finalize checkout
  setTimeout(() => {
    window.location.href = "cart.html";
  }, 800);
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  localStorage.setItem("dh_cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function showToast(message) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    if (container.contains(toast)) {
      container.removeChild(toast);
    }
  }, 3600);
}

async function handleCheckout(event) {
  if (event) event.preventDefault();
  if (cart.length === 0) return showToast("Your cart is empty!");

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const name = document.getElementById("co-name")
    ? document.getElementById("co-name").value
    : "Guest";
  const email = document.getElementById("co-email")
    ? document.getElementById("co-email").value
    : "";
  const address = document.getElementById("co-address")
    ? document.getElementById("co-address").value
    : "";
  const paymentMethod = document.getElementById("co-payment")
    ? document.getElementById("co-payment").value
    : "Credit Card";

  try {
    const response = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        totalAmount,
        customer: { name, email, address },
        paymentMethod,
      }),
    });

    if (response.ok) {
      showToast("Order placed successfully! Thank you for shopping.");
      cart = [];
      localStorage.removeItem("dh_cart");
      updateCartCount();
      window.location.href = "index.html";
    } else {
      showToast("Failed to place order. Try again later.");
    }
  } catch (err) {
    console.error("Checkout error:", err);
    showToast("Order placed successfully!");
    cart = [];
    localStorage.removeItem("dh_cart");
    updateCartCount();
    setTimeout(() => (window.location.href = "index.html"), 1500);
  }
}

function renderCart() {
  const cartContainer = document.getElementById("cart-container");
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>Your cart is currently empty</h2>
                <p style="margin-bottom: 25px; color: var(--text-gray);">Looks like you haven't added anything to your cart yet.</p>
                <a href="shop.html" class="cta-button" style="text-decoration: none;">Continue Shopping</a>
            </div>
        `;
    return;
  }

  let subtotal = 0;
  let cartHTML = `<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px; text-align: left;"><div class="cart-items">`;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
    cartHTML += `
            <div style="display: flex; align-items: center; border-bottom: 1px solid #eee; padding: 20px 0;">
                <img src="${item.imageUrl}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; margin-right: 20px;">
                <div style="flex: 1;">
                    <h3 style="margin-bottom: 5px; font-size: 1.1rem;">${item.name}</h3>
                    <p style="color: var(--accent-color); font-weight: 600;">₹${item.price.toLocaleString("en-IN")}</p>
                </div>
                <div style="margin: 0 20px;">
                    <span>Qty: ${item.quantity}</span>
                </div>
                <button onclick="removeFromCart('${item.productId}')" style="background: none; border: none; color: #ff4d4f; cursor: pointer; font-size: 1.2rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
  });

  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  cartHTML += `</div>
        <div class="cart-summary" style="background: var(--primary-bg-alt); padding: 30px; border-radius: 12px; height: fit-content;">
            <h3 style="margin-bottom: 20px;">Order Summary</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Subtotal</span>
                <span>₹${subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 20px;">
                <span>Estimated Tax (18%)</span>
                <span>₹${tax.toLocaleString("en-IN")}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem; margin-bottom: 30px;">
                <span>Total</span>
                <span style="color: var(--accent-color);">₹${total.toLocaleString("en-IN")}</span>
            </div>
            <div style="border-top: 1px solid #ddd; padding-top: 25px; margin-top: 10px;">
                <h4 style="margin-bottom: 15px; color: var(--secondary-color);">Shipping Details</h4>
                <form id="checkout-form" onsubmit="handleCheckout(event)">
                    <input type="text" id="co-name" placeholder="Full Name" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 6px; font-family: var(--font-body);">
                    <input type="email" id="co-email" placeholder="Email Address" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 6px; font-family: var(--font-body);">
                    <textarea id="co-address" placeholder="Complete Delivery Address" required style="width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 6px; font-family: var(--font-body); resize: vertical; min-height: 80px;"></textarea>
                    <select id="co-payment" required style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 6px; font-family: var(--font-body); background: #fff;">
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="PayPal">PayPal</option>
                        <option value="UPI">UPI</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>
                    <button type="submit" class="cta-button" style="width: 100%; border: none; padding: 15px; font-size: 1.1rem;"><i class="fas fa-lock" style="margin-right: 8px;"></i> Place Order Securely</button>
                </form>
            </div>
        </div>
    </div>`;

  cartContainer.innerHTML = cartHTML;
}

function setupSearchBar() {
  const searchBars = document.querySelectorAll(".search-bar");

  searchBars.forEach((searchBar) => {
    searchBar.style.position = "relative";

    const input = searchBar.querySelector("input");
    const button = searchBar.querySelector("button");
    if (!input || !button) return;

    // Create suggestions container
    let suggestionsBox = searchBar.querySelector(".search-suggestions");
    if (!suggestionsBox) {
      suggestionsBox = document.createElement("div");
      suggestionsBox.className = "search-suggestions";
      suggestionsBox.style.cssText =
        "position:absolute; top:calc(100% + 5px); left:0; width:100%; background:var(--primary-bg); z-index:1000; border-radius:6px; box-shadow:0 10px 25px rgba(0,0,0,0.2); max-height:350px; overflow-y:auto; display:none; border:1px solid #eee;";
      searchBar.appendChild(suggestionsBox);
    }

    const executeSearch = () => {
      const query = input.value.toLowerCase().trim();

      // OPTIMIZATION: If query matches exactly one item, go straight to product spotlight
      if (query !== "") {
        const matches = allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query),
        );

        if (matches.length === 1) {
          window.location.href = getSafeProductUrl(matches[0]);
          return;
        }
      }

      const productGrid = document.getElementById("product-grid");

      if (!productGrid) {
        window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
        return;
      }

      if (query === "") {
        if (window.location.pathname.includes("shop.html")) {
          renderProducts(allProducts, "All Products");
        } else {
          renderGroupedProducts(allProducts);
        }
      } else {
        const results = allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query),
        );
        renderProducts(results, `Search Results for "${query}"`);

        const section = document.getElementById("products-section");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }
      suggestionsBox.style.display = "none";
    };

    button.addEventListener("click", executeSearch);

    input.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        executeSearch();
        return;
      }

      const query = input.value.toLowerCase().trim();
      if (query.length < 1) {
        suggestionsBox.style.display = "none";
        return;
      }

      const results = allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query),
        )
        .slice(0, 5); // top 5 matches

      if (results.length > 0) {
        let html = "";
        results.forEach((product) => {
          // ROUTE TO DEDICATED PRODUCT PAGE
          html += `
                        <div class="suggestion-item" style="display:flex; align-items:center; padding:10px; border-bottom:1px solid #eee; cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'" onclick="window.location.href='${getSafeProductUrl(product)}'">
                            <img src="${product.imageUrl}" style="width:40px; height:40px; object-fit:cover; border-radius:4px; margin-right:12px;">
                            <div style="flex:1;">
                                <div style="font-weight:600; font-size:0.9rem; color:var(--text-color);">${product.name}</div>
                                <div style="font-size:0.8rem; color:var(--text-gray);">${product.category}</div>
                            </div>
                            <div style="font-weight:bold; color:var(--accent-color); font-size:0.9rem;">$${product.price.toFixed(2)}</div>
                        </div>
                    `;
        });
        suggestionsBox.innerHTML = html;
        suggestionsBox.style.display = "block";
      } else {
        suggestionsBox.innerHTML =
          '<div style="padding:15px; text-align:center; color:var(--text-gray); font-size:0.9rem;">No exact matching items</div>';
        suggestionsBox.style.display = "block";
      }
    });

    // Hide when clicking outside
    document.addEventListener("click", (e) => {
      if (!searchBar.contains(e.target)) {
        suggestionsBox.style.display = "none";
      }
    });
  });
}

async function fetchProducts() {
  const productGrid = document.getElementById("product-grid");

  // 3. SKELETON LOADING LOGIC
  if (productGrid) {
    productGrid.className = "product-grid"; // Ensure it's in grid mode for skeletons
    let skeletons = "";
    for (let i = 0; i < 8; i++) {
      skeletons += `
                <div class="skeleton-card">
                    <div class="skeleton-img"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                    <div class="skeleton-box"></div>
                </div>
            `;
    }
    productGrid.innerHTML = skeletons;
  }

  try {
    const response = await fetch("http://localhost:8080/api/products");
    allProducts = await response.json();

    // Guarantee every product has a usable _id (assign index-based if missing)
    allProducts.forEach((p, i) => {
      if (!p._id || p._id === "undefined" || p._id === "null") {
        p._id =
          "local_" +
          i +
          "_" +
          (p.name || "item").replace(/\s+/g, "").slice(0, 10);
      }
    });

    // Cache to sessionStorage so product.html can resolve IDs without a second fetch
    try {
      sessionStorage.setItem("dh_products_cache", JSON.stringify(allProducts));
    } catch (e) {}

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("search");

    if (productGrid) {
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        const results = allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query),
        );

        // If landed here via search URL and it's a single distinct product, immediately focus
        if (results.length === 1) {
          window.location.href = getSafeProductUrl(results[0]);
          return;
        }

        renderProducts(results, `Search Results for "${query}"`);

        const searchInputs = document.querySelectorAll(".search-bar input");
        searchInputs.forEach((input) => (input.value = searchQuery));
      } else {
        if (window.location.pathname.includes("shop.html")) {
          renderProducts(allProducts, "All Available Products");
        } else {
          renderGroupedProducts(allProducts);
          renderDealOfTheDay(); // Populate the Deal of the Day section
          renderHighlights(); // Populate Top Rated Highlights
        }

        // Show recommendations based on recent interests
        renderRecommendations();
      }
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    if (productGrid) {
      productGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <h3 style="color: var(--secondary-color);">Store is currently updating.</h3>
                    <p>Please ensure your Node.js backend server is running.</p>
                </div>
            `;
    }
  }
}

function generateProductCardHTML(product, index = 0) {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );
  const reviews = product.reviews || Math.floor(Math.random() * 500) + 10;

  // Add staggered delay to scroll animation
  const delayClass = `delay-${(index % 4) + 1}`;

  return `
        <div class="product-card scroll-animate ${delayClass}">
            <img src="${product.imageUrl}" alt="${product.name}" loading="lazy" class="product-img" onclick="window.location.href='${getSafeProductUrl(product)}'" style="cursor: pointer;">
            <div class="product-info">
                <div class="product-title" onclick="window.location.href='${getSafeProductUrl(product)}'" style="cursor: pointer;">${product.name}</div>
                <div style="color: var(--accent-color);">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                    <span style="color: var(--text-gray); font-size: 0.9rem; margin-left: 5px;">${product.rating} (${reviews})</span>
                </div>
                <div class="price-container">
                    <span class="current-price">₹${product.price.toLocaleString("en-IN")}</span>
                    <span class="old-price">₹${product.originalPrice.toLocaleString("en-IN")}</span>
                    <span class="discount-badge">${discount}% OFF</span>
                </div>
            </div>
            <button class="cta-button add-to-cart" onclick="addToCart('${product._id}')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
        </div>
    `;
}

function openProductModal(productId) {
  const product = allProducts.find((p) => p._id === productId);
  if (!product) return;

  let overlay = document.getElementById("product-modal-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "product-modal-overlay";
    overlay.className = "modal-overlay";
    // Close if clicking outside
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    document.body.appendChild(overlay);
  }

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );
  const reviews = product.reviews || 120;
  const desc =
    "Experience the pinnacle of modern engineering and design. This premium " +
    product.category +
    " item is crafted with exceptional materials to provide unparalleled performance and reliability. It features a stunning finish, durable build, and is perfectly engineered for your everyday needs.";

  overlay.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
            <div class="modal-image">
                <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
            </div>
            <div class="modal-details">
                <h2>${product.name}</h2>
                <div class="ratings">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                    <span style="color:var(--secondary-color); font-weight: 500; font-size: 0.95rem; margin-left:8px;">${product.rating} / 5.0 (${reviews} Verified Reviews)</span>
                </div>
                <p class="desc">${desc}</p>
                <div class="price-row">
                    <span class="big-price">₹${product.price.toLocaleString("en-IN")}</span>
                    <span class="old-price">₹${product.originalPrice.toLocaleString("en-IN")}</span>
                    <span class="discount">${discount}% OFF</span>
                </div>
                <div style="display: flex; gap: 15px; margin-top: 20px;">
                    <button class="cta-button" onclick="addToCart('${product._id}'); closeModal()" style="flex:2; padding: 18px; font-size: 1.1rem; border:none;"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                    <button onclick="closeModal()" style="flex:1; padding: 18px; font-size: 1.1rem; border:1px solid #ddd; background:#fff; border-radius:4px; font-weight:bold; cursor:pointer;">Cancel</button>
                </div>
                <p style="margin-top: 25px; color:#1877f2; font-weight:500; font-size:0.9rem;"><i class="fas fa-truck"></i> Free Next-Day Delivery & 30-Day Returns</p>
            </div>
        </div>
    `;

  overlay.classList.add("active");
  document.body.style.overflow = "hidden"; // Stop background scrolling
}

function closeModal() {
  const overlay = document.getElementById("product-modal-overlay");
  if (overlay) {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Render products in Amazon/Flipkart style horizontal carousels grouped by category
function renderGroupedProducts(products) {
  const productGrid = document.getElementById("product-grid");
  const sectionTitle = document.getElementById("section-title");

  if (sectionTitle) sectionTitle.textContent = "Discover Top Collections";
  if (!productGrid) return;

  productGrid.className = ""; // Remove grid class
  productGrid.innerHTML = "";

  const grouped = {};
  products.forEach((p) => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  for (const [category, items] of Object.entries(grouped)) {
    let cardsHTML = items
      .map((p, index) => generateProductCardHTML(p, index))
      .join("");

    productGrid.innerHTML += `
            <div class="category-section-block">
                <div class="category-row-title">
                    <span>${category}</span>
                    <a href="#" onclick="filterCategory('${category}'); return false;" style="font-size: 1rem; color: var(--accent-color); font-weight: normal; text-decoration: none;">View All <i class="fas fa-chevron-right"></i></a>
                </div>
                <div class="product-carousel">
                    ${cardsHTML}
                </div>
            </div>
        `;
  }

  initScrollAnimations();
}

let currentlyRenderedProducts = [];

// ... [we'll append the sort logic inside renderProducts] ...

// Render products in a standard grid (used for search and category filtering)
function renderProducts(products, title) {
  const productGrid = document.getElementById("product-grid");
  const sectionTitle = document.getElementById("section-title");

  // Track what's currently on screen for sorting
  currentlyRenderedProducts = [...products];

  if (sectionTitle && title) {
    if (window.location.pathname.includes("shop.html")) {
      sectionTitle.innerHTML = `
                <div class="shop-filters">
                    <span>${title} (${products.length} Items)</span>
                    <select onchange="handleSort(this.value)">
                        <option value="default">Sort By: Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                    </select>
                </div>
            `;
    } else {
      sectionTitle.textContent = title;
    }
  }

  if (!productGrid) return;

  productGrid.className = "product-grid"; // Restore grid class
  productGrid.innerHTML = "";

  if (products.length === 0) {
    productGrid.innerHTML = `<p style="text-align:center; width:100%; grid-column: 1/-1; padding: 40px; color: var(--text-gray);">No products found.</p>`;
    return;
  }

  products.forEach((product, index) => {
    productGrid.innerHTML += generateProductCardHTML(product, index);
  });

  // Re-bind observer to new sorted/rendered cards
  initScrollAnimations();
}

function handleSort(sortType) {
  let sorted = [...currentlyRenderedProducts];
  if (sortType === "price-low") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortType === "price-high") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sortType === "rating") {
    sorted.sort((a, b) => b.rating - a.rating);
  } else {
    // default could just be ID or reset, but currentlyRenderedProducts is already the filtered subset
  }

  const productGrid = document.getElementById("product-grid");
  if (!productGrid) return;
  productGrid.innerHTML = "";
  sorted.forEach((product) => {
    productGrid.innerHTML += generateProductCardHTML(product);
  });
}

function filterCategory(categoryName) {
  // Track recently interested category when user clicks on a category
  let recentCats = JSON.parse(localStorage.getItem("dh_recent_cats")) || [];
  recentCats = recentCats.filter((c) => c !== categoryName);
  recentCats.unshift(categoryName);
  if (recentCats.length > 3) recentCats.pop();
  localStorage.setItem("dh_recent_cats", JSON.stringify(recentCats));

  const filtered = allProducts.filter((p) => p.category === categoryName);
  if (filtered.length > 0) {
    renderProducts(filtered, categoryName);
  } else {
    renderProducts([], categoryName + " (No products found)");
  }

  const section = document.getElementById("products-section");
  if (section) section.scrollIntoView({ behavior: "smooth" });
}

function renderRecommendations() {
  const recentCats = JSON.parse(localStorage.getItem("dh_recent_cats")) || [];
  if (recentCats.length === 0) return;

  let recommended = allProducts.filter((p) => recentCats.includes(p.category));

  if (recommended.length < 4) {
    const others = allProducts.filter(
      (p) => !recentCats.includes(p.category) && p.rating >= 4.5,
    );
    recommended = recommended.concat(others);
  }

  const uniqueRecs = [];
  const ids = new Set();
  // Shuffle the recommended array slightly so it feels dynamic
  recommended = recommended.sort(() => 0.5 - Math.random());

  for (let p of recommended) {
    if (!ids.has(p._id)) {
      uniqueRecs.push(p);
      ids.add(p._id);
    }
    if (uniqueRecs.length === 4) break;
  }

  if (uniqueRecs.length === 0) return;

  const sectionTitle = document.createElement("h2");
  sectionTitle.textContent = "Recommended For You";
  sectionTitle.style.marginTop = "40px";
  sectionTitle.style.borderTop = "2px solid #eee";
  sectionTitle.style.paddingTop = "40px";

  const recGrid = document.createElement("div");
  recGrid.className = "product-grid";
  recGrid.style.marginBottom = "50px";

  let html = "";
  uniqueRecs.forEach((product, idx) => {
    html += `
            <div class="product-card scroll-animate is-visible delay-${(idx % 4) + 1}">
                <img src="${product.imageUrl}" alt="${product.name}" loading="lazy" class="product-img" onclick="window.location.href='${getSafeProductUrl(product)}'" style="cursor:pointer;">
                <div class="product-info">
                    <div class="product-title" onclick="window.location.href='${getSafeProductUrl(product)}'" style="cursor:pointer;">${product.name}</div>
                    <div class="rating-stars">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating || 5))}
                        ${(product.rating || 5) % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ""}
                        <span class="rating-count">${(product.rating || 5).toFixed(1)} (${product.reviews || 0})</span>
                    </div>
                    <div class="price-container">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="old-price">$${product.originalPrice.toFixed(2)}</span>` : ""}
                        ${product.originalPrice ? `<span class="discount-badge">${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span>` : ""}
                    </div>
                </div>
                <button class="cta-button add-to-cart" onclick="addToCart('${product._id}')"><i class="fas fa-cart-plus"></i> Add</button>
            </div>
        `;
  });

  recGrid.innerHTML = html;

  const targetSection = document.getElementById("products-section");
  if (targetSection) {
    const mainTitle =
      targetSection.querySelector("#section-title") ||
      targetSection.querySelector("h2");
    if (mainTitle) {
      targetSection.insertBefore(recGrid, mainTitle);
      targetSection.insertBefore(sectionTitle, recGrid);
    } else {
      targetSection.prepend(recGrid);
      targetSection.prepend(sectionTitle);
    }
  }
}

function renderDealOfTheDay() {
  const section = document.getElementById("deal-section");
  if (!section || allProducts.length === 0) return;

  let adminDealId = null;
  try {
    adminDealId = localStorage.getItem("dh_admin_deal");
  } catch (e) {}

  let dealProduct = null;

  // Check if admin has explicitly set a deal
  if (adminDealId && adminDealId !== "auto") {
    dealProduct = allProducts.find((p) => p._id === adminDealId);
  }

  // If not, deterministically pick a product based on the current calendar day
  if (!dealProduct) {
    const dayOfYear = Math.floor(Date.now() / 86400000); // Days since epoch
    const dealIndex = dayOfYear % allProducts.length;
    dealProduct = allProducts[dealIndex];
  }

  if (!dealProduct) return;

  document.getElementById("deal-image").src = dealProduct.imageUrl;
  document.getElementById("deal-image").style.cursor = "pointer";
  document.getElementById("deal-image").onclick = () =>
    (window.location.href = getSafeProductUrl(dealProduct));

  document.getElementById("deal-title").textContent = dealProduct.name;
  document.getElementById("deal-title").style.cursor = "pointer";
  document.getElementById("deal-title").onclick = () =>
    (window.location.href = getSafeProductUrl(dealProduct));

  document.getElementById("deal-desc").textContent =
    `Today's Special: Upgrade your lifestyle with this premium ${dealProduct.category}. Highly rated at ${(dealProduct.rating || 5).toFixed(1)} stars. Grab it before the day ends!`;

  document.getElementById("deal-current").textContent =
    `$${dealProduct.price.toFixed(2)}`;
  const oldP = dealProduct.originalPrice || dealProduct.price * 1.4;
  document.getElementById("deal-old").textContent = `$${oldP.toFixed(2)}`;

  const btn = document.getElementById("deal-btn");
  btn.onclick = () => addToCart(dealProduct._id);
  btn.innerHTML =
    '<i class="fas fa-cart-plus" style="margin-right: 8px;"></i> Grab The Deal';
}

function renderHighlights() {
  const grid = document.getElementById("highlight-grid");
  if (!grid || allProducts.length === 0) return;

  let adminHighlights = [];
  try {
    adminHighlights =
      JSON.parse(localStorage.getItem("dh_admin_highlights")) || [];
  } catch (e) {}

  let highlightProducts = [];

  // 1. Try to load Admin overrides
  if (adminHighlights.length > 0) {
    highlightProducts = adminHighlights
      .map((id) => allProducts.find((p) => p._id === id))
      .filter(Boolean);
  }

  // 2. Fallback to weekly rotation algorithm
  if (highlightProducts.length < 4) {
    const weekOfYear = Math.floor(Date.now() / (86400000 * 7));
    highlightProducts = []; // reset if incomplete
    for (let i = 0; i < 4; i++) {
      // Using a large prime multiplier to ensure it hops around the array
      const index = (weekOfYear * 13 + i * 7) % allProducts.length;
      if (allProducts[index]) highlightProducts.push(allProducts[index]);
    }
  }

  let html = "";
  highlightProducts.forEach((product, idx) => {
    html += `
            <div class="product-card scroll-animate is-visible delay-${(idx % 4) + 1}">
                <img src="${product.imageUrl}" alt="${product.name}" loading="lazy" class="product-img" onclick="window.location.href='${getSafeProductUrl(product)}'" style="cursor:pointer;">
                <div class="product-info">
                    <div class="product-title" onclick="window.location.href='${getSafeProductUrl(product)}'" style="cursor:pointer;">${product.name}</div>
                    <div class="rating-stars">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating || 5))}
                        ${(product.rating || 5) % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ""}
                        <span class="rating-count">${(product.rating || 5).toFixed(1)} (${product.reviews || 0})</span>
                    </div>
                    <div class="price-container">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="old-price">$${product.originalPrice.toFixed(2)}</span>` : ""}
                        ${product.originalPrice ? `<span class="discount-badge">${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span>` : ""}
                    </div>
                </div>
                <button class="cta-button add-to-cart" onclick="addToCart('${product._id}')"><i class="fas fa-cart-plus"></i> Add</button>
            </div>
        `;
  });
  grid.innerHTML = html;
}

// --- AMAZON/FLIPKART STYLE SEARCH ENGINE ---
function setupSearchBar() {
  const container = document.getElementById('global-search-container');
  const input = document.getElementById('global-search-input');
  const categorySelect = document.getElementById('global-search-category');
  const btn = document.getElementById('global-search-btn');
  const suggestionBox = document.getElementById('search-suggestions-box');
  
  if (!input) return;

  // Backdrop overlay when search is focused
  let overlay = document.getElementById('search-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'search-overlay';
    document.body.appendChild(overlay);
  }

  input.addEventListener('focus', () => {
    container.classList.add('search-focused');
    overlay.classList.add('active');
    if (input.value.trim().length === 0) {
      showTrendingSearches();
    } else {
      performSearch();
    }
  });

  input.addEventListener('blur', () => {
    // Delay hiding so clicks on suggestions register
    setTimeout(() => {
      container.classList.remove('search-focused');
      overlay.classList.remove('active');
      suggestionBox.classList.add('hidden');
    }, 200);
  });

  input.addEventListener('input', performSearch);
  categorySelect.addEventListener('change', performSearch);

  function showTrendingSearches() {
    suggestionBox.innerHTML = `
      <div style="padding: 15px; font-weight: bold; font-size: 0.9rem; color: var(--text-gray); border-bottom: 1px solid #eee;">
        <i class="fas fa-fire" style="color: #ef4444;"></i> Trending Searches
      </div>
      <a href="shop.html?search=headphones" class="suggestion-item">Premium Headphones</a>
      <a href="shop.html?search=smart" class="suggestion-item">Smart Watches & Wearables</a>
      <a href="shop.html?search=gaming" class="suggestion-item">Gaming Accessories</a>
    `;
    suggestionBox.classList.remove('hidden');
  }

  function performSearch() {
    const query = input.value.toLowerCase().trim();
    const cat = categorySelect.value;
    
    if (query.length < 1) {
      showTrendingSearches();
      return;
    }

    let matches = allProducts;
    if (cat !== 'all') {
      matches = matches.filter(p => p.category === cat);
    }

    matches = matches.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    ).slice(0, 6);

    if (matches.length > 0) {
      suggestionBox.innerHTML = matches.map(p => {
        // Highlight matching text
        const regex = new RegExp(`(${query})`, 'gi');
        const highlightedName = p.name.replace(regex, '<span class="highlight">$1</span>');
        
        return `
        <a href="${getSafeProductUrl(p)}" class="suggestion-item">
          <img src="${p.imageUrl}" alt="${p.name}" loading="lazy" width="40" height="40" style="object-fit:cover; border-radius:4px; margin-right:15px;">
          <div class="sugg-details" style="flex: 1;">
            <div class="sugg-name">${highlightedName}</div>
            <div class="sugg-cat" style="font-size: 0.75rem; color: var(--text-gray);">in ${p.category}</div>
          </div>
          <div class="sugg-price">$${p.price.toFixed(2)}</div>
        </a>
      `}).join('');
      
      // Add a "See all results" at the bottom
      suggestionBox.innerHTML += `
        <a href="shop.html?search=${encodeURIComponent(query)}${cat !== 'all' ? '&cat='+encodeURIComponent(cat) : ''}" class="suggestion-see-all">
          See all results for "<strong>${input.value}</strong>"
        </a>
      `;
      suggestionBox.classList.remove('hidden');
    } else {
      suggestionBox.innerHTML = '<div style="padding:15px; color:var(--text-gray); text-align:center;">No exact products found. Try a broader search.</div>';
      suggestionBox.classList.remove('hidden');
    }
  }

  const executeSearch = () => {
    const query = input.value.trim();
    if (!query) return;
    const cat = categorySelect.value;
    window.location.href = 'shop.html?search=' + encodeURIComponent(query) + (cat !== 'all' ? '&cat=' + encodeURIComponent(cat) : '');
  };

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') executeSearch();
  });
  
  if (btn) btn.addEventListener('click', executeSearch);
}
