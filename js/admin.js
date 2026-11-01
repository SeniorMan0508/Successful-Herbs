/**
 * SUCCESSFUL WELLNESS HERBS - Admin Management Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  checkAdminAuth();
  initAdminAuthForm();
  initAdminNavigation();
  initProductForms();
  initAdminReviewForm();
  initSettingsForm();

  window.addEventListener("productsUpdated", () => {
    if (DataStore.getAdminToken()) refreshDashboard();
  });
  window.addEventListener("categoriesUpdated", () => {
    if (DataStore.getAdminToken()) populateCategorySelects();
  });
});

// Admin Authentication (Server-verified Bearer Token)
async function checkAdminAuth() {
  const isLoggedIn = await DataStore.verifyAdminSessionAsync();
  const authScreen = document.getElementById("adminAuthScreen");
  const dashboard = document.getElementById("adminDashboard");

  if (isLoggedIn) {
    if (authScreen) authScreen.style.display = "none";
    if (dashboard) dashboard.style.display = "block";
    refreshDashboard();
  } else {
    if (authScreen) authScreen.style.display = "flex";
    if (dashboard) dashboard.style.display = "none";
  }
}

function initAdminAuthForm() {
  const loginForm = document.getElementById("adminLoginForm");
  const pinInput = document.getElementById("adminPinInput");
  const togglePinBtn = document.getElementById("togglePinVisibilityBtn");

  if (togglePinBtn && pinInput) {
    togglePinBtn.addEventListener("click", () => {
      const isPassword = pinInput.type === "password";
      pinInput.type = isPassword ? "text" : "password";
      togglePinBtn.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const enteredPin = pinInput.value.trim();

      try {
        await DataStore.loginAdminAsync(enteredPin);
        showToast("Welcome to Successful Wellness Herbs Admin Portal", "success");
        pinInput.value = "";
        await checkAdminAuth();
      } catch (err) {
        showToast(err.message || "Incorrect Admin PIN. Please try again.", "error");
        pinInput.value = "";
        pinInput.focus();
      }
    });
  }

  const logoutBtn = document.getElementById("adminLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await DataStore.logoutAdminAsync();
      showToast("Logged out of Admin Portal", "info");
      await checkAdminAuth();
    });
  }
}

// Admin Navigation Tabs
function initAdminNavigation() {
  const tabBtns = document.querySelectorAll(".admin-tab-btn");
  const sections = document.querySelectorAll(".admin-tab-pane");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");

      tabBtns.forEach(b => b.classList.remove("active"));
      sections.forEach(s => s.style.display = "none");

      btn.classList.add("active");
      const targetPane = document.getElementById(`tab_${target}`);
      if (targetPane) targetPane.style.display = "block";
    });
  });
}

// Refresh Entire Dashboard
function refreshDashboard() {
  populateCategorySelects();
  renderStats();
  renderProductsTable();
  renderReviewsTable();
}

// Populate Category Dropdowns & Handle Create / Delete Categories
function populateCategorySelects(selectedCategory = "") {
  const categories = DataStore.getCategories();
  const selects = [
    document.getElementById("newProductCategory"),
    document.getElementById("editProductCategory")
  ];

  selects.forEach(sel => {
    if (!sel) return;
    const prevValue = selectedCategory || sel.value;
    let html = "";
    const list = [...categories];
    if (prevValue && !list.includes(prevValue)) {
      list.push(prevValue);
    }
    list.forEach(cat => {
      html += `<option value="${cat}">${cat}</option>`;
    });
    sel.innerHTML = html;
    if (prevValue && list.includes(prevValue)) {
      sel.value = prevValue;
    }
  });
}

window.handleCreateCategory = async (inputId, selectId) => {
  const inputEl = document.getElementById(inputId);
  const selectEl = document.getElementById(selectId);
  if (!inputEl) return;

  const newCatName = inputEl.value.trim();
  if (!newCatName) {
    showToast("Please type a category name to add.", "error");
    inputEl.focus();
    return;
  }

  try {
    const savedCat = await DataStore.addCategoryAsync(newCatName);
    populateCategorySelects(savedCat);
    if (selectEl && savedCat) {
      selectEl.value = savedCat;
    }
    inputEl.value = "";
    showToast(`Category "${savedCat}" added and selected!`, "success");
  } catch (err) {
    showToast(err.message || "Failed to add category", "error");
  }
};

window.handleDeleteCategory = async (selectId) => {
  const selectEl = document.getElementById(selectId);
  if (!selectEl || !selectEl.value) return;

  const catToDelete = selectEl.value;
  const categories = DataStore.getCategories();
  if (categories.length <= 1) {
    showToast("At least one category must remain.", "error");
    return;
  }

  if (confirm(`Delete the category "${catToDelete}" from the category list?`)) {
    try {
      await DataStore.deleteCategoryAsync(catToDelete);
      populateCategorySelects();
      showToast(`Category "${catToDelete}" removed.`, "info");
    } catch (err) {
      showToast(err.message || "Failed to delete category", "error");
    }
  }
};

// Stats Cards
async function renderStats() {
  const products = DataStore.getProducts();
  const pageData = await DataStore.fetchReviewsPage({ limit: 1, offset: 0, includeHidden: true });
  const stats = pageData.stats || { totalAll: 0, totalPhotos: 0 };

  const totalProds = document.getElementById("statTotalProducts");
  const inStockProds = document.getElementById("statInStockProducts");
  const totalRevs = document.getElementById("statTotalReviews");
  const photoRevs = document.getElementById("statPhotoReviews");

  if (totalProds) totalProds.textContent = products.length;
  if (inStockProds) inStockProds.textContent = products.filter(p => p.inStock !== false).length;
  if (totalRevs) totalRevs.textContent = Number(stats.totalAll).toLocaleString();
  if (photoRevs) photoRevs.textContent = Number(stats.totalPhotos).toLocaleString();
}

// Product Management
let currentNewProductImage = "images/product-herbal-mixture.jpg";
let currentEditProductImage = "";

function initProductForms() {
  // Image Upload for New Product
  const newProductImgFile = document.getElementById("newProductImgFile");
  const newProductImgPreview = document.getElementById("newProductImgPreview");
  const newProductPresetThumbs = document.querySelectorAll("#newProductPresets .preset-thumb");

  if (newProductImgFile) {
    newProductImgFile.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          currentNewProductImage = await DataStore.compressImageFile(file, 900, 0.78);
          if (newProductImgPreview) newProductImgPreview.src = currentNewProductImage;
        } catch (err) {
          newProductImgFile.value = "";
          showToast(err.message || "Only JPG, JPEG, PNG, and WEBP images under 3 MB are allowed.", "error");
        }
      }
    });
  }

  newProductPresetThumbs.forEach(thumb => {
    thumb.addEventListener("click", () => {
      newProductPresetThumbs.forEach(t => t.classList.remove("selected"));
      thumb.classList.add("selected");
      currentNewProductImage = thumb.getAttribute("data-src");
      if (newProductImgPreview) newProductImgPreview.src = currentNewProductImage;
    });
  });

  // Handle Add Product Form Submission
  const addProductForm = document.getElementById("addProductForm");
  if (addProductForm) {
    addProductForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("newProductName").value.trim();
      const category = document.getElementById("newProductCategory").value;
      const price = parseFloat(document.getElementById("newProductPrice").value);
      const oldPrice = parseFloat(document.getElementById("newProductOldPrice").value) || 0;
      const inStock = document.getElementById("newProductInStock").checked;
      const featured = document.getElementById("newProductFeatured").checked;
      const shortDesc = document.getElementById("newProductShortDesc").value.trim();
      const description = document.getElementById("newProductDesc").value.trim();
      const benefits = document.getElementById("newProductBenefits").value.trim();
      const ingredients = document.getElementById("newProductIngredients").value.trim();
      const usage = document.getElementById("newProductUsage").value.trim();

      if (!name || isNaN(price)) {
        showToast("Please provide product name and valid price.", "error");
        return;
      }

      try {
        await DataStore.addProductAsync({
          name,
          category,
          price,
          oldPrice,
          inStock,
          featured,
          image: currentNewProductImage,
          shortDesc,
          description,
          benefits,
          ingredients,
          usage
        });

        showToast(`Successfully added "${name}" to shop!`, "success");
        addProductForm.reset();
        refreshDashboard();
        document.getElementById("addProductModal")?.classList.remove("active");
      } catch (err) {
        showToast(err.message || "Failed to add product", "error");
      }
    });
  }

  // Handle Edit Product Form Submission
  const editProductForm = document.getElementById("editProductForm");
  const editProductImgFile = document.getElementById("editProductImgFile");
  const editProductImgPreview = document.getElementById("editProductImgPreview");
  const editProductPresetThumbs = document.querySelectorAll("#editProductPresets .preset-thumb");

  if (editProductImgFile) {
    editProductImgFile.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          currentEditProductImage = await DataStore.compressImageFile(file, 900, 0.78);
          if (editProductImgPreview) editProductImgPreview.src = currentEditProductImage;
        } catch (err) {
          editProductImgFile.value = "";
          showToast(err.message || "Only JPG, JPEG, PNG, and WEBP images under 3 MB are allowed.", "error");
        }
      }
    });
  }

  editProductPresetThumbs.forEach(thumb => {
    thumb.addEventListener("click", () => {
      editProductPresetThumbs.forEach(t => t.classList.remove("selected"));
      thumb.classList.add("selected");
      currentEditProductImage = thumb.getAttribute("data-src");
      if (editProductImgPreview) editProductImgPreview.src = currentEditProductImage;
    });
  });

  if (editProductForm) {
    editProductForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id = document.getElementById("editProductId").value;
      const name = document.getElementById("editProductName").value.trim();
      const category = document.getElementById("editProductCategory").value;
      const price = parseFloat(document.getElementById("editProductPrice").value);
      const oldPrice = parseFloat(document.getElementById("editProductOldPrice").value) || 0;
      const inStock = document.getElementById("editProductInStock").checked;
      const featured = document.getElementById("editProductFeatured").checked;
      const shortDesc = document.getElementById("editProductShortDesc").value.trim();
      const description = document.getElementById("editProductDesc").value.trim();
      const benefits = document.getElementById("editProductBenefits").value.trim();
      const ingredients = document.getElementById("editProductIngredients").value.trim();
      const usage = document.getElementById("editProductUsage").value.trim();

      try {
        await DataStore.updateProductAsync(id, {
          name,
          category,
          price,
          oldPrice,
          inStock,
          featured,
          image: currentEditProductImage,
          shortDesc,
          description,
          benefits,
          ingredients,
          usage
        });

        showToast(`Updated "${name}" successfully!`, "success");
        refreshDashboard();
        document.getElementById("editProductModal")?.classList.remove("active");
      } catch (err) {
        showToast(err.message || "Failed to update product", "error");
      }
    });
  }

  // Reset products button
  const resetProdsBtn = document.getElementById("btnResetProducts");
  if (resetProdsBtn) {
    resetProdsBtn.addEventListener("click", async () => {
      if (confirm("Are you sure you want to restore default products? All custom products will be reset.")) {
        try {
          await DataStore.resetProductsAsync();
          showToast("Products restored to defaults", "info");
          refreshDashboard();
        } catch (err) {
          showToast(err.message || "Failed to reset products", "error");
        }
      }
    });
  }
}

// Render Products Table
function renderProductsTable() {
  const tbody = document.getElementById("adminProductsTableBody");
  if (!tbody) return;

  const products = DataStore.getProducts();

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px;">No products found. Click "+ Add Product" to add your first remedy!</td></tr>`;
    return;
  }

  let html = "";
  products.forEach(p => {
    html += `
      <tr>
        <td>
          <img src="${p.image}" alt="${p.name}" class="admin-product-thumb" onerror="this.src='images/brand-logo.jpeg'">
        </td>
        <td>
          <strong>${p.name}</strong>
          <div style="font-size: 0.78rem; color: var(--admin-muted);">${p.shortDesc ? p.shortDesc.slice(0, 60) + '...' : ''}</div>
        </td>
        <td><span class="badge badge-herbal">${p.category}</span></td>
        <td>
          <strong>₦${p.price.toLocaleString()}</strong>
          ${p.oldPrice ? `<div style="font-size: 0.78rem; color: #888; text-decoration: line-through;">₦${p.oldPrice.toLocaleString()}</div>` : ''}
        </td>
        <td>
          ${p.inStock !== false 
            ? '<span class="badge-stock"><i class="fas fa-check"></i> In Stock</span>' 
            : '<span class="badge-out-of-stock"><i class="fas fa-times"></i> Out of Stock</span>'}
        </td>
        <td>
          <div class="action-btn-group">
            <button class="btn-icon-action btn-icon-edit" onclick="openEditProductModal('${p.id}')" title="Edit Product">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon-action btn-icon-delete" onclick="confirmDeleteProduct('${p.id}', '${p.name.replace(/'/g, "\\'")}')" title="Delete Product">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// Edit Modal Launcher
window.openEditProductModal = (id) => {
  const product = DataStore.getProductById(id);
  if (!product) return;

  const modal = document.getElementById("editProductModal");
  if (!modal) return;

  document.getElementById("editProductId").value = product.id;
  document.getElementById("editProductName").value = product.name;
  populateCategorySelects(product.category);
  document.getElementById("editProductCategory").value = product.category;
  document.getElementById("editProductPrice").value = product.price;
  document.getElementById("editProductOldPrice").value = product.oldPrice || "";
  document.getElementById("editProductInStock").checked = product.inStock !== false;
  document.getElementById("editProductFeatured").checked = Boolean(product.featured);
  document.getElementById("editProductShortDesc").value = product.shortDesc || "";
  document.getElementById("editProductDesc").value = product.description || "";
  document.getElementById("editProductBenefits").value = Array.isArray(product.benefits) ? product.benefits.join("\n") : (product.benefits || "");
  document.getElementById("editProductIngredients").value = product.ingredients || "";
  document.getElementById("editProductUsage").value = product.usage || "";

  currentEditProductImage = product.image;
  const editPreview = document.getElementById("editProductImgPreview");
  if (editPreview) editPreview.src = product.image;

  modal.classList.add("active");
};

window.confirmDeleteProduct = async (id, name) => {
  if (confirm(`Are you sure you want to delete "${name}"?`)) {
    try {
      await DataStore.deleteProductAsync(id);
      showToast(`Deleted "${name}"`, "error");
      refreshDashboard();
    } catch (err) {
      showToast(err.message || "Failed to delete product", "error");
    }
  }
};

// Admin Review Management
let currentAdminReviewPhoto = "";
let adminReviewsOffset = 0;
const ADMIN_REVIEWS_LIMIT = 20;

function initAdminReviewForm() {
  const form = document.getElementById("adminPostReviewForm");
  const photoInput = document.getElementById("adminReviewPhotoFile");
  const photoPreview = document.getElementById("adminReviewPhotoPreview");
  const previewWrap = document.getElementById("adminReviewPreviewWrap");
  const removeBtn = document.getElementById("adminRemoveReviewPhotoBtn");
  const prodSelect = document.getElementById("adminReviewProduct");

  // Populate product dropdown
  if (prodSelect) {
    const products = DataStore.getProducts();
    let opts = '<option value="General Wellness Herbs">General Consultation / Herbs</option>';
    products.forEach(p => {
      opts += `<option value="${p.name}">${p.name}</option>`;
    });
    prodSelect.innerHTML = opts;
  }

  if (photoInput) {
    photoInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          currentAdminReviewPhoto = await DataStore.compressImageFile(file, 900, 0.78);
          if (photoPreview && previewWrap) {
            photoPreview.src = currentAdminReviewPhoto;
            previewWrap.style.display = "block";
          }
        } catch (_) {
          showToast("Could not process photo file.", "error");
        }
      }
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener("click", () => {
      currentAdminReviewPhoto = "";
      if (photoInput) photoInput.value = "";
      if (previewWrap) previewWrap.style.display = "none";
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const author = document.getElementById("adminReviewAuthor").value.trim();
      const location = document.getElementById("adminReviewLocation").value.trim();
      const rating = parseInt(document.getElementById("adminReviewRating").value, 10);
      const productName = document.getElementById("adminReviewProduct").value;
      const text = document.getElementById("adminReviewText").value.trim();

      if (!author || !text) {
        showToast("Please enter customer name and review text.", "error");
        return;
      }

      await DataStore.addReviewAsync({
        author,
        location: location || "Nigeria",
        rating,
        productName,
        text,
        photoUrl: currentAdminReviewPhoto,
        isApproved: true,
        isFeatured: true
      });

      showToast("Review successfully posted by Admin!", "success");
      form.reset();
      currentAdminReviewPhoto = "";
      adminReviewsOffset = 0;
      if (previewWrap) previewWrap.style.display = "none";
      refreshDashboard();
      document.getElementById("adminAddReviewModal")?.classList.remove("active");
    });
  }

  const resetReviewsBtn = document.getElementById("btnResetReviews");
  if (resetReviewsBtn) {
    resetReviewsBtn.addEventListener("click", async () => {
      if (confirm("Reset all reviews to default customer testimonials?")) {
        await DataStore.resetReviewsAsync();
        adminReviewsOffset = 0;
        showToast("Reviews reset to default testimonials", "info");
        refreshDashboard();
      }
    });
  }
}

// Render Reviews Table (Paginated for 500k+ Scale)
async function renderReviewsTable() {
  const tbody = document.getElementById("adminReviewsTableBody");
  if (!tbody) return;

  const pageData = await DataStore.fetchReviewsPage({
    filter: "all",
    limit: ADMIN_REVIEWS_LIMIT,
    offset: adminReviewsOffset,
    includeHidden: true
  });

  const reviews = pageData.items || [];
  const totalCount = pageData.totalFiltered || 0;

  if (reviews.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px;">No reviews recorded. Use the form above to add one!</td></tr>`;
    renderAdminReviewsPagination(tbody, 0, 0);
    return;
  }

  let html = "";
  reviews.forEach(r => {
    const safeAuthor = (r.author || "").replace(/'/g, "\\'");
    html += `
      <tr>
        <td>
          <strong>${r.author}</strong>
          <div style="font-size: 0.78rem; color: var(--admin-muted);">${r.location}</div>
        </td>
        <td>
          <div style="color: var(--admin-gold); font-size: 0.85rem;">
            ${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}
          </div>
          <span style="font-size: 0.78rem; color: var(--admin-muted);">${r.productName || "Herbs"}</span>
        </td>
        <td style="max-width: 300px;">
          <div style="font-size: 0.85rem; line-height: 1.4; color: var(--admin-text);">
            "${r.text}"
          </div>
        </td>
        <td>
          ${r.photoUrl ? `
            <img src="${r.photoUrl}" alt="Review proof" loading="lazy" style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px; cursor: pointer;" onclick="window.openPhotoLightbox('${r.photoUrl}', '${safeAuthor}')">
          ` : '<span style="font-size: 0.78rem; color: #999;">Text Only</span>'}
        </td>
        <td>
          <button class="btn btn-sm ${r.isApproved !== false ? 'btn-primary' : 'btn-outline'}" style="padding: 4px 10px; font-size: 0.75rem;" onclick="toggleReviewStatus('${r.id}')">
            ${r.isApproved !== false ? '<i class="fas fa-eye"></i> Visible' : '<i class="fas fa-eye-slash"></i> Hidden'}
          </button>
        </td>
        <td>
          <button class="btn-icon-action btn-icon-delete" onclick="confirmDeleteReview('${r.id}')" title="Delete Review">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  renderAdminReviewsPagination(tbody, reviews.length, totalCount);
}

function renderAdminReviewsPagination(tbody, currentCount, totalCount) {
  const tableWrap = tbody.closest(".admin-table-wrap");
  if (!tableWrap) return;

  let pager = document.getElementById("adminReviewsPager");
  if (!pager) {
    pager = document.createElement("div");
    pager.id = "adminReviewsPager";
    pager.style.cssText = "display: flex; align-items: center; justify-content: space-between; margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--admin-border); font-size: 0.85rem;";
    tableWrap.insertAdjacentElement("afterend", pager);
  }

  if (totalCount <= ADMIN_REVIEWS_LIMIT && adminReviewsOffset === 0) {
    pager.innerHTML = `<span style="color: var(--admin-muted);">Showing all ${totalCount.toLocaleString()} reviews</span><div></div>`;
    return;
  }

  const startNum = adminReviewsOffset + 1;
  const endNum = adminReviewsOffset + currentCount;
  const hasPrev = adminReviewsOffset > 0;
  const hasNext = endNum < totalCount;

  pager.innerHTML = `
    <span style="color: var(--admin-muted);">
      Showing <strong>${startNum.toLocaleString()} - ${endNum.toLocaleString()}</strong> of <strong>${totalCount.toLocaleString()}</strong> reviews
    </span>
    <div style="display: flex; gap: 8px;">
      <button type="button" class="btn btn-outline btn-sm" ${hasPrev ? "" : "disabled"} onclick="changeAdminReviewPage(-1)">
        <i class="fas fa-chevron-left"></i> Prev
      </button>
      <button type="button" class="btn btn-outline btn-sm" ${hasNext ? "" : "disabled"} onclick="changeAdminReviewPage(1)">
        Next <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  `;
}

window.changeAdminReviewPage = (dir) => {
  adminReviewsOffset = Math.max(0, adminReviewsOffset + dir * ADMIN_REVIEWS_LIMIT);
  renderReviewsTable();
};

window.toggleReviewStatus = async (id) => {
  try {
    await DataStore.toggleReviewApprovalAsync(id);
    refreshDashboard();
    showToast("Review visibility updated", "info");
  } catch (err) {
    showToast(err.message || "Failed to update review", "error");
  }
};

window.confirmDeleteReview = async (id) => {
  if (confirm("Are you sure you want to permanently delete this review?")) {
    try {
      await DataStore.deleteReviewAsync(id);
      refreshDashboard();
      showToast("Review removed", "error");
    } catch (err) {
      showToast(err.message || "Failed to delete review", "error");
    }
  }
};

// Settings Tab (Server-side Bcrypt PIN Update & Admin-Only Database Export)
function initSettingsForm() {
  const pinForm = document.getElementById("changePinForm");
  const exportBtn = document.getElementById("btnExportBackup");

  if (pinForm) {
    pinForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newPin = document.getElementById("newAdminPin").value.trim();

      if (newPin.length < 6) {
        showToast("PIN must be at least 6 characters.", "error");
        return;
      }

      try {
        await DataStore.updateAdminPinAsync(newPin);
        showToast("Admin PIN hashed and updated on server!", "success");
        pinForm.reset();
      } catch (err) {
        showToast(err.message || "Failed to update PIN", "error");
      }
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", async () => {
      try {
        const data = await DataStore.exportDatabaseBackupAsync();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `successful_herbs_backup_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Database backup exported from server", "success");
      } catch (err) {
        showToast(err.message || "Unauthorized to export database backup", "error");
      }
    });
  }
}
