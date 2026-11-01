/**
 * SUCCESSFUL WELLNESS HERBS - Core Data & LocalStorage Management
 * Brand: Successful Wellness Herbs (Your Path To Natural Wellness)
 */

const BUSINESS_CONFIG = {
  name: "SUCCESSFUL WELLNESS HERBS",
  shortName: "Successful Herbs",
  tagline: "Your Path To Natural Wellness",
  phone1: "0814 888 0378",
  phone2: "+234 902 864 6068",
  whatsapp1: "2348148880378",
  whatsapp2: "2349028646068",
  email: "Successfulwellnessherbs@gmail.com",
  address: "Ojere via Moshood ABIOLA polytechnic Pansheke Abeokuta Ogun state Nigeria",
  logo: "images/brand-logo.jpeg",
  currency: "₦"
};

// Default initial products catalog
const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: "Successful Herbal Mixture (Supreme Immunity & Vitality)",
    category: "Immunity & Detox",
    price: 12500,
    oldPrice: 15000,
    rating: 5.0,
    reviewCount: 38,
    image: "images/product-herbal-mixture.jpg",
    featured: true,
    inStock: true,
    shortDesc: "Our flagship traditional herbal blend formulated to strengthen the immune system, purify the blood, and restore overall vitality.",
    description: "Successful Herbal Mixture is our mastercrafted traditional formula prepared with time-tested roots, bark extracts, and wildcrafted organic herbs. It works from within to eliminate toxins, invigorate organ function, boost metabolic energy, and reinforce natural body defenses against recurrent ailments.",
    benefits: [
      "Purifies the bloodstream and flushes deep body toxins",
      "Strengthens natural immune defense against infections",
      "Restores energy levels, mental clarity, and body stamina",
      "Supports healthy liver, kidney, and cardiovascular function",
      "100% natural organic extraction with zero artificial chemicals"
    ],
    ingredients: "Bitter leaf (Vernonia amygdalina), Ginger root, Turmeric, Moringa oleifera, Licorice root, Indigenous Nigerian forest roots and bark extracts.",
    usage: "Take 1 small tot glass (approx. 30ml - 50ml) morning before breakfast and evening after dinner. Shake vigorously before use."
  },
  {
    id: "p2",
    name: "Pure Organic Detox & Cleansing Tonic",
    category: "Immunity & Detox",
    price: 14000,
    oldPrice: 17000,
    rating: 4.9,
    reviewCount: 29,
    image: "images/product-detox-tonic.jpg",
    featured: true,
    inStock: true,
    shortDesc: "Deep internal flush tonic for cleansing accumulated body waste, liver rejuvenation, and digestive wellness.",
    description: "An intensive botanical detox tonic infused with wild moringa, fresh lime extract, indigenous digestive herbs, and cleansing seed extracts. Formulated specifically to rid the body of heavy toxins, combat bloating, and promote full metabolic revitalization.",
    benefits: [
      "Eliminates trapped bowel toxins and relieves chronic constipation",
      "Recharges liver function and cleanses fatty deposits",
      "Eases persistent stomach bloating and heavy indigestion",
      "Leaves skin clear and refreshed by purifying bodily fluids"
    ],
    ingredients: "Wild Moringa leaves, Senna leaves, Lime extract, Dandelion root, Milk Thistle extract, Herbal mint essence.",
    usage: "Take 1 shot glass (40ml) every morning with warm water for 7 consecutive days for thorough cleansing."
  },
  {
    id: "p3",
    name: "Natural Herbal Vitality & Stamina Tincture",
    category: "Vitality & Strength",
    price: 15000,
    oldPrice: 18500,
    rating: 5.0,
    reviewCount: 46,
    image: "images/product-vitality-extract.jpg",
    featured: true,
    inStock: true,
    shortDesc: "High-potency organic root extract designed for stamina, physical endurance, hormonal balance, and all-day energy.",
    description: "Formulated for both men and women needing authentic herbal rejuvenation. Concentrated extraction of wild African ginseng, ashwagandha, cloves, and precious bark extracts designed to revive flagging energy, boost libido, and enhance daily performance.",
    benefits: [
      "Supercharges physical stamina and combats fatigue",
      "Improves blood circulation and cardiovascular vitality",
      "Supports balanced male & female reproductive hormones",
      "Enhances mental alertness and reduces physical stress"
    ],
    ingredients: "African wild Ginseng, Ashwagandha, Cloves, Cinnamon bark, Mondia whitei (Isirigun), Nutmeg extract.",
    usage: "Use dropper to place 15-20 drops under tongue or dilute in 100ml warm water, once or twice daily."
  },
  {
    id: "p4",
    name: "Gastric Soothe Anti-Ulcer Herbal Brew",
    category: "Digestion & Ulcer",
    price: 11500,
    oldPrice: 14000,
    rating: 4.8,
    reviewCount: 24,
    image: "images/product-herbal-mixture.jpg",
    featured: false,
    inStock: true,
    shortDesc: "Soothing mucilage-rich herbal blend designed to calm gastric burning, heal stomach lining, and neutralize hyperacidity.",
    description: "A gentle yet profoundly healing brew that coats the stomach lining, reduces harsh gastric acid burn, alleviates peptic ulcer distress, and repairs inflamed gastrointestinal walls naturally without harsh drugs.",
    benefits: [
      "Neutralizes stomach hyper-acidity and chest burn quickly",
      "Promotes rapid regeneration of stomach and intestinal lining",
      "Eases painful hunger pangs and ulcer contractions",
      "Gentle on sensitive digestive tracts"
    ],
    ingredients: "Slippery elm bark, Raw cabbage leaf extract, Deglycyrrhizinated licorice, Plantain root, Aloe vera gel.",
    usage: "Take 2 tablespoons 30 minutes before meals, 3 times daily."
  },
  {
    id: "p5",
    name: "Hormonal Harmony & Fertility Roots Blend",
    category: "Hormonal & Fertility",
    price: 16500,
    oldPrice: 20000,
    rating: 5.0,
    reviewCount: 31,
    image: "images/product-vitality-extract.jpg",
    featured: true,
    inStock: true,
    shortDesc: "Traditional womb and reproductive herbal preparation for menstrual regulation, womb cleansing, and natural fertility.",
    description: "Prepared according to sacred Nigerian herbal heritage, this blend targets hormonal imbalances, painful or irregular menstruation, cysts, and cleanses the reproductive system to foster optimal fertility and wellness.",
    benefits: [
      "Normalizes erratic menstrual cycles and stops excessive cramps",
      "Naturally dissolves mild blockages and flushes residual fluids",
      "Balances estrogen and progesterone levels naturally",
      "Nourishes the womb environment for reproductive health"
    ],
    ingredients: "Chasteberry, Wild yam root, Red raspberry leaf, African ginger root, Maca extract, indigenous cleansing herbs.",
    usage: "Take 1 glass cup twice daily from the end of menstruation for 21 days."
  },
  {
    id: "p6",
    name: "Radiant Skin Glow & Herbal Soap Elixir",
    category: "Skin Wellness",
    price: 9500,
    oldPrice: 12000,
    rating: 4.9,
    reviewCount: 22,
    image: "images/product-detox-tonic.jpg",
    featured: false,
    inStock: true,
    shortDesc: "Therapeutic herbal cleansing wash and elixir for clearing stubborn blemishes, eczema, skin rashes, and restoring natural radiance.",
    description: "Crafted with pure organic neem, African black soap base, turmeric, and soothing botanical oils to heal infected skin, clear body acne, soothe rashes, and give your skin a natural healthy glow.",
    benefits: [
      "Clears acne, body spots, and chronic blemishes",
      "Soothes itching, eczema, ringworm, and fungal irritations",
      "Unclogs pores without stripping natural moisture",
      "Brightens complexion using purely natural botanical enzymes"
    ],
    ingredients: "Raw Neem leaf extract, Pure Turmeric, Aloe vera gel, African black soap, Tea tree oil, Shea butter oil.",
    usage: "Lather onto damp skin, allow to sit for 3 minutes, then rinse off thoroughly with clean water."
  }
];

// Default customer reviews (featuring both picture and text reviews)
const DEFAULT_REVIEWS = [
  {
    id: "rev1",
    author: "Alhaji Ibrahim Olawale",
    location: "Abeokuta, Ogun State",
    rating: 5,
    date: "2026-10-21",
    productName: "Successful Herbal Mixture (Supreme Immunity & Vitality)",
    text: "I bought this herbal mixture directly at their Pansheke Abeokuta branch. For months I had persistent body weakness and malaria recurrence. After completing just 1 bottle, my energy returned completely and my digestion is smooth. Very potent traditional medicine prepared with high hygiene!",
    photoUrl: "images/product-herbal-mixture.jpg",
    isApproved: true,
    isFeatured: true
  },
  {
    id: "rev2",
    author: "Mrs. Blessing Adeyemi",
    location: "Ikeja, Lagos State",
    rating: 5,
    date: "2026-10-18",
    productName: "Pure Organic Detox & Cleansing Tonic",
    text: "Ordered through WhatsApp and got it delivered to Lagos within 24 hours. The detox tonic worked like magic on my stubborn belly bloating and heaviness. I feel 5kg lighter and my skin is glowing naturally! Highly recommended.",
    photoUrl: "images/product-detox-tonic.jpg",
    isApproved: true,
    isFeatured: true
  },
  {
    id: "rev3",
    author: "Engr. Kenneth Nwosu",
    location: "Port Harcourt, Rivers",
    rating: 5,
    date: "2026-10-12",
    productName: "Natural Herbal Vitality & Stamina Tincture",
    text: "Top tier herbs! At 48 years old, daily stress on site was draining me. The Vitality Tincture has given me tremendous stamina and restored my peak vitality. I appreciate the polite customer support on WhatsApp too.",
    photoUrl: "",
    isApproved: true,
    isFeatured: true
  },
  {
    id: "rev4",
    author: "Sister Kemi F.",
    location: "Ibadan, Oyo State",
    rating: 5,
    date: "2026-10-05",
    productName: "Gastric Soothe Anti-Ulcer Herbal Brew",
    text: "No more burning in my stomach whenever I skip food! This herbal brew heals ulcer from the root. God bless Successful Wellness Herbs for this wonderful remedy.",
    photoUrl: "",
    isApproved: true,
    isFeatured: true
  },
  {
    id: "rev5",
    author: "Madam Folashade S.",
    location: "Pansheke, Abeokuta",
    rating: 5,
    date: "2026-09-28",
    productName: "Hormonal Harmony & Fertility Roots Blend",
    text: "My menstrual cycle was irregular for over 8 months. Two weeks into using this blend, my period came smoothly without pain. Truly your path to natural wellness. Thank you!",
    photoUrl: "images/product-vitality-extract.jpg",
    isApproved: true,
    isFeatured: true
  }
];

// Default product categories
const DEFAULT_CATEGORIES = [
  "Immunity & Detox",
  "Vitality & Strength",
  "Digestion & Ulcer",
  "Hormonal & Fertility",
  "Skin Wellness",
  "General Health"
];

// LocalStorage Keys (Cart & Session Token)
const STORAGE_KEYS = {
  REVIEWS: "swh_reviews_v1",
  CART: "swh_cart_v1",
  ADMIN_TOKEN: "swh_admin_token_v1"
};

let _productsCache = [...DEFAULT_PRODUCTS];
let _categoriesCache = [...DEFAULT_CATEGORIES];

// Storage & Server API Utilities
const DataStore = {
  // Admin Auth Token Helper
  getAdminToken() {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || "";
  },

  setAdminToken(token) {
    if (token) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    }
  },

  getAuthHeaders(extra = {}) {
    const token = this.getAdminToken();
    return token
      ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}`, ...extra }
      : { "Content-Type": "application/json", ...extra };
  },

  // Sync Products & Categories from Server Database (/api/products)
  async syncFromServer() {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          _productsCache = data.items;
        }
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          _categoriesCache = data.categories;
        }
        window.dispatchEvent(new Event("categoriesUpdated"));
        window.dispatchEvent(new Event("productsUpdated"));
        return data;
      }
    } catch (e) {
      console.error("Failed to sync products from server:", e);
    }
    return { items: _productsCache, categories: _categoriesCache };
  },

  // Categories
  getCategories() {
    return [..._categoriesCache];
  },

  async addCategoryAsync(name) {
    if (!name || !name.trim()) return null;
    const clean = name.trim();
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name: clean })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to add category");
    }
    const data = await res.json();
    if (Array.isArray(data.items)) {
      _categoriesCache = data.items;
      window.dispatchEvent(new Event("categoriesUpdated"));
    }
    return data.name || clean;
  },

  async deleteCategoryAsync(name) {
    if (!name) return false;
    const res = await fetch(`/api/categories/${encodeURIComponent(name)}`, {
      method: "DELETE",
      headers: this.getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete category");
    }
    const data = await res.json();
    if (Array.isArray(data.items)) {
      _categoriesCache = data.items;
      window.dispatchEvent(new Event("categoriesUpdated"));
    }
    return true;
  },

  // Products (Loaded from /api/products)
  getProducts() {
    return [..._productsCache];
  },

  getProductById(id) {
    return _productsCache.find(p => p.id === id) || null;
  },

  async addProductAsync(productData) {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to add product");
    }
    const data = await res.json();
    if (data.item) {
      _productsCache.unshift(data.item);
      if (data.item.category && !_categoriesCache.includes(data.item.category)) {
        _categoriesCache.push(data.item.category);
        window.dispatchEvent(new Event("categoriesUpdated"));
      }
      window.dispatchEvent(new Event("productsUpdated"));
    }
    return data.item;
  },

  async updateProductAsync(id, updatedFields) {
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updatedFields)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update product");
    }
    const data = await res.json();
    if (data.item) {
      const idx = _productsCache.findIndex(p => p.id === id);
      if (idx > -1) _productsCache[idx] = data.item;
      window.dispatchEvent(new Event("productsUpdated"));
    }
    return data.item;
  },

  async deleteProductAsync(id) {
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: this.getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete product");
    }
    _productsCache = _productsCache.filter(p => p.id !== id);
    window.dispatchEvent(new Event("productsUpdated"));
    return true;
  },

  async resetProductsAsync() {
    const res = await fetch("/api/products/reset", {
      method: "POST",
      headers: this.getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to reset products");
    }
    const data = await res.json();
    if (Array.isArray(data.items)) _productsCache = data.items;
    if (Array.isArray(data.categories)) _categoriesCache = data.categories;
    window.dispatchEvent(new Event("categoriesUpdated"));
    window.dispatchEvent(new Event("productsUpdated"));
    return _productsCache;
  },

  // Client-side Image Validation & Compression (Accepts only JPG, JPEG, PNG, WEBP <= 3 MB)
  compressImageFile(file, maxDimension = 900, quality = 0.78) {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new Error("No image file provided."));
      }
      const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const extMatch = (file.name || "").toLowerCase().match(/\.(jpg|jpeg|png|webp)$/);
      if (!allowedMimes.includes((file.type || "").toLowerCase()) || !extMatch) {
        return reject(new Error("Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed."));
      }
      if (file.size > 3 * 1024 * 1024) {
        return reject(new Error("Image file is too large. Maximum allowed size is 3 MB."));
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error("Corrupted or invalid image file."));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error("Failed to read image file."));
      reader.readAsDataURL(file);
    });
  },

  // Reviews (Scalable SQLite API + LocalStorage Fallback)
  getReviews() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error reading reviews:", e);
    }
    this.saveReviews(DEFAULT_REVIEWS);
    return DEFAULT_REVIEWS;
  },

  saveReviews(reviews) {
    try {
      // Keep local cache capped at 100 latest items so localStorage never overflows
      const capped = Array.isArray(reviews) ? reviews.slice(0, 100) : [];
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(capped));
      window.dispatchEvent(new Event("reviewsUpdated"));
      return true;
    } catch (e) {
      console.warn("LocalStorage full, keeping most recent 25 reviews in local cache:", e);
      try {
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify((reviews || []).slice(0, 25)));
      } catch (_) {}
      return false;
    }
  },

  async fetchReviewsPage({ filter = "all", limit = 9, offset = 0, includeHidden = false } = {}) {
    try {
      const params = new URLSearchParams({
        filter,
        limit: String(limit),
        offset: String(offset),
        includeHidden: includeHidden ? "1" : "0"
      });
      const res = await fetch(`/api/reviews?${params.toString()}`, {
        headers: includeHidden ? this.getAuthHeaders() : {}
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {
      // Fallback to local reviews when running without server.js
    }

    const all = this.getReviews();
    let filtered = includeHidden ? all : all.filter(r => r.isApproved !== false);
    if (filter === "photos") {
      filtered = filtered.filter(r => Boolean(r.photoUrl));
    } else if (filter === "five_star") {
      filtered = filtered.filter(r => r.rating === 5);
    }
    const items = filtered.slice(offset, offset + limit);
    const approved = all.filter(r => r.isApproved !== false);
    const avg = approved.length
      ? Number((approved.reduce((s, r) => s + Number(r.rating || 5), 0) / approved.length).toFixed(1))
      : 5.0;

    return {
      items,
      totalFiltered: filtered.length,
      hasMore: offset + items.length < filtered.length,
      stats: {
        totalAll: all.length,
        totalApproved: approved.length,
        totalPhotos: all.filter(r => Boolean(r.photoUrl)).length,
        avgRating: avg
      }
    };
  },

  addReview(reviewData) {
    const reviews = this.getReviews();
    const newReview = {
      id: "rev_" + Date.now(),
      author: reviewData.author || "Anonymous Customer",
      location: reviewData.location || "Nigeria",
      rating: Number(reviewData.rating) || 5,
      date: new Date().toISOString().split("T")[0],
      productName: reviewData.productName || "Successful Wellness Herbs",
      text: reviewData.text || "",
      photoUrl: reviewData.photoUrl || "",
      isApproved: reviewData.isApproved !== undefined ? reviewData.isApproved : true,
      isFeatured: Boolean(reviewData.isFeatured)
    };
    reviews.unshift(newReview);
    this.saveReviews(reviews);
    return newReview;
  },

  async addReviewAsync(reviewData) {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to submit review");
    }
    const data = await res.json();
    const reviews = this.getReviews();
    reviews.unshift(data.item);
    this.saveReviews(reviews);
    return data.item;
  },

  toggleReviewApproval(id) {
    const reviews = this.getReviews();
    const review = reviews.find(r => r.id === id);
    if (review) {
      review.isApproved = !review.isApproved;
      this.saveReviews(reviews);
      return review;
    }
    return null;
  },

  async toggleReviewApprovalAsync(id) {
    const res = await fetch(`/api/reviews/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: this.getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Unauthorized to update review");
    }
    const data = await res.json();
    this.toggleReviewApproval(id);
    return data.item;
  },

  deleteReview(id) {
    let reviews = this.getReviews();
    reviews = reviews.filter(r => r.id !== id);
    this.saveReviews(reviews);
    return true;
  },

  async deleteReviewAsync(id) {
    const res = await fetch(`/api/reviews/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: this.getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Unauthorized to delete review");
    }
    this.deleteReview(id);
    return true;
  },

  resetReviews() {
    this.saveReviews(DEFAULT_REVIEWS);
    return DEFAULT_REVIEWS;
  },

  async resetReviewsAsync() {
    const res = await fetch("/api/reviews/reset", {
      method: "POST",
      headers: this.getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Unauthorized to reset reviews");
    }
    return this.resetReviews();
  },

  // Cart Management
  getCart() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (e) {
      console.error("Error saving cart:", e);
    }
  },

  addToCart(productId, quantity = 1) {
    const product = this.getProductById(productId);
    if (!product) return false;

    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity
      });
    }
    this.saveCart(cart);
    return true;
  },

  updateCartQty(productId, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
    } else {
      const item = cart.find(i => i.id === productId);
      if (item) item.quantity = quantity;
    }
    this.saveCart(cart);
  },

  removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== productId);
    this.saveCart(cart);
  },

  clearCart() {
    this.saveCart([]);
  },

  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  // WhatsApp Order Link Generator
  buildWhatsAppOrderUrl(customerDetails = {}) {
    const cart = this.getCart();
    if (cart.length === 0) return null;

    const total = this.getCartTotal();
    const phone = BUSINESS_CONFIG.whatsapp1;

    let itemsText = "";
    cart.forEach((item, index) => {
      itemsText += `${index + 1}. *${item.name}*\n   Qty: ${item.quantity} | ₦${(item.price * item.quantity).toLocaleString()}\n`;
    });

    const message = 
`🌿 *NEW ORDER - SUCCESSFUL WELLNESS HERBS* 🌿
----------------------------------------
*Customer Name:* ${customerDetails.name || "Customer"}
*Phone Number:* ${customerDetails.phone || "Not specified"}
*Delivery Address:* ${customerDetails.address || "Ojere / Abeokuta pickup"}
*City / State:* ${customerDetails.cityState || "Ogun State"}
${customerDetails.notes ? `*Special Notes:* ${customerDetails.notes}\n` : ""}----------------------------------------
*ITEMS ORDERED:*
${itemsText}----------------------------------------
*TOTAL AMOUNT:* ₦${total.toLocaleString()}
----------------------------------------
Hello *Successful Wellness Herbs*, I would like to place and confirm this order for immediate processing and delivery!`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encoded}`;
  },

  // WhatsApp Quick Inquiry Link Generator
  buildWhatsAppInquiryUrl(messageText, productName = "") {
    const phone = BUSINESS_CONFIG.whatsapp1;
    let baseText = `Hello *Successful Wellness Herbs*,\n\nI am contacting you from your website regarding ${productName ? `*${productName}*` : "natural herbal remedies"}.\n\n${messageText || "I would like to inquire about your remedies and herbal consultation."}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(baseText)}`;
  },

  // Server-Side Admin Authentication & PIN Security (Bcrypt Hashed + Token Protected)
  async loginAdminAsync(enteredPin) {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: (enteredPin || "").trim() })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Incorrect Admin PIN.");
    }
    const data = await res.json();
    this.setAdminToken(data.token);
    return data.token;
  },

  async logoutAdminAsync() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: this.getAuthHeaders()
      });
    } catch (_) {}
    this.setAdminToken("");
  },

  async verifyAdminSessionAsync() {
    const token = this.getAdminToken();
    if (!token) return false;
    try {
      const res = await fetch("/api/admin/session", {
        headers: this.getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.authenticated) this.setAdminToken("");
        return Boolean(data.authenticated);
      }
    } catch (_) {}
    return false;
  },

  async updateAdminPinAsync(newPin) {
    const cleanPin = (newPin || "").trim();
    if (cleanPin.length < 6) {
      throw new Error("PIN must be at least 6 characters.");
    }
    const res = await fetch("/api/admin/pin", {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ newPin: cleanPin })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update Admin PIN");
    }
    return true;
  },

  async exportDatabaseBackupAsync() {
    const res = await fetch("/api/admin/export", {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Unauthorized to export database backup");
    }
    return await res.json();
  }
};

// Global expose & automatic startup sync from /api/products
window.BUSINESS_CONFIG = BUSINESS_CONFIG;
window.DataStore = DataStore;
DataStore.syncFromServer();
