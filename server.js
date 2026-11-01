require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, 'data');
const UPLOADS_DIR = process.env.UPLOADS_DIR ? path.resolve(process.env.UPLOADS_DIR) : path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const db = new DatabaseSync(path.join(DATA_DIR, 'herbal_store.db'));
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;

  CREATE TABLE IF NOT EXISTS categories (
    name TEXT PRIMARY KEY,
    sortOrder INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL DEFAULT 0,
    oldPrice REAL NOT NULL DEFAULT 0,
    rating REAL NOT NULL DEFAULT 5.0,
    reviewCount INTEGER NOT NULL DEFAULT 0,
    image TEXT NOT NULL,
    featured INTEGER NOT NULL DEFAULT 0,
    inStock INTEGER NOT NULL DEFAULT 1,
    shortDesc TEXT DEFAULT '',
    description TEXT DEFAULT '',
    benefits TEXT DEFAULT '[]',
    ingredients TEXT DEFAULT '',
    usage TEXT DEFAULT '',
    createdAt INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_products_created ON products(createdAt DESC);
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    location TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5,
    date TEXT NOT NULL,
    productName TEXT,
    text TEXT NOT NULL,
    photoUrl TEXT DEFAULT '',
    hasPhoto INTEGER NOT NULL DEFAULT 0,
    isApproved INTEGER NOT NULL DEFAULT 1,
    isFeatured INTEGER NOT NULL DEFAULT 1,
    createdAt INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(createdAt DESC);
  CREATE INDEX IF NOT EXISTS idx_reviews_approved_created ON reviews(isApproved, createdAt DESC);
  CREATE INDEX IF NOT EXISTS idx_reviews_photo_created ON reviews(isApproved, hasPhoto, createdAt DESC);
  CREATE INDEX IF NOT EXISTS idx_reviews_rating_created ON reviews(isApproved, rating, createdAt DESC);

  CREATE TABLE IF NOT EXISTS admin_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    token TEXT PRIMARY KEY,
    createdAt INTEGER NOT NULL,
    expiresAt INTEGER NOT NULL
  );
`);

// Default Categories
const DEFAULT_CATEGORIES = [
  "Immunity & Detox",
  "Vitality & Strength",
  "Digestion & Ulcer",
  "Hormonal & Fertility",
  "Skin Wellness",
  "General Health"
];

// Default Products
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
    featured: 1,
    inStock: 1,
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
    usage: "Take 1 small tot glass (approx. 30ml - 50ml) morning before breakfast and evening after dinner. Shake vigorously before use.",
    createdAt: 1761000006000
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
    featured: 1,
    inStock: 1,
    shortDesc: "Deep internal flush tonic for cleansing accumulated body waste, liver rejuvenation, and digestive wellness.",
    description: "An intensive botanical detox tonic infused with wild moringa, fresh lime extract, indigenous digestive herbs, and cleansing seed extracts. Formulated specifically to rid the body of heavy toxins, combat bloating, and promote full metabolic revitalization.",
    benefits: [
      "Eliminates trapped bowel toxins and relieves chronic constipation",
      "Recharges liver function and cleanses fatty deposits",
      "Eases persistent stomach bloating and heavy indigestion",
      "Leaves skin clear and refreshed by purifying bodily fluids"
    ],
    ingredients: "Wild Moringa leaves, Senna leaves, Lime extract, Dandelion root, Milk Thistle extract, Herbal mint essence.",
    usage: "Take 1 shot glass (40ml) every morning with warm water for 7 consecutive days for thorough cleansing.",
    createdAt: 1761000005000
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
    featured: 1,
    inStock: 1,
    shortDesc: "High-potency organic root extract designed for stamina, physical endurance, hormonal balance, and all-day energy.",
    description: "Formulated for both men and women needing authentic herbal rejuvenation. Concentrated extraction of wild African ginseng, ashwagandha, cloves, and precious bark extracts designed to revive flagging energy, boost libido, and enhance daily performance.",
    benefits: [
      "Supercharges physical stamina and combats fatigue",
      "Improves blood circulation and cardiovascular vitality",
      "Supports balanced male & female reproductive hormones",
      "Enhances mental alertness and reduces physical stress"
    ],
    ingredients: "African wild Ginseng, Ashwagandha, Cloves, Cinnamon bark, Mondia whitei (Isirigun), Nutmeg extract.",
    usage: "Use dropper to place 15-20 drops under tongue or dilute in 100ml warm water, once or twice daily.",
    createdAt: 1761000004000
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
    featured: 0,
    inStock: 1,
    shortDesc: "Soothing mucilage-rich herbal blend designed to calm gastric burning, heal stomach lining, and neutralize hyperacidity.",
    description: "A gentle yet profoundly healing brew that coats the stomach lining, reduces harsh gastric acid burn, alleviates peptic ulcer distress, and repairs inflamed gastrointestinal walls naturally without harsh drugs.",
    benefits: [
      "Neutralizes stomach hyper-acidity and chest burn quickly",
      "Promotes rapid regeneration of stomach and intestinal lining",
      "Eases painful hunger pangs and ulcer contractions",
      "Gentle on sensitive digestive tracts"
    ],
    ingredients: "Slippery elm bark, Raw cabbage leaf extract, Deglycyrrhizinated licorice, Plantain root, Aloe vera gel.",
    usage: "Take 2 tablespoons 30 minutes before meals, 3 times daily.",
    createdAt: 1761000003000
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
    featured: 1,
    inStock: 1,
    shortDesc: "Traditional womb and reproductive herbal preparation for menstrual regulation, womb cleansing, and natural fertility.",
    description: "Prepared according to sacred Nigerian herbal heritage, this blend targets hormonal imbalances, painful or irregular menstruation, cysts, and cleanses the reproductive system to foster optimal fertility and wellness.",
    benefits: [
      "Normalizes erratic menstrual cycles and stops excessive cramps",
      "Naturally dissolves mild blockages and flushes residual fluids",
      "Balances estrogen and progesterone levels naturally",
      "Nourishes the womb environment for reproductive health"
    ],
    ingredients: "Chasteberry, Wild yam root, Red raspberry leaf, African ginger root, Maca extract, indigenous cleansing herbs.",
    usage: "Take 1 glass cup twice daily from the end of menstruation for 21 days.",
    createdAt: 1761000002000
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
    featured: 0,
    inStock: 1,
    shortDesc: "Therapeutic herbal cleansing wash and elixir for clearing stubborn blemishes, eczema, skin rashes, and restoring natural radiance.",
    description: "Crafted with pure organic neem, African black soap base, turmeric, and soothing botanical oils to heal infected skin, clear body acne, soothe rashes, and give your skin a natural healthy glow.",
    benefits: [
      "Clears acne, body spots, and chronic blemishes",
      "Soothes itching, eczema, ringworm, and fungal irritations",
      "Unclogs pores without stripping natural moisture",
      "Brightens complexion using purely natural botanical enzymes"
    ],
    ingredients: "Raw Neem leaf extract, Pure Turmeric, Aloe vera gel, African black soap, Tea tree oil, Shea butter oil.",
    usage: "Lather onto damp skin, allow to sit for 3 minutes, then rinse off thoroughly with clean water.",
    createdAt: 1761000001000
  }
];

// Default Reviews
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
    isApproved: 1,
    isFeatured: 1,
    createdAt: 1761000005000
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
    isApproved: 1,
    isFeatured: 1,
    createdAt: 1761000004000
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
    isApproved: 1,
    isFeatured: 1,
    createdAt: 1761000003000
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
    isApproved: 1,
    isFeatured: 1,
    createdAt: 1761000002000
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
    isApproved: 1,
    isFeatured: 1,
    createdAt: 1761000001000
  }
];

function seedCategoriesIfNeeded(forceReset = false) {
  if (forceReset) {
    db.exec('DELETE FROM categories;');
  }
  const countRow = db.prepare('SELECT COUNT(*) as cnt FROM categories').get();
  if (!countRow || countRow.cnt === 0) {
    const insert = db.prepare('INSERT OR IGNORE INTO categories (name, sortOrder) VALUES (?, ?)');
    DEFAULT_CATEGORIES.forEach((cat, idx) => insert.run(cat, idx));
  }
}

function seedProductsIfNeeded(forceReset = false) {
  if (forceReset) {
    db.exec('DELETE FROM products;');
  }
  const countRow = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
  if (!countRow || countRow.cnt === 0) {
    const insert = db.prepare(`
      INSERT INTO products (
        id, name, category, price, oldPrice, rating, reviewCount,
        image, featured, inStock, shortDesc, description, benefits, ingredients, usage, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const p of DEFAULT_PRODUCTS) {
      insert.run(
        p.id,
        p.name,
        p.category,
        p.price,
        p.oldPrice,
        p.rating,
        p.reviewCount,
        p.image,
        p.featured,
        p.inStock,
        p.shortDesc,
        p.description,
        JSON.stringify(p.benefits || []),
        p.ingredients,
        p.usage,
        p.createdAt
      );
    }
  }
}

function seedReviewsIfNeeded(forceReset = false) {
  if (forceReset) {
    db.exec('DELETE FROM reviews;');
  }
  const countRow = db.prepare('SELECT COUNT(*) as cnt FROM reviews').get();
  if (!countRow || countRow.cnt === 0) {
    const insert = db.prepare(`
      INSERT INTO reviews (id, author, location, rating, date, productName, text, photoUrl, hasPhoto, isApproved, isFeatured, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of DEFAULT_REVIEWS) {
      insert.run(
        r.id,
        r.author,
        r.location,
        r.rating,
        r.date,
        r.productName,
        r.text,
        r.photoUrl,
        r.photoUrl ? 1 : 0,
        r.isApproved,
        r.isFeatured,
        r.createdAt
      );
    }
  }
}

function seedAdminPinIfNeeded() {
  const row = db.prepare("SELECT value FROM admin_config WHERE key = 'admin_pin_hash'").get();
  if (!row) {
    const initialPin = (process.env.ADMIN_INITIAL_PIN || '').trim();
    if (initialPin.length >= 6) {
      const initialHash = bcrypt.hashSync(initialPin, 10);
      db.prepare("INSERT INTO admin_config (key, value) VALUES ('admin_pin_hash', ?)").run(initialHash);
    } else {
      console.warn('[Security] ADMIN_INITIAL_PIN (min 6 chars) is not set in .env and no PIN hash exists in the database yet.');
    }
  }
}

function cleanupExpiredSessions() {
  try {
    db.prepare('DELETE FROM admin_sessions WHERE expiresAt <= ?').run(Date.now());
  } catch (err) {
    console.error('Error cleaning expired sessions:', err);
  }
}

seedCategoriesIfNeeded(false);
seedProductsIfNeeded(false);
seedReviewsIfNeeded(false);
seedAdminPinIfNeeded();
cleanupExpiredSessions();
setInterval(cleanupExpiredSessions, 60 * 60 * 1000).unref();

const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3 MB

function detectRealImageType(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return null;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return { mime: 'image/jpeg', ext: 'jpg' };
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4E &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0D &&
    buffer[5] === 0x0A &&
    buffer[6] === 0x1A &&
    buffer[7] === 0x0A
  ) {
    return { mime: 'image/png', ext: 'png' };
  }
  // WEBP: RIFF....WEBP
  if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return { mime: 'image/webp', ext: 'webp' };
  }
  return null;
}

function createValidationError(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

// Validate and save uploaded image to /uploads with random filename (never using user filename)
function saveValidatedImageToDisk(imageInput, defaultFallback = '') {
  if (!imageInput || typeof imageInput !== 'string') return defaultFallback;
  const trimmed = imageInput.trim();
  if (!trimmed) return defaultFallback;

  if (!trimmed.startsWith('data:')) {
    // Allow only safe relative preset paths inside images/ or uploads/ with allowed extensions
    if (
      /^(images|uploads)\/[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp)$/i.test(trimmed) &&
      !trimmed.includes('..')
    ) {
      return trimmed;
    }
    throw createValidationError('Invalid image path or extension. Only JPG, JPEG, PNG, and WEBP images are allowed.');
  }

  const match = trimmed.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/i);
  if (!match) {
    throw createValidationError('Invalid image format. Only JPG, JPEG, PNG, and WEBP files are accepted.');
  }

  let declaredMime = match[1].toLowerCase();
  if (declaredMime === 'image/jpg') declaredMime = 'image/jpeg';

  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length === 0) {
    throw createValidationError('Uploaded image file is empty.');
  }
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw createValidationError('Image size exceeds the 3 MB maximum limit.');
  }

  const detected = detectRealImageType(buffer);
  if (!detected || detected.mime !== declaredMime) {
    throw createValidationError('File content does not match a valid JPG, JPEG, PNG, or WEBP image.');
  }

  const randomFileName = `${crypto.randomBytes(16).toString('hex')}.${detected.ext}`;
  const filePath = path.join(UPLOADS_DIR, randomFileName);
  fs.writeFileSync(filePath, buffer);
  return `uploads/${randomFileName}`;
}

function getBearerToken(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return '';
}

function isAdminAuthenticated(req) {
  const token = getBearerToken(req);
  if (!token) return false;
  const now = Date.now();
  const session = db.prepare('SELECT token FROM admin_sessions WHERE token = ? AND expiresAt > ?').get(token, now);
  return Boolean(session);
}

function requireAdminAuth(req, res, next) {
  if (!isAdminAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized: Valid Admin session token required.' });
  }
  if (typeof next === 'function') return next();
  return true;
}

function formatProductRow(row) {
  let benefits = [];
  try {
    benefits = JSON.parse(row.benefits || '[]');
  } catch (_) {
    benefits = [];
  }
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    oldPrice: Number(row.oldPrice || 0),
    rating: Number(row.rating || 5.0),
    reviewCount: Number(row.reviewCount || 0),
    image: row.image,
    featured: Boolean(row.featured),
    inStock: Boolean(row.inStock),
    shortDesc: row.shortDesc || '',
    description: row.description || '',
    benefits: Array.isArray(benefits) ? benefits : [],
    ingredients: row.ingredients || '',
    usage: row.usage || ''
  };
}

function formatReviewRow(row) {
  return {
    id: row.id,
    author: row.author,
    location: row.location,
    rating: Number(row.rating),
    date: row.date,
    productName: row.productName,
    text: row.text,
    photoUrl: row.photoUrl || '',
    isApproved: Boolean(row.isApproved),
    isFeatured: Boolean(row.isFeatured)
  };
}

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// ================= 403 STATIC & SENSITIVE PATH GUARD (BEFORE express.static) =================
app.use((req, res, next) => {
  let rawPath = req.originalUrl.split('?')[0] || '/';
  try {
    for (let i = 0; i < 3; i++) {
      const decoded = decodeURIComponent(rawPath);
      if (decoded === rawPath) break;
      rawPath = decoded;
    }
  } catch (_) {
    return res.status(403).type('text/plain').send('403 Forbidden');
  }

  const normalized = rawPath.replace(/\\/g, '/').replace(/\/+/g, '/').toLowerCase();
  const segments = normalized.split('/').filter(Boolean);

  const isBlocked =
    normalized.includes('..') ||
    normalized === '/data' ||
    normalized.startsWith('/data/') ||
    normalized === '/node_modules' ||
    normalized.startsWith('/node_modules/') ||
    normalized === '/server.js' ||
    normalized === '/package.json' ||
    normalized === '/package-lock.json' ||
    normalized.endsWith('.db') ||
    normalized.endsWith('.db-wal') ||
    normalized.endsWith('.db-shm') ||
    normalized.endsWith('.sqlite') ||
    normalized.endsWith('.sqlite3') ||
    normalized.endsWith('.env') ||
    normalized.includes('.env.') ||
    segments.some(seg => seg.startsWith('.') || seg === 'data' || seg === 'node_modules');

  if (isBlocked) {
    return res.status(403).type('text/plain').send('403 Forbidden');
  }

  next();
});

// JSON body parser (5 MB max to accommodate 3 MB base64-encoded image payloads)
app.use(express.json({ limit: '5mb' }));

// Disable caching on API responses
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Rate limiter for login (5 failed attempts per 15 minutes per IP)
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many failed login attempts from this IP. Please try again after 15 minutes.'
  }
});

// ================= ADMIN AUTHENTICATION & PIN ROUTES =================
app.post('/api/admin/login', loginRateLimiter, (req, res) => {
  const enteredPin = String(req.body?.pin || '').trim();
  if (!enteredPin) {
    return res.status(400).json({ error: 'PIN is required.' });
  }

  const row = db.prepare("SELECT value FROM admin_config WHERE key = 'admin_pin_hash'").get();
  if (!row || !row.value) {
    return res.status(503).json({
      error: 'Admin PIN is not configured on the server. Set ADMIN_INITIAL_PIN (at least 6 characters) in .env and restart.'
    });
  }

  const isValid = bcrypt.compareSync(enteredPin, row.value);
  if (!isValid) {
    return res.status(401).json({ error: 'Incorrect Admin PIN.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours
  db.prepare('INSERT INTO admin_sessions (token, createdAt, expiresAt) VALUES (?, ?, ?)').run(token, now, expiresAt);

  return res.status(200).json({ token, expiresAt });
});

app.post('/api/admin/logout', (req, res) => {
  const token = getBearerToken(req);
  if (token) {
    db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
  }
  return res.status(200).json({ success: true });
});

app.get('/api/admin/session', (req, res) => {
  return res.status(200).json({ authenticated: isAdminAuthenticated(req) });
});

app.put('/api/admin/pin', requireAdminAuth, (req, res) => {
  const newPin = String(req.body?.newPin || '').trim();
  if (newPin.length < 6) {
    return res.status(400).json({ error: 'New PIN must be at least 6 characters.' });
  }

  const newHash = bcrypt.hashSync(newPin, 10);
  db.prepare("INSERT OR REPLACE INTO admin_config (key, value) VALUES ('admin_pin_hash', ?)").run(newHash);
  return res.status(200).json({ success: true });
});

// ================= ADMIN-ONLY DATABASE EXPORT ROUTE =================
app.get('/api/admin/export', requireAdminAuth, (req, res) => {
  const productRows = db.prepare('SELECT * FROM products ORDER BY createdAt DESC').all();
  const categoryRows = db.prepare('SELECT name FROM categories ORDER BY sortOrder ASC, name ASC').all();
  const reviewRows = db.prepare('SELECT * FROM reviews ORDER BY createdAt DESC').all();

  return res.status(200).json({
    exportedAt: new Date().toISOString(),
    categories: categoryRows.map(c => c.name),
    products: productRows.map(formatProductRow),
    reviews: reviewRows.map(formatReviewRow)
  });
});

// ================= PRODUCTS & CATEGORIES ROUTES =================
app.get('/api/products', (req, res) => {
  const productRows = db.prepare('SELECT * FROM products ORDER BY createdAt DESC').all();
  const categoryRows = db.prepare('SELECT name FROM categories ORDER BY sortOrder ASC, name ASC').all();
  return res.status(200).json({
    items: productRows.map(formatProductRow),
    categories: categoryRows.map(c => c.name)
  });
});

app.post('/api/products', requireAdminAuth, (req, res) => {
  try {
    const body = req.body || {};
    const id = 'prod_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
    const name = String(body.name || '').trim().slice(0, 160);
    if (!name) {
      return res.status(400).json({ error: 'Product name is required.' });
    }
    const category = String(body.category || 'General Health').trim().slice(0, 80);
    const price = Number(body.price) || 0;
    const oldPrice = Number(body.oldPrice) || 0;
    const image = saveValidatedImageToDisk(body.image, 'images/product-herbal-mixture.jpg');
    const featured = body.featured ? 1 : 0;
    const inStock = body.inStock !== false ? 1 : 0;
    const shortDesc = String(body.shortDesc || '').trim().slice(0, 300);
    const description = String(body.description || '').trim().slice(0, 4000);
    const benefitsArr = Array.isArray(body.benefits)
      ? body.benefits.map(b => String(b).trim()).filter(Boolean)
      : String(body.benefits || '').split('\n').map(b => b.trim()).filter(Boolean);
    const ingredients = String(body.ingredients || '100% Wildcrafted Nigerian Herbs').trim().slice(0, 500);
    const usage = String(body.usage || 'Take as directed by herbalist.').trim().slice(0, 500);
    const createdAt = Date.now();

    db.prepare('INSERT OR IGNORE INTO categories (name, sortOrder) VALUES (?, 99)').run(category);
    db.prepare(`
      INSERT INTO products (
        id, name, category, price, oldPrice, rating, reviewCount,
        image, featured, inStock, shortDesc, description, benefits, ingredients, usage, createdAt
      ) VALUES (?, ?, ?, ?, ?, 5.0, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, name, category, price, oldPrice, image, featured, inStock,
      shortDesc, description, JSON.stringify(benefitsArr), ingredients, usage, createdAt
    );

    const inserted = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return res.status(201).json({ item: formatProductRow(inserted) });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ error: err.message });
    throw err;
  }
});

app.post('/api/products/reset', requireAdminAuth, (req, res) => {
  seedCategoriesIfNeeded(true);
  seedProductsIfNeeded(true);
  const productRows = db.prepare('SELECT * FROM products ORDER BY createdAt DESC').all();
  const categoryRows = db.prepare('SELECT name FROM categories ORDER BY sortOrder ASC, name ASC').all();
  return res.status(200).json({
    items: productRows.map(formatProductRow),
    categories: categoryRows.map(c => c.name)
  });
});

app.put('/api/products/:id', requireAdminAuth, (req, res) => {
  try {
    const id = req.params.id;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const body = req.body || {};
    const name = body.name !== undefined ? String(body.name).trim().slice(0, 160) : existing.name;
    if (!name) return res.status(400).json({ error: 'Product name cannot be empty.' });
    const category = body.category !== undefined ? String(body.category).trim().slice(0, 80) : existing.category;
    const price = body.price !== undefined ? Number(body.price) : existing.price;
    const oldPrice = body.oldPrice !== undefined ? Number(body.oldPrice) : existing.oldPrice;
    const image = body.image ? saveValidatedImageToDisk(body.image, existing.image) : existing.image;
    const featured = body.featured !== undefined ? (body.featured ? 1 : 0) : existing.featured;
    const inStock = body.inStock !== undefined ? (body.inStock ? 1 : 0) : existing.inStock;
    const shortDesc = body.shortDesc !== undefined ? String(body.shortDesc).trim().slice(0, 300) : existing.shortDesc;
    const description = body.description !== undefined ? String(body.description).trim().slice(0, 4000) : existing.description;
    const benefitsArr = body.benefits !== undefined
      ? (Array.isArray(body.benefits)
          ? body.benefits.map(b => String(b).trim()).filter(Boolean)
          : String(body.benefits).split('\n').map(b => b.trim()).filter(Boolean))
      : JSON.parse(existing.benefits || '[]');
    const ingredients = body.ingredients !== undefined ? String(body.ingredients).trim().slice(0, 500) : existing.ingredients;
    const usage = body.usage !== undefined ? String(body.usage).trim().slice(0, 500) : existing.usage;

    db.prepare('INSERT OR IGNORE INTO categories (name, sortOrder) VALUES (?, 99)').run(category);
    db.prepare(`
      UPDATE products
      SET name = ?, category = ?, price = ?, oldPrice = ?, image = ?,
          featured = ?, inStock = ?, shortDesc = ?, description = ?,
          benefits = ?, ingredients = ?, usage = ?
      WHERE id = ?
    `).run(
      name, category, price, oldPrice, image,
      featured, inStock, shortDesc, description,
      JSON.stringify(benefitsArr), ingredients, usage, id
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return res.status(200).json({ item: formatProductRow(updated) });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ error: err.message });
    throw err;
  }
});

app.delete('/api/products/:id', requireAdminAuth, (req, res) => {
  const id = req.params.id;
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (existing && existing.image && existing.image.startsWith('uploads/')) {
    const fileName = path.basename(existing.image);
    const diskPath = path.join(UPLOADS_DIR, fileName);
    if (fs.existsSync(diskPath)) {
      try { fs.unlinkSync(diskPath); } catch (_) {}
    }
  }
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return res.status(200).json({ success: true });
});

app.get('/api/categories', (req, res) => {
  const rows = db.prepare('SELECT name FROM categories ORDER BY sortOrder ASC, name ASC').all();
  return res.status(200).json({ items: rows.map(r => r.name) });
});

app.post('/api/categories', requireAdminAuth, (req, res) => {
  const name = String(req.body?.name || '').trim().slice(0, 80);
  if (!name) return res.status(400).json({ error: 'Category name is required' });
  db.prepare('INSERT OR IGNORE INTO categories (name, sortOrder) VALUES (?, 99)').run(name);
  const rows = db.prepare('SELECT name FROM categories ORDER BY sortOrder ASC, name ASC').all();
  return res.status(201).json({ name, items: rows.map(r => r.name) });
});

app.delete('/api/categories/:name', requireAdminAuth, (req, res) => {
  const name = String(req.params.name || '').trim();
  db.prepare('DELETE FROM categories WHERE name = ?').run(name);
  const remaining = db.prepare('SELECT COUNT(*) as cnt FROM categories').get();
  if (!remaining || remaining.cnt === 0) {
    db.prepare("INSERT INTO categories (name, sortOrder) VALUES ('General Health', 0)").run();
  }
  const rows = db.prepare('SELECT name FROM categories ORDER BY sortOrder ASC, name ASC').all();
  return res.status(200).json({ items: rows.map(r => r.name) });
});

// ================= REVIEWS ROUTES =================
// Public: Read approved reviews only (reading hidden reviews requires admin token)
app.get('/api/reviews', (req, res) => {
  const filter = req.query.filter || 'all';
  const wantsHidden = req.query.includeHidden === '1';
  const includeHidden = wantsHidden && isAdminAuthenticated(req);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '9', 10) || 9, 1), 100);
  const offset = Math.max(parseInt(req.query.offset || '0', 10) || 0, 0);

  const conditions = [];
  const params = [];

  if (!includeHidden) {
    conditions.push('isApproved = 1');
  }
  if (filter === 'photos') {
    conditions.push('hasPhoto = 1');
  } else if (filter === 'five_star') {
    conditions.push('rating = 5');
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const totalFilteredRow = db.prepare(`SELECT COUNT(*) as cnt FROM reviews ${whereClause}`).get(...params);
  const rows = db.prepare(`
    SELECT * FROM reviews
    ${whereClause}
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  const statsRow = db.prepare(`
    SELECT
      COUNT(*) as totalAll,
      SUM(CASE WHEN isApproved = 1 THEN 1 ELSE 0 END) as totalApproved,
      SUM(CASE WHEN hasPhoto = 1 AND isApproved = 1 THEN 1 ELSE 0 END) as totalPhotos,
      ROUND(AVG(CASE WHEN isApproved = 1 THEN rating ELSE NULL END), 1) as avgRating
    FROM reviews
  `).get();

  const totalFiltered = totalFilteredRow ? Number(totalFilteredRow.cnt) : 0;

  return res.status(200).json({
    items: rows.map(formatReviewRow),
    totalFiltered,
    hasMore: offset + rows.length < totalFiltered,
    stats: {
      totalAll: includeHidden ? Number(statsRow?.totalAll || 0) : Number(statsRow?.totalApproved || 0),
      totalApproved: Number(statsRow?.totalApproved || 0),
      totalPhotos: Number(statsRow?.totalPhotos || 0),
      avgRating: Number(statsRow?.avgRating || 5.0)
    }
  });
});

// Public: Submit a review (with input validation, length limits, and safe image validation)
app.post('/api/reviews', (req, res) => {
  try {
    const body = req.body || {};
    const rawAuthor = String(body.author || 'Anonymous Customer').trim();
    const rawLocation = String(body.location || 'Nigeria').trim();
    const rawProductName = String(body.productName || 'Successful Wellness Herbs').trim();
    const rawText = String(body.text || '').trim();
    const ratingNum = Number(body.rating !== undefined ? body.rating : 5);

    if (!rawText || rawText.length < 3) {
      return res.status(400).json({ error: 'Review text must be at least 3 characters long.' });
    }
    if (rawText.length > 1000) {
      return res.status(400).json({ error: 'Review text cannot exceed 1000 characters.' });
    }
    if (rawAuthor.length > 80) {
      return res.status(400).json({ error: 'Author name cannot exceed 80 characters.' });
    }
    if (rawLocation.length > 80) {
      return res.status(400).json({ error: 'Location cannot exceed 80 characters.' });
    }
    if (rawProductName.length > 120) {
      return res.status(400).json({ error: 'Product name cannot exceed 120 characters.' });
    }
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be a whole number between 1 and 5.' });
    }

    const id = 'rev_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
    const date = new Date().toISOString().split('T')[0];
    const savedPhotoUrl = body.photoUrl ? saveValidatedImageToDisk(body.photoUrl, '') : '';
    const hasPhoto = savedPhotoUrl ? 1 : 0;

    const isAdmin = isAdminAuthenticated(req);
    const isApproved = isAdmin && body.isApproved !== undefined ? (body.isApproved ? 1 : 0) : 1;
    const isFeatured = isAdmin && body.isFeatured !== undefined ? (body.isFeatured ? 1 : 0) : 0;
    const createdAt = Date.now();

    db.prepare(`
      INSERT INTO reviews (id, author, location, rating, date, productName, text, photoUrl, hasPhoto, isApproved, isFeatured, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, rawAuthor, rawLocation, ratingNum, date, rawProductName, rawText, savedPhotoUrl, hasPhoto, isApproved, isFeatured, createdAt);

    const inserted = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    return res.status(201).json({ item: formatReviewRow(inserted) });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ error: err.message });
    throw err;
  }
});

// Admin-Only: Reset reviews to default
app.post('/api/reviews/reset', requireAdminAuth, (req, res) => {
  seedReviewsIfNeeded(true);
  return res.status(200).json({ success: true });
});

// Admin-Only: Approve / hide a review
app.patch('/api/reviews/:id', requireAdminAuth, (req, res) => {
  const id = req.params.id;
  const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Review not found' });

  const newStatus = existing.isApproved ? 0 : 1;
  db.prepare('UPDATE reviews SET isApproved = ? WHERE id = ?').run(newStatus, id);
  const updated = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  return res.status(200).json({ item: formatReviewRow(updated) });
});

// Admin-Only: Edit a review
app.put('/api/reviews/:id', requireAdminAuth, (req, res) => {
  const id = req.params.id;
  const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Review not found' });

  const body = req.body || {};
  const text = body.text !== undefined ? String(body.text).trim().slice(0, 1000) : existing.text;
  const isApproved = body.isApproved !== undefined ? (body.isApproved ? 1 : 0) : existing.isApproved;
  db.prepare('UPDATE reviews SET text = ?, isApproved = ? WHERE id = ?').run(text, isApproved, id);
  const updated = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  return res.status(200).json({ item: formatReviewRow(updated) });
});

// Admin-Only: Delete a review
app.delete('/api/reviews/:id', requireAdminAuth, (req, res) => {
  const id = req.params.id;
  const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  if (existing && existing.photoUrl && existing.photoUrl.startsWith('uploads/')) {
    const fileName = path.basename(existing.photoUrl);
    const diskPath = path.join(UPLOADS_DIR, fileName);
    if (fs.existsSync(diskPath)) {
      try { fs.unlinkSync(diskPath); } catch (_) {}
    }
  }
  db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
  return res.status(200).json({ success: true });
});

// ================= STATIC FILE SERVER (AFTER 403 GUARD) =================
app.use('/uploads', express.static(UPLOADS_DIR, { dotfiles: 'deny', index: false }));
app.use('/css', express.static(path.join(__dirname, 'css'), { dotfiles: 'deny', index: false }));
app.use('/js', express.static(path.join(__dirname, 'js'), { dotfiles: 'deny', index: false }));
app.use('/images', express.static(path.join(__dirname, 'images'), { dotfiles: 'deny', index: false }));

const ALLOWED_HTML_PAGES = new Set([
  '/index.html',
  '/shop.html',
  '/reviews.html',
  '/contact.html',
  '/admin.html'
]);

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const reqPath = req.path === '/' ? '/index.html' : req.path;
  if (ALLOWED_HTML_PAGES.has(reqPath)) {
    return res.sendFile(path.join(__dirname, reqPath));
  }
  return next();
});

app.use(express.static(path.join(__dirname, 'public'), { dotfiles: 'deny', index: false }));

app.use((req, res) => {
  res.status(404).type('text/plain').send('404 Not Found');
});

app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload too large. Maximum image size is 3 MB.' });
  }
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} with SQLite database at ${path.join(DATA_DIR, 'herbal_store.db')}`);
});
