import { Recipe } from "@/types/meal-planner";

export const SNACK_RECIPES: Recipe[] = [
  {
    id: "snack-mpares-vromis-tahini",
    title: "Μπάρες Βρώμης Χωρίς Ψήσιμο με Ταχίνι & Μέλι",
    titleEn: "No-Bake Oat Bars with Tahini & Greek Honey",
    description: "Υγιεινές, δυναμωτικές μπάρες χωρίς ψήσιμο με νιφάδες βρώμης, ταχίνι, θυμαρίσιο μέλι και καρύδια.",
    servings: 6,
    prepTimeMinutes: 15,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80",
    category: "snacks",
    referenceUrl: "https://akispetretzikis.com/recipe/2704/mpares-vromis",
    instructions: [
      "Σε κατσαρολάκι ζεσταίνουμε ελαφρά το ταχίνι με το μέλι μέχρι να ομογενοποιηθούν.",
      "Σε μπολ ρίχνουμε τη βρώμη, τα καρύδια, την κανέλα και περιχύνουμε με το μείγμα ταχινιού.",
      "Απλώνουμε σε ταψάκι στρωμένο με αντικολλητικό χαρτί και πιέζουμε καλά να γίνει συμπαγές.",
      "Παγώνουμε στο ψυγείο για 2 ώρες και κόβουμε σε 6 ίσες μπάρες."
    ],
    ingredients: [
      { id: "smv-oats", name: "Νιφάδες Βρώμης", amount: 200, unit: "g", category: "pantry", posokaneiQuery: "βρώμη" },
      { id: "smv-tahini", name: "Ταχίνι Μακεδονικό", amount: 120, unit: "g", category: "pantry", posokaneiQuery: "ταχίνι" },
      { id: "smv-honey", name: "Μέλι Θυμαρίσιο", amount: 80, unit: "g", category: "pantry", posokaneiQuery: "μέλι" },
      { id: "smv-walnuts", name: "Καρύδια", amount: 60, unit: "g", category: "pantry", posokaneiQuery: "καρύδια" }
    ]
  },
  {
    id: "snack-kolokythokeftedes-fournou",
    title: "Κολοκυθοκεφτέδες Φούρνου με Δυόσμο & Φέτα",
    titleEn: "Baked Greek Zucchini Fritters (Kolokythokeftedes)",
    description: "Αρωματικοί κολοκυθοκεφτέδες ψημένοι ελαφριά στο φούρνο με τριμμένο κολοκύθι, φέτα, φρέσκο δυόσμο και άνηθο.",
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80",
    category: "snacks",
    referenceUrl: "https://www.argiro.gr/recipe/kolokythokeftedes-fournou/",
    instructions: [
      "Τρίβουμε τα κολοκυθάκια, τα αλατίζουμε και τα στύβουμε πολύ καλά με τα χέρια.",
      "Σε μπολ ανακατεύουμε τα κολοκυθάκια με τα αυγά, τη θρυμματισμένη φέτα, τα μυρωδικά και το αλεύρι.",
      "Πλάθουμε πλακέ κεφτεδάκια και τα τοποθετούμε σε λαδόκολλα ραντισμένη με ελαιόλαδο.",
      "Ψήνουμε στους 190°C για 25 λεπτά μέχρι να ροδίσουν τραγανά."
    ],
    ingredients: [
      { id: "skf-zucchini", name: "Κολοκυθάκια", amount: 600, unit: "g", category: "produce", posokaneiQuery: "κολοκυθάκια" },
      { id: "skf-feta", name: "Φέτα Π.Ο.Π.", amount: 150, unit: "g", category: "dairy", posokaneiQuery: "φέτα" },
      { id: "skf-eggs", name: "Αυγά", amount: 2, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "skf-flour", name: "Αλεύρι για Όλες τις Χρήσεις", amount: 80, unit: "g", category: "pantry", posokaneiQuery: "αλεύρι" },
      { id: "skf-mint", name: "Δυόσμος & Άνηθος", amount: 30, unit: "g", category: "produce", posokaneiQuery: "δυόσμος" },
      { id: "skf-oil", name: "Ελαιόλαδο", amount: 20, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "snack-energy-balls-xourmades-kakao",
    title: "Energy Balls με Χουρμάδες, Καρύδια & Κακάο",
    titleEn: "Raw Energy Balls with Dates, Walnuts & Cocoa",
    description: "Μπουκίτσες ενέργειας χωρίς ζάχαρη και χωρίς ψήσιμο με βασιλικούς χουρμάδες, καρύδια και άγλυκο κακάο.",
    servings: 6,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    category: "snacks",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Αφαιρούμε τα κουκούτσια από τους χουρμάδες.",
      "Βάζουμε στο μούλτι τους χουρμάδες, τα καρύδια και το κακάο.",
      "Χτυπάμε μέχρι να σχηματιστεί μια κολλώδης εύπλαστη πάστα.",
      "Πλάθουμε σε 12 μικρά μπαλάκια και τα κυλάμε σε σουσάμι ή κακάο. Διατηρούνται στο ψυγείο."
    ],
    ingredients: [
      { id: "seb-dates", name: "Χουρμάδες Χωρίς Κουκούτσι", amount: 200, unit: "g", category: "pantry", posokaneiQuery: "χουρμάδες" },
      { id: "seb-walnuts", name: "Καρύδια", amount: 100, unit: "g", category: "pantry", posokaneiQuery: "καρύδια" },
      { id: "seb-cocoa", name: "Κακάο Άγλυκο", amount: 25, unit: "g", category: "pantry", posokaneiQuery: "κακάο" },
      { id: "seb-sesame", name: "Σουσάμι για επικάλυψη", amount: 20, unit: "g", category: "pantry", posokaneiQuery: "σουσάμι" }
    ]
  },
  {
    id: "snack-tyropitakia-kourou",
    title: "Τυροπιτάκια Κουρού με Ανθότυρο & Φέτα",
    titleEn: "Traditional Kourou Cheese Pies with Feta & Anthotyro",
    description: "Τραγανά τυροπιτάκια με αυθεντική τριφτή ζύμη κουρού και πλούσια γέμιση από φέτα και κρεμώδες ανθότυρο.",
    servings: 8,
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    category: "pies",
    referenceUrl: "https://www.argiro.gr/recipe/tyropitakia-kourou/",
    instructions: [
      "Σε μπολ ανακατεύουμε τη θρυμματισμένη φέτα με το ανθότυρο, το ένα αυγό και λίγο πιπέρι.",
      "Κόβουμε τη ζύμη κουρού σε στρογγυλά δισκάκια.",
      "Βάζουμε μια κουταλιά γέμιση στο κέντρο και κλείνουμε σε μισοφέγγαρο πατώντας τις άκρες με πιρούνι.",
      "Αλείφουμε με το δεύτερο αυγό χτυπημένο και ψήνουμε στους 180°C για 25 λεπτά μέχρι να ροδίσουν."
    ],
    ingredients: [
      { id: "stk-dough", name: "Ζύμη Κουρού", amount: 500, unit: "g", category: "pantry", posokaneiQuery: "ζύμη κουρού" },
      { id: "stk-feta", name: "Φέτα Π.Ο.Π.", amount: 200, unit: "g", category: "dairy", posokaneiQuery: "φέτα" },
      { id: "stk-anthotyro", name: "Ανθότυρο Νωπό", amount: 150, unit: "g", category: "dairy", posokaneiQuery: "ανθότυρο" },
      { id: "stk-eggs", name: "Αυγά", amount: 2, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" }
    ]
  },
  {
    id: "snack-ryzogkofretes-tahini-banana",
    title: "Ρυζογκοφρέτες με Ταχίνι, Μπανάνα & Κανέλα",
    titleEn: "Crisp Rice Cakes with Tahini, Sliced Banana & Cinnamon",
    description: "Ελαφρύ και γρήγορο pre-workout σνακ: τραγανές ρυζογκοφρέτες αλειμμένες με ταχίνι, φρέσκια μπανάνα και κανέλα.",
    servings: 1,
    prepTimeMinutes: 3,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80",
    category: "snacks",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Αλείφουμε τις ρυζογκοφρέτες με το ταχίνι (ή φυστικοβούτυρο).",
      "Κόβουμε την μπανάνα σε λεπτές ροδέλες και τις τοποθετούμε από πάνω.",
      "Πασπαλίζουμε με κανέλα και λίγο μέλι και απολαμβάνουμε αμέσως."
    ],
    ingredients: [
      { id: "srb-cakes", name: "Ρυζογκοφρέτες", amount: 30, unit: "g", category: "pantry", posokaneiQuery: "ρυζογκοφρέτες" },
      { id: "srb-tahini", name: "Ταχίνι", amount: 25, unit: "g", category: "pantry", posokaneiQuery: "ταχίνι" },
      { id: "srb-banana", name: "Μπανάνα", amount: 80, unit: "g", category: "produce", posokaneiQuery: "μπανάνες" },
      { id: "srb-honey", name: "Μέλι", amount: 10, unit: "g", category: "pantry", posokaneiQuery: "μέλι" }
    ]
  },
  {
    id: "snack-spitiko-xoumous-karota",
    title: "Σπιτικό Χούμους με Ελαιόλαδο & Στικς Καρότου",
    titleEn: "Homemade Greek Hummus with Carrot Sticks & Olive Oil",
    description: "Κρεμώδης αλοιφή από βρασμένα ρεβύθια, εκλεκτό ταχίνι, λεμόνι και σκόρδο, σερβιρισμένη με τραγανά στικς καρότου.",
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    category: "snacks",
    referenceUrl: "https://akispetretzikis.com/recipe/282/xoumous",
    instructions: [
      "Βάζουμε στο μπλέντερ τα βρασμένα ρεβύθια, το ταχίνι, τον χυμό λεμονιού, το σκόρδο και λίγο νερό.",
      "Χτυπάμε μέχρι να αποκτήσει λεία και βελούδινη υφή.",
      "Αδειάζουμε σε μπολ, κάνουμε λακκουβίτσα με το κουτάλι και ρίχνουμε έξτρα παρθένο ελαιόλαδο και πάπρικα.",
      "Κόβουμε τα φρέσκα καρότα σε μπαστουνάκια και συνοδεύουμε."
    ],
    ingredients: [
      { id: "sxk-chickpeas", name: "Ρεβύθια Βρασμένα", amount: 300, unit: "g", category: "pantry", posokaneiQuery: "ρεβύθια" },
      { id: "sxk-tahini", name: "Ταχίνι", amount: 60, unit: "g", category: "pantry", posokaneiQuery: "ταχίνι" },
      { id: "sxk-carrots", name: "Καρότα Φρέσκα", amount: 300, unit: "g", category: "produce", posokaneiQuery: "καρότα" },
      { id: "sxk-lemon", name: "Λεμόνια", amount: 60, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "sxk-oil", name: "Ελαιόλαδο", amount: 25, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "snack-giaourti-myrtila-kolokythosporoi",
    title: "Γιαούρτι 2% με Μύρτιλα & Σπόρους Κολοκύθας",
    titleEn: "Greek Yogurt 2% with Blueberries & Pumpkin Seeds",
    description: "Δροσερό απογευματινό σνακ με ελληνικό στραγγιστό γιαούρτι 2%, φρέσκα μύρτιλα και τραγανούς κολοκυθόσπορους.",
    servings: 1,
    prepTimeMinutes: 3,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    category: "snacks",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Βάζουμε το στραγγιστό γιαούρτι σε μπολ.",
      "Προσθέτουμε τα πλυμένα μύρτιλα και πασπαλίζουμε με τους σπόρους κολοκύθας.",
      "Ραντίζουμε με λίγο θυμαρίσιο μέλι και απολαμβάνουμε."
    ],
    ingredients: [
      { id: "sgm-yogurt", name: "Γιαούρτι Στραγγιστό 2%", amount: 180, unit: "g", category: "dairy", posokaneiQuery: "γιαούρτι 2%" },
      { id: "sgm-berries", name: "Μύρτιλα (Blueberries)", amount: 50, unit: "g", category: "produce", posokaneiQuery: "μύρτιλα" },
      { id: "sgm-seeds", name: "Σπόροι Κολοκύθας", amount: 20, unit: "g", category: "pantry", posokaneiQuery: "σπόροι κολοκύθας" },
      { id: "sgm-honey", name: "Μέλι Ανθέων", amount: 15, unit: "g", category: "pantry", posokaneiQuery: "μέλι" }
    ]
  },
  {
    id: "snack-crackers-sporon-elaiolado",
    title: "Σπιτικά Crackers Σπόρων με Ελαιόλαδο & Δεντρολίβανο",
    titleEn: "Homemade Olive Oil Seed Crackers with Rosemary",
    description: "Τραγανά κράκερς χωρίς αλεύρι με μείγμα σπόρων (chia, σουσάμι, κολοκυθόσπορο), ελαιόλαδο και δεντρολίβανο.",
    servings: 6,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    category: "snacks",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Σε μπολ ανακατεύουμε τους σπόρους (chia, σουσάμι, κολοκυθόσπορο) με ζεστό νερό και ελαιόλαδο.",
      "Αφήνουμε 10 λεπτά να σχηματιστεί πηχτή γέλη.",
      "Απλώνουμε πολύ λεπτά ανάμεσα σε δύο λαδόκολλες με τον πλάστη.",
      "Ψήνουμε στους 160°C για 20 λεπτά μέχρι να γίνουν τραγανά και σπάμε σε κομμάτια."
    ],
    ingredients: [
      { id: "scs-chia", name: "Σπόροι Chia", amount: 50, unit: "g", category: "pantry", posokaneiQuery: "σπόροι chia" },
      { id: "scs-sesame", name: "Σουσάμι", amount: 60, unit: "g", category: "pantry", posokaneiQuery: "σουσάμι" },
      { id: "scs-pumpkin", name: "Σπόροι Κολοκύθας", amount: 60, unit: "g", category: "pantry", posokaneiQuery: "σπόροι κολοκύθας" },
      { id: "scs-oil", name: "Ελαιόλαδο", amount: 20, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "snack-froutosalata-epoxis-amygdala",
    title: "Φρουτοσαλάτα Εποχής με Αμύγδαλα & Δυόσμο",
    titleEn: "Seasonal Greek Fruit Salad with Almonds & Fresh Mint",
    description: "Δροσερή φρουτοσαλάτα με μήλα, πορτοκάλια, μπανάνα, καβουρδισμένα αμύγδαλα και φρέσκο δυόσμο.",
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=600&q=80",
    category: "snacks",
    referenceUrl: "https://akispetretzikis.com",
    instructions: [
      "Καθαρίζουμε και κόβουμε τα φρούτα σε ίσες μπουκιές.",
      "Τα βάζουμε σε μπολ, ραντίζουμε με λίγο χυμό λεμονιού και μέλι.",
      "Πασπαλίζουμε με τα ανάλατα αμύγδαλα και φυλλαράκια φρέσκου δυόσμου."
    ],
    ingredients: [
      { id: "sfe-apple", name: "Μήλα Στάρκιν", amount: 150, unit: "g", category: "produce", posokaneiQuery: "μήλα" },
      { id: "sfe-banana", name: "Μπανάνες", amount: 120, unit: "g", category: "produce", posokaneiQuery: "μπανάνες" },
      { id: "sfe-almonds", name: "Αμύγδαλα Ανάλατα", amount: 40, unit: "g", category: "pantry", posokaneiQuery: "αμύγδαλα" },
      { id: "sfe-honey", name: "Μέλι Ανθέων", amount: 15, unit: "g", category: "pantry", posokaneiQuery: "μέλι" }
    ]
  },
  {
    id: "snack-mpananes-fysikovoutyro-sokolata",
    title: "Μπανάνες με Φυστικοβούτυρο & Μαύρη Σοκολάτα",
    titleEn: "Banana Bites with Peanut Butter & Dark Chocolate",
    description: "Γρήγορο και λαχταριστό σνακ με ροδέλες μπανάνας, απαλό φυστικοβούτυρο και σταγόνες λιωμένης μαύρης σοκολάτας.",
    servings: 2,
    prepTimeMinutes: 3,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80",
    category: "snacks",
    referenceUrl: "https://akispetretzikis.com",
    instructions: [
      "Κόβουμε τις μπανάνες σε χοντρές ροδέλες.",
      "Απλώνουμε μια κουταλιά φυστικοβούτυρο πάνω σε κάθε ροδέλα.",
      "Περιχύνουμε με λιωμένη μαύρη σοκολάτα ή κακάο και σερβίρουμε αμέσως."
    ],
    ingredients: [
      { id: "smf-banana", name: "Μπανάνες", amount: 160, unit: "g", category: "produce", posokaneiQuery: "μπανάνες" },
      { id: "smf-peanutbutter", name: "Φυστικοβούτυρο", amount: 35, unit: "g", category: "pantry", posokaneiQuery: "φυστικοβούτυρο" },
      { id: "smf-cocoa", name: "Κουβερτούρα ή Κακάο", amount: 20, unit: "g", category: "pantry", posokaneiQuery: "κακάο" }
    ]
  }
];
