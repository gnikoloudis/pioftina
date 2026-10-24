import { Recipe } from "@/types/meal-planner";

export const DINNER_RECIPES: Recipe[] = [
  {
    id: "greek-salad-dakos",
    title: "Χωριάτικη Σαλάτα με Φέτα Π.Ο.Π. & Ελιές Καλαμών",
    titleEn: "Authentic Greek Salad (Horiatiki)",
    description: "Η εμβληματική ελληνική σαλάτα: ζουμερές ντομάτες, τραγανό αγγούρι, φέτα Π.Ο.Π., ελιές Καλαμών και εξαιρετικό παρθένο ελαιόλαδο.",
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    category: "salads",
    referenceUrl: "https://www.gastronomos.gr/syntagh/xoriatiki-salata/",
    instructions: [
      "Κόβουμε τις ντομάτες σε ακανόνιστα κομμάτια και το αγγούρι σε φέτες.",
      "Κόβουμε το κρεμμύδι σε λεπτές ροδέλες και την πιπεριά σε λεπτά μπαστουνάκια.",
      "Βάζουμε τα λαχανικά σε βαθύ μπολ, προσθέτουμε τις ελιές Καλαμών, αλάτι και ρίγανη.",
      "Τοποθετούμε το κομμάτι της φέτας από πάνω, περιχύνουμε με άφθονο ελαιόλαδο και σερβίρουμε με ζεστό ψωμί."
    ],
    ingredients: [
      { id: "dch-tomatoes", name: "Ντομάτες Ώριμες", amount: 400, unit: "g", category: "produce", posokaneiQuery: "ντομάτες" },
      { id: "dch-cucumber", name: "Αγγούρι Φρέσκο", amount: 200, unit: "g", category: "produce", posokaneiQuery: "αγγούρι" },
      { id: "dch-feta", name: "Φέτα Π.Ο.Π.", amount: 150, unit: "g", category: "dairy", posokaneiQuery: "φέτα" },
      { id: "dch-olives", name: "Ελιές Καλαμών", amount: 60, unit: "g", category: "pantry", posokaneiQuery: "ελιές καλαμών" },
      { id: "dch-onions", name: "Κρεμμύδια Ξερά", amount: 80, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "dch-peppers", name: "Πιπεριές Πράσινες", amount: 80, unit: "g", category: "produce", posokaneiQuery: "πιπεριές" },
      { id: "dch-oil", name: "Ελαιόλαδο Εξαιρετικό Παρθένο", amount: 40, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "dinner-kritikos-dakos",
    title: "Κρητικός Ντάκος με Κριθαροκουλούρα & Ξινομυζήθρα",
    titleEn: "Cretan Dakos with Barley Rusk & Myzithra",
    description: "Τραγανή κριθαροκουλούρα μουλιασμένη σε χυμό ντομάτας και ελαιόλαδο, γαρνιρισμένη με ξινομυζήθρα ή φέτα και κάπαρη.",
    servings: 2,
    prepTimeMinutes: 8,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    category: "salads",
    referenceUrl: "https://www.argiro.gr/recipe/kritikos-ntakos/",
    instructions: [
      "Βρέχουμε ελαφρώς τις κριθαροκουλούρες με λίγο νερό και τις ραντίζουμε με ελαιόλαδο.",
      "Τρίβουμε τις ώριμες ντομάτες στον τρίφτη και τις απλώνουμε πάνω στα παξιμάδια.",
      "Θρυμματίζουμε τη φέτα ή ξινομυζήθρα από πάνω.",
      "Προσθέτουμε ελιές, ρίγανη και έξτρα ελαιόλαδο."
    ],
    ingredients: [
      { id: "ddk-rusk", name: "Κριθαροκουλούρα Ντάκος", amount: 140, unit: "g", category: "bakery", posokaneiQuery: "παξιμάδια κριθαρένια" },
      { id: "ddk-tomatoes", name: "Ντομάτες Ώριμες", amount: 300, unit: "g", category: "produce", posokaneiQuery: "ντομάτες" },
      { id: "ddk-feta", name: "Φέτα Π.Ο.Π. ή Ξινομυζήθρα", amount: 100, unit: "g", category: "dairy", posokaneiQuery: "φέτα" },
      { id: "ddk-olives", name: "Ελιές Καλαμών", amount: 40, unit: "g", category: "pantry", posokaneiQuery: "ελιές καλαμών" },
      { id: "ddk-oil", name: "Ελαιόλαδο", amount: 30, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "dinner-kotosalata-giaourti",
    title: "Κοτοσαλάτα με Γιαούρτι, Μουστάρδα & Τραγανό Σέλερι",
    titleEn: "Greek Yogurt Chicken Salad with Celery",
    description: "Δροσερή, ελαφριά και χορταστική κοτοσαλάτα με ψητό στήθος κοτόπουλου, dressing στραγγιστού γιαουρτιού, μουστάρδα και σέλερι.",
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    category: "salads",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Ψήνουμε ή χρησιμοποιούμε περισσευούμενο ψητό στήθος κοτόπουλου κομμένο σε κυβάκια.",
      "Σε μπολ ανακατεύουμε το γιαούρτι με τη μουστάρδα, λίγο ελαιόλαδο, λεμόνι, αλάτι και πιπέρι.",
      "Προσθέτουμε το κοτόπουλο, το ψιλοκομμένο σέλερι και φρέσκο κρεμμυδάκι.",
      "Ανακατεύουμε καλά και σερβίρουμε πάνω σε τρυφερά φύλλα μαρουλιού."
    ],
    ingredients: [
      { id: "dks-chicken", name: "Φιλέτο Στήθος Κοτόπουλο", amount: 350, unit: "g", category: "meat", posokaneiQuery: "στήθος κοτόπουλο" },
      { id: "dks-yogurt", name: "Γιαούρτι Στραγγιστό 2%", amount: 150, unit: "g", category: "dairy", posokaneiQuery: "γιαούρτι 2%" },
      { id: "dks-mustard", name: "Μουστάρδα Απαλή", amount: 20, unit: "g", category: "pantry", posokaneiQuery: "μουστάρδα" },
      { id: "dks-celery", name: "Σέλινο ή Σέλερι", amount: 80, unit: "g", category: "produce", posokaneiQuery: "σέλινο" },
      { id: "dks-lettuce", name: "Μαρούλι Φρέσκο", amount: 150, unit: "g", category: "produce", posokaneiQuery: "μαρούλι" },
      { id: "dks-oil", name: "Ελαιόλαδο", amount: 15, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "dinner-salata-mavromatika",
    title: "Σαλάτα Μαυρομάτικα Φασόλια με Φρέσκο Κρεμμυδάκι",
    titleEn: "Black-Eyed Pea Salad with Spring Onions & Parsley",
    description: "Παραδοσιακή οσπριοσαλάτα με μαυρομάτικα φασόλια, φρέσκα μυρωδικά, ψιλοκομμένη πιπεριά Φλωρίνης και λαδόξιδο.",
    servings: 3,
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    category: "salads",
    referenceUrl: "https://www.gastronomos.gr",
    instructions: [
      "Βράζουμε τα μαυρομάτικα φασόλια σε αλατισμένο νερό για 20-25 λεπτά μέχρι να μαλακώσουν αλλά να κρατάνε το σχήμα τους.",
      "Τα στραγγίζουμε και τα αφήνουμε να κρυώσουν.",
      "Προσθέτουμε τα ψιλοκομμένα φρέσκα κρεμμυδάκια, πιπεριά Φλωρίνης και μαϊντανό.",
      "Χτυπάμε το ελαιόλαδο με το ξύδι και περιχύνουμε τη σαλάτα. Σερβίρουμε δροσερή."
    ],
    ingredients: [
      { id: "dsm-beans", name: "Φασόλια Μαυρομάτικα", amount: 300, unit: "g", category: "pantry", posokaneiQuery: "μαυρομάτικα φασόλια" },
      { id: "dsm-onions", name: "Φρέσκα Κρεμμυδάκια & Μαϊντανός", amount: 100, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "dsm-peppers", name: "Πιπεριές Φλωρίνης", amount: 80, unit: "g", category: "produce", posokaneiQuery: "πιπεριές φλωρίνης" },
      { id: "dsm-oil", name: "Ελαιόλαδο", amount: 35, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "dinner-tonosalata-mesogeiaki",
    title: "Τονοσαλάτα Μεσογειακή με Καλαμπόκι & Αγγούρι",
    titleEn: "Mediterranean Tuna Salad with Corn & Cucumber",
    description: "Γρήγορη και χορταστική τονοσαλάτα με τόνο σε ελαιόλαδο, τραγανό αγγούρι, γλυκό καλαμπόκι, μαρούλι και λεμόνι.",
    servings: 2,
    prepTimeMinutes: 8,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    category: "quick",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Πλένουμε και χοντροκόβουμε το μαρούλι και κόβουμε το αγγούρι σε κυβάκια.",
      "Στραγγίζουμε τον τόνο και τον σπάμε με πιρούνι σε μεγάλο μπολ.",
      "Προσθέτουμε το καλαμπόκι, τα λαχανικά και λίγο φρέσκο κρεμμυδάκι.",
      "Ραντίζουμε με εξαιρετικό παρθένο ελαιόλαδο και χυμό λεμονιού και ανακατεύουμε."
    ],
    ingredients: [
      { id: "dtn-tuna", name: "Τόνος σε Ελαιόλαδο", amount: 200, unit: "g", category: "pantry", posokaneiQuery: "τόνος σε ελαιόλαδο" },
      { id: "dtn-lettuce", name: "Μαρούλι Φρέσκο", amount: 200, unit: "g", category: "produce", posokaneiQuery: "μαρούλι" },
      { id: "dtn-cucumber", name: "Αγγούρι", amount: 150, unit: "g", category: "produce", posokaneiQuery: "αγγούρι" },
      { id: "dtn-lemon", name: "Λεμόνια", amount: 60, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "dtn-oil", name: "Ελαιόλαδο", amount: 15, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "dinner-ntomates-gemistes-tono-katiki",
    title: "Ντομάτες Γεμιστές με Τόνο & Κατίκι Δομοκού",
    titleEn: "Stuffed Tomatoes with Tuna & Katiki Domokou",
    description: "Δροσερό καλοκαιρινό βραδινό χωρίς μαγείρεμα: ώριμες ντομάτες γεμισμένες με μείγμα τόνου, κατίκι Δομοκού και κάπαρη.",
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    category: "healthy",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Κόβουμε το καπάκι από τις ντομάτες και αδειάζουμε προσεκτικά το εσωτερικό με κουτάλι.",
      "Σε μπολ ανακατεύουμε τον στραγγισμένο τόνο με το κατίκι Δομοκού, ψιλοκομμένο αγγούρι και δυόσμο.",
      "Γεμίζουμε τις ντομάτες με το μείγμα.",
      "Ραντίζουμε με λίγο ελαιόλαδο και σερβίρουμε αμέσως."
    ],
    ingredients: [
      { id: "dnt-tomatoes", name: "Ντομάτες Ώριμες Μεγάλες", amount: 500, unit: "g", category: "produce", posokaneiQuery: "ντομάτες" },
      { id: "dnt-tuna", name: "Τόνος σε Νερό ή Ελαιόλαδο", amount: 160, unit: "g", category: "pantry", posokaneiQuery: "τόνος σε νερό" },
      { id: "dnt-katiki", name: "Κατίκι Δομοκού", amount: 120, unit: "g", category: "dairy", posokaneiQuery: "κατίκι" },
      { id: "dnt-cucumber", name: "Αγγούρι", amount: 80, unit: "g", category: "produce", posokaneiQuery: "αγγούρι" },
      { id: "dnt-oil", name: "Ελαιόλαδο", amount: 15, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "dinner-omeleta-manitaria-graviera",
    title: "Ομελέτα με Μανιτάρια, Πιπεριά & Γραβιέρα",
    titleEn: "Greek Mushroom, Pepper & Graviera Omelette",
    description: "Γρήγορο και χορταστικό βραδινό με αυγά ελευθέρας βοσκής, σοταρισμένα φρέσκα μανιτάρια, πιπεριά και λιωμένη γραβιέρα.",
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 8,
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
    category: "quick",
    referenceUrl: "https://akispetretzikis.com",
    instructions: [
      "Σε αντικολλητικό τηγάνι σοτάρουμε τα μανιτάρια και την πιπεριά στο ελαιόλαδο για 4 λεπτά μέχρι να ροδίσουν.",
      "Χτυπάμε τα αυγά με λίγο γάλα, αλάτι και πιπέρι και τα ρίχνουμε πάνω από τα λαχανικά.",
      "Όταν ψηθεί από κάτω, πασπαλίζουμε με τη γραβιέρα, διπλώνουμε στη μέση και αφήνουμε 1 λεπτό να λιώσει το τυρί."
    ],
    ingredients: [
      { id: "dom-eggs", name: "Αυγά Ελευθέρας Βοσκής", amount: 4, unit: "τεμ", category: "dairy", posokaneiQuery: "αυγά" },
      { id: "dom-mushrooms", name: "Μανιτάρια Λευκά", amount: 150, unit: "g", category: "produce", posokaneiQuery: "μανιτάρια" },
      { id: "dom-peppers", name: "Πιπεριές", amount: 80, unit: "g", category: "produce", posokaneiQuery: "πιπεριές" },
      { id: "dom-graviera", name: "Γραβιέρα Κρήτης Τριμμένη", amount: 60, unit: "g", category: "dairy", posokaneiQuery: "γραβιέρα" },
      { id: "dom-oil", name: "Ελαιόλαδο", amount: 15, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "dinner-quinoa-bowl-laxanika-tahini",
    title: "Κινόα Bowl με Ψητά Λαχανικά & Σως Ταχινιού",
    titleEn: "Warm Quinoa Bowl with Roasted Veggies & Tahini Dressing",
    description: "Υγιεινό plant-based βραδινό με αφράτη κινόα, ψητά κολοκυθάκια και πιπεριές, ρεβύθια και σως ταχινιού με λεμόνι.",
    servings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    category: "healthy",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Βράζουμε την κινόα σε διπλάσια ποσότητα νερού για 15 λεπτά μέχρι να πιει το υγρό.",
      "Ψήνουμε σε ταψί με ελαιόλαδο κολοκυθάκια και πιπεριές στους 200°C για 18 λεπτά.",
      "Ετοιμάζουμε τη σως χτυπώντας το ταχίνι με λεμόνι και λίγο χλιαρό νερό.",
      "Μοιράζουμε την κινόα σε μπολ, προσθέτουμε τα ψητά λαχανικά και περιχύνουμε με τη σως ταχινιού."
    ],
    ingredients: [
      { id: "dqb-quinoa", name: "Κινόα", amount: 140, unit: "g", category: "pantry", posokaneiQuery: "κινόα" },
      { id: "dqb-zucchini", name: "Κολοκυθάκια", amount: 200, unit: "g", category: "produce", posokaneiQuery: "κολοκυθάκια" },
      { id: "dqb-peppers", name: "Πιπεριές", amount: 150, unit: "g", category: "produce", posokaneiQuery: "πιπεριές" },
      { id: "dqb-tahini", name: "Ταχίνι", amount: 35, unit: "g", category: "pantry", posokaneiQuery: "ταχίνι" },
      { id: "dqb-lemon", name: "Λεμόνια", amount: 60, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "dqb-oil", name: "Ελαιόλαδο", amount: 20, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "dinner-salata-fakes-feta-dyosmos",
    title: "Σαλάτα με Φακές, Ντοματίνια, Φέτα & Δυόσμο",
    titleEn: "Cold Lentil Salad with Cherry Tomatoes, Feta & Mint",
    description: "Δροσερή καλοκαιρινή φακοσαλάτα με ψιλές βρασμένες φακές, γλυκά ντοματίνια, φέτα, φρέσκο δυόσμο και ελαιόλαδο.",
    servings: 3,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    category: "salads",
    referenceUrl: "https://www.gastronomos.gr",
    instructions: [
      "Βράζουμε τις φακές σε αλατισμένο νερό για 20 λεπτά μέχρι να είναι al dente, στραγγίζουμε και κρυώνουμε.",
      "Σε σαλατιέρα βάζουμε τις φακές, τα κομμένα ντοματίνια, φρέσκο κρεμμυδάκι και δυόσμο.",
      "Θρυμματίζουμε τη φέτα από πάνω.",
      "Περιχύνουμε με ελαιόλαδο και ξύδι, ανακατεύουμε και σερβίρουμε."
    ],
    ingredients: [
      { id: "dsf-lentils", name: "Φακές Ψιλές", amount: 250, unit: "g", category: "pantry", posokaneiQuery: "φακές ψιλές" },
      { id: "dsf-tomatoes", name: "Ντοματίνια Βελανίδι", amount: 200, unit: "g", category: "produce", posokaneiQuery: "ντοματίνια" },
      { id: "dsf-feta", name: "Φέτα Π.Ο.Π.", amount: 100, unit: "g", category: "dairy", posokaneiQuery: "φέτα" },
      { id: "dsf-mint", name: "Δυόσμος & Φρέσκο Κρεμμυδάκι", amount: 40, unit: "g", category: "produce", posokaneiQuery: "δυόσμος" },
      { id: "dsf-oil", name: "Ελαιόλαδο", amount: 30, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "dinner-kolokythosoupa-veloute",
    title: "Κολοκυθόσουπα Βελουτέ με Τζίντζερ & Κρουτόν",
    titleEn: "Creamy Roasted Pumpkin Soup with Ginger",
    description: "Βελούδινη χειμωνιάτικη σούπα από κίτρινη κολοκύθα, καρότο, αρωματικό τζίντζερ και τραγανά κρουτόν.",
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
    category: "comfort",
    referenceUrl: "https://akispetretzikis.com/recipe/2821/kolokyqosoupa",
    instructions: [
      "Σε κατσαρόλα σοτάρουμε το κρεμμύδι με ελαιόλαδο, προσθέτουμε την κολοκύθα σε κύβους και τα καρότα.",
      "Προσθέτουμε νερό ή ζωμό μέχρι να σκεπαστούν τα λαχανικά και βράζουμε για 20 λεπτά μέχρι να μαλακώσουν.",
      "Πολτοποιούμε με ραβδομπλέντερ μέχρι να γίνει βελούδινη η υφή.",
      "Σερβίρουμε ζεστή με λίγο ελαιόλαδο και τραγανά κρουτόν."
    ],
    ingredients: [
      { id: "dks-pumpkin", name: "Κολοκύθα Κίτρινη", amount: 800, unit: "g", category: "produce", posokaneiQuery: "κολοκύθα" },
      { id: "dks-carrots", name: "Καρότα", amount: 200, unit: "g", category: "produce", posokaneiQuery: "καρότα" },
      { id: "dks-onions", name: "Κρεμμύδια Ξερά", amount: 120, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "dks-oil", name: "Ελαιόλαδο", amount: 30, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" },
      { id: "dks-bread", name: "Ψωμί για Κρουτόν", amount: 80, unit: "g", category: "bakery", posokaneiQuery: "ψωμί" }
    ]
  },
  {
    id: "dinner-caesars-kotopoulo",
    title: "Σαλάτα Caesar's με Ψητό Κοτόπουλο & Παρμεζάνα",
    titleEn: "Greek Style Caesar Salad with Grilled Chicken & Graviera",
    description: "Τραγανό μαρούλι με ζουμερό ψητό στήθος κοτόπουλου, φλούδες γραβιέρας ή παρμεζάνας, σπιτικά κρουτόν και ελαφρύ dressing.",
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    category: "salads",
    referenceUrl: "https://akispetretzikis.com",
    instructions: [
      "Ψήνουμε το φιλέτο κοτόπουλο σε σχαροτήγανο για 6 λεπτά από κάθε πλευρά και το κόβουμε σε φέτες.",
      "Πλένουμε και κόβουμε το μαρούλι σε μεγάλα κομμάτια.",
      "Ανακατεύουμε σε μπολ με λίγη μουστάρδα, γιαούρτι, ελαιόλαδο και λεμόνι.",
      "Γαρνίρουμε με το κοτόπουλο, φλούδες γραβιέρας και τραγανά κρουτόν."
    ],
    ingredients: [
      { id: "dcs-chicken", name: "Φιλέτο Στήθος Κοτόπουλο", amount: 350, unit: "g", category: "meat", posokaneiQuery: "στήθος κοτόπουλο" },
      { id: "dcs-lettuce", name: "Μαρούλι Φρέσκο", amount: 250, unit: "g", category: "produce", posokaneiQuery: "μαρούλι" },
      { id: "dcs-cheese", name: "Γραβιέρα ή Παρμεζάνα", amount: 50, unit: "g", category: "dairy", posokaneiQuery: "γραβιέρα" },
      { id: "dcs-yogurt", name: "Γιαούρτι 2%", amount: 60, unit: "g", category: "dairy", posokaneiQuery: "γιαούρτι 2%" },
      { id: "dcs-oil", name: "Ελαιόλαδο", amount: 20, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "dinner-tsipoura-tiganio-xorta",
    title: "Φιλέτο Τσιπούρας στο Τηγάνι με Βραστά Χόρτα",
    titleEn: "Pan-Seared Sea Bream with Steamed Wild Greens",
    description: "Τραγανό φιλέτο τσιπούρας ψημένο στο τηγάνι με την πέτσα, συνοδευόμενο από παραδοσιακά βραστά χόρτα και λαδολέμονο.",
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
    category: "fish",
    referenceUrl: "https://www.argiro.gr",
    instructions: [
      "Βράζουμε τα χόρτα (ή σπανάκι) σε αλατισμένο νερό για 6-8 λεπτά και στραγγίζουμε.",
      "Σε αντικολλητικό τηγάνι με λίγο ελαιόλαδο ψήνουμε τα φιλέτα τσιπούρας από την πλευρά της πέτσας για 4 λεπτά μέχρι να γίνουν τραγανά.",
      "Γυρίζουμε για άλλο 1-2 λεπτά από την άλλη πλευρά.",
      "Σερβίρουμε τα ψάρια με τα χόρτα και άφθονο φρέσκο λαδολέμονο."
    ],
    ingredients: [
      { id: "dtx-fish", name: "Φιλέτο Τσιπούρας Νωπό", amount: 400, unit: "g", category: "meat", posokaneiQuery: "τσιπούρα" },
      { id: "dtx-greens", name: "Σπανάκι ή Χόρτα Εποχής", amount: 400, unit: "g", category: "produce", posokaneiQuery: "σπανάκι" },
      { id: "dtx-lemon", name: "Λεμόνια", amount: 80, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "dtx-oil", name: "Ελαιόλαδο", amount: 30, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "dinner-trahanas-xinos-feta",
    title: "Τραχανάς Ξινός Σούπα με Κυβάκια Φέτας",
    titleEn: "Sour Trahanas Soup with Feta Cubes",
    description: "Παραδοσιακή ελληνική σούπα ξινού τραχανά, ελαφριά για το βράδυ, σερβιρισμένη με λιωμένα κυβάκια φέτας.",
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
    category: "comfort",
    referenceUrl: "https://www.gastronomos.gr",
    instructions: [
      "Σε κατσαρολάκι βράζουμε 650ml νερό με 1 κουταλιά ελαιόλαδο.",
      "Ρίχνουμε τον ξινό τραχανά ανακατεύοντας συνεχώς με ξύλινη κουτάλα.",
      "Σιγοβράζουμε για 12-14 λεπτά μέχρι να χυλώσει.",
      "Αποσύρουμε και σερβίρουμε σε ζεστά μπολ με κυβάκια φέτας και φρεσκοτριμμένο πιπέρι."
    ],
    ingredients: [
      { id: "dtx-trahanas", name: "Τραχανάς Ξινός", amount: 140, unit: "g", category: "pantry", posokaneiQuery: "τραχανάς" },
      { id: "dtx-feta", name: "Φέτα Π.Ο.Π.", amount: 90, unit: "g", category: "dairy", posokaneiQuery: "φέτα" },
      { id: "dtx-oil", name: "Ελαιόλαδο", amount: 15, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "dinner-wrap-kotopoulo-giaourti",
    title: "Wrap Τορτίγιας με Κοτόπουλο, Μαρούλι & Σως Γιαουρτιού",
    titleEn: "Greek Chicken & Yogurt Sauce Tortilla Wrap",
    description: "Ελαφρύ και γρήγορο wrap με ψητό στήθος κοτόπουλου, τραγανό μαρούλι, ντομάτα και δροσερή σως γιαουρτιού.",
    servings: 2,
    prepTimeMinutes: 8,
    cookTimeMinutes: 10,
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
    category: "quick",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Ψήνουμε το στήθος κοτόπουλου σε σχαροτήγανο και το κόβουμε σε λωρίδες.",
      "Ζεσταίνουμε τις τορτίγιες για 30 δευτερόλεπτα σε στεγνό τηγάνι.",
      "Αλείφουμε κάθε τορτίγια με στραγγιστό γιαούρτι αναμεμειγμένο με λίγο λεμόνι και ρίγανη.",
      "Προσθέτουμε μαρούλι, φέτες ντομάτας και το κοτόπουλο, τυλίγουμε σφιχτά και σερβίρουμε."
    ],
    ingredients: [
      { id: "dwr-tortillas", name: "Τορτίγιες Ολικής", amount: 130, unit: "g", category: "bakery", posokaneiQuery: "τορτίγιες" },
      { id: "dwr-chicken", name: "Φιλέτο Στήθος Κοτόπουλο", amount: 250, unit: "g", category: "meat", posokaneiQuery: "στήθος κοτόπουλο" },
      { id: "dwr-yogurt", name: "Γιαούρτι 2%", amount: 80, unit: "g", category: "dairy", posokaneiQuery: "γιαούρτι 2%" },
      { id: "dwr-lettuce", name: "Μαρούλι Φρέσκο", amount: 80, unit: "g", category: "produce", posokaneiQuery: "μαρούλι" },
      { id: "dwr-tomato", name: "Ντομάτα", amount: 100, unit: "g", category: "produce", posokaneiQuery: "ντομάτες" }
    ]
  },
  {
    id: "dinner-manitaria-plevrotous-psita",
    title: "Ψητά Μανιτάρια Πλευρώτους με Σκόρδο & Βαλσάμικο",
    titleEn: "Pan-Grilled Oyster Mushrooms with Garlic & Balsamic",
    description: "Ζουμερά και μυρωδάτα μανιτάρια πλευρώτους ψημένα σε δυνατή φωτιά με ελαιόλαδο, σκόρδο, μαϊντανό και βαλσάμικο ξύδι.",
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 12,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    category: "vegetarian",
    referenceUrl: "https://akispetretzikis.com",
    instructions: [
      "Σκουπίζουμε απαλά τα μανιτάρια πλευρώτους και τα αφήνουμε ολόκληρα ή κομμένα σε μεγάλα κομμάτια.",
      "Ζεσταίνουμε σχαροτήγανο σε δυνατή φωτιά με λίγο ελαιόλαδο.",
      "Ψήνουμε τα μανιτάρια για 4-5 λεπτά από κάθε πλευρά μέχρι να πάρουν ωραίο καστανό χρώμα.",
      "Σβήνουμε με βαλσάμικο ξύδι, πασπαλίζουμε με ψιλοκομμένο σκόρδο και μαϊντανό και σερβίρουμε ζεστά."
    ],
    ingredients: [
      { id: "dmp-mushrooms", name: "Μανιτάρια Πλευρώτους", amount: 450, unit: "g", category: "produce", posokaneiQuery: "μανιτάρια" },
      { id: "dmp-oil", name: "Ελαιόλαδο", amount: 25, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" },
      { id: "dmp-garlic", name: "Σκόρδο & Μαϊντανός", amount: 20, unit: "g", category: "produce", posokaneiQuery: "σκόρδο" }
    ]
  },
  {
    id: "dinner-manitarosoupa-veloute",
    title: "Μανιταρόσουπα Βελουτέ με Θυμάρι & Κρέμα",
    titleEn: "Creamy Wild Mushroom Soup with Fresh Thyme",
    description: "Πλούσια και γήινη βελουτέ σούπα με φρέσκα λευκά μανιτάρια, πράσο, ζωμό λαχανικών και λίγο φρέσκο γάλα.",
    servings: 3,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
    category: "comfort",
    referenceUrl: "https://www.argiro.gr",
    instructions: [
      "Σοτάρουμε σε κατσαρόλα τα μανιτάρια σε φέτες με το κρεμμύδι και το ελαιόλαδο για 6 λεπτά.",
      "Προσθέτουμε ζωμό λαχανικών ή νερό και σιγοβράζουμε για 15 λεπτά.",
      "Πολτοποιούμε με ραβδομπλέντερ, προσθέτουμε το γάλα και φρέσκο θυμάρι.",
      "Σιγοβράζουμε για άλλα 2 λεπτά και σερβίρουμε με ζεστό φρυγανισμένο ψωμί."
    ],
    ingredients: [
      { id: "dms-mushrooms", name: "Μανιτάρια Λευκά", amount: 500, unit: "g", category: "produce", posokaneiQuery: "μανιτάρια" },
      { id: "dms-onions", name: "Κρεμμύδια Ξερά", amount: 100, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "dms-milk", name: "Φρέσκο Γάλα", amount: 150, unit: "ml", category: "dairy", posokaneiQuery: "γάλα πλήρες" },
      { id: "dms-oil", name: "Ελαιόλαδο", amount: 25, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "dinner-salata-roka-syka-karydia",
    title: "Σαλάτα Ρόκα με Αποξηραμένα Σύκα, Καρύδια & Παρμεζάνα",
    titleEn: "Wild Rocket Salad with Dried Figs, Walnuts & Graviera",
    description: "Κομψή σαλάτα με φρέσκια πιπεράτη ρόκα, γλυκά αποξηραμένα σύκα, καρύδια και φλύδες γραβιέρας Κρήτης.",
    servings: 2,
    prepTimeMinutes: 8,
    cookTimeMinutes: 0,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    category: "salads",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Πλένουμε και στεγνώνουμε τη ρόκα σε σαλατιέρα.",
      "Κόβουμε τα αποξηραμένα σύκα σε λεπτές φέτες και σπάμε τα καρύδια.",
      "Χτυπάμε το ελαιόλαδο με λίγο μέλι και ξύδι βαλσάμικο.",
      "Περιχύνουμε τη σαλάτα και γαρνίρουμε με φλούδες γραβιέρας."
    ],
    ingredients: [
      { id: "dsr-arugula", name: "Ρόκα & Μαρούλι", amount: 150, unit: "g", category: "produce", posokaneiQuery: "μαρούλι" },
      { id: "dsr-figs", name: "Σύκα Αποξηραμένα", amount: 60, unit: "g", category: "pantry", posokaneiQuery: "σύκα" },
      { id: "dsr-walnuts", name: "Καρύδια Ψίχα", amount: 35, unit: "g", category: "pantry", posokaneiQuery: "καρύδια" },
      { id: "dsr-cheese", name: "Γραβιέρα Κρήτης", amount: 45, unit: "g", category: "dairy", posokaneiQuery: "γραβιέρα" },
      { id: "dsr-oil", name: "Ελαιόλαδο", amount: 20, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "dinner-biftekakia-galopoulas-kolokythakia",
    title: "Μπιφτεκάκια Γαλοπούλας με Ψητά Κολοκυθάκια",
    titleEn: "Light Turkey Patties with Grilled Zucchini",
    description: "Ελαφριά μπιφτεκάκια με κιμά γαλοπούλας ή κοτόπουλου, μυρωδικά και ψητά κολοκυθάκια σε ροδέλες.",
    servings: 3,
    prepTimeMinutes: 15,
    cookTimeMinutes: 18,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    category: "healthy",
    referenceUrl: "https://akispetretzikis.com",
    instructions: [
      "Ζυμώνουμε τον κιμά με τριμμένο κρεμμύδι, λίγο ελαιόλαδο, ρίγανη και αλάτι.",
      "Πλάθουμε μικρά μπιφτεκάκια και κόβουμε τα κολοκυθάκια σε ροδέλες.",
      "Ψήνουμε σε αντικολλητικό τηγάνι ή φούρνο για 15-18 λεπτά μέχρι να ροδίσουν.",
      "Σερβίρουμε με φρέσκο λεμόνι και σαλάτα."
    ],
    ingredients: [
      { id: "dbg-mince", name: "Κιμάς Γαλοπούλας ή Μοσχαρίσιος", amount: 500, unit: "g", category: "meat", posokaneiQuery: "κιμάς μοσχαρίσιος" },
      { id: "dbg-zucchini", name: "Κολοκυθάκια", amount: 400, unit: "g", category: "produce", posokaneiQuery: "κολοκυθάκια" },
      { id: "dbg-onions", name: "Κρεμμύδια Ξερά", amount: 80, unit: "g", category: "produce", posokaneiQuery: "κρεμμύδια" },
      { id: "dbg-lemon", name: "Λεμόνια", amount: 60, unit: "g", category: "produce", posokaneiQuery: "λεμόνια" },
      { id: "dbg-oil", name: "Ελαιόλαδο", amount: 25, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  },
  {
    id: "dinner-souvlakia-kotopoulo-tzatziki",
    title: "Σουβλάκια Κοτόπουλο σε Πίτα με Τζατζίκι",
    titleEn: "Greek Chicken Souvlaki Pita with Tzatziki",
    description: "Σπιτικά καλαμάκια κοτόπουλου ψημένα ζουμερά, τυλιγμένα σε αφράτες πίτες με γιαούρτι, αγγούρι, ντομάτα και ρίγανη.",
    servings: 3,
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    category: "quick",
    referenceUrl: "https://akispetretzikis.com",
    instructions: [
      "Ψήνουμε τα σουβλάκια κοτόπουλου σε σχαροτήγανο για 12-14 λεπτά μέχρι να ψηθούν καλά.",
      "Ζεσταίνουμε τις πίτες για σουβλάκι με ελάχιστο ελαιόλαδο και ρίγανη.",
      "Ετοιμάζουμε γρήγορο τζατζίκι με στραγγιστό γιαούρτι, τριμμένο αγγούρι και ελαιόλαδο.",
      "Γεμίζουμε τις πίτες με το κοτόπουλο, τζατζίκι, φέτες ντομάτας και κρεμμύδι."
    ],
    ingredients: [
      { id: "dsk-souvlaki", name: "Σουβλάκια Κοτόπουλο Νωπά", amount: 450, unit: "g", category: "meat", posokaneiQuery: "σουβλάκια κοτόπουλο" },
      { id: "dsk-pitas", name: "Πίτες για Σουβλάκι", amount: 240, unit: "g", category: "bakery", posokaneiQuery: "πίτες για σουβλάκι" },
      { id: "dsk-yogurt", name: "Γιαούρτι 2%", amount: 150, unit: "g", category: "dairy", posokaneiQuery: "γιαούρτι 2%" },
      { id: "dsk-cucumber", name: "Αγγούρι", amount: 100, unit: "g", category: "produce", posokaneiQuery: "αγγούρι" },
      { id: "dsk-tomatoes", name: "Ντομάτες", amount: 150, unit: "g", category: "produce", posokaneiQuery: "ντομάτες" }
    ]
  },
  {
    id: "dinner-krya-salata-zymarikon-motzarela",
    title: "Κρύα Σαλάτα Ζυμαρικών με Ντοματίνια & Μοτσαρέλα",
    titleEn: "Cold Pasta Salad with Cherry Tomatoes & Mozzarella",
    description: "Δροσερή σαλάτα ζυμαρικών με πέννες al dente, γλυκά ντοματίνια, μπαλάκια μοτσαρέλας ή φέτας, ελιές και φρέσκο βασιλικό.",
    servings: 3,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80",
    category: "pasta",
    referenceUrl: "https://www.olivemagazine.gr",
    instructions: [
      "Βράζουμε τις πέννες σε αλατισμένο νερό al dente, σουρώνουμε και τις κρυώνουμε με κρύο νερό.",
      "Σε μεγάλο μπολ βάζουμε τα ζυμαρικά με τα κομμένα ντοματίνια, τη μοτσαρέλα (ή φέτα) και τις ελιές Καλαμών.",
      "Περιχύνουμε με εξαιρετικό παρθένο ελαιόλαδο και λίγο ξύδι.",
      "Ανακατεύουμε απαλά και σερβίρουμε δροσερή."
    ],
    ingredients: [
      { id: "dsz-pasta", name: "Ζυμαρικά Πέννες ή Φιογκάκια", amount: 300, unit: "g", category: "pantry", posokaneiQuery: "σπαγγέτι" },
      { id: "dsz-tomatoes", name: "Ντοματίνια Βελανίδι", amount: 200, unit: "g", category: "produce", posokaneiQuery: "ντοματίνια" },
      { id: "dsz-cheese", name: "Μοτσαρέλα ή Φέτα", amount: 120, unit: "g", category: "dairy", posokaneiQuery: "φέτα" },
      { id: "dsz-olives", name: "Ελιές Καλαμών", amount: 40, unit: "g", category: "pantry", posokaneiQuery: "ελιές καλαμών" },
      { id: "dsz-oil", name: "Ελαιόλαδο Εξαιρετικό Παρθένο", amount: 25, unit: "ml", category: "pantry", posokaneiQuery: "ελαιόλαδο" }
    ]
  }
];
