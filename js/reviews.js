/**
 * SUCCESSFUL WELLNESS HERBS - Customer Reviews & Photo/Text Feedback Module
 * Supports 500k+ reviews via Paginated Fetching, Lazy Loading & Automatic Image Compression
 */

document.addEventListener("DOMContentLoaded", () => {
  initReviewForm();
  renderReviewsSection("all", true);

  window.addEventListener("reviewsUpdated", () => {
    renderReviewsSection(currentReviewFilter, true);
  });
});

let currentRatingSelection = 5;
let uploadedPhotoBase64 = "";
let currentReviewFilter = "all";
let currentReviewOffset = 0;
let loadedReviewsCount = 0;
const REVIEWS_PAGE_SIZE = window.location.pathname.includes("reviews.html") ? 9 : 6;

// Initialize Review Submission Form
function initReviewForm() {
  const starsContainer = document.getElementById("ratingStarPicker");
  const form = document.getElementById("customerReviewForm");
  const photoInput = document.getElementById("reviewPhotoInput");
  const previewWrap = document.getElementById("reviewPhotoPreviewWrap");
  const previewImg = document.getElementById("reviewPhotoPreview");
  const removePhotoBtn = document.getElementById("btnRemoveReviewPhoto");
  const productSelect = document.getElementById("reviewProductSelect");

  // Populate product dropdown if present
  function populateReviewProductSelect() {
    if (productSelect && window.DataStore) {
      const products = DataStore.getProducts();
      let options = '<option value="General Wellness Herbs">General Wellness / Consultation</option>';
      products.forEach(p => {
        options += `<option value="${p.name}">${p.name}</option>`;
      });
      productSelect.innerHTML = options;
    }
  }
  populateReviewProductSelect();
  window.addEventListener("productsUpdated", populateReviewProductSelect);

  // Star Rating Interaction
  if (starsContainer) {
    const stars = starsContainer.querySelectorAll(".rating-star");

    function setStars(val) {
      currentRatingSelection = val;
      stars.forEach(star => {
        const starVal = parseInt(star.getAttribute("data-val"), 10);
        if (starVal <= val) {
          star.classList.add("selected");
          star.classList.remove("far");
          star.classList.add("fas");
        } else {
          star.classList.remove("selected");
          star.classList.remove("fas");
          star.classList.add("far");
        }
      });
    }

    stars.forEach(star => {
      star.addEventListener("click", () => {
        const val = parseInt(star.getAttribute("data-val"), 10);
        setStars(val);
      });

      star.addEventListener("mouseenter", () => {
        const hoverVal = parseInt(star.getAttribute("data-val"), 10);
        stars.forEach(s => {
          const sVal = parseInt(s.getAttribute("data-val"), 10);
          if (sVal <= hoverVal) {
            s.classList.add("hovered");
          } else {
            s.classList.remove("hovered");
          }
        });
      });
    });

    starsContainer.addEventListener("mouseleave", () => {
      stars.forEach(s => s.classList.remove("hovered"));
    });

    setStars(5);
  }

  // Photo Upload Handler (Auto-Compresses to ~45KB JPEG for fast storage & 500k+ scale)
  if (photoInput) {
    photoInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        showToast("Please upload a valid image file (JPG, PNG, JPEG, WEBP)", "error");
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        showToast("Image size too large. Please select an image under 15MB.", "error");
        return;
      }

      try {
        uploadedPhotoBase64 = await DataStore.compressImageFile(file, 900, 0.78);
        if (previewImg && previewWrap) {
          previewImg.src = uploadedPhotoBase64;
          previewWrap.style.display = "block";
        }
      } catch (err) {
        if (photoInput) photoInput.value = "";
        showToast(err.message || "Only JPG, JPEG, PNG, and WEBP images under 3 MB are allowed.", "error");
      }
    });
  }

  // Remove Photo Preview
  if (removePhotoBtn) {
    removePhotoBtn.addEventListener("click", () => {
      uploadedPhotoBase64 = "";
      if (photoInput) photoInput.value = "";
      if (previewWrap) previewWrap.style.display = "none";
    });
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("reviewAuthorName")?.value.trim();
      const location = document.getElementById("reviewLocation")?.value.trim();
      const productName = document.getElementById("reviewProductSelect")?.value || "Successful Wellness Herbs";
      const text = document.getElementById("reviewText")?.value.trim();

      if (!name) {
        showToast("Please enter your name.", "error");
        return;
      }

      if (!text || text.length < 3) {
        showToast("Please write at least 3 characters for your review.", "error");
        return;
      }

      if (text.length > 1000) {
        showToast("Review text cannot exceed 1000 characters.", "error");
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const newReview = {
        author: name,
        location: location || "Nigeria",
        rating: currentRatingSelection,
        productName: productName,
        text: text,
        photoUrl: uploadedPhotoBase64 || ""
      };

      try {
        await DataStore.addReviewAsync(newReview);
        showToast("Thank you! Your review has been successfully posted.", "success");

        // Reset form
        form.reset();
        uploadedPhotoBase64 = "";
        if (previewWrap) previewWrap.style.display = "none";
        if (starsContainer) {
          const stars = starsContainer.querySelectorAll(".rating-star");
          stars.forEach(s => {
            s.classList.add("selected", "fas");
            s.classList.remove("far");
          });
          currentRatingSelection = 5;
        }

        renderReviewsSection(currentReviewFilter, true);
      } catch (err) {
        showToast(err.message || "Failed to submit review.", "error");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
}

function buildReviewCardHTML(r) {
  let starIcons = "";
  for (let i = 1; i <= 5; i++) {
    starIcons += i <= r.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
  }

  const initials = (r.author || "SW")
    .split(" ")
    .map(part => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase() || "SW";

  const safeAuthor = (r.author || "Customer").replace(/'/g, "\\'");

  return `
    <div class="review-card">
      <div class="review-header">
        <div class="reviewer-info">
          <div class="reviewer-avatar">${initials}</div>
          <div>
            <h4 class="reviewer-name">${r.author}</h4>
            <span class="reviewer-location"><i class="fas fa-map-marker-alt" style="margin-right: 4px; color: var(--primary);"></i>${r.location}</span>
          </div>
        </div>
        <div class="review-stars">${starIcons}</div>
      </div>

      ${r.productName ? `<span class="review-product-tag"><i class="fas fa-tag"></i> ${r.productName}</span>` : ""}

      <p class="review-text">"${r.text}"</p>

      ${r.photoUrl ? `
        <div class="review-photo-preview" onclick="openPhotoLightbox('${r.photoUrl}', '${safeAuthor}')" title="Click to view full photo proof">
          <img src="${r.photoUrl}" alt="Customer photo review" loading="lazy" decoding="async" onerror="this.parentElement.style.display='none'">
        </div>
      ` : ""}

      <div class="verified-buyer-badge">
        <i class="fas fa-certificate"></i> Verified Customer Feedback
      </div>
    </div>
  `;
}

// Render Reviews Section with Pagination ("Load More" on reviews.html, capped at 6 on index.html)
async function renderReviewsSection(filterType = "all", resetPagination = true) {
  const container = document.getElementById("reviewsDisplayGrid");
  if (!container || !window.DataStore) return;

  const maxReviewsAttr = parseInt(container.getAttribute("data-max-reviews") || "0", 10);
  const isCappedHome = maxReviewsAttr > 0;
  const pageSize = isCappedHome ? maxReviewsAttr : REVIEWS_PAGE_SIZE;

  if (resetPagination || isCappedHome) {
    currentReviewFilter = filterType;
    currentReviewOffset = 0;
    loadedReviewsCount = 0;
  }

  const pageData = await DataStore.fetchReviewsPage({
    filter: currentReviewFilter,
    limit: pageSize,
    offset: currentReviewOffset,
    includeHidden: false
  });

  const reviews = (pageData.items || []).slice(0, pageSize);
  const totalFiltered = pageData.totalFiltered || 0;

  if ((resetPagination || isCappedHome) && reviews.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #ffffff; border-radius: 12px; border: 1px dashed var(--border-color);">
        <i class="fas fa-comment-dots" style="font-size: 2.5rem; color: var(--text-light); margin-bottom: 12px; display: block;"></i>
        <h4 style="color: var(--primary-deep); margin-bottom: 6px;">No Reviews Found</h4>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Be the first customer to share your healing experience!</p>
      </div>
    `;
    if (!isCappedHome) updateLoadMoreButton(container, false, 0, 0);
    return;
  }

  let html = "";
  reviews.forEach(r => {
    html += buildReviewCardHTML(r);
  });

  if (resetPagination || isCappedHome) {
    container.innerHTML = html;
  } else {
    container.insertAdjacentHTML("beforeend", html);
  }

  loadedReviewsCount += reviews.length;
  currentReviewOffset = loadedReviewsCount;

  if (!isCappedHome) {
    updateLoadMoreButton(container, pageData.hasMore, loadedReviewsCount, totalFiltered);
  }
}

function updateLoadMoreButton(gridContainer, hasMore, shownCount, totalCount) {
  let wrap = document.getElementById("reviewsLoadMoreWrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "reviewsLoadMoreWrap";
    wrap.style.cssText = "text-align: center; margin-top: 32px;";
    gridContainer.insertAdjacentElement("afterend", wrap);
  }

  if (!hasMore || totalCount <= shownCount) {
    if (totalCount > REVIEWS_PAGE_SIZE) {
      wrap.innerHTML = `<span style="font-size: 0.86rem; color: var(--text-muted);">Showing all ${totalCount.toLocaleString()} verified reviews</span>`;
    } else {
      wrap.innerHTML = "";
    }
    return;
  }

  wrap.innerHTML = `
    <div style="margin-bottom: 10px; font-size: 0.85rem; color: var(--text-muted);">
      Showing <strong>${shownCount.toLocaleString()}</strong> of <strong>${totalCount.toLocaleString()}</strong> verified reviews
    </div>
    <button type="button" class="btn btn-outline btn-sm" onclick="loadMoreReviews()">
      <i class="fas fa-plus-circle"></i> Load More Reviews
    </button>
  `;
}

window.loadMoreReviews = () => {
  renderReviewsSection(currentReviewFilter, false);
};

// Lightbox for Photo Reviews
window.openPhotoLightbox = (photoUrl, author) => {
  let lightbox = document.getElementById("reviewPhotoLightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "reviewPhotoLightbox";
    lightbox.className = "modal-overlay";
    lightbox.innerHTML = `
      <div class="modal-card" style="max-width: 600px; padding: 20px; text-align: center; background: #ffffff;">
        <button class="modal-close-btn" onclick="document.getElementById('reviewPhotoLightbox').classList.remove('active')">
          <i class="fas fa-times"></i>
        </button>
        <h4 id="lightboxAuthor" style="font-family: var(--font-heading); color: var(--primary-deep); margin-bottom: 16px;">Photo Proof by ${author}</h4>
        <img id="lightboxImg" src="${photoUrl}" style="width: 100%; max-height: 520px; object-fit: contain; border-radius: 8px;">
      </div>
    `;
    document.body.appendChild(lightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.classList.remove("active");
    });
  } else {
    document.getElementById("lightboxAuthor").textContent = `Photo Proof by ${author}`;
    document.getElementById("lightboxImg").src = photoUrl;
  }

  lightbox.classList.add("active");
};

window.filterReviews = (type) => {
  document.querySelectorAll(".review-filter-btn").forEach(btn => {
    if (btn.getAttribute("data-filter") === type) {
      btn.classList.add("btn-primary");
      btn.classList.remove("btn-outline");
    } else {
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline");
    }
  });
  renderReviewsSection(type, true);
};
