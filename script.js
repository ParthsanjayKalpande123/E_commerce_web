/* ================= CART FUNCTIONS ================= */

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  let cart = getCart();
  let count = cart.reduce((sum, item) => sum + item.quantity, 0);
  let cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.innerText = count;
}

function addToCart(product) {
  let cart = getCart();
  let existing = cart.find(item => item.name === product.name);

  if (existing) {
    existing.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  saveCart(cart);
  updateCartCount();
  alert("Added to cart!");
}

/* ================= PRODUCT RENDER ================= */

function renderProducts(products, sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  section.innerHTML = "";

  if (products.length === 0) {
    section.innerHTML = "<p class='text-center'>No products found</p>";
    return;
  }

  products.forEach(p => {
    section.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${p.img}" class="card-img-top"
               style="height:220px; object-fit:cover;">
          <div class="card-body text-center">
            <h6>${p.name}</h6>
            <p class="fw-bold">₹${p.price}</p>
            <button class="btn btn-dark w-100"
              onclick='addToCart(${JSON.stringify(p)})'>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

/* ================= LOAD CART ================= */

function loadCart() {
  let cart = getCart();
  let cartItems = document.getElementById("cartItems");
  let total = 0;

  if (!cartItems) return;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty</p>";
    document.getElementById("total").innerText = 0;
    return;
  }

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity;
    total += itemTotal;

    cartItems.innerHTML += `
      <div class="card mb-3 p-3">
        <div class="d-flex align-items-center gap-3">
          <img src="${item.img}"
               style="width:100px; height:120px; object-fit:cover; border-radius:8px;">
          <div class="flex-grow-1">
            <h5 class="mb-1">${item.name}</h5>
            <p class="mb-1">Price: ₹${item.price}</p>

            <div class="d-flex align-items-center gap-2 mb-1">
              <span>Quantity:</span>
              <button class="btn btn-sm btn-outline-dark"
                onclick="changeQty(${index}, -1)">−</button>
              <span>${item.quantity}</span>
              <button class="btn btn-sm btn-outline-dark"
                onclick="changeQty(${index}, 1)">+</button>
            </div>

            <strong>Total: ₹${itemTotal}</strong>
          </div>
        </div>
      </div>
    `;
  });

  document.getElementById("total").innerText = total;
}

/* ================= QUANTITY ================= */

function changeQty(index, change) {
  let cart = getCart();
  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  loadCart();
  updateCartCount();
}

/* ================= CART ACTIONS ================= */

function clearCart() {
  if (confirm("Are you sure you want to clear the cart?")) {
    localStorage.removeItem("cart");
    loadCart();
    updateCartCount();
  }
}

function proceedToCheckout() {
  let cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }
  window.location.href = "payment.html";
}

/* ================= AUTH SYSTEM ================= */

let isLogin = true;

function toggleAuth() {
  isLogin = !isLogin;

  document.getElementById("authTitle").innerText =
    isLogin ? "Login" : "Signup";

  document.getElementById("authName").classList.toggle("d-none");

  document.getElementById("toggleText").innerText =
    isLogin ? "Don't have an account?" : "Already have an account?";
}

function handleAuth(event) {
  event.preventDefault();

  const name = document.getElementById("authName").value;
  const email = document.getElementById("authEmail").value;
  const password = document.getElementById("authPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (!email || !password || (!isLogin && !name)) {
    alert("Please fill all fields");
    return;
  }

  if (isLogin) {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      alert("Invalid credentials");
      return;
    }
    localStorage.setItem("loggedUser", JSON.stringify(user));
    alert("Login successful!");
  } else {
    if (users.some(u => u.email === email)) {
      alert("Account already exists");
      return;
    }
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedUser", JSON.stringify(newUser));
    alert("Signup successful!");
  }

  updateAuthUI();

  const modalEl = document.getElementById("authModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
}

function updateAuthUI() {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const authBtn = document.getElementById("authBtn");
  const logoutSection = document.getElementById("logoutSection");

  if (!authBtn) return;

  if (user) {
    authBtn.innerHTML = `Hi, ${user.name}`;
    authBtn.removeAttribute("data-bs-toggle");
    authBtn.removeAttribute("data-bs-target");
    if (logoutSection) logoutSection.classList.remove("d-none");
  } else {
    authBtn.innerHTML = `Login / Signup`;
    authBtn.setAttribute("data-bs-toggle", "modal");
    authBtn.setAttribute("data-bs-target", "#authModal");
    if (logoutSection) logoutSection.classList.add("d-none");
  }
}

function logout() {
  localStorage.removeItem("loggedUser");
  localStorage.removeItem("cart");
  window.location.reload();
}

/* ================= INIT ================= */

updateAuthUI();
updateCartCount();
