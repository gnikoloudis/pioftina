import { Product } from "@/lib/posokanei/types";
import { MOCK_FALLBACK_PRODUCTS } from "@/lib/posokanei/mock-data";

/**
 * Pre-curated genuine Greek supermarket products for recipe ingredients.
 * Keyed by canonical ingredient query / name.
 */
export const DEFAULT_CURATED_PRODUCTS: Record<string, Product> = {};

// Helper to look up product by ID in mock database
function findProduct(id: string): Product | undefined {
  return MOCK_FALLBACK_PRODUCTS.find((p) => p.id === id);
}

// 1. Φέτα
const fetaProduct = findProduct("feta-dodoni-400g");
if (fetaProduct) {
  DEFAULT_CURATED_PRODUCTS["φέτα"] = fetaProduct;
  DEFAULT_CURATED_PRODUCTS["φέτα π.ο.π."] = fetaProduct;
}

// 2. Λεμόνια
const lemonsProduct = findProduct("lemons-bag-1kg");
if (lemonsProduct) {
  DEFAULT_CURATED_PRODUCTS["λεμόνια"] = lemonsProduct;
  DEFAULT_CURATED_PRODUCTS["λεμόνι"] = lemonsProduct;
}

// 3. Μοσχαρίσιος Κιμάς & Μοσχάρι Σπάλα
const beefMinceProduct: Product = findProduct("beef-mince-1kg-bulk") || {
  id: "beef-mince-greek-1kg",
  name: "Κιμάς Μοσχαρίσιος Νωπός Ελληνικός 1kg",
  brand: "Κρεοπωλείο Supermarket",
  category: "Κρεοπωλείο & Νωπά Κρέατα",
  category_ids: ["cat-meat"],
  unit: "kg",
  unit_quantity: 1.0,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis"],
  price_stats: {
    min_price: 9.80,
    max_price: 11.20,
    avg_price: 10.50,
    min_unit_price: 9.80,
    retailer_count: 4,
  },
  retailer_prices: [
    {
      retailer: "sklavenitis",
      retailer_display_name: "Σκλαβενίτης",
      retailer_name: "Κιμάς Μοσχαρίσιος 1kg",
      price: 9.80,
      price_normalized: 9.80,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
    {
      retailer: "ab_vasilopoulos",
      retailer_display_name: "ΑΒ Βασιλόπουλος",
      retailer_name: "Κιμάς Μοσχαρίσιος 1kg",
      price: 10.20,
      price_normalized: 10.20,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
  ],
};
DEFAULT_CURATED_PRODUCTS["κιμάς μοσχαρίσιος"] = beefMinceProduct;
DEFAULT_CURATED_PRODUCTS["μοσχαρίσιος κιμάς"] = beefMinceProduct;
DEFAULT_CURATED_PRODUCTS["κιμάς"] = beefMinceProduct;

const beefChunksProduct: Product = {
  id: "beef-chunks-stifado-1kg",
  name: "Μοσχάρι Σπάλα σε Μερίδες για Μαγειρευτό 1kg",
  brand: "Κρεοπωλείο Supermarket",
  category: "Κρεοπωλείο & Νωπά Κρέατα",
  category_ids: ["cat-meat"],
  unit: "kg",
  unit_quantity: 1.0,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "masoutis"],
  price_stats: {
    min_price: 10.90,
    max_price: 12.50,
    avg_price: 11.60,
    min_unit_price: 10.90,
    retailer_count: 3,
  },
  retailer_prices: [
    {
      retailer: "sklavenitis",
      retailer_display_name: "Σκλαβενίτης",
      retailer_name: "Μοσχάρι Σπάλα 1kg",
      price: 10.90,
      price_normalized: 10.90,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
    {
      retailer: "ab_vasilopoulos",
      retailer_display_name: "ΑΒ Βασιλόπουλος",
      retailer_name: "Μοσχάρι Σπάλα 1kg",
      price: 11.40,
      price_normalized: 11.40,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
  ],
};
DEFAULT_CURATED_PRODUCTS["μοσχάρι"] = beefChunksProduct;
DEFAULT_CURATED_PRODUCTS["μοσχάρι σπάλα"] = beefChunksProduct;
DEFAULT_CURATED_PRODUCTS["μοσχάρι για στιφάδο"] = beefChunksProduct;

// 4. Ελαιόλαδο
const oliveOilProduct = findProduct("olive-oil-horio-1lt");
if (oliveOilProduct) {
  DEFAULT_CURATED_PRODUCTS["ελαιόλαδο"] = oliveOilProduct;
  DEFAULT_CURATED_PRODUCTS["εξαιρετικό παρθένο ελαιόλαδο"] = oliveOilProduct;
}

// 5. Πατάτες
const potatoesProduct = findProduct("potatoes-bag-2kg");
if (potatoesProduct) {
  DEFAULT_CURATED_PRODUCTS["πατάτες"] = potatoesProduct;
}

// 6. Μελιτζάνες Φλάσκες
const eggplantsProduct = findProduct("eggplants-1kg");
if (eggplantsProduct) {
  DEFAULT_CURATED_PRODUCTS["μελιτζάνες"] = eggplantsProduct;
  DEFAULT_CURATED_PRODUCTS["μελιτζάνες φλάσκες"] = eggplantsProduct;
}

// 7. Γάλα Πλήρες
const milkProduct = findProduct("milk-delta-1lt");
if (milkProduct) {
  DEFAULT_CURATED_PRODUCTS["γάλα πλήρες"] = milkProduct;
  DEFAULT_CURATED_PRODUCTS["φρέσκο γάλα πλήρες"] = milkProduct;
}

// 8. Γραβιέρα
const gravieraProduct = findProduct("graviera-amfilochias-200g");
if (gravieraProduct) {
  DEFAULT_CURATED_PRODUCTS["γραβιέρα"] = gravieraProduct;
  DEFAULT_CURATED_PRODUCTS["γραβιέρα τριμμένη"] = gravieraProduct;
}

// 9. Ντομάτες / Passata
const passataProduct = findProduct("kyknos-passata-500g") || {
  id: "kyknos-passata-500g",
  name: "ΚΥΚΝΟΣ Τομάτα Τριμμένη Passata 500g",
  brand: "ΚΥΚΝΟΣ",
  category: "Προϊόντα Τομάτας",
  category_ids: ["cat-pantry"],
  unit: "kg",
  unit_quantity: 0.5,
  has_image: true,
  image_url: null,
  private_label: false,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis"],
  price_stats: {
    min_price: 0.95,
    max_price: 1.15,
    avg_price: 1.05,
    min_unit_price: 1.90,
    retailer_count: 4,
  },
  retailer_prices: [
    {
      retailer: "sklavenitis",
      retailer_display_name: "Σκλαβενίτης",
      retailer_name: "Κύκνος Passata 500g",
      price: 0.95,
      price_normalized: 1.90,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
    {
      retailer: "ab_vasilopoulos",
      retailer_display_name: "ΑΒ Βασιλόπουλος",
      retailer_name: "Κύκνος Passata 500g",
      price: 1.05,
      price_normalized: 2.10,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
  ],
};
DEFAULT_CURATED_PRODUCTS["τομάτα τριμμένη"] = passataProduct;

// 10. Ντομάτες για Γεμιστά / Φρέσκες
const freshTomatoes = findProduct("tomatoes-pack-1kg");
if (freshTomatoes) {
  DEFAULT_CURATED_PRODUCTS["ντομάτες"] = freshTomatoes;
  DEFAULT_CURATED_PRODUCTS["ντομάτες για γεμιστά"] = freshTomatoes;
}

// 11. Πιπεριές για Γεμιστά
const freshPeppers = findProduct("peppers-pack-1kg");
if (freshPeppers) {
  DEFAULT_CURATED_PRODUCTS["πιπεριές"] = freshPeppers;
  DEFAULT_CURATED_PRODUCTS["πιπεριές για γεμιστά"] = freshPeppers;
}

// 12. Ρύζι Καρολίνα
const karolinaRice = findProduct("rice-bonnet-500g");
if (karolinaRice) {
  DEFAULT_CURATED_PRODUCTS["ρύζι καρολίνα"] = karolinaRice;
  DEFAULT_CURATED_PRODUCTS["ρύζι καρολίνα ή γλασέ"] = karolinaRice;
}

// 13. Κρεμμύδια Ξερά
const onionsProduct = findProduct("onions-bag-1kg");
if (onionsProduct) {
  DEFAULT_CURATED_PRODUCTS["κρεμμύδια"] = onionsProduct;
  DEFAULT_CURATED_PRODUCTS["κρεμμύδια ξερά"] = onionsProduct;
}

// 14. Κοτόπουλο / Μπούτια
const chickenProduct = findProduct("chicken-breast-mimikos-700g") || {
  id: "kotopoulo-whole-1.5kg",
  name: "Κοτόπουλο ολόκληρο νωπό ελληνικό 1.5kg",
  brand: "Πτηνοτροφία Supermarket",
  category: "Πουλερικά & Κρέας",
  category_ids: ["cat-meat"],
  unit: "kg",
  unit_quantity: 1.5,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis"],
  price_stats: {
    min_price: 5.85,
    max_price: 6.90,
    avg_price: 6.35,
    min_unit_price: 3.90,
    retailer_count: 4,
  },
  retailer_prices: [
    {
      retailer: "sklavenitis",
      retailer_display_name: "Σκλαβενίτης",
      retailer_name: "Κοτόπουλο Νωπό 1.5kg",
      price: 5.85,
      price_normalized: 3.90,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
    {
      retailer: "ab_vasilopoulos",
      retailer_display_name: "ΑΒ Βασιλόπουλος",
      retailer_name: "Κοτόπουλο Νωπό 1.5kg",
      price: 6.20,
      price_normalized: 4.13,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
  ],
};
DEFAULT_CURATED_PRODUCTS["κοτόπουλο μπούτια"] = chickenProduct;
DEFAULT_CURATED_PRODUCTS["κοτόπουλο"] = chickenProduct;

// 14b. Κοτόπουλο Φιλέτο Στήθος
const chickenBreastProduct: Product = findProduct("chicken-breast-mimikos-700g") || {
  id: "chicken-breast-mimikos-700g",
  name: "ΜΙΜΙΚΟΣ Φιλέτο Στήθος Κοτόπουλο 700g",
  brand: "ΜΙΜΙΚΟΣ",
  category: "Κρεοπωλείο",
  category_ids: ["cat-meat", "cat-poultry"],
  unit: "kg",
  unit_quantity: 0.7,
  has_image: true,
  image_url: null,
  private_label: false,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "masoutis"],
  price_stats: {
    min_price: 6.95,
    max_price: 7.60,
    avg_price: 7.25,
    min_unit_price: 9.93,
    retailer_count: 3,
  },
  retailer_prices: [
    {
      retailer: "sklavenitis",
      retailer_display_name: "Σκλαβενίτης",
      retailer_name: "Μιμίκος Φιλέτο 700g",
      price: 6.95,
      price_normalized: 9.93,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
  ],
};
DEFAULT_CURATED_PRODUCTS["κοτόπουλο στήθος"] = chickenBreastProduct;
DEFAULT_CURATED_PRODUCTS["φιλέτο κοτόπουλο"] = chickenBreastProduct;
DEFAULT_CURATED_PRODUCTS["στήθος κοτόπουλο"] = chickenBreastProduct;
DEFAULT_CURATED_PRODUCTS["φιλέτο στήθος κοτόπουλο"] = chickenBreastProduct;

// 14c. Μαρούλι
const lettuceProduct: Product = {
  id: "lettuce-fresh-piece",
  name: "Μαρούλι Φρέσκο Ελληνικό (τεμάχιο)",
  brand: "Μαναβική Supermarket",
  category: "Μαναβική & Οπωροπωλείο",
  category_ids: ["cat-produce"],
  unit: "τεμ",
  unit_quantity: 1.0,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis"],
  price_stats: {
    min_price: 0.65,
    max_price: 0.85,
    avg_price: 0.74,
    min_unit_price: 0.65,
    retailer_count: 4,
  },
  retailer_prices: [
    {
      retailer: "sklavenitis",
      retailer_display_name: "Σκλαβενίτης",
      retailer_name: "Μαρούλι Ελληνικό",
      price: 0.65,
      price_normalized: 0.65,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
    {
      retailer: "ab_vasilopoulos",
      retailer_display_name: "ΑΒ Βασιλόπουλος",
      retailer_name: "Μαρούλι Ελληνικό",
      price: 0.75,
      price_normalized: 0.75,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
  ],
};
DEFAULT_CURATED_PRODUCTS["μαρούλι"] = lettuceProduct;
DEFAULT_CURATED_PRODUCTS["μαρούλι φρέσκο"] = lettuceProduct;

// 15. Μουστάρδα
const mustardProduct = findProduct("mustard-kalamata-papadimitriou-300g");
if (mustardProduct) {
  DEFAULT_CURATED_PRODUCTS["μουστάρδα"] = mustardProduct;
  DEFAULT_CURATED_PRODUCTS["μουστάρδα απαλή"] = mustardProduct;
}

// 16. Σπαγγέτι No 6
const pastaProduct = findProduct("pasta-barilla-no5-500g");
if (pastaProduct) {
  DEFAULT_CURATED_PRODUCTS["σπαγγέτι no 6"] = pastaProduct;
  DEFAULT_CURATED_PRODUCTS["σπαγγέτι"] = pastaProduct;
}

// 17. Μυζήθρα τριμμένη
const myzithraProduct: Product = {
  id: "myzithra-mevgal-200g",
  name: "ΜΕΒΓΑΛ Μυζήθρα Ξηρή Τριμμένη 200g",
  brand: "ΜΕΒΓΑΛ",
  category: "Τυριά & Γαλακτοκομικά",
  category_ids: ["cat-dairy"],
  unit: "kg",
  unit_quantity: 0.2,
  has_image: true,
  image_url: null,
  private_label: false,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "masoutis"],
  price_stats: {
    min_price: 2.48,
    max_price: 2.85,
    avg_price: 2.65,
    min_unit_price: 12.40,
    retailer_count: 3,
  },
  retailer_prices: [
    {
      retailer: "sklavenitis",
      retailer_display_name: "Σκλαβενίτης",
      retailer_name: "ΜΕΒΓΑΛ Μυζήθρα 200g",
      price: 2.48,
      price_normalized: 12.40,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
    {
      retailer: "ab_vasilopoulos",
      retailer_display_name: "ΑΒ Βασιλόπουλος",
      retailer_name: "ΜΕΒΓΑΛ Μυζήθρα 200g",
      price: 2.58,
      price_normalized: 12.90,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
  ],
};
DEFAULT_CURATED_PRODUCTS["μυζήθρα τριμμένη"] = myzithraProduct;
DEFAULT_CURATED_PRODUCTS["κεφαλοτύρι ή μυζήθρα τριμμένη"] = myzithraProduct;

// 18. Φασολάκια
const fasolakiaProduct = findProduct("fasolakia-barba-stathis-1kg");
if (fasolakiaProduct) {
  DEFAULT_CURATED_PRODUCTS["φασολάκια"] = fasolakiaProduct;
  DEFAULT_CURATED_PRODUCTS["φασολάκια στρογγυλά ή πλατιά"] = fasolakiaProduct;
}

// 19. Σπανάκι
const spinachProduct = findProduct("spinach-barba-stathis-1kg");
if (spinachProduct) {
  DEFAULT_CURATED_PRODUCTS["σπανάκι"] = spinachProduct;
}

// 20. Αγγούρια
const aggouriaProduct = {
  id: "aggouria-greek-1kg",
  name: "Αγγούρια Ελληνικά σε συσκευασία 750g",
  brand: "Μαναβική Supermarket",
  category: "Μαναβική & Οπωροπωλείο",
  category_ids: ["cat-produce"],
  unit: "kg",
  unit_quantity: 0.75,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl"],
  price_stats: {
    min_price: 1.35,
    max_price: 1.65,
    avg_price: 1.48,
    min_unit_price: 1.80,
    retailer_count: 3,
  },
  retailer_prices: [
    {
      retailer: "sklavenitis",
      retailer_display_name: "Σκλαβενίτης",
      retailer_name: "Αγγούρια 750g",
      price: 1.35,
      price_normalized: 1.80,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
    {
      retailer: "ab_vasilopoulos",
      retailer_display_name: "ΑΒ Βασιλόπουλος",
      retailer_name: "Αγγούρια 750g",
      price: 1.45,
      price_normalized: 1.93,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
  ],
};
DEFAULT_CURATED_PRODUCTS["αγγούρια"] = aggouriaProduct;

// 21. Παξιμάδια
const rusksProduct = findProduct("rusks-manna-600g");
if (rusksProduct) {
  DEFAULT_CURATED_PRODUCTS["παξιμάδια κριθαρένια"] = rusksProduct;
}

// 22. Ελιές
const olivesProduct = findProduct("olives-kalamon-350g");
if (olivesProduct) {
  DEFAULT_CURATED_PRODUCTS["ελιές καλαμών"] = olivesProduct;
}

// 23. Φακές
const lentilsProduct = findProduct("lentils-agrino-500g");
if (lentilsProduct) {
  DEFAULT_CURATED_PRODUCTS["φακές ψιλές"] = lentilsProduct;
  DEFAULT_CURATED_PRODUCTS["φακές"] = lentilsProduct;
}

// 24. Αραβικές Πίτες
const arabicPitaProduct: Product = {
  id: "arabic-pita-karamolegkos-360g",
  name: "ΚΑΡΑΜΟΛΕΓΚΟΣ Αραβικές Πίτες Μεγάλες 6τεμ 360g",
  brand: "ΚΑΡΑΜΟΛΕΓΚΟΣ",
  category: "Αρτοσκευάσματα & Πίτες",
  category_ids: ["cat-bakery"],
  unit: "kg",
  unit_quantity: 0.36,
  has_image: true,
  image_url: null,
  private_label: false,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "mymarket", "masoutis"],
  price_stats: {
    min_price: 1.42,
    max_price: 1.65,
    avg_price: 1.52,
    min_unit_price: 3.94,
    retailer_count: 4,
  },
  retailer_prices: [
    {
      retailer: "sklavenitis",
      retailer_display_name: "Σκλαβενίτης",
      retailer_name: "Καραμολέγκος Αραβικές Πίτες 360g",
      price: 1.42,
      price_normalized: 3.94,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
    {
      retailer: "ab_vasilopoulos",
      retailer_display_name: "ΑΒ Βασιλόπουλος",
      retailer_name: "Καραμολέγκος Αραβικές Πίτες 360g",
      price: 1.48,
      price_normalized: 4.11,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
  ],
};
DEFAULT_CURATED_PRODUCTS["αραβικές πίτες"] = arabicPitaProduct;
DEFAULT_CURATED_PRODUCTS["αραβική πίτα"] = arabicPitaProduct;
DEFAULT_CURATED_PRODUCTS["αραβικη πιτα"] = arabicPitaProduct;
DEFAULT_CURATED_PRODUCTS["αραβικες πιτες"] = arabicPitaProduct;
DEFAULT_CURATED_PRODUCTS["πίτες αραβικές"] = arabicPitaProduct;
DEFAULT_CURATED_PRODUCTS["πιτες αραβικες"] = arabicPitaProduct;
DEFAULT_CURATED_PRODUCTS["αραβικές πίτες μεγάλες"] = arabicPitaProduct;

// 25. Πίτες για Σουβλάκι
const souvlakiPitaProduct: Product = {
  id: "pites-souvlaki-10tem-820g",
  name: "ΧΩΡΙΑΤΙΚΕΣ Πίτες για Σουβλάκι Παραδοσιακές 10τεμ 820g",
  brand: "Αρτοποιία Supermarket",
  category: "Αρτοσκευάσματα & Πίτες",
  category_ids: ["cat-bakery"],
  unit: "kg",
  unit_quantity: 0.82,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl"],
  price_stats: {
    min_price: 1.75,
    max_price: 1.95,
    avg_price: 1.84,
    min_unit_price: 2.13,
    retailer_count: 3,
  },
  retailer_prices: [
    {
      retailer: "sklavenitis",
      retailer_display_name: "Σκλαβενίτης",
      retailer_name: "Πίτες για Σουβλάκι 10τεμ",
      price: 1.75,
      price_normalized: 2.13,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
    {
      retailer: "ab_vasilopoulos",
      retailer_display_name: "ΑΒ Βασιλόπουλος",
      retailer_name: "Πίτες για Σουβλάκι 10τεμ",
      price: 1.85,
      price_normalized: 2.26,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
  ],
};
DEFAULT_CURATED_PRODUCTS["πίτες για σουβλάκι"] = souvlakiPitaProduct;
DEFAULT_CURATED_PRODUCTS["πίτα για σουβλάκι"] = souvlakiPitaProduct;

// 26. Τορτίγιες Wraps
const tortillasProduct: Product = {
  id: "tortillas-papadopoulou-370g",
  name: "ΠΑΠΑΔΟΠΟΥΛΟΥ Tortillas Wraps Σταρένιες 6τεμ 370g",
  brand: "ΠΑΠΑΔΟΠΟΥΛΟΥ",
  category: "Αρτοσκευάσματα & Πίτες",
  category_ids: ["cat-bakery"],
  unit: "kg",
  unit_quantity: 0.37,
  has_image: true,
  image_url: null,
  private_label: false,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "mymarket"],
  price_stats: {
    min_price: 1.58,
    max_price: 1.79,
    avg_price: 1.68,
    min_unit_price: 4.27,
    retailer_count: 3,
  },
  retailer_prices: [
    {
      retailer: "sklavenitis",
      retailer_display_name: "Σκλαβενίτης",
      retailer_name: "Παπαδοπούλου Tortillas 370g",
      price: 1.58,
      price_normalized: 4.27,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
  ],
};
DEFAULT_CURATED_PRODUCTS["τορτίγιες"] = tortillasProduct;
DEFAULT_CURATED_PRODUCTS["τορτίγια"] = tortillasProduct;

// 28. Στραγγιστό Γιαούρτι 2%
const greekYogurtProduct: Product = {
  id: "fage-total-2pct-1kg",
  name: "ΦΑΓΕ Total 2% Γιαούρτι Στραγγιστό 1kg",
  brand: "ΦΑΓΕ",
  category: "Τυριά & Γαλακτοκομικά",
  category_ids: ["cat-dairy", "cat-yogurt"],
  unit: "kg",
  unit_quantity: 1,
  has_image: true,
  image_url: null,
  private_label: false,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "masoutis", "mymarket"],
  price_stats: {
    min_price: 3.45,
    max_price: 3.95,
    avg_price: 3.68,
    min_unit_price: 3.45,
    retailer_count: 4,
  },
  retailer_prices: [
    {
      retailer: "sklavenitis",
      retailer_display_name: "Σκλαβενίτης",
      retailer_name: "ΦΑΓΕ Total 2% 1kg",
      price: 3.45,
      price_normalized: 3.45,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
    {
      retailer: "ab_vasilopoulos",
      retailer_display_name: "ΑΒ Βασιλόπουλος",
      retailer_name: "ΦΑΓΕ Total 2% 1kg",
      price: 3.65,
      price_normalized: 3.65,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
    {
      retailer: "mymarket",
      retailer_display_name: "My Market",
      retailer_name: "ΦΑΓΕ Total 2% 1kg",
      price: 3.75,
      price_normalized: 3.75,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
  ],
};
DEFAULT_CURATED_PRODUCTS["γιαούρτι 2%"] = greekYogurtProduct;
DEFAULT_CURATED_PRODUCTS["γιαουρτι 2%"] = greekYogurtProduct;
DEFAULT_CURATED_PRODUCTS["στραγγιστό γιαούρτι 2%"] = greekYogurtProduct;
DEFAULT_CURATED_PRODUCTS["στραγγιστο γιαουρτι 2%"] = greekYogurtProduct;
DEFAULT_CURATED_PRODUCTS["γιαούρτι"] = greekYogurtProduct;
DEFAULT_CURATED_PRODUCTS["γιαουρτι"] = greekYogurtProduct;
DEFAULT_CURATED_PRODUCTS["στραγγιστό γιαούρτι"] = greekYogurtProduct;
DEFAULT_CURATED_PRODUCTS["στραγγιστο γιαουρτι"] = greekYogurtProduct;

// 29. Μέλι
const honeyProduct: Product = {
  id: "attiki-honey-455g",
  name: "ΑΤΤΙΚΗ Μέλι Ελληνικό Ανθέων & Κωνοφόρων 455g",
  brand: "ΑΤΤΙΚΗ",
  category: "Τρόφιμα Παντοπωλείου",
  category_ids: ["cat-pantry", "cat-honey"],
  unit: "kg",
  unit_quantity: 0.455,
  has_image: true,
  image_url: null,
  private_label: false,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "masoutis"],
  price_stats: {
    min_price: 5.85,
    max_price: 6.7,
    avg_price: 6.25,
    min_unit_price: 12.86,
    retailer_count: 3,
  },
  retailer_prices: [
    {
      retailer: "sklavenitis",
      retailer_display_name: "Σκλαβενίτης",
      retailer_name: "Αττική Μέλι 455g",
      price: 5.85,
      price_normalized: 12.86,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
    {
      retailer: "ab_vasilopoulos",
      retailer_display_name: "ΑΒ Βασιλόπουλος",
      retailer_name: "Αττική Μέλι 455g",
      price: 6.2,
      price_normalized: 13.63,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
  ],
};
DEFAULT_CURATED_PRODUCTS["μέλι"] = honeyProduct;
DEFAULT_CURATED_PRODUCTS["μελι"] = honeyProduct;
DEFAULT_CURATED_PRODUCTS["μέλι θυμαρίσιο"] = honeyProduct;
DEFAULT_CURATED_PRODUCTS["μελι θυμαρισιο"] = honeyProduct;

// 30. Καρύδια
const walnutsProduct: Product = {
  id: "walnuts-greek-200g",
  name: "Καρύδια Ψίχα Ελληνικά 200g",
  brand: "Ξηροί Καρποί Supermarket",
  category: "Τρόφιμα Παντοπωλείου",
  category_ids: ["cat-pantry", "cat-nuts"],
  unit: "kg",
  unit_quantity: 0.2,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "mymarket"],
  price_stats: {
    min_price: 2.85,
    max_price: 3.4,
    avg_price: 3.12,
    min_unit_price: 14.25,
    retailer_count: 3,
  },
  retailer_prices: [
    {
      retailer: "sklavenitis",
      retailer_display_name: "Σκλαβενίτης",
      retailer_name: "Καρύδια Ψίχα 200g",
      price: 2.85,
      price_normalized: 14.25,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
    {
      retailer: "ab_vasilopoulos",
      retailer_display_name: "ΑΒ Βασιλόπουλος",
      retailer_name: "Καρύδια Ψίχα 200g",
      price: 3.1,
      price_normalized: 15.5,
      is_discount: false,
      discount_percentage: null,
      last_updated: "2026-10-18T00:00:00",
      country: "GR",
    },
  ],
};
DEFAULT_CURATED_PRODUCTS["καρύδια"] = walnutsProduct;
DEFAULT_CURATED_PRODUCTS["καρυδια"] = walnutsProduct;
DEFAULT_CURATED_PRODUCTS["καρύδια ψίχα"] = walnutsProduct;



/**
 * Returns a pre-curated product for an ingredient query if available
 */
export function getCuratedDefaultProduct(nameOrQuery: string): Product | null {
  const q = nameOrQuery.toLowerCase().trim();
  if (DEFAULT_CURATED_PRODUCTS[q]) {
    return DEFAULT_CURATED_PRODUCTS[q];
  }

  // Also check stripped/cleaned query without buzzwords
  const cleaned = q
    .replace(/\b(high\s*protein|protein|πρωτεΐνη|πρωτεινη|zero|bio|βιολογικό|βιολογικά|light|χωρίς\s*γλουτένη|extra|deluxe|premium|ολικής)\b/gi, "")
    .replace(/[(),;.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned && DEFAULT_CURATED_PRODUCTS[cleaned]) {
    return DEFAULT_CURATED_PRODUCTS[cleaned];
  }

  for (const [key, prod] of Object.entries(DEFAULT_CURATED_PRODUCTS)) {
    if (
      q.includes(key) ||
      key.includes(q) ||
      (cleaned && (cleaned.includes(key) || key.includes(cleaned)))
    ) {
      return prod;
    }
  }
  return null;
}
