/**
 * SUCCESSFUL WELLNESS HERBS - Main Front-End Application Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initCartDrawer();
  initProductModal();
  updateCartUI();

  // Listen to custom updates
  window.addEventListener("cartUpdated", updateCartUI);
});

// Toast Notification Helper
function showToast(message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
window.showToast = showToast;

// Header & Navigation
function initHeader() {
  const header = document.querySelector(".main-header");
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");

  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener("click", () => {
      navMenu.classList.toggle("mobile-open");
      const icon = mobileBtn.querySelector("i");
      if (icon) {
        if (navMenu.classList.contains("mobile-open")) {
          icon.className = "fas fa-times";
        } else {
          icon.className = "fas fa-bars";
        }
      }
    });
  }
}

// Cart Drawer & Slide-over
function initCartDrawer() {
  const cartToggleBtns = document.querySelectorAll(".cart-toggle-btn");
  const cartOverlay = document.querySelector(".cart-drawer-overlay");
  const cartDrawer = document.querySelector(".cart-drawer");
  const closeCartBtn = document.querySelector(".btn-close-drawer");
  const whatsappCheckoutBtn = document.getElementById("btnWhatsAppCheckout");

  function openCart() {
    if (cartOverlay && cartDrawer) {
      cartOverlay.classList.add("active");
      cartDrawer.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeCart() {
    if (cartOverlay && cartDrawer) {
      cartOverlay.classList.remove("active");
      cartDrawer.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  cartToggleBtns.forEach(btn => btn.addEventListener("click", openCart));
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  // WhatsApp Checkout Button in Drawer
  if (whatsappCheckoutBtn) {
    whatsappCheckoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const cart = DataStore.getCart();
      if (cart.length === 0) {
        showToast("Your cart is empty! Add remedies before checking out.", "error");
        return;
      }

      const custName = document.getElementById("checkoutCustName")?.value.trim();
      const custPhone = document.getElementById("checkoutCustPhone")?.value.trim();
      const custAddress = document.getElementById("checkoutCustAddress")?.value.trim();
      const custCityState = document.getElementById("checkoutCustCityState")?.value.trim();
      const custNotes = document.getElementById("checkoutCustNotes")?.value.trim();

      if (!custName) {
        showToast("Please enter your name to complete WhatsApp order.", "error");
        document.getElementById("checkoutCustName")?.focus();
        return;
      }

      if (!custPhone) {
        showToast("Please enter your phone number.", "error");
        document.getElementById("checkoutCustPhone")?.focus();
        return;
      }

      const details = {
        name: custName,
        phone: custPhone,
        address: custAddress || "Store Pickup / Moshood Abiola Poly Pansheke",
        cityState: custCityState || "Ogun State",
        notes: custNotes
      };

      const waUrl = DataStore.buildWhatsAppOrderUrl(details);
      if (waUrl) {
        showToast("Redirecting to WhatsApp to complete your order...", "success");
        setTimeout(() => {
          window.open(waUrl, "_blank");
        }, 600);
      }
    });
  }
}

// Update Cart UI
function updateCartUI() {
  const count = DataStore.getCartCount();
  const total = DataStore.getCartTotal();
  const cart = DataStore.getCart();

  // Badges
  document.querySelectorAll(".cart-badge").forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  });

  // Drawer list
  const drawerBody = document.querySelector(".cart-drawer-body");
  const drawerTotal = document.getElementById("cartDrawerTotal");

  if (drawerTotal) {
    drawerTotal.textContent = `₦${total.toLocaleString()}`;
  }

  if (drawerBody) {
    if (cart.length === 0) {
      drawerBody.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon"><i class="fas fa-shopping-basket"></i></div>
          <p class="cart-empty-text">Your cart is currently empty</p>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px;">
            Explore our potent herbal remedies and add natural wellness solutions to your basket.
          </p>
          <a href="shop.html" class="btn btn-primary btn-sm" onclick="document.querySelector('.cart-drawer-overlay').click()">
            Browse Remedies
          </a>
        </div>
      `;
    } else {
      let html = '<div class="cart-items-list">';
      cart.forEach(item => {
        html += `
          <div class="cart-item-card" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='images/brand-logo.jpeg'">
            <div class="cart-item-info">
              <h4 class="cart-item-name">${item.name}</h4>
              <div class="cart-item-price">₦${(item.price * item.quantity).toLocaleString()}</div>
              <div class="cart-item-qty-ctrl">
                <button class="qty-btn" onclick="updateQty('${item.id}', ${item.quantity - 1})">-</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQty('${item.id}', ${item.quantity + 1})">+</button>
              </div>
            </div>
            <button class="btn-remove-cart" onclick="removeCartItem('${item.id}')" title="Remove item">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        `;
      });
      html += '</div>';
      drawerBody.innerHTML = html;
    }
  }
}

// Cart actions callable globally
window.updateQty = (id, newQty) => {
  DataStore.updateCartQty(id, newQty);
};

window.removeCartItem = (id) => {
  DataStore.removeFromCart(id);
  showToast("Item removed from cart", "error");
};

window.handleAddToCart = (id) => {
  const success = DataStore.addToCart(id, 1);
  if (success) {
    const product = DataStore.getProductById(id);
    showToast(`Added ${product ? product.name : "remedy"} to cart!`, "success");
  }
};

window.handleDirectWhatsAppOrder = (id) => {
  const product = DataStore.getProductById(id);
  if (!product) return;

  const msg = `Hello *Successful Wellness Herbs*,\n\nI would like to order *${product.name}* (₦${product.price.toLocaleString()}) directly via WhatsApp. Please advise on payment details and delivery to my location!`;
  const url = `https://wa.me/${BUSINESS_CONFIG.whatsapp1}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
};

// Product Modal (Quick View)
function initProductModal() {
  const modalOverlay = document.getElementById("productDetailModal");
  if (!modalOverlay) return;

  const closeBtn = modalOverlay.querySelector(".modal-close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modalOverlay.classList.remove("active");
    });
  }

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("active");
    }
  });
}

window.openProductModal = (id) => {
  const product = DataStore.getProductById(id);
  if (!product) return;

  const modalOverlay = document.getElementById("productDetailModal");
  if (!modalOverlay) return;

  const modalImg = document.getElementById("modalImg");
  const modalCategory = document.getElementById("modalCategory");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");
  const modalOldPrice = document.getElementById("modalOldPrice");
  const modalDesc = document.getElementById("modalDesc");
  const modalBenefits = document.getElementById("modalBenefits");
  const modalIngredients = document.getElementById("modalIngredients");
  const modalUsage = document.getElementById("modalUsage");
  const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");
  const modalWhatsAppBtn = document.getElementById("modalWhatsAppBtn");

  if (modalImg) modalImg.src = product.image;
  if (modalCategory) modalCategory.textContent = product.category;
  if (modalTitle) modalTitle.textContent = product.name;
  if (modalPrice) modalPrice.textContent = `₦${product.price.toLocaleString()}`;
  if (modalOldPrice) {
    if (product.oldPrice) {
      modalOldPrice.textContent = `₦${product.oldPrice.toLocaleString()}`;
      modalOldPrice.style.display = "inline";
    } else {
      modalOldPrice.style.display = "none";
    }
  }
  if (modalDesc) modalDesc.textContent = product.description || product.shortDesc;
  if (modalIngredients) modalIngredients.textContent = product.ingredients || "100% Wildcrafted Nigerian Herbs";
  if (modalUsage) modalUsage.textContent = product.usage || "Take as directed by herbalist.";

  if (modalBenefits) {
    let benefitsList = "";
    if (Array.isArray(product.benefits)) {
      product.benefits.forEach(b => {
        benefitsList += `<li><i class="fas fa-check-circle"></i><span>${b}</span></li>`;
      });
    }
    modalBenefits.innerHTML = benefitsList;
  }

  if (modalAddToCartBtn) {
    modalAddToCartBtn.onclick = () => {
      DataStore.addToCart(product.id, 1);
      showToast(`Added ${product.name} to cart!`, "success");
      modalOverlay.classList.remove("active");
    };
  }

  if (modalWhatsAppBtn) {
    modalWhatsAppBtn.onclick = () => {
      handleDirectWhatsAppOrder(product.id);
    };
  }

  modalOverlay.classList.add("active");
};

// Render Product Card HTML Helper
window.createProductCardHTML = (product) => {
  return `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='images/brand-logo.jpeg'" loading="lazy">
        <div class="product-badge-group">
          ${product.oldPrice ? `<span class="badge badge-discount">Save ₦${(product.oldPrice - product.price).toLocaleString()}</span>` : ""}
          <span class="badge badge-herbal"><i class="fas fa-leaf"></i> 100% Herbal</span>
        </div>
        <button class="product-quick-view-btn" onclick="openProductModal('${product.id}')">
          <i class="fas fa-eye"></i> Quick View
        </button>
      </div>

      <div class="product-content">
        <div class="product-meta-row">
          <span class="product-cat">${product.category}</span>
          <div class="product-rating">
            <i class="fas fa-star"></i>
            <span>${product.rating ? product.rating.toFixed(1) : "5.0"}</span>
          </div>
        </div>

        <h3 class="product-title">
          <a href="javascript:void(0)" onclick="openProductModal('${product.id}')">${product.name}</a>
        </h3>

        <p class="product-desc">${product.shortDesc || product.description}</p>

        <div class="product-bottom">
          <div class="product-pricing">
            <span class="product-price">₦${product.price.toLocaleString()}</span>
            ${product.oldPrice ? `<span class="product-old-price">₦${product.oldPrice.toLocaleString()}</span>` : ""}
          </div>

          <div class="product-actions">
            <button class="btn-card-cart" onclick="handleAddToCart('${product.id}')" title="Add to Cart">
              <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
};
