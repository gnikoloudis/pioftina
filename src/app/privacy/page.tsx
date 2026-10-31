import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  Lock,
  Mail,
  HardDrive,
  Database,
  Globe,
  FileText,
  Cookie,
  Download,
  Scale,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Info,
  Server,
  UserCheck,
  RefreshCw,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Πολιτική Απορρήτου & Προστασία Δεδομένων — pioftina.gr",
  description:
    "Ενημερωθείτε για την Πολιτική Απορρήτου του pioftina.gr. Πλήρης συμμόρφωση με τον GDPR (ΕΕ 2016/679) & Ν. 4624/2019, αρχιτεκτονική Privacy by Design, τοπική αποθήκευση, μηδενικά διαφημιστικά cookies και προστασία δεδομένων εγγραφής στο newsletter.",
};

export default function PrivacyPolicyPage() {
  const sections = [
    { id: "intro", title: "1. Ταυτότητα & Εισαγωγή", icon: Info },
    { id: "local-first", title: "2. Privacy by Design & Τοπική Αποθήκευση", icon: HardDrive },
    { id: "newsletter", title: "3. Εγγραφή στο Ενημερωτικό Δελτίο (Newsletter)", icon: Mail },
    { id: "posokanei-api", title: "4. Διασύνδεση με e-Καταναλωτή & Proxy Caching", icon: Globe },
    { id: "cookies", title: "5. Πολιτική Cookies & Tracking (Zero Ads)", icon: Cookie },
    { id: "security", title: "6. Ασφάλεια & Τεχνικά Μέτρα (OWASP Grade A+)", icon: Lock },
    { id: "export-portability", title: "7. Φορητότητα Δεδομένων (Save to PC)", icon: Download },
    { id: "gdpr-rights", title: "8. Τα Δικαιώματά σας βάσει GDPR", icon: Scale },
    { id: "contact", title: "9. Επικοινωνία & Υπεύθυνος Επεξεργασίας", icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 select-none group"
            title="Επιστροφή στην αρχική σελίδα του pioftina.gr"
          >
            <div className="size-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-blue-700/20 ring-2 ring-blue-500/20 group-hover:scale-105 transition-transform">
              <span>π</span>
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-foreground font-heading">
                pioftina<span className="text-primary font-black">.gr</span>
              </span>
              <p className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">
                Έξυπνες Αγορές Σούπερ Μάρκετ
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-all hover:scale-102"
          >
            <ArrowLeft className="size-3.5" />
            <span>Επιστροφή στην Εφαρμογή</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:py-12 space-y-10">
        {/* Hero Section */}
        <div className="space-y-4 text-center sm:text-left border-b border-border/70 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
            <ShieldCheck className="size-4" />
            <span>GDPR (Κανονισμός ΕΕ 2016/679) &amp; Νόμος 4624/2019</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
            Πολιτική Απορρήτου &amp; Προστασία Δεδομένων
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
            Στο <strong>pioftina.gr</strong> η προστασία της ιδιωτικότητάς σας δεν είναι απλώς νομική υποχρέωση, 
            αλλά <strong>θεμελιώδης αρχή της αρχιτεκτονικής μας</strong>. Η εφαρμογή έχει σχεδιαστεί με βάση 
            το μοντέλο <em>Privacy by Design</em>: τα γεύματα και οι λίστες σας παραμένουν στη συσκευή σας, 
            δεν απαιτείται εγγραφή λογαριασμού, και δεν χρησιμοποιούμε κανένα διαφημιστικό tracker.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground/80 pt-2">
            <span>📅 Τελευταία Ενημέρωση: <strong>31 Οκτωβρίου 2026</strong></span>
            <span>&bull;</span>
            <span>Έκδοση: <strong>2.1 (Production Architecture)</strong></span>
          </div>
        </div>

        {/* Quick Table of Contents */}
        <nav aria-label="Πίνακας Περιεχομένων" className="p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border/80 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileText className="size-4 text-primary" />
            <span>Πίνακας Περιεχομένων &amp; Γρήγορη Πλοήγηση</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="flex items-center gap-2 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all font-medium"
                >
                  <Icon className="size-3.5 text-primary/80 shrink-0" />
                  <span className="truncate">{sec.title}</span>
                </a>
              );
            })}
          </div>
        </nav>

        {/* Policy Body */}
        <div className="space-y-12 text-sm text-foreground/90 leading-relaxed">
          {/* Section 1: Introduction & Identity */}
          <section id="intro" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5 border-b border-border/60 pb-2">
              <Info className="size-5 text-primary" />
              <span>1. Ταυτότητα Υπηρεσίας &amp; Υπεύθυνος Επεξεργασίας</span>
            </h2>
            <p>
              Η διαδικτυακή πλατφόρμα <strong>pioftina.gr</strong> παρέχει εργαλεία έξυπνου εβδομαδιαίου προγραμματισμού 
              γευμάτων, βελτιστοποίησης μεγεθών συσκευασιών (bulk packaging) και σύγκρισης τιμών καλαθιού αγορών 
              από τα μεγαλύτερα ελληνικά σούπερ μάρκετ, αξιοποιώντας τα ανοικτά δεδομένα του επίσημου Παρατηρητηρίου Τιμών 
              (<strong>e-Καταναλωτής / posokanei.gov.gr</strong> της Γενικής Γραμματείας Εμπορίου).
            </p>
            <p>
              Υπεύθυνος Επεξεργασίας (Data Controller) για τις προαιρετικές υπηρεσίες συλλογής δεδομένων (όπως το newsletter) 
              είναι η ομάδα διαχείρισης του <strong>pioftina.gr</strong>, με ηλεκτρονική διεύθυνση επικοινωνίας 
              για θέματα προστασίας δεδομένων:{" "}
              <a href="mailto:privacy@pioftina.gr" className="text-primary font-semibold underline underline-offset-2">
                privacy@pioftina.gr
              </a>.
            </p>
          </section>

          {/* Section 2: Local-First / Privacy by Design */}
          <section id="local-first" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5 border-b border-border/60 pb-2">
              <HardDrive className="size-5 text-primary" />
              <span>2. Αρχιτεκτονική &quot;Privacy by Design&quot; &amp; Τοπική Αποθήκευση</span>
            </h2>
            <p>
              Όπως περιγράφεται στο τεχνικό διάγραμμα αρχιτεκτονικής του συστήματος (<em>Architecture Tier 3 &amp; Tier 4</em>), 
              το <strong>pioftina.gr</strong> είναι δομημένο με φιλοσοφία <strong>Local-First</strong>:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>Χωρίς Υποχρεωτικό Λογαριασμό</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Για να προγραμματίσετε τα γεύματά σας, να διαχειριστείτε την αποθήκη σας ή να συγκρίνετε τιμές 
                  σούπερ μάρκετ, <strong>δεν απαιτείται δημιουργία λογαριασμού</strong>, ούτε καταχώρηση ονόματος, 
                  τηλεφώνου ή τραπεζικών καρτών.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                  <Database className="size-4 text-blue-500" />
                  <span>Αποθήκευση στο Browser (localStorage)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Τα προγράμματα γευμάτων, τα αποθέματα τροφίμων, τα τικαρισμένα προϊόντα και οι ρυθμίσεις του 
                  νοικοκυριού σας αποθηκεύονται <strong>αποκλειστικά στον φυλλομετρητή σας</strong> (Web Local Storage) 
                  και δεν μεταδίδονται στους διακομιστές μας.
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Μπορείτε να διαγράψετε πλήρως όλα τα αποθηκευμένα δεδομένα του προγράμματός σας ανά πάσα στιγμή, 
              είτε επιλέγοντας &quot;Εκκαθάριση&quot; μέσα από την εφαρμογή, είτε διαγράφοντας τα δεδομένα περιήγησης 
              του browser σας.
            </p>
          </section>

          {/* Section 3: Newsletter */}
          <section id="newsletter" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5 border-b border-border/60 pb-2">
              <Mail className="size-5 text-primary" />
              <span>3. Εγγραφή στο Ενημερωτικό Δελτίο (Newsletter &amp; Email Registration)</span>
            </h2>
            <p>
              Η εφαρμογή παρέχει τη δυνατότητα εθελοντικής εγγραφής στο ηλεκτρονικό ενημερωτικό δελτίο 
              (μέσω του ασφαλούς endpoint <code>/api/newsletter/subscribe</code>), με σκοπό τη λήψη ειδοποιήσεων για:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-muted-foreground">
              <li><strong>Προσφορές &amp; Μειώσεις Τιμών (Deals)</strong>: Εβδομαδιαίες ενημερώσεις για προσφορές στα σούπερ μάρκετ.</li>
              <li><strong>Οικονομικές Συνταγές (Recipes)</strong>: Εποχιακές ελληνικές συνταγές χαμηλού κόστους.</li>
              <li><strong>Συμβουλές Αποταμίευσης (Budget Tips)</strong>: Τεχνικές εξοικονόμησης, meal-prep και bulk buying.</li>
            </ul>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2">
              <h3 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <Shield className="size-3.5 text-primary" />
                <span>Τεχνικά &amp; Νομικά Χαρακτηριστικά Εγγραφής</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div>
                  <strong className="text-foreground">Δεδομένα που συλλέγονται:</strong> Διεύθυνση email, επιλεγμένες θεματικές, ημερομηνία εγγραφής, πηγή φόρμας και User-Agent για λόγους ασφαλείας.
                </div>
                <div>
                  <strong className="text-foreground">Νομική Βάση:</strong> Ρητή και ελεύθερη συγκατάθεση του χρήστη (Άρθρο 6 παρ. 1 περ. α GDPR).
                </div>
                <div>
                  <strong className="text-foreground">Προστασία Rate Limiter:</strong> Μέγιστο 5 αιτήσεις ανά 15 λεπτά ανά IP για αποτροπή bot spamming.
                </div>
                <div>
                  <strong className="text-foreground">Διαγραφή (Unsubscribe):</strong> Δυνατότητα άμεσης διαγραφής ανά πάσα στιγμή με ένα κλικ ή με αίτημα στο <code>privacy@pioftina.gr</code>.
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Τα emails των συνδρομητών <strong>δεν πωλούνται, δεν ενοικιάζονται και δεν κοινοποιούνται ποτέ σε διαφημιστικές εταιρείες ή τρίτους εμπορικούς συνεργάτες</strong>.
            </p>
          </section>

          {/* Section 4: posokanei.gov.gr & Caching */}
          <section id="posokanei-api" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5 border-b border-border/60 pb-2">
              <Globe className="size-5 text-primary" />
              <span>4. Διασύνδεση με το Παρατηρητήριο Τιμών (posokanei.gov.gr) &amp; Proxy Caching</span>
            </h2>
            <p>
              Η εφαρμογή ανακτά δεδομένα τιμών προϊόντων από το επίσημο Παρατηρητήριο Τιμών e-Καταναλωτής 
              (<em>posokanei.gov.gr</em>). Για τη διασφάλιση της ιδιωτικότητας των χρηστών μας:
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <Server className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Server-Side Proxy (Ανωνυμοποίηση Ερωτημάτων):</strong> Οι αναζητήσεις προϊόντων 
                  εκτελούνται μέσω του Next.js API route <code>/api/posokanei/search</code>. Κατά την επικοινωνία με το κυβερνητικό API, 
                  <strong>καμία προσωπική πληροφορία</strong> (όπως IP χρήστη, αναγνωριστικά συσκευής ή ιστορικό) δεν διαβιβάζεται προς το posokanei.gov.gr.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <RefreshCw className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>In-Memory Sliding-Window Caching (10m TTL):</strong> Τα αποτελέσματα τιμών αποθηκεύονται προσωρινά 
                  στη μνήμη του διακομιστή για 10 λεπτά. Αυτό αποτρέπει επαναλαμβανόμενες κλήσεις, προστατεύει τις δημόσιες 
                  υποδομές και αποκλείει τη δυνατότητα ιχνηλάτησης μεμονωμένων χρηστών.
                </span>
              </div>
            </div>
          </section>

          {/* Section 5: Cookies & Tracking Policy */}
          <section id="cookies" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5 border-b border-border/60 pb-2">
              <Cookie className="size-5 text-primary" />
              <span>5. Πολιτική Cookies &amp; Τεχνολογιών Ιχνηλάτησης (Zero Ad-Tracking)</span>
            </h2>
            <p>
              Το <strong>pioftina.gr</strong> ακολουθεί αυστηρή πολιτική <strong>μηδενικής διαφημιστικής ιχνηλάτησης</strong>:
            </p>
            <div className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Μηδενική Χρήση Cookies Τρίτων &amp; Tracking Pixels</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>ΔΕΝ</strong> χρησιμοποιούμε Google Analytics, Facebook/Meta Pixel, διαφημιστικά cookies, 
                ούτε cookies συμπεριφορικής κατάρτισης προφίλ (behavioral profiling). Η επίσκεψή σας στον ιστότοπο 
                είναι ανώνυμη.
              </p>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground pt-1">
              <h3 className="font-bold text-xs text-foreground">Τεχνικά Απαραίτητα Cookies Συνεδρίας:</h3>
              <p>
                Το μοναδικό cookie που ενδέχεται να τεθεί είναι το <code>pioftina_admin_session</code>, το οποίο 
                αφορά <strong>αποκλειστικά και μόνο εξουσιοδοτημένους διαχειριστές</strong> της εφαρμογής για την πρόσβαση 
                στο Administration Panel. Είναι αυστηρά τεχνικό session cookie (με χαρακτηριστικά <code>HttpOnly</code>, 
                <code>SameSite=Strict</code> και <code>Secure</code>) και δεν αφορά τους απλούς επισκέπτες της υπηρεσίας.
              </p>
            </div>
          </section>

          {/* Section 6: Security & Technical Measures */}
          <section id="security" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5 border-b border-border/60 pb-2">
              <Lock className="size-5 text-primary" />
              <span>6. Ασφάλεια Δεδομένων &amp; Τεχνικά Μέτρα (OWASP Grade A+)</span>
            </h2>
            <p>
              Εφαρμόζουμε σύγχρονα τεχνικά και οργανωτικά μέτρα ασφαλείας, πιστοποιημένα μέσω της αυτοματοποιημένης 
              σουίτας ελέγχου διείσδυσης OWASP ASVS (βαθμολογία ασφαλείας <strong>Grade A+ 98/100</strong>):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                <strong className="text-foreground block font-bold">HTTPS &amp; HSTS</strong>
                <p className="text-muted-foreground">Πλήρης κρυπτογράφηση μεταφοράς δεδομένων με Strict-Transport-Security.</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                <strong className="text-foreground block font-bold">Anti-DoS &amp; Rate Limiter</strong>
                <p className="text-muted-foreground">Sliding-window IP throttling σε όλα τα POST/GET endpoints.</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                <strong className="text-foreground block font-bold">Security Headers</strong>
                <p className="text-muted-foreground">X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy.</p>
              </div>
            </div>
          </section>

          {/* Section 7: Export & Data Portability */}
          <section id="export-portability" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5 border-b border-border/60 pb-2">
              <Download className="size-5 text-primary" />
              <span>7. Φορητότητα Δεδομένων &amp; Τοπική Εξαγωγή (Save to PC)</span>
            </h2>
            <p>
              Σύμφωνα με το <strong>Άρθρο 20 του GDPR (Δικαίωμα στη Φορητότητα Δεδομένων)</strong>, το <strong>pioftina.gr</strong> 
              ενσωματώνει αυτόνομο Export Engine (<em>Architecture Phase 2</em>). Μπορείτε ανά πάσα στιγμή να εξάγετε:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-muted-foreground">
              <li><strong>Εκτυπώσιμο Έγγραφο A4 (Print / PDF)</strong>: Πλήρης διάταξη γευμάτων και λίστα αγορών για αποθήκευση ή εκτύπωση.</li>
              <li><strong>Απλό Κείμενο (.txt)</strong>: Εύκολη αποστολή σε εφαρμογές ανταλλαγής μηνυμάτων ή σημειωματάριο.</li>
              <li><strong>Ψηφιακό Αντίγραφο JSON Backup</strong>: Δομημένο αρχείο με όλες τις συνταγές, τα slots και τα υλικά της εβδομάδας.</li>
            </ul>
            <p className="text-xs text-muted-foreground">
              Όλες οι λειτουργίες εξαγωγής εκτελούνται <strong>100% τοπικά στη συσκευή σας</strong> χωρίς καμία μεταφόρτωση σε εξωτερικό server.
            </p>
          </section>

          {/* Section 8: GDPR Rights */}
          <section id="gdpr-rights" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5 border-b border-border/60 pb-2">
              <Scale className="size-5 text-primary" />
              <span>8. Τα Δικαιώματά σας βάσει του GDPR (Κανονισμός ΕΕ 2016/679)</span>
            </h2>
            <p>
              Ως υποκείμενο των δεδομένων, διατηρείτε πλήρη δικαιώματα βάσει της ευρωπαϊκής και ελληνικής νομοθεσίας:
            </p>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="p-3 rounded-xl bg-card border border-border">
                <strong className="text-foreground">Δικαίωμα Πρόσβασης (Άρθρο 15):</strong> Έχετε το δικαίωμα να ενημερωθείτε αν τηρούμε το email σας στη λίστα συνδρομητών και για ποιους σκοπούς.
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <strong className="text-foreground">Δικαίωμα Διόρθωσης (Άρθρο 16):</strong> Μπορείτε να επικαιροποιήσετε τις θεματικές ενότητες που λαμβάνετε.
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <strong className="text-foreground">Δικαίωμα Διαγραφής / &quot;Δικαίωμα στη Λήθη&quot; (Άρθρο 17):</strong> Μπορείτε να ζητήσετε την άμεση και οριστική διαγραφή του email σας από τη βάση δεδομένων συνδρομητών.
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <strong className="text-foreground">Δικαίωμα Περιορισμού &amp; Εναντίωσης (Άρθρα 18 &amp; 21):</strong> Μπορείτε να αντιταχθείτε στην αποστολή ενημερωτικών επικοινωνιών ανά πάσα στιγμή.
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <strong className="text-foreground">Δικαίωμα Καταγγελίας στην Αρχή:</strong> Εάν θεωρείτε ότι παραβιάζονται τα δικαιώματά σας, έχετε δικαίωμα υποβολής καταγγελίας στην <strong>Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (ΑΠΔΠΧ)</strong>:
                <div className="mt-1 font-mono text-[11px] text-foreground">
                  Κηφισίας 1-3, 115 23 Αθήνα | Τηλ: 210 6475600 | Website:{" "}
                  <a href="https://www.dpa.gr" target="_blank" rel="noopener noreferrer" className="underline text-primary inline-flex items-center gap-0.5">
                    www.dpa.gr <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Section 9: Contact & DPO */}
          <section id="contact" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5 border-b border-border/60 pb-2">
              <UserCheck className="size-5 text-primary" />
              <span>9. Επικοινωνία &amp; Άσκηση Δικαιωμάτων</span>
            </h2>
            <p>
              Για οποιαδήποτε απορία, σχόλιο ή άσκηση των δικαιωμάτων σας σχετικά με την παρούσα Πολιτική Απορρήτου 
              ή για άμεση διαγραφή από το ενημερωτικό δελτίο, μπορείτε να επικοινωνήσετε μαζί μας:
            </p>
            <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                <span className="font-bold text-foreground">Email Υπευθύνου Προστασίας Δεδομένων:</span>
                <a href="mailto:privacy@pioftina.gr" className="text-primary font-bold underline hover:text-primary/80">
                  privacy@pioftina.gr
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="size-4 text-muted-foreground" />
                <span>Ιστότοπος Υπηρεσίας: <strong>https://pioftina.gr</strong></span>
              </div>
              <p className="text-muted-foreground pt-1">
                Απαντάμε σε όλα τα αιτήματα άσκησης δικαιωμάτων εντός των προβλεπόμενων από τον GDPR προθεσμιών 
                (εντός 30 ημερών από την παραλαβή του αιτήματος).
              </p>
            </div>
          </section>
        </div>

        {/* Back to Home CTA Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-tr from-primary/10 via-primary/5 to-muted/20 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-foreground font-heading">
              Έτοιμοι για έξυπνες και οικονομικές αγορές;
            </h3>
            <p className="text-xs text-muted-foreground">
              Σχεδιάστε το εβδομαδιαίο πλάνο γευμάτων και βρείτε το φθηνότερο καλάθι σούπερ μάρκετ χωρίς καμία καταχώρηση προσωπικών δεδομένων.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/20 hover:scale-102 transition-all shrink-0"
          >
            <span>Έναρξη Προγραμματισμού</span>
            <ArrowLeft className="size-3.5 rotate-180" />
          </Link>
        </div>
      </main>

      {/* Universal Privacy Page Footer */}
      <footer className="border-t border-border/80 bg-muted/20 py-8 px-4 text-xs text-muted-foreground text-center space-y-2 mt-auto">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-semibold text-foreground">
            pioftina.gr &bull; Έξυπνες αγορές σούπερ μάρκετ με αυτόματη σύγκριση τιμών καλαθιού
          </p>
          <p className="text-[11px] text-muted-foreground">
            Δεδομένα τιμών από το επίσημο Παρατηρητήριο Τιμών{" "}
            <a href="https://posokanei.gov.gr" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              posokanei.gov.gr
            </a>{" "}
            (Γενική Γραμματεία Εμπορίου).
          </p>
          <div className="flex items-center justify-center gap-3 pt-2 text-[11px]">
            <Link href="/" className="hover:text-foreground underline">
              Αρχική Σελίδα
            </Link>
            <span>&bull;</span>
            <span className="font-bold text-foreground">Πολιτική Απορρήτου (GDPR)</span>
            <span>&bull;</span>
            <a href="mailto:privacy@pioftina.gr" className="hover:text-foreground underline">
              Επικοινωνία
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
