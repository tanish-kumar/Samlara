// ====== Utility: Fetch wrapper with session cookies ======
const fetchJSON = (url, opts = {}) =>
  fetch(url, { credentials: "include", ...opts }).then((r) => r.json());

// ====== Global variable for logged-in user ======
let currentUser = null;
let selectedSize = null;

// ====== Load logged in user info (for navbar UI update) ======
async function loadUser() {
  try {
    const data = await fetchJSON("/api/auth/me");
    currentUser = data.user;

    const loginLink = document.querySelector("#login-link");
    const userSlot = document.querySelector("#user-slot");
    const logoutBtn = document.querySelector("#logout-btn");

    if (loginLink) loginLink.style.display = currentUser ? "none" : "inline-block";
    if (userSlot) userSlot.textContent = currentUser ? currentUser.name : "";
    if (logoutBtn) logoutBtn.style.display = currentUser ? "inline-block" : "none";
  } catch {
    currentUser = null;
  }
}



// ====== Hero slider ======
let currentSlide = 0;
const slides = document.querySelectorAll(".hero-slider img");

function showSlide(index) {
  slides.forEach((img, i) => img.classList.toggle("active", i === index));
}

setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 3000);

// ====== Hamburger toggle ======
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
hamburger?.addEventListener("click", () => navLinks.classList.toggle("show"));

// ====== Logout ======
async function logout() {
  await fetchJSON("/api/auth/logout", { method: "POST" });
  location.href = "index.html";
}

// ====== Require login ======
function requireLogin() {
  if (!currentUser) {
    alert("Please login first!");
    location.href = "login.html";
    return false;
  }
  return true;
}

// ====== Load products on homepage ======
async function loadProducts() {
  const wrap = document.querySelector("#product-list");
  if (!wrap) return;

  const items = await fetchJSON("/api/products");
  wrap.innerHTML = "";

  items.forEach((p) => {
    wrap.innerHTML += `
      <div class="card" data-id="${p._id}">
        ${p.tag ? `<div style="font-size:12px;color:#555"><span style="border:1px solid #e5e5e5;border-radius:999px;padding:4px 8px">${p.tag}</span></div>` : ""}
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <div class="price">₹${p.price}</div>
        <div class="actions">
          <a class="btn buy-now" data-id="${p._id}" href="product.html?id=${p._id}">Buy Now</a>
          <button class="btn add-to-cart" data-id="${p._id}">Add to Cart</button>
          <button class="btn add-to-wishlist" data-id="${p._id}">Wishlist</button>
        </div>
      </div>
    `;
  });

  // ====== Event delegation for product buttons ======
  wrap.addEventListener("click", async (e) => {
    const target = e.target;
    const pid = target.dataset.id;
    if (!pid) return;

    if (target.classList.contains("add-to-cart")) await handleAddToCart(pid);
    if (target.classList.contains("add-to-wishlist")) await handleAddToWishlist(pid);
  });
}

// ====== Load product details ======
async function loadProductDetail() {
  const holder = document.querySelector("#product-detail");
  if (!holder) return;

  const id = new URL(location.href).searchParams.get("id");
  if (!id) return (holder.innerHTML = "<p>Product not found.</p>");

  const p = await fetchJSON("/api/products/" + id);
  holder.innerHTML = `
    <div class="container">
      <div class="product-section">
        <div class="image-section">
          <img src="${p.image}" alt="${p.name}" class="product-image">
          <img src="${p.images}" alt="${p.name}" class="product-image">
          
        </div>

        <div class="details-section">
          <h1 class="product-title">${p.name}</h1>
          <div class="price-section">
            <span class="current-price">₹${p.price}</span>
            <span class="original-price">₹699</span>
          </div>

          <div class="rating">
            <div class="stars">★★★★☆</div>
            <span class="rating-text">4.2/5 (156 reviews)</span>
          </div>

          <div class="description"><p>${p.desc}</p></div>

          <div class="size-selection">
            <label class="size-label">Select Size:</label>
            <div class="size-options">
              ${p.sizes.map((s) => `<div class="size-option" data-size="${s}">${s}</div>`).join("")}
            </div>
          </div>

          <button class="btn proceed-checkout" data-id="${p._id}">🛒 BUY NOW</button>
        </div>
      </div>

      <div class="reviews-section">
        <h2 class="reviews-title">Customer Reviews</h2>
        <div class="review"><div class="review-header"><span class="reviewer-name">${p.rw1_name}</span><span class="review-stars">★★★★★</span></div><p>${p.rw1}</p></div>
        <div class="review"><div class="review-header"><span class="reviewer-name">${p.rw2_name}</span><span class="review-stars">★★★★☆</span></div><p>${p.rw2}</p></div>
        <div class="review"><div class="review-header"><span class="reviewer-name">${p.rw3_name}</span><span class="review-stars">★★★★★</span></div><p>${p.rw3}</p></div>
      </div>
    </div>
  `;


  // ====== Size selection ======
  holder.querySelectorAll(".size-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      holder.querySelectorAll(".size-option").forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
      selectedSize = opt.dataset.size;
    });
  });

  // ====== Checkout button ======
  holder.querySelector(".proceed-checkout")?.addEventListener("click", () => {
    if (!requireLogin()) return;
    if (!selectedSize) return alert("Please select a size first!");
    sessionStorage.setItem("checkout", JSON.stringify({ productId: id, size: selectedSize }));
    location.href = "checkout.html";
  });
}

// ====== Add to cart ======
async function handleAddToCart(productId) {
  if (!requireLogin()) return;
  const res = await fetchJSON("/api/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  alert(res.message || "Added");
  loadCart();
}

// ====== Add to wishlist ======
async function handleAddToWishlist(productId) {
  if (!requireLogin()) return;
  const res = await fetchJSON("/api/wishlist/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  alert(res.message || "Added");
  loadWishlist();
}

// ====== Load checkout page ======
async function loadCheckout() {
  const root = document.querySelector("#checkout");
  if (!root) return;
  if (!requireLogin()) return;

  const payload = JSON.parse(sessionStorage.getItem("checkout") || "null");
  if (!payload) return (root.innerHTML = "<p>No item to checkout.</p>");

  const p = await fetchJSON("/api/products/" + payload.productId);
  root.innerHTML = `
    <div class="card">
      <h2>Checkout</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div>
          <img src="${p.image}" alt="${p.name}" style="width:100%;border-radius:14px">
          <h3>${p.name}</h3>
          <div>Size: <b>${payload.size}</b></div>
          <div class="price">₹${p.price}</div>
        </div>
        <form id="checkoutForm" class="form">
          <h3>Shipping Address</h3>
          <input class="input" name="fullName" placeholder="Full Name" required>
          <input class="input" name="phone" placeholder="Phone" required>
          <input class="input" name="line1" placeholder="Address line 1" required>
          <input class="input" name="line2" placeholder="Address line 2 (optional)">
          <input class="input" name="city" placeholder="City" required>
          <input class="input" name="state" placeholder="State" required>
          <input class="input" name="pincode" placeholder="Pincode" required>

          <label>Payment Method</label>
          <select class="input" name="paymentMethod" required>
            <option value="COD">Cash on Delivery</option>
            
          </select>

          <div id="qrBox" style="display:none;border:1px dashed #ccc;border-radius:12px;padding:12px">
            <p>Scan & pay this QR, then confirm order.</p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=demo@upi&pn=SamLara&am=${p.price}" alt="QR Code">
          </div>

          <button class="btn" type="submit">Confirm Order</button>
        </form>
      </div>
    </div>
  `;

  const form = document.querySelector("#checkoutForm");
  const pm = form.querySelector('select[name="paymentMethod"]');
  const qrBox = document.querySelector("#qrBox");

  pm.addEventListener("change", () => (qrBox.style.display = pm.value === "QR" ? "block" : "none"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const address = {
      fullName: fd.get("fullName"),
      phone: fd.get("phone"),
      line1: fd.get("line1"),
      line2: fd.get("line2"),
      city: fd.get("city"),
      state: fd.get("state"),
      pincode: fd.get("pincode"),
    };
    const paymentMethod = fd.get("paymentMethod");

    const res = await fetchJSON("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: payload.productId, size: payload.size, address, paymentMethod }),
    });

    if (res.order) {
      alert("Order placed!");
      sessionStorage.removeItem("checkout");
      location.href = "myorders.html";
    } else {
      alert(res.message || "Failed");
    }

  });
}

// ====== Load orders ======
async function loadOrders() {
  const list = document.querySelector("#orders");
  if (!list) return;
  if (!requireLogin()) return;

  const items = await fetchJSON("/api/orders/mine");
  if (!Array.isArray(items)) {
    list.innerHTML = "<p>Login required.</p>";
    return;
  }

  list.innerHTML = items
    .map((o) => {
      const product = o.product || {}; // fallback
      return `
        <div class="card" style="display:grid;grid-template-columns:90px 1fr;gap:12px">
          <img src="${product.image || "/assets/placeholder.jpg"}" 
               style="width:90px;height:90px;object-fit:cover;border-radius:12px">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <h3 style="margin:0">${product.name || "Unknown Product"} <small>(${o.size})</small></h3>
              <b>₹${o.price}</b>
            </div>
            <div>Status: ${o.status}</div>
            <small>Placed on ${new Date(o.createdAt).toLocaleString()}</small>
          </div>
        </div>
      `;
    })
    .join("");
}


// ====== Load cart ======
async function loadCart() {
  const container = document.querySelector("#cart-container");
  if (!container) return;
  if (!requireLogin()) return;

  try {
    const items = await fetchJSON("/api/cart/mine");
    const validItems = items.filter((c) => c.product); // ✅ Skip invalid/null products

    if (!validItems.length) {
      container.innerHTML = "<p>Your cart is empty.</p>";
      document.querySelector("#cart-total").textContent = "Total: ₹0";
      return;
    }

    let total = 0;
    container.innerHTML = validItems
      .map((c) => {
        total += c.product.price * c.quantity;
        return `
        <div class="card" style="display:grid;grid-template-columns:100px 1fr auto;gap:10px;align-items:center">
          <img src="${c.product.image}" style="width:100px;border-radius:10px">
          <div>
            <h3>${c.product.name}</h3>
            <div>₹${c.product.price} × ${c.quantity}</div>
          </div>
          <div style="display:flex;gap:6px">
             <button class="qty-btn" data-id="${c.product._id}" data-action="dec" ${c.quantity === 1 ? 'disabled' : ''}>-</button>
             <span>${c.quantity}</span>
            <button class="qty-btn" data-id="${c.product._id}" data-action="inc">+</button>
            <button class="remove-btn" data-id="${c.product._id}">Remove</button>
          </div>
        </div>
      `;
      })
      .join("");

    document.querySelector("#cart-total").textContent = `Total: ₹${total}`;

    // ====== Cart buttons ======
    container.addEventListener("click", async (e) => {
      const target = e.target;
      const pid = target.dataset.id;
      if (!pid) return;

      const currentItem = validItems.find(i => i.product._id === pid);
      if (!currentItem) return;

      if (target.classList.contains("qty-btn")) {
        const qty = target.dataset.action === "inc" ? currentItem.quantity + 1 : currentItem.quantity - 1;
        if (qty < 1) await removeFromCart(pid);
        else await updateCartQty(pid, qty);
      }


      if (target.classList.contains("remove-btn")) await removeFromCart(pid);
    });
  } catch (e) {
    console.error(e);
    container.innerHTML = "<p>Failed to load cart.</p>";
  }
}

async function updateCartQty(productId, quantity) {
  await fetchJSON("/api/cart/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity }),
  });
  loadCart();
}

async function removeFromCart(productId) {
  await fetchJSON("/api/cart/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  loadCart();
}

// ====== Wishlist ======
async function loadWishlist() {
  const container = document.querySelector("#wishlist-container");
  if (!container) return;
  if (!requireLogin()) return;

  try {
    const items = await fetchJSON("/api/wishlist/mine");
    if (!items.length) return (container.innerHTML = "<p>Your wishlist is empty.</p>");

    container.innerHTML = items
      .map(
        (p) => `
      <div class="card" style="display:grid;grid-template-columns:100px 1fr auto;gap:10px;align-items:center">
        <img src="${p.image}" style="width:100px;border-radius:10px">
        <div>
          <h3>${p.name}</h3>
          <div>₹${p.price}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="move-cart" data-id="${p._id}">Move to Cart</button>
          <button class="remove-wishlist" data-id="${p._id}">Remove</button>
        </div>
      </div>
    `
      )
      .join("");

    container.addEventListener("click", async (e) => {
      const target = e.target;
      const pid = target.dataset.id;
      if (!pid) return;

      if (target.classList.contains("move-cart")) await moveToCart(pid);
      if (target.classList.contains("remove-wishlist")) await removeFromWishlist(pid);
    });
  } catch (e) {
    console.error(e);
    container.innerHTML = "<p>Failed to load wishlist.</p>";
  }
}

async function moveToCart(productId) {
  await handleAddToCart(productId);
  await removeFromWishlist(productId);
}

async function removeFromWishlist(productId) {
  await fetchJSON("/api/wishlist/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  loadWishlist();
}

// ====== Initialize ======
window.addEventListener("DOMContentLoaded", async () => {
  await loadUser();
  document.querySelector("#logout-btn")?.addEventListener("click", logout);

  loadProducts();
  loadProductDetail();
  loadCheckout();
  loadOrders();
  loadCart();
  loadWishlist();
});
