require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { createClient } = require('@libsql/client');
const cloudinary = require('cloudinary').v2;

const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, 'data');
const UPLOADS_DIR = process.env.UPLOADS_DIR ? path.resolve(process.env.UPLOADS_DIR) : path.join(__dirname, 'uploads');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

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
    createdAt: 1761000025000
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
    createdAt: 1761000024000
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
    createdAt: 1761000023000
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
    createdAt: 1761000022000
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
    createdAt: 1761000021000
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
    createdAt: 1761000020000
  },
  {
    id: "p7",
    name: "Malaria & Typhoid Root Flush Decoction",
    category: "Immunity & Detox",
    price: 11000,
    oldPrice: 13500,
    rating: 4.9,
    reviewCount: 34,
    image: "images/product-herbal-mixture.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Fast-acting bitter root decoction for clearing recurrent malaria parasites and enteric fever symptoms.",
    description: "Traditional antimalarial bark and leaf decoction prepared from Enantia chlorantha (Awopa), lemongrass, and pawpaw leaves to flush resistant parasites and restore appetite.",
    benefits: ["Clears stubborn malaria and typhoid fever", "Relieves body aches, chills, and headaches", "Supports red blood cell recovery"],
    ingredients: "Awopa bark, Carica papaya leaf, Cymbopogon citratus, Azadirachta indica, Citrus aurantifolia.",
    usage: "Take half glass cup morning and night after meals for 5 days.",
    createdAt: 1761000019000
  },
  {
    id: "p8",
    name: "Cardio-Clear Blood Pressure & Heart Tonic",
    category: "General Health",
    price: 14500,
    oldPrice: 17500,
    rating: 4.9,
    reviewCount: 21,
    image: "images/product-detox-tonic.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Calming vascular tonic that supports healthy blood pressure, arterial flexibility, and restful sleep.",
    description: "Formulated with hibiscus calyx (Zobo), aged garlic bulb extract, and mistletoe leaves to relax blood vessels and support healthy circulation.",
    benefits: ["Supports normal blood pressure readings", "Promotes healthy cholesterol balance", "Calms palpitations and vascular tension"],
    ingredients: "Hibiscus sabdariffa, Allium sativum, African Mistletoe, Crataegus berry, Ginger.",
    usage: "Take 30ml morning and evening after food.",
    createdAt: 1761000018000
  },
  {
    id: "p9",
    name: "JointEase Arthritis & Rheumatism Liniment Brew",
    category: "General Health",
    price: 13000,
    oldPrice: 16000,
    rating: 4.8,
    reviewCount: 19,
    image: "images/product-vitality-extract.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Anti-inflammatory herbal formula for waist pain, stiff knees, swollen joints, and backache relief.",
    description: "Combines curcuma, boswellia resin, and warming African pepper extracts to reduce joint inflammation and restore comfortable mobility.",
    benefits: ["Soothes chronic waist, knee, and back pain", "Reduces joint swelling and morning stiffness", "Nourishes cartilage and connective tissues"],
    ingredients: "Turmeric root, Boswellia serrata, Xylopia aethiopica (Uda), Ginger root, Devil's claw.",
    usage: "Take 40ml twice daily after meals.",
    createdAt: 1761000017000
  },
  {
    id: "p10",
    name: "GlucoBalance Sugar Control Bitter Extract",
    category: "Immunity & Detox",
    price: 15500,
    oldPrice: 18500,
    rating: 5.0,
    reviewCount: 27,
    image: "images/product-herbal-mixture.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Metabolic herbal extract formulated to support healthy blood sugar regulation and pancreatic vitality.",
    description: "Crafted from bitter melon, scent leaf, and gymnema botanicals to assist natural glucose metabolism and reduce sugar cravings.",
    benefits: ["Supports balanced blood glucose levels", "Reduces frequent nighttime urination", "Boosts metabolic energy without spikes"],
    ingredients: "Momordica charantia, Ocimum gratissimum, Vernonia amygdalina, Cinnamon bark, Fenugreek seed.",
    usage: "Take 30ml every morning 20 minutes before breakfast.",
    createdAt: 1761000016000
  },
  {
    id: "p11",
    name: "Men's Kingly Virility & Prostate Guard Roots",
    category: "Vitality & Strength",
    price: 17000,
    oldPrice: 21000,
    rating: 5.0,
    reviewCount: 41,
    image: "images/product-vitality-extract.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Concentrated male root blend supporting prostate comfort, urinary flow, and peak masculine stamina.",
    description: "Infused with Pygeum africanum bark, pumpkin seed extract, and Mondia whitei roots for long-term male reproductive and prostate wellness.",
    benefits: ["Supports healthy prostate size and urinary flow", "Enhances masculine drive and endurance", "Combats lower back fatigue"],
    ingredients: "Pygeum africanum, Mondia whitei, Cucurbita pepo seed, Garcinia kola (Bitter kola), Zingiber officinale.",
    usage: "Take 1 tot glass (40ml) every night after dinner.",
    createdAt: 1761000015000
  },
  {
    id: "p12",
    name: "Kidney & Urinary Tract Cleansing Elixir",
    category: "Immunity & Detox",
    price: 13500,
    oldPrice: 16000,
    rating: 4.8,
    reviewCount: 18,
    image: "images/product-detox-tonic.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Gentle diuretic botanical flush to cleanse the kidneys, bladder, and urinary tract.",
    description: "Formulated with Phyllanthus niruri (Chanca Piedra), corn silk, and dandelion leaf to flush uric acid and support clear kidney filtration.",
    benefits: ["Flushes kidney sediment and urinary impurities", "Soothes urinary burning and discomfort", "Supports healthy fluid balance"],
    ingredients: "Phyllanthus niruri, Zea mays silk, Taraxacum officinale, Hibiscus, Lemon peel.",
    usage: "Take 40ml twice daily with plenty of clean water.",
    createdAt: 1761000014000
  },
  {
    id: "p13",
    name: "Pile-Free & Colon Relief Herbal Mixture",
    category: "Digestion & Ulcer",
    price: 10500,
    oldPrice: 13000,
    rating: 4.9,
    reviewCount: 33,
    image: "images/product-herbal-mixture.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Targeted herbal remedy for internal and external hemorrhoids (jedi-jedi), constipation, and waist heaviness.",
    description: "Traditional Yoruba jedi-jedi formulation that shrinks inflamed rectal veins, softens stool naturally, and relieves lower back heaviness.",
    benefits: ["Relieves internal and external pile discomfort", "Prevents hard stools and straining", "Clears excess sugar buildup in the gut"],
    ingredients: "Sorghum bicolor sheath, Khaya ivorensis bark, Senna pod, Allium cepa, Cloves.",
    usage: "Take 1 shot glass morning and evening after meals.",
    createdAt: 1761000013000
  },
  {
    id: "p14",
    name: "Fibroid & Ovarian Wellness Root Infusion",
    category: "Hormonal & Fertility",
    price: 18000,
    oldPrice: 22000,
    rating: 5.0,
    reviewCount: 26,
    image: "images/product-vitality-extract.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Intensive womb-care root infusion to support uterine health, reduce heavy flow, and ease pelvic pressure.",
    description: "Slow-steeped forest roots and soursop leaf extracts designed to promote healthy uterine tissue and balanced female cycles.",
    benefits: ["Eases pelvic fullness and menstrual clotting", "Supports healthy uterine and ovarian tissue", "Boosts iron levels after heavy cycles"],
    ingredients: "Annona muricata leaf, Tetrapleura tetraptera (Aridan), Kigelia africana, Curcuma longa, Negro pepper.",
    usage: "Take half glass cup morning and night for 30 days.",
    createdAt: 1761000012000
  },
  {
    id: "p15",
    name: "BreatheEasy Asthma & Chest Congestion Syrup",
    category: "General Health",
    price: 11000,
    oldPrice: 13500,
    rating: 4.8,
    reviewCount: 17,
    image: "images/product-detox-tonic.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Warming respiratory herbal syrup with raw forest honey, bitter kola, and eucalyptus for clear airways.",
    description: "Loosens stubborn phlegm, calms persistent coughs, and opens bronchial passages naturally.",
    benefits: ["Clears chest congestion and phlegm", "Soothes dry and productive coughs", "Supports easy breathing during cold weather"],
    ingredients: "Raw forest honey, Garcinia kola, Zingiber officinale, Abrus precatorius, Peppermint leaf.",
    usage: "Take 2 tablespoons 3 times daily.",
    createdAt: 1761000011000
  },
  {
    id: "p16",
    name: "Clear-Infection Broadband Herbal Antibiotic",
    category: "Immunity & Detox",
    price: 15000,
    oldPrice: 18000,
    rating: 5.0,
    reviewCount: 39,
    image: "images/product-herbal-mixture.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Potent antimicrobial herbal cleanser for stubborn bacterial, fungal, and pelvic infections.",
    description: "Formulated with allicin-rich garlic, neem bark, and golden seal alternatives to combat recurring internal infections and itching.",
    benefits: ["Targets stubborn internal and pelvic infections", "Soothes unusual discharge and itching", "Reinforces natural mucosal immunity"],
    ingredients: "Azadirachta indica bark, Allium sativum, Vernonia amygdalina, Syzygium aromaticum, Citrus aurantifolia.",
    usage: "Take 40ml morning and night for 10 consecutive days.",
    createdAt: 1761000010000
  },
  {
    id: "p17",
    name: "Blood Builder & Sickle Cell Support Tonic",
    category: "General Health",
    price: 12000,
    oldPrice: 14500,
    rating: 4.9,
    reviewCount: 25,
    image: "images/product-detox-tonic.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Iron-rich botanical blood tonic made from sorghum leaf sheath, fluted pumpkin, and moringa.",
    description: "Rapidly replenishes hemoglobin levels, combats dizziness and pallor, and nourishes red blood cells naturally.",
    benefits: ["Boosts blood count and iron levels naturally", "Relieves chronic tiredness and dizziness", "Safe and nourishing for recovering patients"],
    ingredients: "Sorghum bicolor (Poporo), Telfairia occidentalis (Ugu), Moringa oleifera, Hibiscus, Date syrup.",
    usage: "Take half glass cup twice daily after meals.",
    createdAt: 1761000009000
  },
  {
    id: "p18",
    name: "Digestive Bitters & Flat Tummy Elixir",
    category: "Digestion & Ulcer",
    price: 10000,
    oldPrice: 12500,
    rating: 4.8,
    reviewCount: 28,
    image: "images/product-herbal-mixture.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Aromatic digestive bitters to stimulate bile flow, burn abdominal fat deposits, and relieve gas.",
    description: "Taken before or after heavy meals to speed up digestion, prevent acid reflux, and trim waistline bloating.",
    benefits: ["Relieves gas, indigestion, and sluggish bowels", "Supports healthy metabolism and flat tummy", "Curbs late-night appetite"],
    ingredients: "Cinnamon, Fennel seed, Ginger, Bitter orange peel, Green tea extract, Senna.",
    usage: "Take 1 shot glass (30ml) after dinner daily.",
    createdAt: 1761000008000
  },
  {
    id: "p19",
    name: "Eczema & Fungal Clear Botanical Balm",
    category: "Skin Wellness",
    price: 8500,
    oldPrice: 10500,
    rating: 4.9,
    reviewCount: 20,
    image: "images/product-detox-tonic.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Concentrated herbal salve for ringworm, eczema patches, athlete's foot, and skin reactions.",
    description: "Blends Cassia alata (Asunwon) leaf extract with unrefined shea butter and tea tree oil for rapid topical skin repair.",
    benefits: ["Clears stubborn ringworm and fungal patches", "Stops intense skin itching and scaling", "Moisturizes and repairs cracked skin"],
    ingredients: "Senna alata (Asunwon), Unrefined Shea Butter, Neem oil, Tea tree oil, Camwood (Osun).",
    usage: "Apply a thin layer to clean, dry affected skin morning and night.",
    createdAt: 1761000007000
  },
  {
    id: "p20",
    name: "Deep Sleep & Nerve Calm Herbal Infusion",
    category: "General Health",
    price: 11500,
    oldPrice: 14000,
    rating: 4.9,
    reviewCount: 16,
    image: "images/product-vitality-extract.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Non-habit-forming botanical relaxant for insomnia, stress tension, and racing thoughts.",
    description: "Gentle infusion of passionflower, chamomile, lemongrass, and ashwagandha to quiet the nervous system and promote deep restorative sleep.",
    benefits: ["Promotes deep, uninterrupted nighttime sleep", "Eases nervous tension and stress headaches", "Wake up refreshed without grogginess"],
    ingredients: "Passiflora incarnata, Matricaria chamomilla, Withania somnifera, Lemongrass, Nutmeg.",
    usage: "Take 30ml in warm water 45 minutes before bedtime.",
    createdAt: 1761000006000
  },
  {
    id: "p21",
    name: "Postpartum Womb Flush & Lactation Herbs",
    category: "Hormonal & Fertility",
    price: 13500,
    oldPrice: 16500,
    rating: 5.0,
    reviewCount: 23,
    image: "images/product-vitality-extract.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Warming traditional spice and root tonic for new mothers to tone the womb and support breastmilk flow.",
    description: "Prepared with Uda, Uziza, Aridan, and fenugreek to help cleanse postpartum lochia and nourish nursing mothers.",
    benefits: ["Gently cleanses and tones the womb after childbirth", "Supports healthy breastmilk production", "Restores core warmth and strength"],
    ingredients: "Xylopia aethiopica (Uda), Piper guineense (Uziza), Tetrapleura tetraptera, Fenugreek, Ginger.",
    usage: "Take 1 warm cup morning and evening.",
    createdAt: 1761000005000
  },
  {
    id: "p22",
    name: "Liver Guard & Hepatitis Recovery Tonic",
    category: "Immunity & Detox",
    price: 16000,
    oldPrice: 19500,
    rating: 4.9,
    reviewCount: 22,
    image: "images/product-detox-tonic.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Hepatoprotective herbal formula to regenerate liver cells, clear jaundice tint, and detoxify enzymes.",
    description: "Combines Milk Thistle (Silymarin), Phyllanthus amarus, and turmeric root to shield and repair overworked liver tissue.",
    benefits: ["Supports healthy liver enzyme levels", "Assists recovery from fatty liver and toxicity", "Improves bile flow and skin clarity"],
    ingredients: "Silybum marianum, Phyllanthus amarus, Curcuma longa, Taraxacum root, Bitter leaf.",
    usage: "Take 40ml twice daily before meals.",
    createdAt: 1761000004000
  },
  {
    id: "p23",
    name: "Royal Honey & Ginseng Stamina Booster",
    category: "Vitality & Strength",
    price: 16000,
    oldPrice: 19000,
    rating: 5.0,
    reviewCount: 35,
    image: "images/product-vitality-extract.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Pure wildflower honey infused with Panax ginseng, maca root, and royal jelly for peak physical vitality.",
    description: "A delicious, fast-absorbing energy tonic for busy professionals, athletes, and couples seeking natural stamina.",
    benefits: ["Delivers sustained natural energy without crash", "Supports reproductive vitality in men and women", "Strengthens immune resilience"],
    ingredients: "Wild Nigerian forest honey, Panax ginseng, Lepidium meyenii (Maca), Ginger, Cloves.",
    usage: "Take 1 tablespoon daily straight or mixed into warm tea.",
    createdAt: 1761000003000
  },
  {
    id: "p24",
    name: "Blemish-Free Turmeric & Neem Facial Toner",
    category: "Skin Wellness",
    price: 9000,
    oldPrice: 11500,
    rating: 4.8,
    reviewCount: 19,
    image: "images/product-detox-tonic.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Botanical clarifying toner for dark spots, hyperpigmentation, razor bumps, and oily skin.",
    description: "Distilled rosewater, neem leaf hydrosol, licorice root, and turmeric extract to fade dark marks and tighten pores gently.",
    benefits: ["Fades dark spots and acne scars naturally", "Calms razor bumps and skin redness", "Balances excess facial oil"],
    ingredients: "Neem hydrosol, Curcuma longa extract, Licorice root, Aloe vera juice, Witch hazel.",
    usage: "Apply with cotton pad onto clean face morning and night.",
    createdAt: 1761000002000
  },
  {
    id: "p25",
    name: "Complete Family Immune Shield Herbal Pack",
    category: "General Health",
    price: 22000,
    oldPrice: 26000,
    rating: 5.0,
    reviewCount: 44,
    image: "images/product-herbal-mixture.jpg",
    featured: 0,
    inStock: 1,
    shortDesc: "Value family bottle of our multi-herb immune and digestive shield for year-round household wellness.",
    description: "Our comprehensive all-in-one family herbal tonic combining immune boosters, gentle detoxifiers, and antioxidant roots.",
    benefits: ["Protects the whole family against seasonal illnesses", "Keeps digestion regular and blood purified", "Economical family-size preparation"],
    ingredients: "Bitter leaf, Moringa, Ginger, Turmeric, Lemongrass, Cloves, Citrus peel, Hibiscus.",
    usage: "Adults: 40ml twice daily. Youths (12+): 20ml once daily after food.",
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

async function createTablesIfNeeded() {
  await db.batch([
    `CREATE TABLE IF NOT EXISTS categories (
      name TEXT PRIMARY KEY,
      sortOrder INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS products (
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
    )`,
    `CREATE INDEX IF NOT EXISTS idx_products_created ON products(createdAt DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`,
    `CREATE TABLE IF NOT EXISTS reviews (
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
    )`,
    `CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(createdAt DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_reviews_approved_created ON reviews(isApproved, createdAt DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_reviews_photo_created ON reviews(isApproved, hasPhoto, createdAt DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_reviews_rating_created ON reviews(isApproved, rating, createdAt DESC)`,
    `CREATE TABLE IF NOT EXISTS admin_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      createdAt INTEGER NOT NULL,
      expiresAt INTEGER NOT NULL
    )`
  ], 'write');
}

async function seedCategoriesIfNeeded(forceReset = false) {
  if (forceReset) {
    await db.execute('DELETE FROM categories');
  }
  const countRes = await db.execute('SELECT COUNT(*) as cnt FROM categories');
  const cnt = Number(countRes.rows[0]?.cnt || 0);
  if (cnt === 0) {
    const statements = DEFAULT_CATEGORIES.map((cat, idx) => ({
      sql: 'INSERT OR IGNORE INTO categories (name, sortOrder) VALUES (?, ?)',
      args: [cat, idx]
    }));
    await db.batch(statements, 'write');
  }
}

async function seedProductsIfNeeded(forceReset = false) {
  if (forceReset) {
    await db.execute('DELETE FROM products');
  }
  const countRes = await db.execute('SELECT COUNT(*) as cnt FROM products');
  const cnt = Number(countRes.rows[0]?.cnt || 0);
  if (cnt === 0) {
    const categoryStatements = DEFAULT_CATEGORIES.map((cat, idx) => ({
      sql: 'INSERT OR IGNORE INTO categories (name, sortOrder) VALUES (?, ?)',
      args: [cat, idx]
    }));
    const productStatements = DEFAULT_PRODUCTS.map(p => ({
      sql: `INSERT OR IGNORE INTO products (
        id, name, category, price, oldPrice, rating, reviewCount,
        image, featured, inStock, shortDesc, description, benefits, ingredients, usage, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
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
      ]
    }));
    await db.batch([...categoryStatements, ...productStatements], 'write');
  }
}

async function seedReviewsIfNeeded(forceReset = false) {
  if (forceReset) {
    await db.execute('DELETE FROM reviews');
  }
  const countRes = await db.execute('SELECT COUNT(*) as cnt FROM reviews');
  const cnt = Number(countRes.rows[0]?.cnt || 0);
  if (cnt === 0) {
    const statements = DEFAULT_REVIEWS.map(r => ({
      sql: `INSERT OR IGNORE INTO reviews (
        id, author, location, rating, date, productName, text, photoUrl, hasPhoto, isApproved, isFeatured, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
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
      ]
    }));
    await db.batch(statements, 'write');
  }
}

async function seedAdminPinIfNeeded() {
  const res = await db.execute("SELECT value FROM admin_config WHERE key = 'admin_pin_hash'");
  if (res.rows.length === 0) {
    const initialPin = (process.env.ADMIN_INITIAL_PIN || '').trim();
    if (initialPin.length >= 6) {
      const initialHash = bcrypt.hashSync(initialPin, 10);
      await db.execute({
        sql: "INSERT OR IGNORE INTO admin_config (key, value) VALUES ('admin_pin_hash', ?)",
        args: [initialHash]
      });
    } else {
      console.warn('[Security] ADMIN_INITIAL_PIN (min 6 chars) is not set in .env and no PIN hash exists in the database yet.');
    }
  }
}

async function cleanupExpiredSessions() {
  try {
    await db.execute({
      sql: 'DELETE FROM admin_sessions WHERE expiresAt <= ?',
      args: [Date.now()]
    });
  } catch (err) {
    console.error('Error cleaning expired sessions:', err.message);
  }
}

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

// Validate image (<= 3 MB, real JPG/PNG/WEBP magic bytes) and upload to Cloudinary
async function uploadValidatedImageToCloudinary(imageInput, defaultFallback = '') {
  if (!imageInput || typeof imageInput !== 'string') return defaultFallback;
  const trimmed = imageInput.trim();
  if (!trimmed) return defaultFallback;

  if (!trimmed.startsWith('data:')) {
    // Allow safe relative preset paths OR existing Cloudinary secure URLs
    if (
      (/^(images|uploads)\/[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp)$/i.test(trimmed) && !trimmed.includes('..')) ||
      /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9._/-]+\.(jpg|jpeg|png|webp)$/i.test(trimmed)
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

  const randomPublicId = `swh_${crypto.randomBytes(16).toString('hex')}`;
  const dataUri = `data:${detected.mime};base64,${buffer.toString('base64')}`;

  try {
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'successful_wellness_herbs',
      public_id: randomPublicId,
      resource_type: 'image',
      overwrite: false
    });
    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error('Cloudinary did not return a secure_url.');
    }
    return uploadResult.secure_url;
  } catch (cloudErr) {
    const err = new Error(`Cloudinary image upload failed: ${cloudErr.message || 'Check CLOUDINARY_URL configuration.'}`);
    err.statusCode = 502;
    throw err;
  }
}

async function deleteCloudinaryImageIfApplicable(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return;
  if (!imageUrl.startsWith('https://res.cloudinary.com/')) return;
  try {
    const match = imageUrl.match(/\/image\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    if (match && match[1]) {
      await cloudinary.uploader.destroy(match[1], { resource_type: 'image', invalidate: true });
    }
  } catch (err) {
    console.error('Failed to delete Cloudinary image:', err.message);
  }
}

function getBearerToken(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return '';
}

async function isAdminAuthenticated(req) {
  const token = getBearerToken(req);
  if (!token) return false;
  const now = Date.now();
  const res = await db.execute({
    sql: 'SELECT token FROM admin_sessions WHERE token = ? AND expiresAt > ?',
    args: [token, now]
  });
  return res.rows.length > 0;
}

async function requireAdminAuth(req, res, next) {
  try {
    const authed = await isAdminAuthenticated(req);
    if (!authed) {
      return res.status(401).json({ error: 'Unauthorized: Valid Admin session token required.' });
    }
    if (typeof next === 'function') return next();
    return true;
  } catch (err) {
    return next(err);
  }
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

// Disable caching on API responses and allow local dev origins (e.g. VS Code Live Server)
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  const origin = req.headers.origin || '';
  if (
    origin === 'null' ||
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)
  ) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
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
app.post('/api/admin/login', loginRateLimiter, async (req, res, next) => {
  try {
    const enteredPin = String(req.body?.pin || '').trim();
    if (!enteredPin) {
      return res.status(400).json({ error: 'PIN is required.' });
    }

    const pinRes = await db.execute("SELECT value FROM admin_config WHERE key = 'admin_pin_hash'");
    const row = pinRes.rows[0];
    if (!row || !row.value) {
      return res.status(503).json({
        error: 'Admin PIN is not configured on the server. Set ADMIN_INITIAL_PIN (at least 6 characters) in .env and restart.'
      });
    }

    const isValid = bcrypt.compareSync(enteredPin, String(row.value));
    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect Admin PIN.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const now = Date.now();
    const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours
    await db.execute({
      sql: 'INSERT INTO admin_sessions (token, createdAt, expiresAt) VALUES (?, ?, ?)',
      args: [token, now, expiresAt]
    });

    return res.status(200).json({ token, expiresAt });
  } catch (err) {
    next(err);
  }
});

app.post('/api/admin/logout', async (req, res, next) => {
  try {
    const token = getBearerToken(req);
    if (token) {
      await db.execute({
        sql: 'DELETE FROM admin_sessions WHERE token = ?',
        args: [token]
      });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

app.get('/api/admin/session', async (req, res, next) => {
  try {
    const authenticated = await isAdminAuthenticated(req);
    return res.status(200).json({ authenticated });
  } catch (err) {
    next(err);
  }
});

app.put('/api/admin/pin', requireAdminAuth, async (req, res, next) => {
  try {
    const newPin = String(req.body?.newPin || '').trim();
    if (newPin.length < 6) {
      return res.status(400).json({ error: 'New PIN must be at least 6 characters.' });
    }

    const newHash = bcrypt.hashSync(newPin, 10);
    await db.execute({
      sql: "INSERT OR REPLACE INTO admin_config (key, value) VALUES ('admin_pin_hash', ?)",
      args: [newHash]
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ================= ADMIN-ONLY DATABASE EXPORT ROUTE =================
app.get('/api/admin/export', requireAdminAuth, async (req, res, next) => {
  try {
    const [productRes, categoryRes, reviewRes] = await Promise.all([
      db.execute('SELECT * FROM products ORDER BY createdAt DESC'),
      db.execute('SELECT name FROM categories ORDER BY sortOrder ASC, name ASC'),
      db.execute('SELECT * FROM reviews ORDER BY createdAt DESC')
    ]);

    return res.status(200).json({
      exportedAt: new Date().toISOString(),
      categories: categoryRes.rows.map(c => c.name),
      products: productRes.rows.map(formatProductRow),
      reviews: reviewRes.rows.map(formatReviewRow)
    });
  } catch (err) {
    next(err);
  }
});

// ================= PRODUCTS & CATEGORIES ROUTES =================
app.get('/api/products', async (req, res, next) => {
  try {
    const [productRes, categoryRes] = await Promise.all([
      db.execute('SELECT * FROM products ORDER BY createdAt DESC'),
      db.execute('SELECT name FROM categories ORDER BY sortOrder ASC, name ASC')
    ]);
    return res.status(200).json({
      items: productRes.rows.map(formatProductRow),
      categories: categoryRes.rows.map(c => c.name)
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/products', requireAdminAuth, async (req, res, next) => {
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
    const image = await uploadValidatedImageToCloudinary(body.image, 'images/product-herbal-mixture.jpg');
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

    await db.execute({
      sql: 'INSERT OR IGNORE INTO categories (name, sortOrder) VALUES (?, 99)',
      args: [category]
    });
    await db.execute({
      sql: `INSERT INTO products (
        id, name, category, price, oldPrice, rating, reviewCount,
        image, featured, inStock, shortDesc, description, benefits, ingredients, usage, createdAt
      ) VALUES (?, ?, ?, ?, ?, 5.0, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, name, category, price, oldPrice, image, featured, inStock,
        shortDesc, description, JSON.stringify(benefitsArr), ingredients, usage, createdAt
      ]
    });

    const insertedRes = await db.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [id]
    });
    return res.status(201).json({ item: formatProductRow(insertedRes.rows[0]) });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ error: err.message });
    next(err);
  }
});

app.post('/api/products/reset', requireAdminAuth, async (req, res, next) => {
  try {
    await seedCategoriesIfNeeded(true);
    await seedProductsIfNeeded(true);
    const [productRes, categoryRes] = await Promise.all([
      db.execute('SELECT * FROM products ORDER BY createdAt DESC'),
      db.execute('SELECT name FROM categories ORDER BY sortOrder ASC, name ASC')
    ]);
    return res.status(200).json({
      items: productRes.rows.map(formatProductRow),
      categories: categoryRes.rows.map(c => c.name)
    });
  } catch (err) {
    next(err);
  }
});

app.put('/api/products/:id', requireAdminAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const existingRes = await db.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [id]
    });
    const existing = existingRes.rows[0];
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const body = req.body || {};
    const name = body.name !== undefined ? String(body.name).trim().slice(0, 160) : existing.name;
    if (!name) return res.status(400).json({ error: 'Product name cannot be empty.' });
    const category = body.category !== undefined ? String(body.category).trim().slice(0, 80) : existing.category;
    const price = body.price !== undefined ? Number(body.price) : existing.price;
    const oldPrice = body.oldPrice !== undefined ? Number(body.oldPrice) : existing.oldPrice;

    let image = existing.image;
    if (body.image && body.image !== existing.image) {
      image = await uploadValidatedImageToCloudinary(body.image, existing.image);
      if (existing.image && existing.image !== image) {
        await deleteCloudinaryImageIfApplicable(existing.image);
      }
    }

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

    await db.execute({
      sql: 'INSERT OR IGNORE INTO categories (name, sortOrder) VALUES (?, 99)',
      args: [category]
    });
    await db.execute({
      sql: `UPDATE products
            SET name = ?, category = ?, price = ?, oldPrice = ?, image = ?,
                featured = ?, inStock = ?, shortDesc = ?, description = ?,
                benefits = ?, ingredients = ?, usage = ?
            WHERE id = ?`,
      args: [
        name, category, price, oldPrice, image,
        featured, inStock, shortDesc, description,
        JSON.stringify(benefitsArr), ingredients, usage, id
      ]
    });

    const updatedRes = await db.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [id]
    });
    return res.status(200).json({ item: formatProductRow(updatedRes.rows[0]) });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ error: err.message });
    next(err);
  }
});

app.delete('/api/products/:id', requireAdminAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const existingRes = await db.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [id]
    });
    const existing = existingRes.rows[0];
    if (existing && existing.image) {
      await deleteCloudinaryImageIfApplicable(String(existing.image));
      if (String(existing.image).startsWith('uploads/')) {
        const fileName = path.basename(String(existing.image));
        const diskPath = path.join(UPLOADS_DIR, fileName);
        if (fs.existsSync(diskPath)) {
          try { fs.unlinkSync(diskPath); } catch (_) {}
        }
      }
    }
    await db.execute({
      sql: 'DELETE FROM products WHERE id = ?',
      args: [id]
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

app.get('/api/categories', async (req, res, next) => {
  try {
    const rowsRes = await db.execute('SELECT name FROM categories ORDER BY sortOrder ASC, name ASC');
    return res.status(200).json({ items: rowsRes.rows.map(r => r.name) });
  } catch (err) {
    next(err);
  }
});

app.post('/api/categories', requireAdminAuth, async (req, res, next) => {
  try {
    const name = String(req.body?.name || '').trim().slice(0, 80);
    if (!name) return res.status(400).json({ error: 'Category name is required' });
    await db.execute({
      sql: 'INSERT OR IGNORE INTO categories (name, sortOrder) VALUES (?, 99)',
      args: [name]
    });
    const rowsRes = await db.execute('SELECT name FROM categories ORDER BY sortOrder ASC, name ASC');
    return res.status(201).json({ name, items: rowsRes.rows.map(r => r.name) });
  } catch (err) {
    next(err);
  }
});

app.delete('/api/categories/:name', requireAdminAuth, async (req, res, next) => {
  try {
    const name = String(req.params.name || '').trim();
    await db.execute({
      sql: 'DELETE FROM categories WHERE name = ?',
      args: [name]
    });
    const remainingRes = await db.execute('SELECT COUNT(*) as cnt FROM categories');
    const cnt = Number(remainingRes.rows[0]?.cnt || 0);
    if (cnt === 0) {
      await db.execute("INSERT INTO categories (name, sortOrder) VALUES ('General Health', 0)");
    }
    const rowsRes = await db.execute('SELECT name FROM categories ORDER BY sortOrder ASC, name ASC');
    return res.status(200).json({ items: rowsRes.rows.map(r => r.name) });
  } catch (err) {
    next(err);
  }
});

// ================= REVIEWS ROUTES =================
// Public: Read approved reviews only (reading hidden reviews requires admin token)
app.get('/api/reviews', async (req, res, next) => {
  try {
    const filter = req.query.filter || 'all';
    const wantsHidden = req.query.includeHidden === '1';
    const includeHidden = wantsHidden && (await isAdminAuthenticated(req));
    const limit = Math.min(Math.max(parseInt(req.query.limit || '9', 10) || 9, 1), 100);
    const offset = Math.max(parseInt(req.query.offset || '0', 10) || 0, 0);

    const conditions = [];
    const args = [];

    if (!includeHidden) {
      conditions.push('isApproved = 1');
    }
    if (filter === 'photos') {
      conditions.push('hasPhoto = 1');
    } else if (filter === 'five_star') {
      conditions.push('rating = 5');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [totalFilteredRes, rowsRes, statsRes] = await Promise.all([
      db.execute({
        sql: `SELECT COUNT(*) as cnt FROM reviews ${whereClause}`,
        args
      }),
      db.execute({
        sql: `SELECT * FROM reviews ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
        args: [...args, limit, offset]
      }),
      db.execute(`
        SELECT
          COUNT(*) as totalAll,
          SUM(CASE WHEN isApproved = 1 THEN 1 ELSE 0 END) as totalApproved,
          SUM(CASE WHEN hasPhoto = 1 AND isApproved = 1 THEN 1 ELSE 0 END) as totalPhotos,
          ROUND(AVG(CASE WHEN isApproved = 1 THEN rating ELSE NULL END), 1) as avgRating
        FROM reviews
      `)
    ]);

    const totalFiltered = Number(totalFilteredRes.rows[0]?.cnt || 0);
    const statsRow = statsRes.rows[0] || {};

    return res.status(200).json({
      items: rowsRes.rows.map(formatReviewRow),
      totalFiltered,
      hasMore: offset + rowsRes.rows.length < totalFiltered,
      stats: {
        totalAll: includeHidden ? Number(statsRow.totalAll || 0) : Number(statsRow.totalApproved || 0),
        totalApproved: Number(statsRow.totalApproved || 0),
        totalPhotos: Number(statsRow.totalPhotos || 0),
        avgRating: Number(statsRow.avgRating || 5.0)
      }
    });
  } catch (err) {
    next(err);
  }
});

// Public: Submit a review (with input validation, length limits, and safe Cloudinary image upload)
app.post('/api/reviews', async (req, res, next) => {
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
    const savedPhotoUrl = body.photoUrl ? await uploadValidatedImageToCloudinary(body.photoUrl, '') : '';
    const hasPhoto = savedPhotoUrl ? 1 : 0;

    const isAdmin = await isAdminAuthenticated(req);
    const isApproved = isAdmin && body.isApproved !== undefined ? (body.isApproved ? 1 : 0) : 1;
    const isFeatured = isAdmin && body.isFeatured !== undefined ? (body.isFeatured ? 1 : 0) : 0;
    const createdAt = Date.now();

    await db.execute({
      sql: `INSERT INTO reviews (id, author, location, rating, date, productName, text, photoUrl, hasPhoto, isApproved, isFeatured, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, rawAuthor, rawLocation, ratingNum, date, rawProductName, rawText, savedPhotoUrl, hasPhoto, isApproved, isFeatured, createdAt]
    });

    const insertedRes = await db.execute({
      sql: 'SELECT * FROM reviews WHERE id = ?',
      args: [id]
    });
    return res.status(201).json({ item: formatReviewRow(insertedRes.rows[0]) });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ error: err.message });
    next(err);
  }
});

// Admin-Only: Reset reviews to default
app.post('/api/reviews/reset', requireAdminAuth, async (req, res, next) => {
  try {
    await seedReviewsIfNeeded(true);
    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Admin-Only: Approve / hide a review
app.patch('/api/reviews/:id', requireAdminAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const existingRes = await db.execute({
      sql: 'SELECT * FROM reviews WHERE id = ?',
      args: [id]
    });
    const existing = existingRes.rows[0];
    if (!existing) return res.status(404).json({ error: 'Review not found' });

    const newStatus = existing.isApproved ? 0 : 1;
    await db.execute({
      sql: 'UPDATE reviews SET isApproved = ? WHERE id = ?',
      args: [newStatus, id]
    });
    const updatedRes = await db.execute({
      sql: 'SELECT * FROM reviews WHERE id = ?',
      args: [id]
    });
    return res.status(200).json({ item: formatReviewRow(updatedRes.rows[0]) });
  } catch (err) {
    next(err);
  }
});

// Admin-Only: Edit a review
app.put('/api/reviews/:id', requireAdminAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const existingRes = await db.execute({
      sql: 'SELECT * FROM reviews WHERE id = ?',
      args: [id]
    });
    const existing = existingRes.rows[0];
    if (!existing) return res.status(404).json({ error: 'Review not found' });

    const body = req.body || {};
    const text = body.text !== undefined ? String(body.text).trim().slice(0, 1000) : existing.text;
    const isApproved = body.isApproved !== undefined ? (body.isApproved ? 1 : 0) : existing.isApproved;
    await db.execute({
      sql: 'UPDATE reviews SET text = ?, isApproved = ? WHERE id = ?',
      args: [text, isApproved, id]
    });
    const updatedRes = await db.execute({
      sql: 'SELECT * FROM reviews WHERE id = ?',
      args: [id]
    });
    return res.status(200).json({ item: formatReviewRow(updatedRes.rows[0]) });
  } catch (err) {
    next(err);
  }
});

// Admin-Only: Delete a review
app.delete('/api/reviews/:id', requireAdminAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const existingRes = await db.execute({
      sql: 'SELECT * FROM reviews WHERE id = ?',
      args: [id]
    });
    const existing = existingRes.rows[0];
    if (existing && existing.photoUrl) {
      await deleteCloudinaryImageIfApplicable(String(existing.photoUrl));
      if (String(existing.photoUrl).startsWith('uploads/')) {
        const fileName = path.basename(String(existing.photoUrl));
        const diskPath = path.join(UPLOADS_DIR, fileName);
        if (fs.existsSync(diskPath)) {
          try { fs.unlinkSync(diskPath); } catch (_) {}
        }
      }
    }
    await db.execute({
      sql: 'DELETE FROM reviews WHERE id = ?',
      args: [id]
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
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

async function startServer() {
  try {
    await createTablesIfNeeded();
    await seedProductsIfNeeded(false);
    await seedReviewsIfNeeded(false);
    await seedAdminPinIfNeeded();
    await cleanupExpiredSessions();
    setInterval(cleanupExpiredSessions, 60 * 60 * 1000).unref();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT} (connected to Turso & Cloudinary)`);
    });
  } catch (err) {
    console.error('Failed to initialize database and start server:', err.message);
    process.exit(1);
  }
}

startServer();
