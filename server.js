const http = require('http');
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Initialize High-Performance SQLite Database (Supports 500k+ reviews with indexes)
const db = new DatabaseSync(path.join(DATA_DIR, 'herbal_store.db'));
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;

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
`);

// Seed default reviews if database is empty
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
seedReviewsIfNeeded(false);

// Save Base64 Data URL to disk file in /uploads so database stays lightweight
function saveBase64PhotoToDisk(photoDataUrl, prefix = 'rev') {
  if (!photoDataUrl || typeof photoDataUrl !== 'string') return '';
  if (!photoDataUrl.startsWith('data:image/')) {
    return photoDataUrl; // Already a normal URL/path
  }
  const match = photoDataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (!match) return '';
  let ext = match[1].toLowerCase();
  if (ext === 'jpeg') ext = 'jpg';
  const base64Data = match[2];
  const fileName = `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = path.join(UPLOADS_DIR, fileName);
  fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
  return `uploads/${fileName}`;
}

function parseJsonBody(req, maxBytes = 10 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > maxBytes) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
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

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURI(parsedUrl.pathname);

    // ================= API ENDPOINTS FOR SCALABLE REVIEWS =================
    if (pathname === '/api/reviews' && req.method === 'GET') {
      const filter = parsedUrl.searchParams.get('filter') || 'all';
      const includeHidden = parsedUrl.searchParams.get('includeHidden') === '1';
      const limit = Math.min(Math.max(parseInt(parsedUrl.searchParams.get('limit') || '9', 10), 1), 100);
      const offset = Math.max(parseInt(parsedUrl.searchParams.get('offset') || '0', 10), 0);

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
          SUM(CASE WHEN hasPhoto = 1 THEN 1 ELSE 0 END) as totalPhotos,
          ROUND(AVG(CASE WHEN isApproved = 1 THEN rating ELSE NULL END), 1) as avgRating
        FROM reviews
      `).get();

      const totalFiltered = totalFilteredRow ? Number(totalFilteredRow.cnt) : 0;

      return sendJson(res, 200, {
        items: rows.map(formatReviewRow),
        totalFiltered,
        hasMore: offset + rows.length < totalFiltered,
        stats: {
          totalAll: Number(statsRow?.totalAll || 0),
          totalApproved: Number(statsRow?.totalApproved || 0),
          totalPhotos: Number(statsRow?.totalPhotos || 0),
          avgRating: Number(statsRow?.avgRating || 5.0)
        }
      });
    }

    if (pathname === '/api/reviews' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const id = 'rev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      const author = (body.author || 'Anonymous Customer').trim().slice(0, 120);
      const location = (body.location || 'Nigeria').trim().slice(0, 120);
      const rating = Math.min(Math.max(Number(body.rating) || 5, 1), 5);
      const date = new Date().toISOString().split('T')[0];
      const productName = (body.productName || 'Successful Wellness Herbs').trim().slice(0, 160);
      const text = (body.text || '').trim().slice(0, 5000);

      if (!text) {
        return sendJson(res, 400, { error: 'Review text is required' });
      }

      const savedPhotoUrl = saveBase64PhotoToDisk(body.photoUrl || '', 'review');
      const hasPhoto = savedPhotoUrl ? 1 : 0;
      const isApproved = body.isApproved !== false ? 1 : 0;
      const isFeatured = body.isFeatured !== false ? 1 : 0;
      const createdAt = Date.now();

      db.prepare(`
        INSERT INTO reviews (id, author, location, rating, date, productName, text, photoUrl, hasPhoto, isApproved, isFeatured, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, author, location, rating, date, productName, text, savedPhotoUrl, hasPhoto, isApproved, isFeatured, createdAt);

      const inserted = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
      return sendJson(res, 201, { item: formatReviewRow(inserted) });
    }

    if (pathname === '/api/reviews/reset' && req.method === 'POST') {
      seedReviewsIfNeeded(true);
      return sendJson(res, 200, { success: true });
    }

    if (pathname.startsWith('/api/reviews/') && req.method === 'PATCH') {
      const parts = pathname.split('/');
      const id = parts[3];
      const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
      if (!existing) return sendJson(res, 404, { error: 'Review not found' });

      const newStatus = existing.isApproved ? 0 : 1;
      db.prepare('UPDATE reviews SET isApproved = ? WHERE id = ?').run(newStatus, id);
      const updated = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
      return sendJson(res, 200, { item: formatReviewRow(updated) });
    }

    if (pathname.startsWith('/api/reviews/') && req.method === 'DELETE') {
      const parts = pathname.split('/');
      const id = parts[3];
      const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
      if (existing && existing.photoUrl && existing.photoUrl.startsWith('uploads/')) {
        const diskPath = path.join(__dirname, existing.photoUrl);
        if (fs.existsSync(diskPath)) {
          try { fs.unlinkSync(diskPath); } catch (_) {}
        }
      }
      db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
      return sendJson(res, 200, { success: true });
    }

    // ================= STATIC FILE SERVER =================
    let reqPath = pathname;
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

    const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, safePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal Error');
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} with SQLite database at data/herbal_store.db`);
});
