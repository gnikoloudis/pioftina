import { Recipe } from "@/types/meal-planner";

export const LUNCH_RECIPES: Recipe[] = [
  {
    id: "moussaka",
    title: "Παραδοσιακός Μουσακάς με Κιμά & Μπεσαμέλ",
    titleEn: "Traditional Greek Moussaka",
    description: "Στρώσεις από μελιτζάνες, πατάτες, αρωματικό μοσχαρίσιο κιμά και πλούσια αφράτη μπεσαμέλ.",
    servings: 6,
    prepTimeMinutes: 45,
    cookTimeMinutes: 50,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    category: "traditional",
    referenceUrl: "https://akispetretzikis.com/recipe/1825/mousakas",
    instructions: [
      "Κόβουμε σε φέτες τις μελιτζάνες και τις πατάτες, τις λαδώνουμε ελαφρώς και τις ψήνουμε στο φούρνο μέχρι να μαλακώσουν.",
      "Σε κατσαρόλα σοτάρουμε τον κιμά με ελαιόλαδο, προσθέτουμε την τριμμένη τομάτα και σιγοβράζουμε μέχρι να δέσει η σάλτσα.",
      "Ετοιμάζουμε την αφράτη μπεσαμέλ με το φρέσκο γάλα, αλεύρι και την τριμμένη γραβιέρα.",
      "Στρώνουμε σε ταψί πατάτες, μελιτζάνες, κιμά, καλύπτουμε με τη μπεσαμέλ και ψήνουμε στους 180°C για 50 λεπτά μέχρι να ροδίσει."
    ],
    ingredients: [
      { id: "lmou-beef", name: "Μοσχαρίσιος Κιμάς", amount: 600, unit: "g", category: "meat", posokaneiQuery: "κιμάς μοσχαρίσιος" },
      { id: "lmou-eggplant", name: "Μελιτζάνες Φλάσκες", amount: 800, unit: "g", category: "produce", posokaneiQuery: "μελιτζάνες" },
      { id: "lmou-potatoes", name: "Πατάτες", amount: 700, unit: "g", category: "produce", posokaneiQuery: "πατάτες" },
      { id: "lmou-milk", name: "Φρέσκο Γάλα Πλήρες", amount: 750, unit: "ml", category: "dairy", posokaneiQuery: "γάλα πλήρες" },
      { id: "lmou-cheese", name: "Γραβιέρα τριμμένη", amount: 120, unit: "g", category: "dairy", posokaneiQuery: "γραβιέρα" },
      { id: "lmou-passata", name: "Ντομάτες Τριμμένες (Passata)", amount: 500, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lmou-oil", name: "Ελαιόλαδο", amount: 60, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-pastitsio",
    title: "Παστίτσιο Παραδοσιακό με Χοντρό Μακαρόνι & Κιμά",
    titleEn: "Authentic Greek Pastitsio",
    description: "Το αρχοντικό ελληνικό κυριακάτικο φαγητό: χοντρά μακαρόνια νο 2, αρωματική σάλτσα κιμά με κανέλα και βελούδινη μπεσαμέλ.",
    servings: 6,
    prepTimeMinutes: 40,
    cookTimeMinutes: 50,
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80",
    category: "traditional",
    referenceUrl: "https://www.argiro.gr/recipe/pastitsio-aythentiko/",
    instructions: [
      "Βράζουμε τα μακαρόνια νο 2 σε αλατισμένο νερό, τα στραγγίζουμε και τα ανακατεύουμε με λίγο γάλα και γραβιέρα.",
      "Σοτάρουμε τον κιμά σε ελαιόλαδο με ψιλοκομμένο κρεμμύδι, σβήνουμε με κρασί, προσθέτουμε την τομάτα και σιγοβράζουμε.",
      "Ετοιμάζουμε την κρέμα μπεσαμέλ με γάλα, βούτυρο και μοσχοκάρυδο.",
      "Στρώνουμε σε ταψί τα μισά μακαρόνια, τον κιμά, τα υπόλοιπα μακαρόνια και από πάνω την μπεσαμέλ. Ψήνουμε στους 180°C για 50 λεπτά."
    ],
    ingredients: [
      { id: "lpas-pasta", name: "Μακαρόνια για Παστίτσιο No 2", amount: 500, unit: "g", category: "pantry", posokaneiQuery: "μακαρόνια για παστίτσιο" },
      { id: "lpas-beef", name: "Μοσχαρίσιος Κιμάς", amount: 650, unit: "g", category: "meat", posokaneiQuery: "κιμάς μοσχαρίσιος" },
      { id: "lpas-passata", name: "Ντομάτες Τριμμένες", amount: 500, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lpas-milk", name: "Φρέσκο Γάλα Πλήρες", amount: 800, unit: "ml", category: "dairy", posokaneiQuery: "γάλα πλήρες" },
      { id: "lpas-cheese", name: "Γραβιέρα Κρήτης Τριμμένη", amount: 150, unit: "g", category: "dairy", posokaneiQuery: "γραβιέρα" },
      { id: "lpas-butter", name: "Βούτυρο Αγελάδος", amount: 40, unit: "g", category: "dairy", posokaneiQuery: "βούτυρο" },
      { id: "lpas-oil", name: "Ελαιόλαδο", amount: 40, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "gemista",
    title: "Γεμιστά με Ρύζι & Μυρωδικά στο Ταψί",
    titleEn: "Stuffed Tomatoes & Peppers (Gemista)",
    description: "Το κατεξοχήν καλοκαιρινό ελληνικό φαγητό, με ζουμερές ντομάτες, πιπεριές, ρύζι καρολίνα και φρέσκα μυρωδικά.",
    servings: 6,
    prepTimeMinutes: 30,
    cookTimeMinutes: 60,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    category: "vegetarian",
    referenceUrl: "https://www.argiro.gr/recipe/gemista-me-ryzi/",
    instructions: [
      "Αδειάζουμε προσεκτικά το εσωτερικό από τις ντομάτες και τις πιπεριές και κρατάμε τη σάρκα.",
      "Σοτάρουμε σε ελαιόλαδο τα κρεμμύδια, προσθέτουμε το ρύζι και τη σάρκα της ντομάτας με φρέσκα μυρωδικά.",
      "Γεμίζουμε τα λαχανικά κατά τα 3/4 και τοποθετούμε ανάμεσά τους κυδωνάτες πατάτες.",
      "Περιχύνουμε με ελαιόλαδο και ψήνουμε στους 180°C για 60 λεπτά μέχρι να μαλακώσουν και να ροδίσουν."
    ],
    ingredients: [
      { id: "lgem-tomatoes", name: "Ντομάτες για Γεμιστά", amount: 1000, unit: "g", category: "produce", posokaneiQuery: "ντομάτες" },
      { id: "lgem-peppers", name: "Πιπεριές για Γεμιστά", amount: 700, unit: "g", category: "produce", posokaneiQuery: "πιπεριές" },
      { id: "lgem-rice", name: "Ρύζι Καρολίνα", amount: 350, unit: "g", category: "pantry", posokaneiQuery: "ρύζι καρολίνα" },
      { id: "lgem-potatoes", name: "Πατάτες", amount: 500, unit: "g", category: "produce", posokaneiQuery: "πατάτες" },
      { id: "lgem-onions", name: "Κρεμμύδια Ξερά", amount: 250, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lgem-oil", name: "Ελαιόλαδο Εξαιρετικό Παρθένο", amount: 90, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-mosxari-kokkinisto-xylopites",
    title: "Μοσχαράκι Κοκκινιστό με Χυλοπίτες & Μυζήθρα",
    titleEn: "Beef Kokkinisto with Greek Hilopites & Myzithra",
    description: "Τρυφερό μοσχαράκι σιγομαγειρεμένο σε πλούσια κόκκινη σάλτσα τομάτας, σερβιρισμένο με παραδοσιακές χωριάτικες χυλοπίτες.",
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 80,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    category: "meat",
    referenceUrl: "https://www.gastronomos.gr/syntagh/kokkinisto-mosxari/",
    instructions: [
      "Θωρακίζουμε τις μερίδες μοσχαριού σε ελαιόλαδο σε δυνατή φωτιά μέχρι να πάρουν βαθύ χρώμα.",
      "Προσθέτουμε τα κρεμμύδια, σβήνουμε με κόκκινο κρασί και προσθέτουμε την τριμμένη τομάτα και μπαχάρι.",
      "Σιγοβράζουμε σκεπασμένο για 70-80 λεπτά μέχρι το μοσχάρι να λιώνει στο πιρούνι.",
      "Βράζουμε τις χυλοπίτες, τις περιχύνουμε με τη σάλτσα και πασπαλίζουμε με ξερή μυζήθρα."
    ],
    ingredients: [
      { id: "lmk-beef", name: "Μοσχάρι Σπάλα σε Μερίδες", amount: 800, unit: "g", category: "meat", posokaneiQuery: "μοσχάρι σπάλα" },
      { id: "lmk-xylopites", name: "Χυλοπίτες Παραδοσιακές", amount: 400, unit: "g", category: "pantry", posokaneiQuery: "χυλοπίτες" },
      { id: "lmk-passata", name: "Ντομάτες Τριμμένες", amount: 500, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lmk-onions", name: "Κρεμμύδια Ξερά", amount: 200, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lmk-myzithra", name: "Μυζήθρα Ξερή Τριμμένη", amount: 90, unit: "g", category: "dairy", posokaneiQuery: "μυζήθρα" },
      { id: "lmk-oil", name: "Ελαιόλαδο", amount: 50, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-giouvetsi-mosxari",
    title: "Γιουβέτσι Μοσχάρι με Κριθαράκι στο Πήλινο",
    titleEn: "Slow Baked Beef Giouvetsi with Orzo",
    description: "Παραδοσιακό κυριακάτικο φαγητό: μοσχάρι σιγοψημένο στο φούρνο με κριθαράκι που απορροφά όλους τους ζωμούς και τριμμένη γραβιέρα.",
    servings: 5,
    prepTimeMinutes: 25,
    cookTimeMinutes: 90,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    category: "comfort",
    referenceUrl: "https://akispetretzikis.com/recipe/486/giouvetsi-mosxari",
    instructions: [
      "Σοτάρουμε το μοσχάρι στην κατσαρόλα με κρεμμύδι και ελαιόλαδο, προσθέτουμε την τομάτα και λίγο νερό.",
      "Μεταφέρουμε σε γάστρα ή ταψί και ψήνουμε στους 180°C για 1 ώρα μέχρι να μαλακώσει το κρέας.",
      "Προσθέτουμε το κριθαράκι και ζεστό νερό και ψήνουμε για ακόμη 20-25 λεπτά μέχρι να πιει τα υγρά του.",
      "Πασπαλίζουμε με άφθονη τριμμένη γραβιέρα και σερβίρουμε ζεστό."
    ],
    ingredients: [
      { id: "lgv-beef", name: "Μοσχάρι Σπάλα σε Μερίδες", amount: 900, unit: "g", category: "meat", posokaneiQuery: "μοσχάρι σπάλα" },
      { id: "lgv-orzo", name: "Κριθαράκι Μέτριο", amount: 450, unit: "g", category: "pantry", posokaneiQuery: "κριθαράκι" },
      { id: "lgv-passata", name: "Ντομάτες Τριμμένες", amount: 500, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lgv-onions", name: "Κρεμμύδια Ξερά", amount: 200, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lgv-cheese", name: "Γραβιέρα Κρήτης Τριμμένη", amount: 100, unit: "g", category: "dairy", posokaneiQuery: "γραβιέρα" },
      { id: "lgv-oil", name: "Ελαιόλαδο", amount: 50, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "spanakorizo",
    title: "Σπανακόρυζο Λεμονάτο με Φρέσκο Κρεμμυδάκι",
    titleEn: "Greek Lemon Spanakorizo with Spring Onions",
    description: "Κλασικό λαδερό φαγητό της ελληνικής κουζίνας, ζουμερό, αρωματικό με μπόλικο άνηθο, φρέσκο κρεμμυδάκι και χυμό λεμονιού.",
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    category: "vegetarian",
    referenceUrl: "https://www.argiro.gr/recipe/spanakoryzo-lemonato/",
    instructions: [
      "Σε κατσαρόλα σοτάρουμε τα φρέσκα κρεμμυδάκια με το ελαιόλαδο μέχρι να μαλακώσουν.",
      "Προσθέτουμε το πλυμένο και χοντροκομμένο σπανάκι και ανακατεύουμε μέχρι να πέσει ο όγκος του.",
      "Ρίχνουμε το ρύζι καρολίνα και νερό, σιγοβράζουμε για 20 λεπτά μέχρι να μαλακώσει το ρύζι.",
      "Αποσύρουμε, προσθέτουμε τον ψιλοκομμένο άνηθο, τον χυμό λεμονιού και σερβίρουμε με φέτα."
    ],
    ingredients: [
      { id: "lsp-spinach", name: "Σπανάκι Φρέσκο", amount: 900, unit: "g", category: "produce", posokaneiQuery: "σπανάκι" },
      { id: "lsp-rice", name: "Ρύζι Καρολίνα", amount: 200, unit: "g", category: "pantry", posokaneiQuery: "ρύζι καρολίνα" },
      { id: "lsp-onions", name: "Φρέσκα Κρεμμυδάκια & Άνηθος", amount: 150, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lsp-lemon", name: "Λεμόνια", amount: 120, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "lsp-oil", name: "Ελαιόλαδο Εξαιρετικό Παρθένο", amount: 60, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" },
      { id: "lsp-feta", name: "Φέτα Π.Ο.Π.", amount: 120, unit: "g", category: "dairy", posokaneiQuery: "φέτα" }
    ]
  },
  {
    id: "fasolakia-ladera",
    title: "Φασολάκια Λαδερά Γιαχνί με Πατάτες & Καρότα",
    titleEn: "Greek Braised Green Beans (Fasolakia)",
    description: "Παραδοσιακά πράσινα φασολάκια σιγομαγειρεμένα σε σάλτσα ντομάτας με πατάτες, καρότα, μαϊντανό και άφθονο ελαιόλαδο.",
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 45,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    category: "vegetarian",
    referenceUrl: "https://www.gastronomos.gr/syntagh/fasolakia-ladera/",
    instructions: [
      "Καθαρίζουμε τα φασολάκια και κόβουμε τις πατάτες και τα καρότα σε χοντρά κομμάτια.",
      "Σε πλατιά κατσαρόλα σοτάρουμε το κρεμμύδι στο ελαιόλαδο για 3 λεπτά.",
      "Προσθέτουμε τα φασολάκια, τις πατάτες, τα καρότα και την τριμμένη τομάτα με λίγο νερό.",
      "Σιγοβράζουμε για 40-45 λεπτά μέχρι να μελώσουν και να μείνουν μόνο με το λαδάκι τους. Συνοδεύουμε με φέτα."
    ],
    ingredients: [
      { id: "lfs-beans", name: "Φασολάκια Στρογγυλά Φρέσκα", amount: 800, unit: "g", category: "produce", posokaneiQuery: "φασολάκια" },
      { id: "lfs-potatoes", name: "Πατάτες", amount: 400, unit: "g", category: "produce", posokaneiQuery: "πατάτες" },
      { id: "lfs-carrots", name: "Καρότα", amount: 200, unit: "g", category: "produce", posokaneiQuery: "καρότα" },
      { id: "lfs-passata", name: "Ντομάτες Τριμμένες", amount: 400, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lfs-onions", name: "Κρεμμύδια Ξερά", amount: 150, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lfs-oil", name: "Ελαιόλαδο", amount: 70, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-biftekia-fournou-patates",
    title: "Μπιφτέκια Μοσχαρίσια Αφράτα με Πατάτες Φούρνου",
    titleEn: "Fluffy Greek Beef Patties with Roasted Potatoes",
    description: "Αφράτα ζουμερά μπιφτέκια πλασμένα με κρεμμύδι, ρίγανη και ελαιόλαδο, ψημένα στο ταψί με λεμονάτες πατάτες.",
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 45,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    category: "meat",
    referenceUrl: "https://akispetretzikis.com/recipe/134/biftekia-fournou",
    instructions: [
      "Ζυμώνουμε τον μοσχαρίσιο κιμά με τριμμένο κρεμμύδι, μουλιασμένο ψωμί, ρίγανη, ελαιόλαδο και αλατοπίπερο.",
      "Κόβουμε τις πατάτες κυδωνάτες, τις βάζουμε στο ταψί και τις ανακατεύουμε με λεμόνι, μουστάρδα, ρίγανη και ελαιόλαδο.",
      "Πλάθουμε τα μπιφτέκια και τα τοποθετούμε πάνω από τις πατάτες.",
      "Ψήνουμε στους 190°C για 45 λεπτά μέχρι να ροδίσουν τα μπιφτέκια και να μελώσουν οι πατάτες."
    ],
    ingredients: [
      { id: "lbf-beef", name: "Μοσχαρίσιος Κιμάς", amount: 650, unit: "g", category: "meat", posokaneiQuery: "κιμάς μοσχαρίσιος" },
      { id: "lbf-potatoes", name: "Πατάτες", amount: 800, unit: "g", category: "produce", posokaneiQuery: "πατάτες" },
      { id: "lbf-onions", name: "Κρεμμύδια Ξερά", amount: 150, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lbf-lemon", name: "Λεμόνια", amount: 100, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "lbf-mustard", name: "Μουστάρδα Απαλή", amount: 40, unit: "g", category: "pantry", posokaneiQuery: "μουστάρδα" },
      { id: "lbf-oil", name: "Ελαιόλαδο", amount: 50, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "roast-chicken-potatoes",
    title: "Κοτόπουλο στο Φούρνο με Πατάτες & Μουστάρδα",
    titleEn: "Greek Roasted Chicken & Potatoes with Mustard & Lemon",
    description: "Κλασικό ελληνικό οικογενειακό φαγητό: τραγανό χρυσαφένιο κοτόπουλο με μελωμένες λεμονάτες πατάτες φούρνου.",
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 65,
    imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80",
    category: "comfort",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Πλένουμε και στεγνώνουμε τις μερίδες κοτόπουλου (μπούτια ή φιλέτο).",
      "Σε ταψί κόβουμε τις πατάτες κυδωνάτες και ετοιμάζουμε τη μαρινάδα με ελαιόλαδο, χυμό λεμονιού, μουστάρδα, ρίγανη και σκόρδο.",
      "Περιχύνουμε το κοτόπουλο και τις πατάτες και ανακατεύουμε καλά να καλυφθούν παντού.",
      "Ψήνουμε στους 190°C για 65 λεπτά μέχρι το κοτόπουλο να γίνει τραγανό εξωτερικά και ζουμερό μέσα."
    ],
    ingredients: [
      { id: "lkp-chicken", name: "Κοτόπουλο Μπούτια Νωπά", amount: 1000, unit: "g", category: "meat", posokaneiQuery: "κοτόπουλο μπούτια" },
      { id: "lkp-potatoes", name: "Πατάτες", amount: 900, unit: "g", category: "produce", posokaneiQuery: "πατάτες" },
      { id: "lkp-lemon", name: "Λεμόνια", amount: 120, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "lkp-mustard", name: "Μουστάρδα Απαλή", amount: 50, unit: "g", category: "pantry", posokaneiQuery: "μουστάρδα" },
      { id: "lkp-oil", name: "Ελαιόλαδο", amount: 60, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "fakes-soup",
    title: "Φακές Σούπα Παραδοσιακές με Δάφνη & Ξύδι",
    titleEn: "Traditional Greek Lentil Soup (Fakes)",
    description: "Θρεπτική, πλούσια σε σίδηρο σούπα με ψιλές φακές, τριμμένη τομάτα, φύλλα δάφνης, σκόρδο και κόκκινο ξύδι.",
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 40,
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
    category: "traditional",
    referenceUrl: "https://www.argiro.gr/recipe/fakes-soupa/",
    instructions: [
      "Ξεπλένουμε τις φακές και τις βάζουμε σε κατσαρόλα με κρύο νερό να πάρουν μια βράση. Στραγγίζουμε αν επιθυμούμε.",
      "Προσθέτουμε φρέσκο ζεστό νερό, το ψιλοκομμένο κρεμμύδι, σκόρδο, φύλλα δάφνης και την τριμμένη τομάτα.",
      "Σιγοβράζουμε για 35 λεπτά μέχρι να μαλακώσουν οι φακές και να χυλώσει η σούπα.",
      "Προς το τέλος ρίχνουμε το ελαιόλαδο και το ξύδι. Σερβίρουμε με ελιές Καλαμών και φέτα."
    ],
    ingredients: [
      { id: "lfk-lentils", name: "Φακές Ψιλές", amount: 400, unit: "g", category: "pantry", posokaneiQuery: "φακές ψιλές" },
      { id: "lfk-passata", name: "Ντομάτες Τριμμένες", amount: 350, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lfk-onions", name: "Κρεμμύδια Ξερά", amount: 150, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lfk-oil", name: "Ελαιόλαδο Εξαιρετικό Παρθένο", amount: 60, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" },
      { id: "lfk-olives", name: "Ελιές Καλαμών", amount: 100, unit: "g", category: "pantry", posokaneiQuery: "ελιές καλαμών" },
      { id: "lfk-feta", name: "Φέτα Π.Ο.Π.", amount: 100, unit: "g", category: "dairy", posokaneiQuery: "φέτα" }
    ]
  },
  {
    id: "lunch-revithia-soupa-sifnos",
    title: "Ρεβύθια Σούπα Σιφνέικα στη Γάστρα",
    titleEn: "Sifnos Style Slow Cooked Chickpea Stew",
    description: "Μελωμένα ρεβύθια αργοψημένα στη γάστρα με μπόλικο κρεμμύδι, ελαιόλαδο, δάφνη και χυμό λεμονιού.",
    servings: 5,
    prepTimeMinutes: 15,
    cookTimeMinutes: 120,
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
    category: "traditional",
    referenceUrl: "https://www.gastronomos.gr/syntagh/revithia-fournou/",
    instructions: [
      "Μουλιάζουμε τα ρεβύθια σε νερό με λίγο αλάτι για 12 ώρες.",
      "Τα στραγγίζουμε και τα τοποθετούμε σε πήλινο σκεύος ή γάστρα με χοντροκομμένα κρεμμύδια, δάφνη και νερό να τα σκεπάζει.",
      "Περιχύνουμε με το ελαιόλαδο, κλείνουμε το καπάκι και ψήνουμε στους 170°C για 2 ώρες.",
      "Όταν μαλακώσουν και μελώσει ο ζωμός, προσθέτουμε φρέσκο χυμό λεμονιού."
    ],
    ingredients: [
      { id: "lrv-chickpeas", name: "Ρεβύθια Χονδρά Ελληνικά", amount: 500, unit: "g", category: "pantry", posokaneiQuery: "ρεβύθια" },
      { id: "lrv-onions", name: "Κρεμμύδια Ξερά", amount: 300, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lrv-lemon", name: "Λεμόνια", amount: 100, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "lrv-oil", name: "Ελαιόλαδο", amount: 80, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-tsipoura-psiti-fournou",
    title: "Τσιπούρα Ψητή στο Φούρνο με Λαδολέμονο & Ρίγανη",
    titleEn: "Baked Whole Sea Bream with Lemon & Oregano",
    description: "Φρέσκια τσιπούρα ψημένη στο φούρνο με πατάτες σε λεπτές ροδέλες, κρεμμύδια και κλασικό λαδολέμονο.",
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
    category: "fish",
    referenceUrl: "https://akispetretzikis.com/recipe/5267/tsipoura-psiti",
    instructions: [
      "Καθαρίζουμε και χαράζουμε ελαφρώς τις τσιπούρες και από τις δύο πλευρές.",
      "Στρώνουμε στο ταψί τις πατάτες κομμένες σε λεπτές ροδέλες και λίγο κρεμμύδι.",
      "Τοποθετούμε τα ψάρια από πάνω και περιχύνουμε με χτυπημένο λαδολέμονο, ρίγανη και αλάτι.",
      "Ψήνουμε στους 190°C για 25 λεπτά μέχρι να ψηθεί το ψάρι και να ροδίσει η πέτσα."
    ],
    ingredients: [
      { id: "lts-fish", name: "Τσιπούρα Νωπή Ελληνική", amount: 800, unit: "g", category: "meat", posokaneiQuery: "τσιπούρα" },
      { id: "lts-potatoes", name: "Πατάτες", amount: 400, unit: "g", category: "produce", posokaneiQuery: "πατάτες" },
      { id: "lts-lemon", name: "Λεμόνια", amount: 100, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "lts-oil", name: "Ελαιόλαδο", amount: 40, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-solomos-fournou-sparaggia",
    title: "Σολομός Φούρνου με Σπαράγγια & Λεμόνι",
    titleEn: "Baked Salmon Fillet with Asparagus & Lemon",
    description: "Υγιεινό και πλούσιο σε ωμέγα-3 γεύμα: ζουμερά φιλέτα σολομού με τρυφερά σπαράγγια και λαδολέμονο.",
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 18,
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
    category: "fish",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Τοποθετούμε τα φιλέτα σολομού και τα καθαρισμένα σπαράγγια σε ταψί με αντικολλητικό χαρτί.",
      "Ραντίζουμε με ελαιόλαδο, χυμό λεμονιού, αλάτι και πιπέρι.",
      "Τοποθετούμε λεπτές φέτες λεμονιού πάνω σε κάθε φιλέτο σολομού.",
      "Ψήνουμε στους 180°C για 18 λεπτά μέχρι να ψηθεί ομοιόμορφα ο σολομός."
    ],
    ingredients: [
      { id: "lsl-salmon", name: "Φιλέτο Σολομού Νωπό", amount: 400, unit: "g", category: "meat", posokaneiQuery: "σολομός" },
      { id: "lsl-lemon", name: "Λεμόνια", amount: 80, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "lsl-oil", name: "Ελαιόλαδο", amount: 25, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-xoirino-selinato-lemonato",
    title: "Χοιρινό Σελινοκάπηλο (Λεμονάτο με Σέλινο)",
    titleEn: "Traditional Pork Stew with Celery (Selinato)",
    description: "Κλασικό χειμωνιάτικο ελληνικό πιάτο με τρυφερό χοιρινό κρέας, μπόλικο αρωματικό σέλινο και δέσιμο λεμονάτης σάλτσας.",
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 70,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    category: "traditional",
    referenceUrl: "https://www.gastronomos.gr",
    instructions: [
      "Σοτάρουμε τις μερίδες χοιρινού σε ελαιόλαδο μέχρι να ροδίσουν καλά.",
      "Προσθέτουμε τα κρεμμύδια και σβήνουμε με λευκό κρασί ή χυμό λεμονιού.",
      "Προσθέτουμε το χοντροκομμένο σέλινο και σιγοβράζουμε με ζεστό νερό για 60 λεπτά.",
      "Δένουμε τη σάλτσα με χυμό λεμονιού και σερβίρουμε ζεστό."
    ],
    ingredients: [
      { id: "lxs-pork", name: "Χοιρινό Σπάλα σε Μερίδες", amount: 850, unit: "g", category: "meat", posokaneiQuery: "χοιρινό" },
      { id: "lxs-celery", name: "Σέλινο Φρέσκο", amount: 500, unit: "g", category: "produce", posokaneiQuery: "σέλινο" },
      { id: "lxs-onions", name: "Κρεμμύδια Ξερά", amount: 180, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lxs-lemon", name: "Λεμόνια", amount: 100, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "lxs-oil", name: "Ελαιόλαδο", amount: 50, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "spaghetti-kimas",
    title: "Μακαρόνια με Κιμά (Ελληνική Bolognese με Κανέλα)",
    titleEn: "Greek Spaghetti with Minced Meat Sauce & Cinnamon",
    description: "Το πιο αγαπημένο ελληνικό οικογενειακό φαγητό: σπαγγέτι νο 6 με πλούσια σάλτσα μοσχαρίσιου κιμά, κανέλα και κεφαλοτύρι.",
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80",
    category: "pasta",
    referenceUrl: "https://akispetretzikis.com/recipe/108/makaronia-me-kima",
    instructions: [
      "Σε κατσαρόλα σοτάρουμε τον κιμά με ελαιόλαδο και ψιλοκομμένο κρεμμύδι.",
      "Προσθέτουμε την τριμμένη τομάτα, ξυλάκι κανέλας, μπαχάρι και σιγοβράζουμε για 25 λεπτά μέχρι να δέσει η σάλτσα.",
      "Βράζουμε τα σπαγγέτι σε αλατισμένο νερό al dente και στραγγίζουμε.",
      "Σερβίρουμε τα ζεστά μακαρόνια με άφθονη σάλτσα κιμά και τριμμένη γραβιέρα ή μυζήθρα."
    ],
    ingredients: [
      { id: "lmk-spaghetti", name: "Σπαγγέτι No 6", amount: 500, unit: "g", category: "pantry", posokaneiQuery: "σπαγγέτι" },
      { id: "lmk-beefmince", name: "Μοσχαρίσιος Κιμάς", amount: 600, unit: "g", category: "meat", posokaneiQuery: "κιμάς μοσχαρίσιος" },
      { id: "lmk-passata2", name: "Ντομάτες Τριμμένες", amount: 500, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lmk-onions2", name: "Κρεμμύδια Ξερά", amount: 150, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lmk-cheese2", name: "Γραβιέρα Κρήτης Τριμμένη", amount: 100, unit: "g", category: "dairy", posokaneiQuery: "γραβιέρα" },
      { id: "lmk-oil2", name: "Ελαιόλαδο", amount: 40, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-soutzoukakia-smyrneika",
    title: "Σουτζουκάκια Σμυρνέικα σε Σάλτσα Ντομάτας με Πουρέ",
    titleEn: "Smyrna Meatballs with Cumin in Rich Tomato Sauce",
    description: "Μυρωδάτα μακρόστενα σουτζουκάκια πλασμένα με κύμινο και σκόρδο, μαγειρεμένα σε πλούσια κόκκινη σάλτσα.",
    servings: 4,
    prepTimeMinutes: 30,
    cookTimeMinutes: 40,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    category: "comfort",
    referenceUrl: "https://www.argiro.gr/recipe/soutzoukakia-smyrneika/",
    instructions: [
      "Ζυμώνουμε τον κιμά με ψωμί μουλιασμένο σε κόκκινο κρασί, μπόλικο κύμινο, σκόρδο, αλάτι και πιπέρι.",
      "Πλάθουμε σε μακρόστενα σουτζουκάκια και τα ψήνουμε ελαφρώς στο φούρνο ή σε τηγάνι.",
      "Ετοιμάζουμε σάλτσα ντομάτας με ελαιόλαδο, τομάτα τριμμένη και λίγη κανέλα.",
      "Βάζουμε τα σουτζουκάκια μέσα στη σάλτσα και σιγοβράζουμε για 20 λεπτά. Συνοδεύουμε με ρύζι ή πουρέ."
    ],
    ingredients: [
      { id: "lsm-beef", name: "Μοσχαρίσιος Κιμάς", amount: 650, unit: "g", category: "meat", posokaneiQuery: "κιμάς μοσχαρίσιος" },
      { id: "lsm-passata", name: "Ντομάτες Τριμμένες", amount: 500, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lsm-potatoes", name: "Πατάτες για Πουρέ", amount: 600, unit: "g", category: "produce", posokaneiQuery: "πατάτες" },
      { id: "lsm-milk", name: "Φρέσκο Γάλα", amount: 150, unit: "ml", category: "dairy", posokaneiQuery: "γάλα πλήρες" },
      { id: "lsm-butter", name: "Βούτυρο Αγελάδος", amount: 30, unit: "g", category: "dairy", posokaneiQuery: "βούτυρο" },
      { id: "lsm-oil", name: "Ελαιόλαδο", amount: 40, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-mpriam-fournou",
    title: "Μπριάμ Καλοκαιρινό Φούρνου με Μελιτζάνες",
    titleEn: "Greek Summer Briam (Roasted Vegetables)",
    description: "Παραδοσιακό ταψί με μελιτζάνες, κολοκυθάκια, πατάτες, πιπεριές και ντομάτα, ψημένο με άφθονο ελαιόλαδο.",
    servings: 5,
    prepTimeMinutes: 25,
    cookTimeMinutes: 60,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    category: "vegetarian",
    referenceUrl: "https://www.argiro.gr/recipe/mpriam-fournou/",
    instructions: [
      "Κόβουμε τις μελιτζάνες, τα κολοκυθάκια, τις πατάτες και τις πιπεριές σε χοντρά κομμάτια.",
      "Τα απλώνουμε σε μεγάλο ταψί, προσθέτουμε τις τριμμένες ντομάτες, σκόρδο, μαϊντανό και ρίγανη.",
      "Περιχύνουμε με το ελαιόλαδο και ανακατεύουμε όλα τα υλικά με τα χέρια.",
      "Ψήνουμε στους 190°C για 60 λεπτά μέχρι να μαλακώσουν τα λαχανικά και να μελώσουν με το λάδι. Σερβίρουμε με φέτα."
    ],
    ingredients: [
      { id: "lbr-eggplant", name: "Μελιτζάνες Φλάσκες", amount: 500, unit: "g", category: "produce", posokaneiQuery: "μελιτζάνες" },
      { id: "lbr-zucchini", name: "Κολοκυθάκια", amount: 500, unit: "g", category: "produce", posokaneiQuery: "κολοκυθάκια" },
      { id: "lbr-potatoes", name: "Πατάτες", amount: 500, unit: "g", category: "produce", posokaneiQuery: "πατάτες" },
      { id: "lbr-peppers", name: "Πιπεριές", amount: 300, unit: "g", category: "produce", posokaneiQuery: "πιπεριές" },
      { id: "lbr-passata", name: "Ντομάτες Τριμμένες", amount: 400, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lbr-oil", name: "Ελαιόλαδο", amount: 80, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" },
      { id: "lbr-feta", name: "Φέτα Π.Ο.Π.", amount: 150, unit: "g", category: "dairy", posokaneiQuery: "φέτα" }
    ]
  },
  {
    id: "lunch-gigantes-plaki",
    title: "Γίγαντες Πλακί στο Φούρνο με Ντομάτα & Σέλερι",
    titleEn: "Greek Baked Giant Beans (Gigantes Plaki)",
    description: "Μεγάλα βουτυράτα φασόλια γίγαντες ψημένα στο ταψί με πλούσια σάλτσα ντομάτας, καρότα, σέλερι και ελαιόλαδο.",
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 70,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    category: "traditional",
    referenceUrl: "https://www.gastronomos.gr/syntagh/gigantes-plaki/",
    instructions: [
      "Μουλιάζουμε τους γίγαντες αποβραδίς και τους προβράζουμε για 40 λεπτά μέχρι να μισομαλακώσουν.",
      "Σε ταψί σοτάρουμε κρεμμύδι, σκόρδο, καρότα και σέλινο με ελαιόλαδο.",
      "Προσθέτουμε τους γίγαντες και την τριμμένη τομάτα με λίγο από το ζωμό τους.",
      "Ψήνουμε στους 180°C για 70 λεπτά μέχρι να μελώσουν και να κάνουν κρούστα. Σερβίρουμε με φέτα."
    ],
    ingredients: [
      { id: "lgg-beans", name: "Γίγαντες Πρεσπών", amount: 450, unit: "g", category: "pantry", posokaneiQuery: "γίγαντες" },
      { id: "lgg-passata", name: "Ντομάτες Τριμμένες", amount: 450, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lgg-carrots", name: "Καρότα", amount: 200, unit: "g", category: "produce", posokaneiQuery: "καρότα" },
      { id: "lgg-onions", name: "Κρεμμύδια Ξερά", amount: 200, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lgg-oil", name: "Ελαιόλαδο", amount: 70, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" },
      { id: "lgg-feta", name: "Φέτα Π.Ο.Π.", amount: 100, unit: "g", category: "dairy", posokaneiQuery: "φέτα" }
    ]
  },
  {
    id: "lunch-giouvarlakia-avgolemono",
    title: "Γιουβαρλάκια Αυγολέμονο με Μοσχαρίσιο Κιμά",
    titleEn: "Greek Meatball Soup with Egg-Lemon Sauce (Givarlakia)",
    description: "Αφράτα κεφτεδάκια με κιμά και ρύζι μαγειρεμένα σε ζωμό και δεμένα με βελούδινο παραδοσιακό αυγολέμονο.",
    servings: 4,
    prepTimeMinutes: 25,
    cookTimeMinutes: 35,
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
    category: "comfort",
    referenceUrl: "https://www.argiro.gr/recipe/giouvarlakia-avgolemono/",
    instructions: [
      "Ζυμώνουμε τον μοσχαρίσιο κιμά με το ρύζι, ψιλοκομμένο κρεμμύδι, άνηθο, ελαιόλαδο και αλατοπίπερο.",
      "Πλάθουμε μικρά στρογγυλά γιουβαρλάκια και τα αλευρώνουμε ελαφρώς.",
      "Σε κατσαρόλα βράζουμε νερό με λίγο ελαιόλαδο και ρίχνουμε τα γιουβαρλάκια να σιγοβράσουν για 30 λεπτά.",
      "Ετοιμάζουμε το αυγολέμονο χτυπώντας τα αυγά με το χυμό λεμονιού και ζεστό ζωμό, περιχύνουμε και κουνάμε την κατσαρόλα."
    ],
    ingredients: [
      { id: "lgv-mince", name: "Μοσχαρίσιος Κιμάς", amount: 550, unit: "g", category: "meat", posokaneiQuery: "κιμάς μοσχαρίσιος" },
      { id: "lgv-rice", name: "Ρύζι Καρολίνα ή Γλασέ", amount: 80, unit: "g", category: "pantry", posokaneiQuery: "ρύζι καρολίνα" },
      { id: "lgv-eggs", name: "Αυγά για το Αυγολέμονο", amount: 2, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "lgv-lemon", name: "Λεμόνια", amount: 100, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "lgv-onions", name: "Κρεμμύδια Ξερά & Άνηθος", amount: 120, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lgv-oil", name: "Ελαιόλαδο", amount: 40, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-kotopoulo-mpamies-kokkinisto",
    title: "Κοτόπουλο με Μπάμιες Κοκκινιστό",
    titleEn: "Greek Braised Chicken with Okra in Tomato Sauce",
    description: "Παραδοσιακό καλοκαιρινό φαγητό της γιαγιάς με τρυφερό κοτόπουλο και μπάμιες μαγειρεμένες σε σάλτσα φρέσκιας ντομάτας.",
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 50,
    imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80",
    category: "traditional",
    referenceUrl: "https://www.gastronomos.gr",
    instructions: [
      "Σοτάρουμε τις μερίδες κοτόπουλου σε ελαιόλαδο μέχρι να ροδίσουν.",
      "Προσθέτουμε το ψιλοκομμένο κρεμμύδι και σβήνουμε με λίγο ξύδι για να κρατήσουν οι μπάμιες το σχήμα τους.",
      "Προσθέτουμε τις μπάμιες και την τριμμένη τομάτα και σιγοβράζουμε χωρίς να ανακατεύουμε με κουτάλα (μόνο κουνώντας την κατσαρόλα).",
      "Μαγειρεύουμε για 45-50 λεπτά μέχρι να δέσει η σάλτσα και να μελώσουν οι μπάμιες."
    ],
    ingredients: [
      { id: "lkm-chicken", name: "Κοτόπουλο Μπούτια", amount: 900, unit: "g", category: "meat", posokaneiQuery: "κοτόπουλο μπούτια" },
      { id: "lkm-okra", name: "Μπάμιες Κατεψυγμένες ή Φρέσκες", amount: 700, unit: "g", category: "produce", posokaneiQuery: "μπάμιες" },
      { id: "lkm-passata", name: "Ντομάτες Τριμμένες", amount: 450, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lkm-onions", name: "Κρεμμύδια Ξερά", amount: 150, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lkm-oil", name: "Ελαιόλαδο", amount: 60, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-laxanontolmades-avgolemono",
    title: "Λαχανοντολμάδες με Κιμά & Αυγολέμονο",
    titleEn: "Greek Cabbage Rolls with Minced Meat & Avgolemono",
    description: "Τρυφερά φύλλα λάχανου τυλιγμένα με κιμά, ρύζι και άνηθο, σιγομαγειρεμένα και περιχυμένα με πλούσιο αυγολέμονο.",
    servings: 5,
    prepTimeMinutes: 45,
    cookTimeMinutes: 45,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    category: "comfort",
    referenceUrl: "https://www.argiro.gr/recipe/laxanontolmades/",
    instructions: [
      "Ζεματάμε το λάχανο σε βραστό νερό και ξεχωρίζουμε τα φύλλα του.",
      "Ζυμώνουμε τον κιμά με το ρύζι, ψιλοκομμένο κρεμμύδι, άνηθο και ελαιόλαδο.",
      "Τυλίγουμε τα ντολμαδάκια και τα τοποθετούμε σφιχτά στην κατσαρόλα σε στρώσεις.",
      "Σκεπάζουμε με πιάτο, ρίχνουμε ζεστό νερό και σιγοβράζουμε για 45 λεπτά. Δένουμε με αυγολέμονο."
    ],
    ingredients: [
      { id: "llx-cabbage", name: "Λάχανο Λευκό", amount: 1200, unit: "g", category: "produce", posokaneiQuery: "λάχανο" },
      { id: "llx-beef", name: "Μοσχαρίσιος Κιμάς", amount: 600, unit: "g", category: "meat", posokaneiQuery: "κιμάς μοσχαρίσιος" },
      { id: "llx-rice", name: "Ρύζι Καρολίνα", amount: 100, unit: "g", category: "pantry", posokaneiQuery: "ρύζι καρολίνα" },
      { id: "llx-eggs", name: "Αυγά για το Αυγολέμονο", amount: 2, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "llx-lemon", name: "Λεμόνια", amount: 100, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "llx-oil", name: "Ελαιόλαδο", amount: 50, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-vakalaos-plaki-patates",
    title: "Βακαλάος Πλακί με Πατάτες & Κρεμμύδια",
    titleEn: "Baked Salt Cod Plaki with Potatoes & Onions",
    description: "Παραδοσιακός βακαλάος ψημένος στο φούρνο με στρώσεις πατάτας, κρεμμυδιών και πλούσιας κόκκινης σάλτσας ντομάτας.",
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 45,
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
    category: "fish",
    referenceUrl: "https://www.gastronomos.gr",
    instructions: [
      "Στρώνουμε στο ταψί τις πατάτες και τα κρεμμύδια κομμένα σε ροδέλες.",
      "Τοποθετούμε τα κομμάτια του ξαλμυρισμένου βακαλάου ανάμεσα στις πατάτες.",
      "Περιχύνουμε με την τριμμένη τομάτα, ψιλοκομμένο μαϊντανό και άφθονο ελαιόλαδο.",
      "Ψήνουμε στους 180°C για 45 λεπτά μέχρι να μαλακώσουν οι πατάτες και να δέσει η σάλτσα."
    ],
    ingredients: [
      { id: "lvp-cod", name: "Βακαλάος Φιλέτο", amount: 750, unit: "g", category: "meat", posokaneiQuery: "βακαλάος" },
      { id: "lvp-potatoes", name: "Πατάτες", amount: 600, unit: "g", category: "produce", posokaneiQuery: "πατάτες" },
      { id: "lvp-passata", name: "Ντομάτες Τριμμένες", amount: 450, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lvp-onions", name: "Κρεμμύδια Ξερά", amount: 250, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lvp-oil", name: "Ελαιόλαδο", amount: 60, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-xtapodi-kofto-makaronaki",
    title: "Χταπόδι με Κοφτό Μακαρονάκι Κοκκινιστό",
    titleEn: "Greek Octopus with Ditalini Pasta in Tomato Sauce",
    description: "Το κατεξοχήν σαρακοστιανό και ναυτικό ελληνικό πιάτο: τρυφερό χταπόδι μαγειρεμένο με κοφτό μακαρονάκι και κανέλα.",
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 50,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    category: "fish",
    referenceUrl: "https://akispetretzikis.com/recipe/2096/xtapodi-kofto",
    instructions: [
      "Κόβουμε το χταπόδι σε μπουκιές και το βάζουμε στην κατσαρόλα να βγάλει τα υγρά του.",
      "Προσθέτουμε ελαιόλαδο, κρεμμύδι, σβήνουμε με κόκκινο κρασί και ρίχνουμε την τομάτα.",
      "Σιγοβράζουμε για 35 λεπτά μέχρι να μαλακώσει το χταπόδι.",
      "Προσθέτουμε ζεστό νερό και το κοφτό μακαρονάκι και βράζουμε για άλλα 12 λεπτά μέχρι να μελώσει το ζυμαρικό."
    ],
    ingredients: [
      { id: "lxt-octopus", name: "Χταπόδι Καθαρισμένο", amount: 800, unit: "g", category: "meat", posokaneiQuery: "χταπόδι" },
      { id: "lxt-pasta", name: "Κοφτό Μακαρονάκι", amount: 400, unit: "g", category: "pantry", posokaneiQuery: "κοφτό μακαρονάκι" },
      { id: "lxt-passata", name: "Ντομάτες Τριμμένες", amount: 450, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lxt-onions", name: "Κρεμμύδια Ξερά", amount: 180, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lxt-oil", name: "Ελαιόλαδο", amount: 50, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-kotopoulo-filletto-kastano-ryzi",
    title: "Κοτόπουλο Φιλέτο Σχάρας με Καστανό Ρύζι & Μπρόκολο",
    titleEn: "Grilled Chicken Breast with Brown Rice & Steamed Broccoli",
    description: "Καθαρό, υγιεινό γεύμα υψηλής πρωτεΐνης: φιλέτο στήθος κοτόπουλου ψημένο με ρίγανη, καστανό ρύζι και μπρόκολο στον ατμό.",
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80",
    category: "healthy",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Μαρινάρουμε τα φιλέτα κοτόπουλου με ελαιόλαδο, λεμόνι, ρίγανη και πιπέρι.",
      "Ψήνουμε σε αντικολλητικό σχαροτήγανο για 6-7 λεπτά από κάθε πλευρά.",
      "Βράζουμε το καστανό ρύζι και μαγειρεύουμε το μπρόκολο στον ατμό μέχρι να μείνει τραγανό.",
      "Σερβίρουμε με έξτρα παρθένο ελαιόλαδο και φρέσκο λεμόνι."
    ],
    ingredients: [
      { id: "lkh-chicken", name: "Φιλέτο Στήθος Κοτόπουλο", amount: 450, unit: "g", category: "meat", posokaneiQuery: "στήθος κοτόπουλο" },
      { id: "lkh-rice", name: "Καστανό Ρύζι", amount: 150, unit: "g", category: "pantry", posokaneiQuery: "καστανό ρύζι" },
      { id: "lkh-broccoli", name: "Μπρόκολο Φρέσκο", amount: 350, unit: "g", category: "produce", posokaneiQuery: "μπρόκολο" },
      { id: "lkh-lemon", name: "Λεμόνια", amount: 80, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "lkh-oil", name: "Ελαιόλαδο Εξαιρετικό Παρθένο", amount: 25, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-kolokythakia-gemista-avgolemono",
    title: "Κολοκυθάκια Γεμιστά με Κιμά & Αυγολέμονο",
    titleEn: "Stuffed Zucchini with Minced Beef & Avgolemono Sauce",
    description: "Τρυφερά κολοκυθάκια γεμισμένα με κιμά, ρύζι και άνηθο, σιγομαγειρεμένα σε λευκό ζωμό και δεμένα με αυγολέμονο.",
    servings: 4,
    prepTimeMinutes: 30,
    cookTimeMinutes: 45,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    category: "traditional",
    referenceUrl: "https://www.argiro.gr",
    instructions: [
      "Αδειάζουμε προσεκτικά το εσωτερικό από τα κολοκυθάκια με το ειδικό εργαλείο.",
      "Ζυμώνουμε τον κιμά με το ρύζι, κρεμμύδι, άνηθο, ελαιόλαδο και λίγη από τη σάρκα των κολοκυθιών.",
      "Γεμίζουμε τα κολοκυθάκια και τα τοποθετούμε όρθια ή πλαγιαστά στην κατσαρόλα.",
      "Προσθέτουμε νερό και ελαιόλαδο και σιγοβράζουμε για 40 λεπτά. Δένουμε με πλούσιο αυγολέμονο."
    ],
    ingredients: [
      { id: "lkg-zucchini", name: "Κολοκυθάκια Μέτρια", amount: 1000, unit: "g", category: "produce", posokaneiQuery: "κολοκυθάκια" },
      { id: "lkg-beef", name: "Μοσχαρίσιος Κιμάς", amount: 500, unit: "g", category: "meat", posokaneiQuery: "κιμάς μοσχαρίσιος" },
      { id: "lkg-rice", name: "Ρύζι Καρολίνα", amount: 80, unit: "g", category: "pantry", posokaneiQuery: "ρύζι καρολίνα" },
      { id: "lkg-eggs", name: "Αυγά", amount: 2, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "lkg-lemon", name: "Λεμόνια", amount: 100, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "lkg-oil", name: "Ελαιόλαδο", amount: 45, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-xoirini-tigania-piperies",
    title: "Χοιρινή Τηγανιά με Πιπεριές, Μουστάρδα & Ρίγανη",
    titleEn: "Quick Greek Pork Tigania with Peppers & Mustard",
    description: "Γρήγορη, ζουμερή χοιρινή τηγανιά με πολύχρωμες πιπεριές, σβησμένη με κρασί και δεμένη με απαλή μουστάρδα.",
    servings: 3,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    category: "quick",
    referenceUrl: "https://akispetretzikis.com",
    instructions: [
      "Σε καυτό τηγάνι σοτάρουμε τις μπουκιές χοιρινού σε ελαιόλαδο μέχρι να ροδίσουν καλά.",
      "Προσθέτουμε τις κομμένες πιπεριές και τα κρεμμύδια και σοτάρουμε για 4 λεπτά.",
      "Σβήνουμε με λευκό κρασί ή λεμόνι και προσθέτουμε τη μουστάρδα διαλυμένη σε λίγο ζεστό νερό.",
      "Πασπαλίζουμε με ρίγανη και σιγοβράζουμε για 3 λεπτά μέχρι να δέσει η σάλτσα."
    ],
    ingredients: [
      { id: "lxt-pork", name: "Χοιρινή Τηγανιά σε Μπουκιές", amount: 600, unit: "g", category: "meat", posokaneiQuery: "χοιρινό" },
      { id: "lxt-peppers", name: "Πιπεριές Πολύχρωμες", amount: 250, unit: "g", category: "produce", posokaneiQuery: "πιπεριές" },
      { id: "lxt-onions", name: "Κρεμμύδια Ξερά", amount: 120, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lxt-mustard", name: "Μουστάρδα Απαλή", amount: 35, unit: "g", category: "pantry", posokaneiQuery: "μουστάρδα" },
      { id: "lxt-oil", name: "Ελαιόλαδο", amount: 35, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-melitzanes-papoutsakia",
    title: "Παπουτσάκια Μελιτζάνες με Κιμά & Γραβιέρα",
    titleEn: "Greek Stuffed Eggplants (Papoutsakia)",
    description: "Μισές μελιτζάνες ψημένες στο φούρνο, γεμισμένες με αρωματικό κιμά και καλυμμένες με κρέμα και τριμμένη γραβιέρα.",
    servings: 4,
    prepTimeMinutes: 30,
    cookTimeMinutes: 40,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    category: "comfort",
    referenceUrl: "https://www.argiro.gr/recipe/melitzanes-papoutsakia/",
    instructions: [
      "Κόβουμε τις μελιτζάνες στη μέση, τις χαράζουμε, τις λαδώνουμε και τις ψήνουμε στο φούρνο μέχρι να μαλακώσουν.",
      "Ετοιμάζουμε τη σάλτσα κιμά με κρεμμύδι, τομάτα τριμμένη και μπαχαρικά.",
      "Πιέζουμε τη σάρκα των μελιτζανών με πιρούνι και γεμίζουμε με τον κιμά.",
      "Καλύπτουμε με ελαφριά μπεσαμέλ και τριμμένη γραβιέρα και ψήνουμε στους 180°C για 30 λεπτά μέχρι να ροδίσουν."
    ],
    ingredients: [
      { id: "lmp-eggplant", name: "Μελιτζάνες Φλάσκες", amount: 800, unit: "g", category: "produce", posokaneiQuery: "μελιτζάνες" },
      { id: "lmp-beef", name: "Μοσχαρίσιος Κιμάς", amount: 500, unit: "g", category: "meat", posokaneiQuery: "κιμάς μοσχαρίσιος" },
      { id: "lmp-passata", name: "Ντομάτες Τριμμένες", amount: 350, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lmp-milk", name: "Φρέσκο Γάλα", amount: 250, unit: "ml", category: "dairy", posokaneiQuery: "γάλα πλήρες" },
      { id: "lmp-cheese", name: "Γραβιέρα Κρήτης Τριμμένη", amount: 80, unit: "g", category: "dairy", posokaneiQuery: "γραβιέρα" },
      { id: "lmp-oil", name: "Ελαιόλαδο", amount: 45, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-arakas-laderos-patates",
    title: "Αρακάς Λαδερός με Πατάτες & Άνηθο",
    titleEn: "Greek Braised Peas with Potatoes & Dill",
    description: "Γλυκός λαδερός αρακάς μαγειρεμένος με πατάτες, καρότα, μπόλικο άνηθο και ελαιόλαδο.",
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 35,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    category: "vegetarian",
    referenceUrl: "https://www.gastronomos.gr",
    instructions: [
      "Σε κατσαρόλα σοτάρουμε το κρεμμύδι στο ελαιόλαδο για 3 λεπτά.",
      "Προσθέτουμε τον αρακά, τις πατάτες κομμένες σε κύβους, τα καρότα και την τριμμένη τομάτα.",
      "Σιγοβράζουμε με λίγο νερό για 30 λεπτά μέχρι να μαλακώσουν οι πατάτες και να μελώσει η σάλτσα.",
      "Προσθέτουμε τον άνηθο προς το τέλος και σερβίρουμε με φέτα."
    ],
    ingredients: [
      { id: "lar-peas", name: "Αρακάς Κατεψυγμένος", amount: 750, unit: "g", category: "produce", posokaneiQuery: "αρακάς" },
      { id: "lar-potatoes", name: "Πατάτες", amount: 400, unit: "g", category: "produce", posokaneiQuery: "πατάτες" },
      { id: "lar-carrots", name: "Καρότα", amount: 200, unit: "g", category: "produce", posokaneiQuery: "καρότα" },
      { id: "lar-passata", name: "Ντομάτες Τριμμένες", amount: 350, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lar-oil", name: "Ελαιόλαδο", amount: 60, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" },
      { id: "lar-feta", name: "Φέτα Π.Ο.Π.", amount: 120, unit: "g", category: "dairy", posokaneiQuery: "φέτα" }
    ]
  },
  {
    id: "lunch-kotosoupa-veloute-avgolemono",
    title: "Κοτόσουπα Βελουτέ Αυγολέμονο με Καρότο",
    titleEn: "Classic Greek Lemon Chicken Soup with Rice",
    description: "Παρηγορητική σούπα κοτόπουλου με ρύζι καρολίνα, γλυκά καρότα και πλούσιο κρεμώδες αυγολέμονο.",
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 50,
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
    category: "comfort",
    referenceUrl: "https://www.argiro.gr/recipe/kotosoupa-avgolemono/",
    instructions: [
      "Βράζουμε το κοτόπουλο με τα καρότα και το κρεμμύδι σε κατσαρόλα με νερό για 40 λεπτά.",
      "Βγάζουμε το κοτόπουλο, ξεψαχνίζουμε το κρέας και σουρώνουμε τον ζωμό.",
      "Ξαναβάζουμε τον ζωμό στη φωτιά, προσθέτουμε το ρύζι και βράζουμε για 15 λεπτά μέχρι να μαλακώσει.",
      "Ετοιμάζουμε το αυγολέμονο με τα αυγά και το λεμόνι, περιχύνουμε τη σούπα και ξαναβάζουμε το ψαχνό κοτόπουλο."
    ],
    ingredients: [
      { id: "lks-chicken", name: "Κοτόπουλο Μπούτια ή Ολόκληρο", amount: 850, unit: "g", category: "meat", posokaneiQuery: "κοτόπουλο μπούτια" },
      { id: "lks-rice", name: "Ρύζι Καρολίνα ή Γλασέ", amount: 100, unit: "g", category: "pantry", posokaneiQuery: "ρύζι καρολίνα" },
      { id: "lks-carrots", name: "Καρότα", amount: 200, unit: "g", category: "produce", posokaneiQuery: "καρότα" },
      { id: "lks-eggs", name: "Αυγά", amount: 2, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "lks-lemon", name: "Λεμόνια", amount: 100, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "lks-oil", name: "Ελαιόλαδο", amount: 30, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "lunch-kritharoto-garides-ouzo",
    title: "Κριθαρότο με Γαρίδες & Ούζο",
    titleEn: "Greek Shrimp Kritharoto with Ouzo & Feta",
    description: "Θαλασσινό κριθαρότο με γαρίδες σβησμένες με ούζο, σάλτσα ντομάτας και θρυμματισμένη φέτα.",
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    category: "fish",
    referenceUrl: "https://akispetretzikis.com/recipe/4291/kritharoto-garides",
    instructions: [
      "Σοτάρουμε τις γαρίδες σε ελαιόλαδο για 2 λεπτά και τις αφαιρούμε σε πιάτο.",
      "Στο ίδιο τηγάνι σοτάρουμε το κρεμμύδι με το κριθαράκι, σβήνουμε με ούζο και προσθέτουμε την τομάτα.",
      "Προσθέτουμε σταδιακά ζεστό ζωμό ή νερό ανακατεύοντας σαν ριζότο για 15 λεπτά.",
      "Επαναφέρουμε τις γαρίδες, πασπαλίζουμε με φέτα και άνηθο και σερβίρουμε ζουμερό."
    ],
    ingredients: [
      { id: "lkg-shrimp", name: "Γαρίδες Καθαρισμένες", amount: 500, unit: "g", category: "meat", posokaneiQuery: "γαρίδες" },
      { id: "lkg-orzo", name: "Κριθαράκι Μέτριο", amount: 350, unit: "g", category: "pantry", posokaneiQuery: "κριθαράκι" },
      { id: "lkg-passata", name: "Ντομάτες Τριμμένες", amount: 350, unit: "g", category: "pantry", posokaneiQuery: "τομάτα τριμμένη" },
      { id: "lkg-onions", name: "Κρεμμύδια Ξερά", amount: 120, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "lkg-feta", name: "Φέτα Π.Ο.Π.", amount: 100, unit: "g", category: "dairy", posokaneiQuery: "φέτα" },
      { id: "lkg-oil", name: "Ελαιόλαδο", amount: 40, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  }
];
