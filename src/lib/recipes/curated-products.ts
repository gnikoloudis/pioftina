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

// 18. Αυγά Ελευθέρας Βοσκής
const eggsProduct: Product = {
  id: "eggs-free-range-6pk",
  name: "Αυγά Ελευθέρας Βοσκής 6άδα M/L",
  brand: "Χρυσά Αυγά",
  category: "Γαλακτοκομικά & Αυγά",
  category_ids: ["cat-dairy", "cat-eggs"],
  unit: "τεμ",
  unit_quantity: 6,
  has_image: true,
  image_url: null,
  private_label: false,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 2.10, max_price: 2.45, avg_price: 2.25, min_unit_price: 0.35, retailer_count: 5 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Αυγά Ελευθέρας Βοσκής 6άδα", price: 2.10, price_normalized: 2.10, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" },
    { retailer: "ab_vasilopoulos", retailer_display_name: "ΑΒ Βασιλόπουλος", retailer_name: "Αυγά Ελευθέρας Βοσκής 6άδα", price: 2.25, price_normalized: 2.25, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["αυγά"] = eggsProduct;
DEFAULT_CURATED_PRODUCTS["αυγα"] = eggsProduct;
DEFAULT_CURATED_PRODUCTS["αυγό"] = eggsProduct;
DEFAULT_CURATED_PRODUCTS["αυγο"] = eggsProduct;
DEFAULT_CURATED_PRODUCTS["αυγά ελευθέρας βοσκής"] = eggsProduct;

// 19. Βούτυρο & Στακοβούτυρο
const butterProduct: Product = {
  id: "butter-lupak-cow-250g",
  name: "Βούτυρο Αγελάδος / Στακοβούτυρο 250g",
  brand: "Lurpak / Κρήτης",
  category: "Γαλακτοκομικά & Βούτυρα",
  category_ids: ["cat-dairy"],
  unit: "g",
  unit_quantity: 250,
  has_image: true,
  image_url: null,
  private_label: false,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 3.20, max_price: 3.65, avg_price: 3.40, min_unit_price: 12.80, retailer_count: 4 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Βούτυρο 250g", price: 3.20, price_normalized: 12.80, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["βούτυρο"] = butterProduct;
DEFAULT_CURATED_PRODUCTS["βουτυρο"] = butterProduct;
DEFAULT_CURATED_PRODUCTS["στακοβούτυρο"] = butterProduct;
DEFAULT_CURATED_PRODUCTS["στακοβουτυρο"] = butterProduct;
DEFAULT_CURATED_PRODUCTS["βούτυρο αγελάδος"] = butterProduct;

// 20. Ψωμί Προζυμένιο, Τοστ & Κουλούρι
const breadProduct: Product = {
  id: "bread-sourdough-500g",
  name: "Ψωμί Προζυμένιο Χωριάτικο / Τοστ 500g",
  brand: "Αρτοποιείο Supermarket",
  category: "Αρτοποιείο",
  category_ids: ["cat-bakery"],
  unit: "g",
  unit_quantity: 500,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 1.35, max_price: 1.65, avg_price: 1.50, min_unit_price: 2.70, retailer_count: 5 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Ψωμί Χωριάτικο 500g", price: 1.35, price_normalized: 2.70, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["ψωμί"] = breadProduct;
DEFAULT_CURATED_PRODUCTS["ψωμι"] = breadProduct;
DEFAULT_CURATED_PRODUCTS["ψωμί προζυμένιο"] = breadProduct;
DEFAULT_CURATED_PRODUCTS["προζυμένιο ψωμί"] = breadProduct;
DEFAULT_CURATED_PRODUCTS["ψωμί του τοστ"] = breadProduct;
DEFAULT_CURATED_PRODUCTS["ψωμί ολικής"] = breadProduct;
DEFAULT_CURATED_PRODUCTS["κουλούρι"] = breadProduct;
DEFAULT_CURATED_PRODUCTS["bagel"] = breadProduct;
DEFAULT_CURATED_PRODUCTS["τσουρέκι"] = {
  ...breadProduct,
  id: "tsoureki-greek-450g",
  name: "Τσουρέκι Παραδοσιακό Πολίτικο 450g",
  price_stats: { min_price: 2.30, max_price: 2.80, avg_price: 2.50, min_unit_price: 5.10, retailer_count: 4 }
};

// 21. Κολοκυθάκια Φρέσκα
const zucchiniProduct: Product = {
  id: "zucchini-greek-1kg",
  name: "Κολοκυθάκια Ελληνικά 1kg",
  brand: "Μαναβική Supermarket",
  category: "Οπωροπωλείο & Μαναβική",
  category_ids: ["cat-produce"],
  unit: "kg",
  unit_quantity: 1.0,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 1.30, max_price: 1.70, avg_price: 1.50, min_unit_price: 1.30, retailer_count: 5 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Κολοκυθάκια 1kg", price: 1.30, price_normalized: 1.30, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["κολοκυθάκια"] = zucchiniProduct;
DEFAULT_CURATED_PRODUCTS["κολοκυθακια"] = zucchiniProduct;
DEFAULT_CURATED_PRODUCTS["κολοκύθι"] = zucchiniProduct;
DEFAULT_CURATED_PRODUCTS["κολοκυθάκι"] = zucchiniProduct;

// 22. Ανθότυρο & Κατίκι Δομοκού
const anthotyroProduct: Product = {
  id: "anthotyro-cretan-350g",
  name: "Ανθότυρο Νωπό / Κατίκι Δομοκού 350g",
  brand: "Τυροκομείο",
  category: "Γαλακτοκομικά & Τυριά",
  category_ids: ["cat-dairy"],
  unit: "g",
  unit_quantity: 350,
  has_image: true,
  image_url: null,
  private_label: false,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 2.40, max_price: 2.95, avg_price: 2.65, min_unit_price: 6.85, retailer_count: 4 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Ανθότυρο 350g", price: 2.40, price_normalized: 6.85, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["ανθότυρο"] = anthotyroProduct;
DEFAULT_CURATED_PRODUCTS["ανθοτυρο"] = anthotyroProduct;
DEFAULT_CURATED_PRODUCTS["κατίκι"] = anthotyroProduct;
DEFAULT_CURATED_PRODUCTS["κατικι"] = anthotyroProduct;
DEFAULT_CURATED_PRODUCTS["κατίκι δομοκού"] = anthotyroProduct;
DEFAULT_CURATED_PRODUCTS["ξινομυζήθρα"] = anthotyroProduct;
DEFAULT_CURATED_PRODUCTS["κεφαλοτύρι"] = {
  ...anthotyroProduct,
  id: "kefalotyri-amfilochias-250g",
  name: "Κεφαλοτύρι Αμφιλοχίας / Κρήτης 250g",
  price_stats: { min_price: 3.80, max_price: 4.30, avg_price: 4.00, min_unit_price: 15.20, retailer_count: 4 }
};

// 23. Βρώμη Ολικής Άλεσης
const oatsProduct: Product = {
  id: "oats-quaker-whole-500g",
  name: "Νιφάδες Βρώμης Ολικής Άλεσης 500g",
  brand: "Quaker / Supermarket",
  category: "Παντοπωλείο",
  category_ids: ["cat-pantry"],
  unit: "g",
  unit_quantity: 500,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 1.15, max_price: 1.60, avg_price: 1.35, min_unit_price: 2.30, retailer_count: 5 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Νιφάδες Βρώμης 500g", price: 1.15, price_normalized: 2.30, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["βρώμη"] = oatsProduct;
DEFAULT_CURATED_PRODUCTS["βρωμη"] = oatsProduct;
DEFAULT_CURATED_PRODUCTS["νιφάδες βρώμης"] = oatsProduct;

// 24. Φρούτα (Μήλα, Μπανάνες)
const fruitProduct: Product = {
  id: "apples-starkin-1kg",
  name: "Μήλα Στάρκιν / Μπανάνες 1kg",
  brand: "Μαναβική Supermarket",
  category: "Οπωροπωλείο",
  category_ids: ["cat-produce"],
  unit: "kg",
  unit_quantity: 1.0,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 1.40, max_price: 1.85, avg_price: 1.60, min_unit_price: 1.40, retailer_count: 5 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Μήλα 1kg", price: 1.40, price_normalized: 1.40, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["μήλα"] = fruitProduct;
DEFAULT_CURATED_PRODUCTS["μηλα"] = fruitProduct;
DEFAULT_CURATED_PRODUCTS["μπανάνες"] = { ...fruitProduct, id: "bananas-chiquita-1kg", name: "Μπανάνες Chiquita 1kg" };
DEFAULT_CURATED_PRODUCTS["μπανανες"] = DEFAULT_CURATED_PRODUCTS["μπανάνες"];
DEFAULT_CURATED_PRODUCTS["μπανάνα"] = DEFAULT_CURATED_PRODUCTS["μπανάνες"];

// 25. Ταχίνι & Φυστικοβούτυρο
const tahiniProduct: Product = {
  id: "tahini-macedonian-350g",
  name: "Μακεδονικό Ταχίνι / Φυστικοβούτυρο 350g",
  brand: "Μακεδονικό / Supermarket",
  category: "Παντοπωλείο",
  category_ids: ["cat-pantry"],
  unit: "g",
  unit_quantity: 350,
  has_image: true,
  image_url: null,
  private_label: false,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 3.30, max_price: 3.90, avg_price: 3.60, min_unit_price: 9.40, retailer_count: 4 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Ταχίνι 350g", price: 3.30, price_normalized: 9.40, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["ταχίνι"] = tahiniProduct;
DEFAULT_CURATED_PRODUCTS["ταχινι"] = tahiniProduct;
DEFAULT_CURATED_PRODUCTS["φυστικοβούτυρο"] = tahiniProduct;
DEFAULT_CURATED_PRODUCTS["φυστικοβουτυρο"] = tahiniProduct;

// 26. Αλεύρι για Όλες τις Χρήσεις
const flourProduct: Product = {
  id: "flour-all-purpose-1kg",
  name: "Αλεύρι για Όλες τις Χρήσεις 1kg",
  brand: "Μύλοι Αγίου Γεωργίου / Supermarket",
  category: "Παντοπωλείο",
  category_ids: ["cat-pantry"],
  unit: "kg",
  unit_quantity: 1.0,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 0.95, max_price: 1.35, avg_price: 1.15, min_unit_price: 0.95, retailer_count: 5 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Αλεύρι 1kg", price: 0.95, price_normalized: 0.95, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["αλεύρι"] = flourProduct;
DEFAULT_CURATED_PRODUCTS["αλευρι"] = flourProduct;

// 27. Σολομός & Τσιπούρα
const fishProduct: Product = {
  id: "fish-fresh-tsipoura-1kg",
  name: "Τσιπούρα Ελληνική Νωπή / Σολομός 1kg",
  brand: "Ιχθυοπωλείο Supermarket",
  category: "Ιχθυοπωλείο",
  category_ids: ["cat-fish"],
  unit: "kg",
  unit_quantity: 1.0,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 6.90, max_price: 8.50, avg_price: 7.60, min_unit_price: 6.90, retailer_count: 4 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Τσιπούρα 1kg", price: 6.90, price_normalized: 6.90, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["τσιπούρα"] = fishProduct;
DEFAULT_CURATED_PRODUCTS["τσιπουρα"] = fishProduct;
DEFAULT_CURATED_PRODUCTS["σολομός"] = { ...fishProduct, id: "salmon-fresh-fillet-400g", name: "Φιλέτο Σολομού Νωπό 400g", price_stats: { min_price: 5.80, max_price: 6.90, avg_price: 6.30, min_unit_price: 14.50, retailer_count: 4 } };
DEFAULT_CURATED_PRODUCTS["σολομος"] = DEFAULT_CURATED_PRODUCTS["σολομός"];
DEFAULT_CURATED_PRODUCTS["βακαλάος"] = { ...fishProduct, id: "cod-fillet-800g", name: "Βακαλάος Φιλέτο 800g", price_stats: { min_price: 7.20, max_price: 8.50, avg_price: 7.80, min_unit_price: 9.00, retailer_count: 4 } };

// 28. Τραχανάς, Χυλοπίτες & Κριθαράκι
const orzoProduct: Product = {
  id: "orzo-pasta-misko-500g",
  name: "Κριθαράκι Μέτριο / Χυλοπίτες / Τραχανάς 500g",
  brand: "Μίσκο / Supermarket",
  category: "Παντοπωλείο & Ζυμαρικά",
  category_ids: ["cat-pantry"],
  unit: "g",
  unit_quantity: 500,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 0.88, max_price: 1.25, avg_price: 1.05, min_unit_price: 1.76, retailer_count: 5 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Κριθαράκι 500g", price: 0.88, price_normalized: 1.76, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["κριθαράκι"] = orzoProduct;
DEFAULT_CURATED_PRODUCTS["κριθαρακι"] = orzoProduct;
DEFAULT_CURATED_PRODUCTS["χυλοπίτες"] = orzoProduct;
DEFAULT_CURATED_PRODUCTS["κοφτό μακαρονάκι"] = orzoProduct;
DEFAULT_CURATED_PRODUCTS["μακαρόνια για παστίτσιο"] = orzoProduct;
DEFAULT_CURATED_PRODUCTS["τραχανάς"] = orzoProduct;
DEFAULT_CURATED_PRODUCTS["τραχανας"] = orzoProduct;

// 29. Όσπρια (Ρεβύθια, Γίγαντες, Μαυρομάτικα)
const legumesProduct: Product = {
  id: "chickpeas-greek-500g",
  name: "Ρεβύθια & Γίγαντες Πρεσπών 500g",
  brand: "3 Άλφα / Supermarket",
  category: "Όσπρια",
  category_ids: ["cat-pantry"],
  unit: "g",
  unit_quantity: 500,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 1.85, max_price: 2.35, avg_price: 2.10, min_unit_price: 3.70, retailer_count: 4 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Ρεβύθια 500g", price: 1.85, price_normalized: 3.70, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["ρεβύθια"] = legumesProduct;
DEFAULT_CURATED_PRODUCTS["ρεβυθια"] = legumesProduct;
DEFAULT_CURATED_PRODUCTS["γίγαντες"] = legumesProduct;
DEFAULT_CURATED_PRODUCTS["γιγαντες"] = legumesProduct;
DEFAULT_CURATED_PRODUCTS["μαυρομάτικα φασόλια"] = legumesProduct;

// 30. Χοιρινό Κρέας
const porkProduct: Product = {
  id: "pork-shoulder-chunks-1kg",
  name: "Χοιρινή Σπάλα / Τηγανιά 1kg",
  brand: "Κρεοπωλείο Supermarket",
  category: "Κρεοπωλείο",
  category_ids: ["cat-meat"],
  unit: "kg",
  unit_quantity: 1.0,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 5.60, max_price: 6.80, avg_price: 6.20, min_unit_price: 5.60, retailer_count: 5 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Χοιρινό Σπάλα 1kg", price: 5.60, price_normalized: 5.60, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["χοιρινό"] = porkProduct;
DEFAULT_CURATED_PRODUCTS["χοιρινο"] = porkProduct;

// 31. Θαλασσινά (Γαρίδες, Χταπόδι, Τόνος)
const seafoodProduct: Product = {
  id: "shrimp-peeled-500g",
  name: "Γαρίδες / Χταπόδι Καθαρισμένο 500g",
  brand: "7 Θάλασσες / Supermarket",
  category: "Κατεψυγμένα Αλιεύματα",
  category_ids: ["cat-seafood"],
  unit: "g",
  unit_quantity: 500,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 6.40, max_price: 7.90, avg_price: 7.10, min_unit_price: 12.80, retailer_count: 5 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Γαρίδες 500g", price: 6.40, price_normalized: 12.80, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["γαρίδες"] = seafoodProduct;
DEFAULT_CURATED_PRODUCTS["γαριδες"] = seafoodProduct;
DEFAULT_CURATED_PRODUCTS["χταπόδι"] = seafoodProduct;
DEFAULT_CURATED_PRODUCTS["χταποδι"] = seafoodProduct;
DEFAULT_CURATED_PRODUCTS["τόνος σε ελαιόλαδο"] = {
  ...seafoodProduct,
  id: "tuna-in-olive-oil-2x160g",
  name: "Τόνος σε Ελαιόλαδο 2x160g",
  price_stats: { min_price: 3.40, max_price: 4.10, avg_price: 3.75, min_unit_price: 10.60, retailer_count: 5 }
};
DEFAULT_CURATED_PRODUCTS["τόνος σε νερό"] = DEFAULT_CURATED_PRODUCTS["τόνος σε ελαιόλαδο"];

// 32. Λαχανικά & Μανιτάρια (Μανιτάρια, Καρότα, Αρακάς, Μπάμιες, Πιπεριές Φλωρίνης, Ντοματίνια)
const freshVegProduct: Product = {
  id: "mushrooms-fresh-white-500g",
  name: "Μανιτάρια Λευκά / Πλευρώτους 500g",
  brand: "Μαναβική Supermarket",
  category: "Οπωροπωλείο",
  category_ids: ["cat-produce"],
  unit: "g",
  unit_quantity: 500,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 1.85, max_price: 2.30, avg_price: 2.05, min_unit_price: 3.70, retailer_count: 5 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Μανιτάρια 500g", price: 1.85, price_normalized: 3.70, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["μανιτάρια"] = freshVegProduct;
DEFAULT_CURATED_PRODUCTS["μανιταρια"] = freshVegProduct;
DEFAULT_CURATED_PRODUCTS["καρότα"] = { ...freshVegProduct, id: "carrots-greek-1kg", name: "Καρότα Ελληνικά 1kg", unit: "kg", unit_quantity: 1.0, price_stats: { min_price: 0.85, max_price: 1.15, avg_price: 1.00, min_unit_price: 0.85, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["καροτα"] = DEFAULT_CURATED_PRODUCTS["καρότα"];
DEFAULT_CURATED_PRODUCTS["αρακάς"] = { ...freshVegProduct, id: "peas-frozen-1kg", name: "Αρακάς Κατεψυγμένος 1kg", unit: "kg", unit_quantity: 1.0, price_stats: { min_price: 2.10, max_price: 2.65, avg_price: 2.35, min_unit_price: 2.10, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["μπάμιες"] = DEFAULT_CURATED_PRODUCTS["αρακάς"];
DEFAULT_CURATED_PRODUCTS["ντοματίνια"] = { ...freshVegProduct, id: "cherry-tomatoes-500g", name: "Ντοματίνια Βελανίδι 500g", price_stats: { min_price: 1.55, max_price: 1.95, avg_price: 1.75, min_unit_price: 3.10, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["πιπεριές φλωρίνης"] = { ...freshVegProduct, id: "florina-peppers-500g", name: "Πιπεριές Φλωρίνης 500g", price_stats: { min_price: 1.45, max_price: 1.85, avg_price: 1.65, min_unit_price: 2.90, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["λάχανο"] = { ...freshVegProduct, id: "cabbage-white-1kg", name: "Λάχανο Λευκό 1kg", unit: "kg", unit_quantity: 1.0, price_stats: { min_price: 0.65, max_price: 0.95, avg_price: 0.80, min_unit_price: 0.65, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["μπρόκολο"] = { ...freshVegProduct, id: "broccoli-fresh-500g", name: "Μπρόκολο Φρέσκο 500g", price_stats: { min_price: 1.25, max_price: 1.65, avg_price: 1.45, min_unit_price: 2.50, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["κολοκύθα"] = { ...freshVegProduct, id: "pumpkin-yellow-1kg", name: "Κολοκύθα Κίτρινη 1kg", unit: "kg", unit_quantity: 1.0, price_stats: { min_price: 1.10, max_price: 1.50, avg_price: 1.30, min_unit_price: 1.10, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["σέλινο"] = { ...freshVegProduct, id: "celery-fresh-bundle", name: "Σέλινο / Σέλερι Ματσάκι", unit: "g", unit_quantity: 300, price_stats: { min_price: 0.60, max_price: 0.90, avg_price: 0.75, min_unit_price: 2.00, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["δυόσμος"] = { ...freshVegProduct, id: "fresh-herbs-mint-dill", name: "Φρέσκα Μυρωδικά (Δυόσμος & Άνηθος)", unit: "g", unit_quantity: 100, price_stats: { min_price: 0.45, max_price: 0.70, avg_price: 0.55, min_unit_price: 4.50, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["άνηθος"] = DEFAULT_CURATED_PRODUCTS["δυόσμος"];
DEFAULT_CURATED_PRODUCTS["σκόρδο"] = { ...freshVegProduct, id: "garlic-bundle-3pk", name: "Σκόρδα Ελληνικά 3άδα", unit: "τεμ", unit_quantity: 3, price_stats: { min_price: 0.90, max_price: 1.25, avg_price: 1.10, min_unit_price: 0.30, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["σκορδο"] = DEFAULT_CURATED_PRODUCTS["σκόρδο"];

// 33. Σνακ & Υγιεινά (Σπόροι, Χουρμάδες, Ζύμη, Γαλοπούλα, Κινόα)
const snackItemsProduct: Product = {
  id: "seeds-chia-sesame-200g",
  name: "Σπόροι Chia / Κολοκυθόσπορος / Σουσάμι 200g",
  brand: "Supermarket Bio",
  category: "Υγιεινή Διατροφή",
  category_ids: ["cat-pantry"],
  unit: "g",
  unit_quantity: 200,
  has_image: true,
  image_url: null,
  private_label: true,
  price_drop: false,
  available_countries: ["GR"],
  is_international: false,
  retailers: ["sklavenitis", "ab_vasilopoulos", "lidl", "masoutis", "chalkiadakis"],
  price_stats: { min_price: 1.75, max_price: 2.25, avg_price: 2.00, min_unit_price: 8.75, retailer_count: 5 },
  retailer_prices: [
    { retailer: "sklavenitis", retailer_display_name: "Σκλαβενίτης", retailer_name: "Σπόροι 200g", price: 1.75, price_normalized: 8.75, is_discount: false, discount_percentage: null, last_updated: "2026-10-18T00:00:00", country: "GR" }
  ]
};
DEFAULT_CURATED_PRODUCTS["σπόροι chia"] = snackItemsProduct;
DEFAULT_CURATED_PRODUCTS["σπόροι κολοκύθας"] = snackItemsProduct;
DEFAULT_CURATED_PRODUCTS["σουσάμι"] = snackItemsProduct;
DEFAULT_CURATED_PRODUCTS["αμύγδαλα"] = snackItemsProduct;
DEFAULT_CURATED_PRODUCTS["χουρμάδες"] = { ...snackItemsProduct, id: "dates-dried-250g", name: "Χουρμάδες Χωρίς Κουκούτσι 250g", price_stats: { min_price: 2.10, max_price: 2.60, avg_price: 2.35, min_unit_price: 8.40, retailer_count: 4 } };
DEFAULT_CURATED_PRODUCTS["σύκα"] = DEFAULT_CURATED_PRODUCTS["χουρμάδες"];
DEFAULT_CURATED_PRODUCTS["κακάο"] = { ...snackItemsProduct, id: "cocoa-dark-125g", name: "Κακάο Άγλυκο 125g", price_stats: { min_price: 1.45, max_price: 1.85, avg_price: 1.65, min_unit_price: 11.60, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["γαλοπούλα"] = { ...snackItemsProduct, id: "turkey-smoked-slices-160g", name: "Γαλοπούλα Καπνιστή σε Φέτες 160g", price_stats: { min_price: 1.80, max_price: 2.20, avg_price: 2.00, min_unit_price: 11.25, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["ζύμη κουρού"] = { ...snackItemsProduct, id: "kourou-pastry-sheet-500g", name: "Ζύμη Κουρού 500g", price_stats: { min_price: 2.20, max_price: 2.70, avg_price: 2.45, min_unit_price: 4.40, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["κινόα"] = { ...snackItemsProduct, id: "quinoa-white-500g", name: "Κινόα Λευκή 500g", price_stats: { min_price: 2.40, max_price: 2.95, avg_price: 2.70, min_unit_price: 4.80, retailer_count: 4 } };
DEFAULT_CURATED_PRODUCTS["καστανό ρύζι"] = { ...snackItemsProduct, id: "brown-rice-500g", name: "Καστανό Ρύζι 500g", price_stats: { min_price: 1.10, max_price: 1.45, avg_price: 1.25, min_unit_price: 2.20, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["γάλα αμυγδάλου"] = { ...snackItemsProduct, id: "almond-milk-1l", name: "Γάλα Αμυγδάλου Χωρίς Ζάχαρη 1L", unit: "l", unit_quantity: 1.0, price_stats: { min_price: 1.70, max_price: 2.20, avg_price: 1.95, min_unit_price: 1.70, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["ρυζογκοφρέτες"] = { ...snackItemsProduct, id: "rice-cakes-100g", name: "Ρυζογκοφρέτες Χωρίς Αλάτι 100g", price_stats: { min_price: 0.95, max_price: 1.25, avg_price: 1.10, min_unit_price: 9.50, retailer_count: 5 } };
DEFAULT_CURATED_PRODUCTS["μύρτιλα"] = { ...snackItemsProduct, id: "blueberries-fresh-125g", name: "Μύρτιλα (Blueberries) 125g", price_stats: { min_price: 1.75, max_price: 2.20, avg_price: 1.95, min_unit_price: 14.00, retailer_count: 4 } };
DEFAULT_CURATED_PRODUCTS["σουβλάκια κοτόπουλο"] = { ...snackItemsProduct, id: "chicken-skewers-fresh-400g", name: "Σουβλάκια Κοτόπουλο Νωπά 400g", price_stats: { min_price: 3.75, max_price: 4.40, avg_price: 4.10, min_unit_price: 9.38, retailer_count: 4 } };




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
