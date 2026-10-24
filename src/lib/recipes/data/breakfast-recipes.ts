import { Recipe } from "@/types/meal-planner";

export const BREAKFAST_RECIPES: Recipe[] = [
  {
    id: "breakfast-strapatsada",
    title: "Παραδοσιακή Στραπατσάδα (Καγιανάς) με Φέτα & Ντομάτα",
    titleEn: "Traditional Greek Strapatsada (Kayianas)",
    description: "Κλασικό ελληνικό πρωινό με φρέσκα αυγά, ζουμερή ντομάτα που έχει πιει τα υγρά της, ελαιόλαδο και αυθεντική φέτα.",
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://akispetretzikis.com/recipe/1183/strapatsada",
    instructions: [
      "Τρίβουμε τις ώριμες ντομάτες στον τρίφτη και τις βάζουμε σε αντικολλητικό τηγάνι με ελαιόλαδο σε μέτρια προς δυνατή φωτιά.",
      "Μαγειρεύουμε για 6-8 λεπτά μέχρι να εξατμιστούν τα περισσότερα υγρά της ντομάτας.",
      "Χτυπάμε τα αυγά σε μπολ με λίγο πιπέρι και ρίγανη, και τα προσθέτουμε στο τηγάνι ανακατεύοντας απαλά με σπάτουλα.",
      "Μόλις πήξουν ελαφρά τα αυγά, τρίβουμε τη φέτα από πάνω, αποσύρουμε από τη φωτιά και σερβίρουμε με ζεστό ψωμί."
    ],
    ingredients: [
      { id: "str-eggs", name: "Αυγά Ελευθέρας Βοσκής", amount: 4, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "str-tomatoes", name: "Ντομάτες Ώριμες", amount: 350, unit: "g", category: "produce", posokaneiQuery: "ντομάτες" },
      { id: "str-feta", name: "Φέτα Π.Ο.Π.", amount: 80, unit: "g", category: "dairy", posokaneiQuery: "φέτα" },
      { id: "str-oil", name: "Ελαιόλαδο Εξαιρετικό Παρθένο", amount: 25, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" },
      { id: "str-bread", name: "Προζυμένιο Ψωμί", amount: 120, unit: "g", category: "bakery", posokaneiQuery: "ψωμί" }
    ]
  },
  {
    id: "breakfast-avga-matia-stakovoutyro",
    title: "Αυγά Μάτια με Στακοβούτυρο & Προζυμένιο Ψωμί",
    titleEn: "Fried Eggs with Cretan Staka Butter",
    description: "Αυθεντικό κρητικό πρωινό με αυγά τηγανισμένα σε αρωματικό στακοβούτυρο και τραγανές μπουκιές προζυμένιου ψωμιού.",
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    imageUrl: "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://www.gastronomos.gr/syntagh/ayga-matia-me-stakovoytyro/",
    instructions: [
      "Ζεσταίνουμε το στακοβούτυρο (ή βούτυρο γάλακτος) σε μικρό τηγάνι μέχρι να λιώσει και να μοσχοβολήσει.",
      "Σπάμε προσεκτικά τα αυγά στο τηγάνι, προσέχοντας να μην σπάσουν οι κρόκοι.",
      "Περιχύνουμε το ασπράδι με το καυτό βούτυρο χρησιμοποιώντας ένα κουτάλι.",
      "Πασπαλίζουμε με θαλασσινό αλάτι και φρεσκοτριμμένο πιπέρι και σερβίρουμε αμέσως με ζεστό προζυμένιο ψωμί."
    ],
    ingredients: [
      { id: "ams-eggs", name: "Αυγά Ελευθέρας Βοσκής", amount: 4, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "ams-butter", name: "Στακοβούτυρο ή Βούτυρο Γάλακτος", amount: 30, unit: "g", category: "dairy", posokaneiQuery: "βούτυρο" },
      { id: "ams-bread", name: "Προζυμένιο Ψωμί Χωριάτικο", amount: 150, unit: "g", category: "bakery", posokaneiQuery: "ψωμί" }
    ]
  },
  {
    id: "breakfast-omeleta-kolokythakia",
    title: "Ομελέτα Φούρνου με Κολοκυθάκια, Δυόσμο & Ανθότυρο",
    titleEn: "Baked Zucchini & Anthotyro Frittata",
    description: "Ελαφριά και αφράτη ομελέτα ταψιού με τριμμένα γλυκά κολοκυθάκια, φρέσκο δυόσμο και κρεμώδες ελληνικό ανθότυρο.",
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://www.argiro.gr/recipe/omeleta-fournou-me-kolokythakia/",
    instructions: [
      "Τρίβουμε τα κολοκυθάκια, τα αλατίζουμε ελαφρά και τα στύβουμε καλά με τα χέρια να φύγουν τα υγρά τους.",
      "Σε μπολ χτυπάμε τα αυγά με το γάλα, το ελαιόλαδο, ψιλοκομμένο δυόσμο και φρέσκο κρεμμυδάκι.",
      "Προσθέτουμε τα κολοκυθάκια και σπάμε το ανθότυρο σε κομμάτια.",
      "Αδειάζουμε σε λαδωμένο πυρίμαχο σκεύος και ψήνουμε στους 180°C για 25 λεπτά μέχρι να ροδίσει."
    ],
    ingredients: [
      { id: "omk-zucchini", name: "Κολοκυθάκια Φρέσκα", amount: 500, unit: "g", category: "produce", posokaneiQuery: "κολοκυθάκια" },
      { id: "omk-eggs", name: "Αυγά", amount: 6, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "omk-anthotyro", name: "Ανθότυρο Νωπό", amount: 180, unit: "g", category: "dairy", posokaneiQuery: "ανθότυρο" },
      { id: "omk-mint", name: "Φρέσκος Δυόσμος & Κρεμμυδάκι", amount: 40, unit: "g", category: "produce", posokaneiQuery: "δυόσμος" },
      { id: "omk-oil", name: "Ελαιόλαδο", amount: 20, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" },
      { id: "omk-milk", name: "Φρέσκο Γάλα Πλήρες", amount: 60, unit: "ml", category: "dairy", posokaneiQuery: "γάλα πλήρες" }
    ]
  },
  {
    id: "breakfast-giaourti-meli-karydia",
    title: "Ελληνικό Γιαούρτι 2% με Θυμαρίσιο Μέλι, Καρύδια & Κανέλα",
    titleEn: "Greek Yogurt with Thyme Honey & Walnuts",
    description: "Το αρχέγονο υγιεινό ελληνικό πρωινό: πλούσιο σε πρωτεΐνη στραγγιστό γιαούρτι με θυμαρίσιο μέλι και καρύδια.",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://www.olivemagazine.gr/recipe/elliniko-giaourti-meli-karydia/",
    instructions: [
      "Βάζουμε το δροσερό στραγγιστό γιαούρτι σε ένα βαθύ μπολ.",
      "Περιχύνουμε ομοιόμορφα με το θυμαρίσιο μέλι.",
      "Σπάμε τα καρύδια σε χοντρά κομμάτια και τα πασπαλίζουμε από πάνω μαζί με λίγη κανέλα."
    ],
    ingredients: [
      { id: "gmk-yogurt", name: "Γιαούρτι Στραγγιστό 2%", amount: 200, unit: "g", category: "dairy", posokaneiQuery: "γιαούρτι 2%" },
      { id: "gmk-honey", name: "Μέλι Θυμαρίσιο", amount: 25, unit: "g", category: "pantry", posokaneiQuery: "μέλι" },
      { id: "gmk-walnuts", name: "Καρύδια Ψίχα", amount: 30, unit: "g", category: "pantry", posokaneiQuery: "καρύδια" }
    ]
  },
  {
    id: "breakfast-porridge-milo-tahini",
    title: "Porridge Βρώμης με Μήλο, Κανέλα & Ταχίνι",
    titleEn: "Warm Cinnamon Apple Oatmeal with Tahini",
    description: "Ζεστή και τονωτική κρέμα βρώμης με γάλα, τριμμένο μήλο, κανέλα Κεϋλάνης και κουταλιά ελληνικό ταχίνι.",
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 8,
    imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://akispetretzikis.com/recipe/5380/porridge-vromis",
    instructions: [
      "Σε μικρή κατσαρόλα ρίχνουμε το γάλα και τις νιφάδες βρώμης σε μέτρια φωτιά.",
      "Ανακατεύουμε συνεχώς για 5-6 λεπτά μέχρι να χυλώσει η βρώμη.",
      "Αποσύρουμε από τη φωτιά, προσθέτουμε το τριμμένο μήλο και την κανέλα.",
      "Μοιράζουμε σε μπολ και γαρνίρουμε με το ταχίνι και λίγο μέλι."
    ],
    ingredients: [
      { id: "pmt-oats", name: "Νιφάδες Βρώμης Ολικής", amount: 100, unit: "g", category: "pantry", posokaneiQuery: "βρώμη" },
      { id: "pmt-milk", name: "Φρέσκο Γάλα Πλήρες", amount: 350, unit: "ml", category: "dairy", posokaneiQuery: "γάλα πλήρες" },
      { id: "pmt-apple", name: "Μήλα Στάρκιν", amount: 180, unit: "g", category: "produce", posokaneiQuery: "μήλα" },
      { id: "pmt-tahini", name: "Ταχίνι Μακεδονικό", amount: 35, unit: "g", category: "pantry", posokaneiQuery: "ταχίνι" },
      { id: "pmt-honey", name: "Μέλι Ανθέων", amount: 20, unit: "g", category: "pantry", posokaneiQuery: "μέλι" }
    ]
  },
  {
    id: "breakfast-tost-olika-graviera",
    title: "Τοστ Ολικής με Γαλοπούλα, Γραβιέρα Κρήτης & Ντοματίνια",
    titleEn: "Whole Grain Toast with Turkey, Cretan Graviera & Tomatoes",
    description: "Γρήγορο και θρεπτικό τοστ με ψωμί ολικής άλεσης, εκλεκτή γραβιέρα Κρήτης, γαλοπούλα και φρέσκα ντοματίνια.",
    servings: 1,
    prepTimeMinutes: 3,
    cookTimeMinutes: 5,
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Τοποθετούμε τις φέτες γαλοπούλας και τη γραβιέρα ανάμεσα στις φέτες ψωμιού ολικής.",
      "Προσθέτουμε λεπτές φέτες ντοματίνια και ελάχιστη ρίγανη.",
      "Ψήνουμε στην τοστιέρα για 4-5 λεπτά μέχρι να λιώσει το τυρί και να ροδίσει το ψωμί."
    ],
    ingredients: [
      { id: "tot-bread", name: "Ψωμί του Τοστ Ολικής", amount: 80, unit: "g", category: "bakery", posokaneiQuery: "ψωμί του τοστ" },
      { id: "tot-graviera", name: "Γραβιέρα Κρήτης σε Φέτες", amount: 45, unit: "g", category: "dairy", posokaneiQuery: "γραβιέρα" },
      { id: "tot-turkey", name: "Γαλοπούλα Καπνιστή", amount: 40, unit: "g", category: "meat", posokaneiQuery: "γαλοπούλα" },
      { id: "tot-tomatoes", name: "Ντοματίνια Βελανίδι", amount: 60, unit: "g", category: "produce", posokaneiQuery: "ντοματίνια" }
    ]
  },
  {
    id: "breakfast-tiganites-meli",
    title: "Τηγανίτες (Pancakes) με Μέλι & Κανέλα",
    titleEn: "Traditional Greek Honey Pancakes",
    description: "Οι αρχαίες ελληνικές τηγανίτες: αφράτες, φτιαγμένες με απλά υλικά και περιχυμένες με μέλι και καρύδια.",
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://www.argiro.gr/recipe/tiganites-me-meli/",
    instructions: [
      "Σε μπολ ανακατεύουμε το αλεύρι, το γάλα, το αυγό και μια πρέζα αλάτι μέχρι να έχουμε παχύρρευστο χυλό.",
      "Ζεσταίνουμε λίγο ελαιόλαδο σε αντικολλητικό τηγάνι σε μέτρια φωτιά.",
      "Ρίχνουμε κουταλιές από το μείγμα και ψήνουμε για 2 λεπτά από κάθε πλευρά μέχρι να φουσκώσουν.",
      "Σερβίρουμε ζεστές με άφθονο μέλι, κανέλα και ψιλοκομμένα καρύδια."
    ],
    ingredients: [
      { id: "tig-flour", name: "Αλεύρι για Όλες τις Χρήσεις", amount: 200, unit: "g", category: "pantry", posokaneiQuery: "αλεύρι" },
      { id: "tig-milk", name: "Φρέσκο Γάλα Πλήρες", amount: 220, unit: "ml", category: "dairy", posokaneiQuery: "γάλα πλήρες" },
      { id: "tig-egg", name: "Αυγό", amount: 1, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "tig-oil", name: "Ελαιόλαδο για το τηγάνι", amount: 20, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" },
      { id: "tig-honey", name: "Μέλι Θυμαρίσιο", amount: 60, unit: "g", category: "pantry", posokaneiQuery: "μέλι" },
      { id: "tig-walnuts", name: "Καρύδια", amount: 40, unit: "g", category: "pantry", posokaneiQuery: "καρύδια" }
    ]
  },
  {
    id: "breakfast-dakos-avgo-katiki",
    title: "Κρητικός Ντάκος Πρωινού με Αυγό Ποσέ & Κατίκι",
    titleEn: "Breakfast Dakos with Poached Egg & Katiki Cheese",
    description: "Μοντέρνα εκδοχή του παραδοσιακού ντάκου με κριθαροκουλούρα, τριμμένη ντομάτα, δροσερό κατίκι Δομοκού και μελάτο αυγό ποσέ.",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 6,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://www.gastronomos.gr",
    instructions: [
      "Βρέχουμε ελαφρώς την κριθαροκουλούρα με λίγο νερό και ραντίζουμε με εξαιρετικό παρθένο ελαιόλαδο.",
      "Απλώνουμε την τριμμένη ντομάτα και μια γενναία κουταλιά κατίκι Δομοκού.",
      "Ετοιμάζουμε το αυγό ποσέ σε σιγοβράζον νερό για 3-4 λεπτά μέχρι να μείνει ο κρόκος ρευστός.",
      "Τοποθετούμε το αυγό πάνω στον ντάκο, πασπαλίζουμε με ρίγανη και φρεσκοτριμμένο πιπέρι."
    ],
    ingredients: [
      { id: "bdk-rusk", name: "Κριθαροκουλούρα Ντάκος", amount: 70, unit: "g", category: "bakery", posokaneiQuery: "παξιμάδια κριθαρένια" },
      { id: "bdk-egg", name: "Αυγό Ελευθέρας Βοσκής", amount: 1, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "bdk-katiki", name: "Κατίκι Δομοκού", amount: 50, unit: "g", category: "dairy", posokaneiQuery: "κατίκι" },
      { id: "bdk-tomato", name: "Ντομάτα Ώριμη", amount: 100, unit: "g", category: "produce", posokaneiQuery: "ντομάτες" },
      { id: "bdk-oil", name: "Ελαιόλαδο Εξαιρετικό Παρθένο", amount: 15, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "breakfast-smoothie-bowl-chia",
    title: "Smoothie Bowl με Γιαούρτι, Μπανάνα & Σπόρους Chia",
    titleEn: "Greek Yogurt Banana Smoothie Bowl with Chia",
    description: "Πλούσιο σε αντιοξειδωτικά και φυτικές ίνες smoothie bowl με στραγγιστό γιαούρτι, παγωμένη μπανάνα, chia και μέλι.",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://akispetretzikis.com",
    instructions: [
      "Χτυπάμε στο μπλέντερ το γιαούρτι με τη μισή μπανάνα και το μέλι μέχρι να γίνει απαλή κρέμα.",
      "Αδειάζουμε σε μπολ και κόβουμε την υπόλοιπη μπανάνα σε λεπτές ροδέλες στην επιφάνεια.",
      "Πασπαλίζουμε με τους σπόρους chia και λίγα καρύδια."
    ],
    ingredients: [
      { id: "sbc-yogurt", name: "Γιαούρτι Στραγγιστό 2%", amount: 180, unit: "g", category: "dairy", posokaneiQuery: "γιαούρτι 2%" },
      { id: "sbc-banana", name: "Μπανάνες", amount: 130, unit: "g", category: "produce", posokaneiQuery: "μπανάνες" },
      { id: "sbc-chia", name: "Σπόροι Chia", amount: 15, unit: "g", category: "pantry", posokaneiQuery: "σπόροι chia" },
      { id: "sbc-honey", name: "Μέλι Ανθέων", amount: 15, unit: "g", category: "pantry", posokaneiQuery: "μέλι" },
      { id: "sbc-walnuts", name: "Καρύδια", amount: 20, unit: "g", category: "pantry", posokaneiQuery: "καρύδια" }
    ]
  },
  {
    id: "breakfast-avgofetes-tsoureki",
    title: "Αυγοφέτες (French Toast) Τσουρεκιού με Μέλι",
    titleEn: "Tsoureki French Toast with Greek Honey",
    description: "Αρωματικές αυγοφέτες από πασχαλινό τσουρέκι βουτηγμένες σε αυγό και γάλα, ψημένες με βούτυρο και μέλι.",
    servings: 3,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://akispetretzikis.com/recipe/4270/aygofetes",
    instructions: [
      "Κόβουμε το τσουρέκι σε χοντρές φέτες πάχους 2 εκατοστών.",
      "Σε ρηχό σκεύος χτυπάμε τα αυγά με το γάλα και λίγη κανέλα.",
      "Βουτάμε κάθε φέτα τσουρεκιού στο μείγμα για λίγα δευτερόλεπτα από κάθε πλευρά.",
      "Ψήνουμε σε αντικολλητικό τηγάνι με λιωμένο βούτυρο για 2-3 λεπτά από κάθε πλευρά και σερβίρουμε με μέλι."
    ],
    ingredients: [
      { id: "avt-tsoureki", name: "Τσουρέκι Παραδοσιακό", amount: 250, unit: "g", category: "bakery", posokaneiQuery: "τσουρέκι" },
      { id: "avt-eggs", name: "Αυγά", amount: 3, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "avt-milk", name: "Φρέσκο Γάλα Πλήρες", amount: 100, unit: "ml", category: "dairy", posokaneiQuery: "γάλα πλήρες" },
      { id: "avt-butter", name: "Βούτυρο Αγελάδος", amount: 25, unit: "g", category: "dairy", posokaneiQuery: "βούτυρο" },
      { id: "avt-honey", name: "Μέλι Θυμαρίσιο", amount: 40, unit: "g", category: "pantry", posokaneiQuery: "μέλι" }
    ]
  },
  {
    id: "breakfast-sfouggato-mytilinis",
    title: "Σφουγγάτο Μυτιλήνης με Κολοκυθάκια & Κεφαλοτύρι",
    titleEn: "Lesvos Sfouggato with Zucchini & Kefalotyri",
    description: "Παραδοσιακή συνταγή από τη Λέσβο: ζουμερή πίτα-ομελέτα χωρίς φύλλο με κολοκυθάκια, κεφαλοτύρι, φέτα και δυόσμο.",
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 35,
    imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://www.argiro.gr/recipe/sfouggato-mytilinis/",
    instructions: [
      "Τρίβουμε τα κολοκυθάκια και τα στραγγίζουμε πολύ καλά από τα υγρά τους.",
      "Σε μεγάλο μπολ χτυπάμε τα αυγά και προσθέτουμε τα τυριά, τα μυρωδικά, το ελαιόλαδο και 2 κουταλιές αλεύρι.",
      "Ενσωματώνουμε τα κολοκυθάκια ανακατεύοντας ομοιόμορφα.",
      "Ψήνουμε σε προθερμασμένο φούρνο στους 180°C για 35 λεπτά μέχρι να ροδοκοκκινίσει η επιφάνεια."
    ],
    ingredients: [
      { id: "sfm-zucchini", name: "Κολοκυθάκια", amount: 600, unit: "g", category: "produce", posokaneiQuery: "κολοκυθάκια" },
      { id: "sfm-eggs", name: "Αυγά", amount: 5, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "sfm-feta", name: "Φέτα Π.Ο.Π.", amount: 150, unit: "g", category: "dairy", posokaneiQuery: "φέτα" },
      { id: "sfm-kefalotyri", name: "Κεφαλοτύρι Τριμμένο", amount: 80, unit: "g", category: "dairy", posokaneiQuery: "κεφαλοτύρι" },
      { id: "sfm-flour", name: "Αλεύρι για Όλες τις Χρήσεις", amount: 40, unit: "g", category: "pantry", posokaneiQuery: "αλεύρι" },
      { id: "sfm-mint", name: "Δυόσμος & Άνηθος", amount: 30, unit: "g", category: "produce", posokaneiQuery: "δυόσμος" },
      { id: "sfm-oil", name: "Ελαιόλαδο", amount: 30, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "breakfast-trahanas-glykos-feta",
    title: "Τραχανάς Γλυκός με Φέτα & Φρυγανισμένο Ψωμί",
    titleEn: "Sweet Trahanas Soup with Feta & Crusty Bread",
    description: "Θερμαντικό και πατροπαράδοτο χειμωνιάτικο πρωινό με γλυκό σιταρένιο τραχανά, βούτυρο γάλακτος και κυβάκια φέτας.",
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://www.gastronomos.gr/syntagh/glykos-trahanas/",
    instructions: [
      "Σε κατσαρολάκι βάζουμε 600ml νερό ή γάλα να πάρει βράση.",
      "Προσθέτουμε τον τραχανά σαν βροχή και ανακατεύουμε τακτικά με ξύλινη κουτάλα για 12 λεπτά σε χαμηλή φωτιά.",
      "Προς το τέλος προσθέτουμε το βούτυρο και λίγο αλάτι.",
      "Σερβίρουμε σε ζεστά πιάτα με θρυμματισμένη φέτα και φρεσκοψημένο ψωμί."
    ],
    ingredients: [
      { id: "trg-trahanas", name: "Τραχανάς Γλυκός", amount: 140, unit: "g", category: "pantry", posokaneiQuery: "τραχανάς" },
      { id: "trg-butter", name: "Βούτυρο Αγελάδος", amount: 20, unit: "g", category: "dairy", posokaneiQuery: "βούτυρο" },
      { id: "trg-feta", name: "Φέτα Π.Ο.Π.", amount: 80, unit: "g", category: "dairy", posokaneiQuery: "φέτα" },
      { id: "trg-bread", name: "Ψωμί Προζυμένιο", amount: 100, unit: "g", category: "bakery", posokaneiQuery: "ψωμί" }
    ]
  },
  {
    id: "breakfast-bagel-solomos",
    title: "Bagel Ολικής με Σολομό, Τυρί Κρέμα & Αγγούρι",
    titleEn: "Whole Grain Bagel with Smoked Salmon & Cream Cheese",
    description: "Εκλεπτυσμένο brunch με φρυγανισμένο bagel ολικής, απαλό τυρί κρέμα, καπνιστό σολομό, φρέσκο αγγούρι και άνηθο.",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Κόβουμε το bagel στη μέση και το φρυγανίζουμε ελαφρώς.",
      "Αλείφουμε και τις δύο πλευρές με το τυρί κρέμα (ή ανθότυρο).",
      "Στρώνουμε λεπτές φέτες αγγούρι, τον καπνιστό σολομό και λίγο φρέσκο άνηθο.",
      "Κλείνουμε και απολαμβάνουμε."
    ],
    ingredients: [
      { id: "bgs-bread", name: "Bagel Ολικής ή Ψωμάκι", amount: 90, unit: "g", category: "bakery", posokaneiQuery: "ψωμί" },
      { id: "bgs-salmon", name: "Σολομός Καπνιστός", amount: 60, unit: "g", category: "meat", posokaneiQuery: "σολομός" },
      { id: "bgs-creamcheese", name: "Τυρί Κρέμα ή Ανθότυρο", amount: 40, unit: "g", category: "dairy", posokaneiQuery: "ανθότυρο" },
      { id: "bgs-cucumber", name: "Αγγούρι Φρέσκο", amount: 50, unit: "g", category: "produce", posokaneiQuery: "αγγούρι" },
      { id: "bgs-dill", name: "Άνηθος Φρέσκος", amount: 5, unit: "g", category: "produce", posokaneiQuery: "άνηθος" }
    ]
  },
  {
    id: "breakfast-scrambled-spanaki-manitaria",
    title: "Scrambled Eggs με Σπανάκι & Μανιτάρια Σοτέ",
    titleEn: "Creamy Scrambled Eggs with Sautéed Spinach & Mushrooms",
    description: "Πρωτεϊνικό πρωινό με κρεμώδη αυγά scramble, φρέσκο τρυφερό σπανάκι, σοταρισμένα μανιτάρια και ελαιόλαδο.",
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://akispetretzikis.com",
    instructions: [
      "Σε αντικολλητικό τηγάνι σοτάρουμε τα μανιτάρια σε φέτες με το ελαιόλαδο για 4 λεπτά μέχρι να ροδίσουν.",
      "Προσθέτουμε το σπανάκι και ανακατεύουμε για 2 λεπτά μέχρι να μαραθεί.",
      "Χτυπάμε τα αυγά με λίγο γάλα και τα ρίχνουμε στο τηγάνι σε χαμηλή φωτιά.",
      "Ανακατεύουμε αργά και απαλά με σπάτουλα σιλικόνης μέχρι να σχηματιστούν κρεμώδεις πτυχές."
    ],
    ingredients: [
      { id: "ses-eggs", name: "Αυγά Ελευθέρας Βοσκής", amount: 4, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "ses-spinach", name: "Σπανάκι Φρέσκο", amount: 150, unit: "g", category: "produce", posokaneiQuery: "σπανάκι" },
      { id: "ses-mushrooms", name: "Μανιτάρια Λευκά", amount: 150, unit: "g", category: "produce", posokaneiQuery: "μανιτάρια" },
      { id: "ses-oil", name: "Ελαιόλαδο", amount: 15, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" },
      { id: "ses-milk", name: "Φρέσκο Γάλα", amount: 30, unit: "ml", category: "dairy", posokaneiQuery: "γάλα πλήρες" }
    ]
  },
  {
    id: "breakfast-overnight-oats-kakao",
    title: "Overnight Oats με Γάλα Αμυγδάλου, Κακάο & Μπανάνα",
    titleEn: "Chocolate Banana Overnight Oats with Almond Milk",
    description: "Έτοιμο από το προηγούμενο βράδυ: βρώμη μουλιασμένη σε ρόφημα αμυγδάλου με άγλυκο κακάο, μέλι και φέτες μπανάνας.",
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Σε βαζάκι ανακατεύουμε τη βρώμη, το κακάο και τους σπόρους chia.",
      "Προσθέτουμε το ρόφημα αμυγδάλου και το μέλι, και ανακατεύουμε πολύ καλά.",
      "Σκεπάζουμε και αφήνουμε στο ψυγείο για τουλάχιστον 6 ώρες (ή όλη τη νύχτα).",
      "Το πρωί γαρνίρουμε με ροδέλες μπανάνας και λίγα καρύδια."
    ],
    ingredients: [
      { id: "ono-oats", name: "Νιφάδες Βρώμης", amount: 50, unit: "g", category: "pantry", posokaneiQuery: "βρώμη" },
      { id: "ono-almondmilk", name: "Γάλα Αμυγδάλου", amount: 160, unit: "ml", category: "dairy", posokaneiQuery: "γάλα αμυγδάλου" },
      { id: "ono-cocoa", name: "Κακάο Άγλυκο", amount: 10, unit: "g", category: "pantry", posokaneiQuery: "κακάο" },
      { id: "ono-chia", name: "Σπόροι Chia", amount: 10, unit: "g", category: "pantry", posokaneiQuery: "σπόροι chia" },
      { id: "ono-honey", name: "Μέλι Ανθέων", amount: 15, unit: "g", category: "pantry", posokaneiQuery: "μέλι" },
      { id: "ono-banana", name: "Μπανάνα", amount: 80, unit: "g", category: "produce", posokaneiQuery: "μπανάνες" }
    ]
  },
  {
    id: "breakfast-egg-muffins-florinis",
    title: "Muffins Αυγού Φούρνου με Πιπεριές Φλωρίνης & Φέτα",
    titleEn: "Baked Egg Muffins with Florina Peppers & Feta",
    description: "Πρακτικά ατομικά muffins αυγού με γλυκιά πιπεριά Φλωρίνης, φέτα και ρίγανη, ιδανικά για meal prep πρωινού.",
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://www.argiro.gr",
    instructions: [
      "Προθερμαίνουμε το φούρνο στους 180°C και λαδώνουμε μια φόρμα για muffins.",
      "Ψιλοκόβουμε τις πιπεριές Φλωρίνης και τις μοιράζουμε στις θήκες μαζί με τη θρυμματισμένη φέτα.",
      "Χτυπάμε τα αυγά με λίγο γάλα, ρίγανη και πιπέρι.",
      "Γεμίζουμε τις θήκες και ψήνουμε για 20 λεπτά μέχρι να σταθεροποιηθούν και να ροδίσουν."
    ],
    ingredients: [
      { id: "emf-eggs", name: "Αυγά", amount: 6, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "emf-peppers", name: "Πιπεριές Φλωρίνης", amount: 120, unit: "g", category: "produce", posokaneiQuery: "πιπεριές φλωρίνης" },
      { id: "emf-feta", name: "Φέτα Π.Ο.Π.", amount: 100, unit: "g", category: "dairy", posokaneiQuery: "φέτα" },
      { id: "emf-milk", name: "Φρέσκο Γάλα", amount: 50, unit: "ml", category: "dairy", posokaneiQuery: "γάλα πλήρες" },
      { id: "emf-oil", name: "Ελαιόλαδο", amount: 10, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "breakfast-tahinopita-kanela",
    title: "Ταχινόπιτα Παραδοσιακή με Κανέλα & Σουσάμι",
    titleEn: "Traditional Tahini Bread Roll with Cinnamon & Sesame",
    description: "Νηστίσιμη και δυναμωτική ταχινόπιτα με πλούσια γέμιση ταχινιού, μέλι, κανέλα και καβουρδισμένο σουσάμι.",
    servings: 6,
    prepTimeMinutes: 20,
    cookTimeMinutes: 35,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://www.gastronomos.gr",
    instructions: [
      "Ανοίγουμε τη ζύμη σε λεπτό φύλλο.",
      "Ανακατεύουμε το ταχίνι με το μέλι και την κανέλα μέχρι να γίνει ομοιόμορφο μείγμα επάλειψης.",
      "Αλείφουμε τη ζύμη, τυλίγουμε σε ρολό ή σαλίγκαρο και πασπαλίζουμε με άφθονο σουσάμι.",
      "Ψήνουμε στους 180°C για 35 λεπτά μέχρι να ροδίσει τραγανά."
    ],
    ingredients: [
      { id: "tpk-flour", name: "Αλεύρι για Όλες τις Χρήσεις", amount: 350, unit: "g", category: "pantry", posokaneiQuery: "αλεύρι" },
      { id: "tpk-tahini", name: "Ταχίνι Μακεδονικό", amount: 180, unit: "g", category: "pantry", posokaneiQuery: "ταχίνι" },
      { id: "tpk-honey", name: "Μέλι Ανθέων", amount: 90, unit: "g", category: "pantry", posokaneiQuery: "μέλι" },
      { id: "tpk-sesame", name: "Σουσάμι", amount: 30, unit: "g", category: "pantry", posokaneiQuery: "σουσάμι" },
      { id: "tpk-oil", name: "Ελαιόλαδο", amount: 30, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "recipe-arabic-pita-wrap",
    title: "Κουλούρι Θεσσαλονίκης Γεμιστό με Ανθότυρο & Ελιές",
    titleEn: "Thessaloniki Sesame Simit Stuffed with Anthotyro & Olives",
    description: "Τραγανό σουσαμένιο κουλούρι κομμένο στη μέση, γεμισμένο με φρέσκο κρητικό ανθότυρο, ροδέλες ελιάς Καλαμών και ρίγανη.",
    servings: 1,
    prepTimeMinutes: 3,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Κόβουμε το φρέσκο κουλούρι Θεσσαλονίκης οριζόντια στη μέση.",
      "Απλώνουμε το ανθότυρο ομοιόμορφα και στις δύο πλευρές.",
      "Προσθέτουμε τις ροδέλες ελιάς Καλαμών και λίγες σταγόνες ελαιόλαδο με ρίγανη.",
      "Κλείνουμε και απολαμβάνουμε ένα αυθεντικό ελληνικό street breakfast."
    ],
    ingredients: [
      { id: "kth-koulouri", name: "Κουλούρι Θεσσαλονίκης με Σουσάμι", amount: 90, unit: "g", category: "bakery", posokaneiQuery: "ψωμί" },
      { id: "kth-anthotyro", name: "Ανθότυρο Νωπό", amount: 60, unit: "g", category: "dairy", posokaneiQuery: "ανθότυρο" },
      { id: "kth-olives", name: "Ελιές Καλαμών χωρίς κουκούτσι", amount: 30, unit: "g", category: "pantry", posokaneiQuery: "ελιές καλαμών" },
      { id: "kth-oil", name: "Ελαιόλαδο", amount: 5, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "breakfast-pancakes-vromis-banana",
    title: "Pancakes Βρώμης & Μπανάνας με Φυστικοβούτυρο",
    titleEn: "Oatmeal Banana Pancakes with Peanut Butter",
    description: "Υγιεινά pancakes χωρίς αλεύρι και χωρίς ζάχαρη, φτιαγμένα στο μπλέντερ με βρώμη, αυγά, ώριμη μπανάνα και φυστικοβούτυρο.",
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://akispetretzikis.com",
    instructions: [
      "Βάζουμε στο μπλέντερ τη βρώμη, τα αυγά, την μπανάνα και λίγη κανέλα και χτυπάμε μέχρι να γίνει ομοιογενές μείγμα.",
      "Ζεσταίνουμε ελάχιστο ελαιόλαδο σε αντικολλητικό τηγάνι σε μέτρια φωτιά.",
      "Ψήνουμε μικρά pancakes για 2 λεπτά μέχρι να βγάλουν φουσκάλες, και γυρίζουμε για άλλο 1 λεπτό.",
      "Σερβίρουμε ζεστά με μια κουταλιά φυστικοβούτυρο και λίγο μέλι."
    ],
    ingredients: [
      { id: "pvb-oats", name: "Νιφάδες Βρώμης", amount: 100, unit: "g", category: "pantry", posokaneiQuery: "βρώμη" },
      { id: "pvb-banana", name: "Μπανάνα Ώριμη", amount: 120, unit: "g", category: "produce", posokaneiQuery: "μπανάνες" },
      { id: "pvb-eggs", name: "Αυγά", amount: 2, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "pvb-peanutbutter", name: "Φυστικοβούτυρο Απαλό", amount: 35, unit: "g", category: "pantry", posokaneiQuery: "φυστικοβούτυρο" },
      { id: "pvb-honey", name: "Μέλι Ανθέων", amount: 20, unit: "g", category: "pantry", posokaneiQuery: "μέλι" }
    ]
  },
  {
    id: "breakfast-ryzogalo-paradosiako",
    title: "Ρυζόγαλο Παραδοσιακό με Ξύσμα Λεμονιού & Κανέλα",
    titleEn: "Traditional Greek Rice Pudding (Ryzogalo)",
    description: "Βελούδινο παραδοσιακό ρυζόγαλο με φρέσκο πλήρες γάλα, ρύζι γλασέ, αρωματικό ξύσμα λεμονιού και άφθονη κανέλα.",
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    category: "breakfast",
    referenceUrl: "https://www.argiro.gr/recipe/ryzogalo/",
    instructions: [
      "Βράζουμε το ρύζι σε 300ml νερό με μια πρέζα αλάτι για 10 λεπτά μέχρι να μαλακώσει.",
      "Προσθέτουμε το φρέσκο γάλα και το ξύσμα λεμονιού και σιγοβράζουμε σε χαμηλή φωτιά ανακατεύοντας τακτικά.",
      "Όταν χυλώσει και δέσει όμορφα, αποσύρουμε από τη φωτιά.",
      "Μοιράζουμε σε μπολάκια, αφήνουμε να κρυώσει και πασπαλίζουμε με μπόλικη κανέλα."
    ],
    ingredients: [
      { id: "ryz-rice", name: "Ρύζι Γλασέ ή Καρολίνα", amount: 150, unit: "g", category: "pantry", posokaneiQuery: "ρύζι καρολίνα" },
      { id: "ryz-milk", name: "Φρέσκο Γάλα Πλήρες", amount: 800, unit: "ml", category: "dairy", posokaneiQuery: "γάλα πλήρες" },
      { id: "ryz-lemon", name: "Λεμόνια (ξύσμα)", amount: 50, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "ryz-honey", name: "Μέλι ή Ζάχαρη", amount: 60, unit: "g", category: "pantry", posokaneiQuery: "μέλι" }
    ]
  }
];
