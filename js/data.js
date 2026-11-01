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
  currency: "₦",
  adminPinDefault: "admin123"
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

// LocalStorage Keys
const STORAGE_KEYS = {
  PRODUCTS: "swh_products_v1",
  REVIEWS: "swh_reviews_v1",
  CART: "swh_cart_v1",
  ADMIN_PIN: "swh_admin_pin_v1",
  ORDERS: "swh_orders_v1"
};

// Storage Utilities
const DataStore = {
  // Products
  getProducts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error reading products:", e);
    }
    this.saveProducts(DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  },

  saveProducts(products) {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      window.dispatchEvent(new Event("productsUpdated"));
      return true;
    } catch (e) {
      console.error("Error saving products:", e);
      return false;
    }
  },

  getProductById(id) {
    return this.getProducts().find(p => p.id === id) || null;
  },

  addProduct(productData) {
    const products = this.getProducts();
    const newProduct = {
      id: "prod_" + Date.now(),
      name: productData.name || "Untitled Herbal Product",
      category: productData.category || "General Health",
      price: Number(productData.price) || 0,
      oldPrice: Number(productData.oldPrice) || 0,
      rating: 5.0,
      reviewCount: 0,
      image: productData.image || "images/product-herbal-mixture.jpg",
      featured: Boolean(productData.featured),
      inStock: productData.inStock !== false,
      shortDesc: productData.shortDesc || "",
      description: productData.description || "",
      benefits: Array.isArray(productData.benefits) 
        ? productData.benefits 
        : (productData.benefits || "").split("\n").map(b => b.trim()).filter(Boolean),
      ingredients: productData.ingredients || "100% Wildcrafted Nigerian Herbs",
      usage: productData.usage || "Take as directed by herbalist."
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  },

  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    if (typeof updatedFields.benefits === "string") {
      updatedFields.benefits = updatedFields.benefits.split("\n").map(b => b.trim()).filter(Boolean);
    }
    if (updatedFields.price) updatedFields.price = Number(updatedFields.price);
    if (updatedFields.oldPrice) updatedFields.oldPrice = Number(updatedFields.oldPrice);

    products[index] = { ...products[index], ...updatedFields };
    this.saveProducts(products);
    return products[index];
  },

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    this.saveProducts(products);
    return true;
  },

  resetProducts() {
    this.saveProducts(DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  },

  // Client-side Image Compression (Reduces 4MB+ photos to ~45KB JPEG for fast loading & storage)
  compressImageFile(file, maxDimension = 900, quality = 0.78) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith("image/")) {
        return reject(new Error("Invalid image file"));
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
        img.onerror = () => resolve(event.target.result);
        img.src = event.target.result;
      };
      reader.onerror = reject;
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
      const res = await fetch(`/api/reviews?${params.toString()}`);
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
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData)
      });
      if (res.ok) {
        const data = await res.json();
        const reviews = this.getReviews();
        reviews.unshift(data.item);
        this.saveReviews(reviews);
        return data.item;
      }
    } catch (_) {}
    return this.addReview(reviewData);
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
    try {
      const res = await fetch(`/api/reviews/${encodeURIComponent(id)}`, { method: "PATCH" });
      if (res.ok) {
        const data = await res.json();
        this.toggleReviewApproval(id);
        return data.item;
      }
    } catch (_) {}
    return this.toggleReviewApproval(id);
  },

  deleteReview(id) {
    let reviews = this.getReviews();
    reviews = reviews.filter(r => r.id !== id);
    this.saveReviews(reviews);
    return true;
  },

  async deleteReviewAsync(id) {
    try {
      const res = await fetch(`/api/reviews/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        this.deleteReview(id);
        return true;
      }
    } catch (_) {}
    return this.deleteReview(id);
  },

  resetReviews() {
    this.saveReviews(DEFAULT_REVIEWS);
    return DEFAULT_REVIEWS;
  },

  async resetReviewsAsync() {
    try {
      await fetch("/api/reviews/reset", { method: "POST" });
    } catch (_) {}
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

  // Admin PIN Security
  getAdminPin() {
    const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_PIN);
    return stored && stored.trim().length >= 4 ? stored.trim() : BUSINESS_CONFIG.adminPinDefault;
  },

  setAdminPin(newPin) {
    if (!newPin || newPin.trim().length < 4) return false;
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPin.trim());
    return true;
  },

  resetAdminPin() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_PIN);
    return BUSINESS_CONFIG.adminPinDefault;
  },

  verifyAdminPin(enteredPin) {
    if (!enteredPin) return false;
    const clean = enteredPin.trim();
    const currentPin = this.getAdminPin();
    return clean === currentPin;
  }
};

// Global expose
window.BUSINESS_CONFIG = BUSINESS_CONFIG;
window.DataStore = DataStore;
