/**
 * ═══════════════════════════════════════════════════
 * NIVELLMEDICAL AG — Shared Site Integration
 * nivell-site.js · Version 5.0 · Mai 2026
 * Smart Assistant · KB + AI · Promo-Codes · Navigation
 * ═══════════════════════════════════════════════════
 */

// ── ASSISTANT API ENDPOINT ──
// Set to '/api/chat' (or '/.netlify/functions/chat') when backend is deployed
// When unreachable, the system falls back to the local KB below
const NIVELL_CHAT_API = '/.netlify/functions/chat';
const NIVELL_CHAT_API_TIMEOUT_MS = 8000;

// ── EXPANDED KNOWLEDGE BASE — Smart Fallback ──
// Topics cover: products, prices, clinical indications, treatment workflow,
// patient questions, complications, edge cases. Multilingual (DE primary, EN secondary).
const NIVELLIPSO_KNOWLEDGE = [
 // ═══ PREISE & ANGEBOTE ═══
 { keywords: ['preis','kosten','chf','gebühr','gebuehr','tarif','price','cost','wie teuer','kostet'],
   answer: "Unsere Preise (gültig ab 01.07.2026, exkl. MWSt.):\n\n• Single Arch: CHF 710 – CHF 1'450\n• Dual Arch: CHF 1'100 – CHF 2'200 (Premium)\n• Touch-Up: CHF 470 / CHF 650\n• Retainer: ab CHF 140\n\nMit persönlichem Promo-Code aus dem Honor & Reward Programm zusätzlich vergünstigt. Details: info@nivellipso.com" },
 { keywords: ['promo','rabatt','discount','code','honor','reward','bonus','punkte','st tropez','reise','incentive'],
   answer: "Das nivellipso® Honor & Reward Programm:\n\n• Jeder aktive Nivellipso-Arzt erhält einen persönlichen Promo-Code\n• Discount bis −25% auf Schienen-Bestellungen\n• Brackets mit bis −30% für Nivellipso-Mitglieder\n• Anniversary-Boni und Volume-Rewards\n• Top-Tier: Incentive-Reise (z.B. St. Tropez)\n\nIhr persönlicher Code: info@nivellipso.com anfragen." },
 { keywords: ['loyalität','loyalty','treue','jahresbonus','jahrestreue','10%'],
   answer: "Loyalty-Programm — einfach gehalten:\n\nAb einem Jahr als Nivellipso-Kunde erhalten Sie automatisch 10% Rabatt auf jede Bestellung ab CHF 650. Keine Tier-Pyramiden, keine Punkte. Weitere Aktionen via Newsletter.\n\nLoyalität zahlt sich aus." },

 // ═══ DAS SYSTEM ═══
 { keywords: ['soft','regular','intense','phase','system','three','3-aligner','drei aligner','drei schienen','3-schienen','three-aligner','three-schienen'],
   answer: "Das nivellipso® Three-Schienen-System hat drei Phasen:\n\n• SOFT: Sanfter Behandlungsstart, Gewebeanpassung (Phase 01)\n• REGULAR: Aktive Zahnbewegung, optimale Balance (Phase 02)\n• INTENSE: Finale Stabilisierung, keine Rezidive (Phase 03)\n\nDrei differenzierte Materialien pro Stufe (Wandstärken 0,75/0,85/1,0 mm). Biomechanisch überlegen, klinisch validiert." },
 { keywords: ['material','pet-g','pet g','kunststoff','biokompatibel','wandstärke','wandstaerke','stärke','staerke','0.75','0.85','1.0'],
   answer: "Material:\n\n• Biokompatibles PET-G (medizinisch zugelassen)\n• Drei Wandstärken pro Stufe: 0,75 mm · 0,85 mm · 1,0 mm\n• Klar, geruchsneutral, BPA-frei\n• Hergestellt in der Schweiz\n• Vollständige Rückverfolgbarkeit jeder Charge\n\nMaterialwahl erfolgt phasenbasiert für optimale Kraft-Komfort-Balance." },
 { keywords: ['single','einzel','einfach','simple','einfache fälle','einfache faelle'],
   answer: "Single-Schiene für einfache Fälle:\n\nFür leichte Korrekturen, finale Feineinstellungen oder Touch-Ups nach Rezidiven steht unser Single-Schienen-System zur Verfügung. Auf Anfrage planbar.\n\nKlinische Empfehlung für Standardfälle bleibt das Three-Schienen-System wegen der überlegenen Biomechanik." },

 // ═══ INDIKATIONEN ═══
 { keywords: ['indikation','wann','geeignet','wofür','wofuer','indication','case selection','fallselektion'],
   answer: "Indikationen für nivellipso® Schienen:\n\n• Leichter bis mittelschwerer Engstand (Crowding)\n• Lückenschluss (Spacing)\n• Klasse-I-Korrekturen\n• Tiefbiss-Reduktion bis moderate Grade\n• Post-orthodontische Retention\n• Ästhetische Frontzahnkorrekturen\n\nGrenzen: ausgeprägte skelettale Diskrepanzen, schwere Klasse II/III Fälle — hier empfiehlt sich Brackets oder kombinierte Therapie." },
 { keywords: ['klasse i','klasse 1','class i','class 1'],
   answer: "Klasse-I-Fälle:\n\nDas Three-Schienen-System ist ideal für Klasse-I-Korrekturen — Engstand, Spacing, leichte Rotationen, Niveauausgleich. Vorhersehbare Ergebnisse mit klinisch validierter Biomechanik." },
 { keywords: ['klasse ii','klasse 2','class ii','overjet','distalbiss'],
   answer: "Klasse-II-Fälle:\n\nLeichte bis moderate Klasse-II-Korrekturen sind mit nivellipso® machbar (mit Attachments, ggf. Elastics). Bei ausgeprägter skelettaler Klasse II empfehlen wir Brackets-Therapie oder Kombinationsbehandlung.\n\nWir beraten Sie gerne im Einzelfall: info@nivellipso.com" },
 { keywords: ['klasse iii','klasse 3','class iii','mesialbiss','progenie'],
   answer: "Klasse-III-Fälle:\n\nLeichte dentoalveoläre Klasse-III-Korrekturen sind aligner-basiert möglich. Bei skelettaler Klasse III ist eine chirurgisch-kombinierte Behandlung oft erforderlich.\n\nIndividuelle Falleinschätzung gerne via info@nivellipso.com" },
 { keywords: ['engstand','crowding','platzmangel'],
   answer: "Engstand (Crowding):\n\nLeichter bis mittelschwerer Engstand (bis ~5 mm pro Kiefer) ist ein klassischer Schienen-Fall. Bei ausgeprägtem Engstand >5 mm kann eine IPR (interproximale Reduktion) oder Extraktion erforderlich werden — wird im Treatment-Plan vorgeschlagen." },
 { keywords: ['lücke','luecke','spacing','spalt','diastema','lückenschluss','lueckenschluss'],
   answer: "Lückenschluss (Spacing/Diastema):\n\nKlassische Indikation für nivellipso® Schienen. Diastema mediale oder generelles Spacing lassen sich vorhersehbar schließen. Attachments unterstützen die Bewegung bei Bedarf." },
 { keywords: ['tiefbiss','deep bite','deepbite','overbite'],
   answer: "Tiefbiss (Deep Bite):\n\nLeichte bis mittlere Tiefbisse lassen sich aligner-basiert reduzieren (Bite Ramps, Intrusion der Frontzähne). Schwere Tiefbisse mit skelettaler Komponente erfordern oft kombinierte Therapie." },
 { keywords: ['kreuzbiss','crossbite','seitlicher kreuzbiss','frontaler kreuzbiss'],
   answer: "Kreuzbiss (Crossbite):\n\nDentoalveolärer Kreuzbiss ist mit nivellipso® korrigierbar — die Schiene expandiert in der gewünschten Ebene. Bei skelettalem Kreuzbiss ist evtl. eine Gaumennahterweiterung vorab nötig.\n\nDetails im individuellen Treatment-Plan." },
 { keywords: ['offener biss','open bite','frontoffener'],
   answer: "Offener Biss:\n\nDentaler offener Biss ist eine anspruchsvolle, aber machbare Indikation — durch Extrusion der Frontzähne und/oder Intrusion der Seitenzähne. Erfolgsfaktoren: Compliance + Habit-Kontrolle (Zungenposition).\n\nKlinische Beratung gerne via info@nivellipso.com" },

 // ═══ ATTACHMENTS & TOOLS ═══
 { keywords: ['attachment','attachments','bonding','komposit'],
   answer: "Attachments (Komposit-Aufbauten):\n\nWerden bei komplexeren Bewegungen am Zahn angeklebt — geben der Schiene Griffflächen für rotationen, Extrusionen, distalisationen.\n\n• Material: Standard Komposit (lichthärtend)\n• Form/Position: im Treatment-Plan exakt spezifiziert\n• Klebetemplate wird mitgeliefert\n• Entfernung am Ende der Behandlung: schmerzfrei, ohne Schmelzschaden" },
 { keywords: ['ipr','interproximal','interproximale reduktion','strip','schmelzreduktion'],
   answer: "IPR (Interproximale Reduktion):\n\nBei Engstand >3 mm pro Kiefer wird im Treatment-Plan IPR vorgeschlagen — Streifen oder Bohrer reduzieren minimal interproximalen Schmelz (0,2–0,5 mm pro Kontakt).\n\nSicher bei korrekter Anwendung. Plan zeigt: welche Zähne, welche Stufe, wie viel mm." },
 { keywords: ['elastic','gummiband','klasse ii elastics','intermaxillär','rubber band'],
   answer: "Elastics (Gummizüge):\n\nFür Klasse-II/III-Korrekturen, Mittellinien-Korrekturen oder vertikale Komponenten werden intermaxilläre Elastics eingesetzt. Patient klipst sie an Schienen-Buttons oder Attachments.\n\nCompliance-relevant — VISIBAL hilft beim Tracking." },

 // ═══ BEHANDLUNGSDAUER & WORKFLOW ═══
 { keywords: ['dauer','wie lange behandlung','behandlungsdauer','wie viele monate','monate','duration'],
   answer: "Behandlungsdauer (Richtwerte):\n\n• Einfache Fälle (bis 7 Stufen): 3–4 Monate\n• Mittel (8–14 Stufen): 4–7 Monate\n• Komplex (15–21 Stufen): 7–11 Monate\n• Unlimited (bis 36 Stufen): 9–18 Monate\n\nStufenwechsel typisch alle 2 Wochen. Schnellerer Wechsel (7–10 Tage) bei guter Compliance möglich." },
 { keywords: ['wechsel','stufenwechsel','wann wechseln','wie oft wechseln'],
   answer: "Stufenwechsel:\n\nStandard: alle 14 Tage neue Schiene einsetzen. Bei guter Compliance (22+h Tragezeit, kein Druckgefühl mehr) ist Wechsel nach 10 Tagen möglich.\n\nNicht früher wechseln — die Zähne brauchen Zeit für die biomechanische Antwort." },
 { keywords: ['lieferzeit','liefer','versand','wann fertig','dauer fertigung','delivery'],
   answer: "Lieferzeiten:\n\n• Treatment-Plan: 3 Werktage nach Scan-Eingang\n• Schienen Standard: 14 Werktage (CH/FL)\n• Frei Haus ab CHF 600 Bestellwert\n\nDirektversand ab Manufaktur." },
 { keywords: ['scan','intraoral','itero','trios','3shape','impression','abdruck','stl','ply'],
   answer: "Digitaler Scan / Abdruck:\n\nWir akzeptieren STL- oder PLY-Dateien aus allen gängigen Intraoral-Scannern: iTero, TRIOS, Primescan, Medit, etc.\n\nKein Scanner? Silikonabdrücke werden eingescannt (Aufpreis). Empfohlen sind aber digitale Scans — präziser, schneller, hygienischer." },
 { keywords: ['clincheck','treatment plan','behandlungsplan','planung','plan freigeben'],
   answer: "ClinCheck-Workflow:\n\n1. Scan hochladen über Doctor Portal\n2. Wir erstellen digitalen Treatment-Plan in 3 WT\n3. Sie reviewen 3D-Animation, Bewegungen, Stufen, IPR, Attachments\n4. Anpassungen möglich — kostenlose Iteration\n5. Freigabe → Produktion startet\n\nDie Verantwortung für den Plan bleibt klinisch beim behandelnden Arzt." },

 // ═══ ZIELGRUPPE ═══
 { keywords: ['erwachsene','adult','alter','grenze','wie alt'],
   answer: "Erwachsenenbehandlung:\n\nKeine obere Altersgrenze. Schienenbehandlung funktioniert bei gesundem Parodont und gutem Knochenangebot in jedem Alter. Bei Patienten 50+ achten wir auf langsame Bewegungsraten und parodontale Kontrolle." },
 { keywords: ['kind','teen','jugend','teenager','kinder','child','jung'],
   answer: "Kinder & Teens:\n\nAb spätem Wechselgebiss (~12 Jahre) und vollständigem Durchbruch der bleibenden Frontzähne möglich. Wichtig: Compliance ist altersabhängig — VISIBAL-Tracking unterstützt.\n\nBei jüngeren Patienten oft besser: Frühbehandlung mit klassischer Apparatur." },

 // ═══ PATIENTENFRAGEN ═══
 { keywords: ['22h','22 stunden','tragezeit','tragen','wear','stunden','wie lange tragen'],
   answer: "22-Stunden-Regel:\n\nSchiene muss mindestens 22h/Tag getragen werden. Unter 20h verliert sie biomechanische Wirksamkeit — Zähne bewegen sich nicht mehr, Behandlung verzögert sich oder stoppt.\n\nNur zum Essen, Trinken (außer Wasser) und Zähneputzen herausnehmen. VISIBAL trackt automatisch." },
 { keywords: ['schmerz','druck','weh','tut weh','unangenehm','pain','pressure','sore'],
   answer: "Druckgefühl & Schmerzen:\n\nIn den ersten 2–3 Tagen nach Stufenwechsel ist Druck normal und gewünscht — er zeigt aktive Zahnbewegung. Besonders in REGULAR-Phase.\n\nBei starken Schmerzen, Schleimhautverletzungen, Bisswunden oder unerwarteten Symptomen: direkten Kontakt mit Ihrer Praxis aufnehmen." },
 { keywords: ['essen','trinken','kaffee','rotwein','tee','food','drink'],
   answer: "Essen & Trinken mit Schienen:\n\n• Essen: Schiene IMMER herausnehmen\n• Wasser: OK mit Schiene\n• Kaffee, Tee, Wein, Säfte: NUR ohne Schiene — sonst Verfärbung\n• Vor dem Wiedereinsetzen: Zähne putzen oder mindestens spülen\n• Heißgetränke: nicht mit Schiene — verformt das PET-G" },
 { keywords: ['reinigen','putzen','hygiene','schiene reinigen','schiene putzen','clean','aligner cleaning'],
   answer: "Schiene reinigen:\n\n• Täglich: Zahnbürste + lauwarmes Wasser (nicht heiß!)\n• Wöchentlich: Reinigungstabletten (z.B. Corega, Retainer Brite) oder mildes Spülmittel\n• Niemals: Mundwasser mit Alkohol, Bleichmittel, Backpulver — beschädigen das Material\n• Aufbewahrung außerhalb des Mundes: in der Aufbewahrungsbox, nicht in Servietten (vergessen Sie sonst!)" },
 { keywords: ['lispeln','sprechen','spreche','speech','aussprache'],
   answer: "Lispeln in den ersten Tagen:\n\nNormal in den ersten 3–7 Tagen — Zunge muss sich an die ~1 mm dickere Schiene gewöhnen. Nach kurzer Zeit verschwindet das Lispeln vollständig.\n\nTipp: laut vorlesen oder zählen — beschleunigt die Anpassung." },
 { keywords: ['verloren','lost','vergessen','versehentlich','accident'],
   answer: "Schiene verloren:\n\n1. Sofort die nächste Stufe einsetzen (falls bereits zugesendet)\n2. Wenn nicht: vorherige Stufe wieder tragen → keine Rückwärtsbewegung\n3. Praxis kontaktieren — Nachproduktion oft binnen 5 WT möglich (CHF nach Aufwand)\n4. Verlust dokumentieren in VISIBAL → automatisches Re-Order möglich" },
 { keywords: ['bricht','gebrochen','riss','beschädigt','broken','crack'],
   answer: "Schiene gebrochen:\n\nNicht weitertragen — scharfe Kanten können Schleimhaut verletzen.\n\n1. Vorherige Stufe einsetzen (oder Retainer)\n2. Praxis kontaktieren mit Foto der Bruchstelle\n3. Nachproduktion erfolgt kostenlos im Garantierahmen (24 Monate), bei Anwendungsfehler Aufpreis\n\nHäufige Ursache: Schiene in heißem Wasser, mechanische Belastung durch Knirschen — Schienenschutz prüfen." },
 { keywords: ['sport','schwimmen','training','swim','contact sport'],
   answer: "Sport mit Schienen:\n\n• Schwimmen, Joggen, Yoga, Krafttraining: Schiene drin lassen — schützt sogar leicht\n• Kontaktsport (Boxen, Hockey, MMA): Schiene raus, Mundschutz nutzen\n• Tauchen: Schiene drin OK, aber Druckausgleich beachten\n\nSchwitzen ist kein Problem — die Schiene verträgt das." },
 { keywords: ['schlafen','nachts','snore','grind','knirschen','bruxismus'],
   answer: "Nachts & Knirschen (Bruxismus):\n\nSchlafen mit Schiene ist Pflicht — die meiste Tragezeit fällt in die Nacht.\n\nKnirscher zerstören Schienen schneller — wir empfehlen während aktiver Behandlung KEINEN separaten Aufbissbehelf (die Schiene übernimmt die Funktion). Nach der Behandlung: separater Knirschschutz." },
 { keywords: ['rauchen','smoking','tabak','vape'],
   answer: "Rauchen mit Schienen:\n\nGrundsätzlich möglich, aber:\n• Verfärbung der Schiene (besonders bei Zigaretten)\n• Tipp: vor dem Rauchen Schiene raus, danach Zähne spülen\n• E-Zigaretten/Vape: weniger Verfärbung, aber gleiches Verfahren\n\nLangfristig ist Rauchstopp ohnehin gut für Parodont und Behandlungserfolg." },
 { keywords: ['schwanger','pregnant','stillen','baby'],
   answer: "Schwangerschaft & Stillzeit:\n\nSchienenbehandlung ist generell möglich. Wichtig:\n• Materialien sind biokompatibel\n• Hormonelle Veränderungen können Zahnfleischempfindlichkeit erhöhen\n• Röntgen während Schwangerschaft vermeiden — wir arbeiten ohnehin volldigital\n\nKlinische Entscheidung im Einzelfall mit Ihrer Praxis." },

 // ═══ BRACKETS ═══
 { keywords: ['bracket','metall','keramik','selbstligierend','self-lig','self lig'],
   answer: "nivellipso® Bracket-Linie:\n\n• Metall (MIM, 022\" Slot Roth/MBT): CHF 2.40/Stk · Standard\n• Keramik (monokristallin): CHF 7.80/Stk · ästhetisch\n• Selbstligierend (passiv): CHF 9.50/Stk · Premium\n\nNivellipso-Mitglieder: bis −30% Rabatt mit Promo-Code (Member-Pricing: CHF 1.32 / 4.29 / 5.23). Bestellung via Doctor Portal." },
 { keywords: ['bogen','arch','niti','stahl','tma'],
   answer: "Bögen & Drahttherapie:\n\n• NiTi rund: CHF 3.20/Stk · superelastisch, initial\n• NiTi rechteckig: CHF 4.10/Stk · Arbeitsphase\n• Stahl rund: CHF 1.80/Stk · stabilisierend\n• Stahl rechteckig: CHF 2.40/Stk · Finishing\n• TMA: CHF 5.60/Stk · controlled deflection\n\nMember-Pricing für Nivellipso-Mitglieder. Komplettsortiment im Doctor Portal." },

 // ═══ PROFI-FRAGEN ═══
 { keywords: ['kfo','kieferorthopäde','kieferorthopaede','orthodontist','spezialist'],
   answer: "Für KFO-Ärzte:\n\nDas nivellipso®-System ist von Kieferorthopäden für Kieferorthopäden entwickelt:\n\n• Volle klinische Kontrolle über jeden Schritt\n• Plan-Anpassungen kostenlos\n• Direkte Kommunikation mit unserer KFO-Beratung (nivellipso® Team)\n• Persönlicher Account-Manager statt anonymem Call-Center\n• Sonderkonditionen für High-Volume-Praxen\n\nKennenlern-Termin: info@nivellipso.com" },
 { keywords: ['zahnarzt','dental','allgemeinpraktiker','dentist','gp'],
   answer: "Für Zahnärzte (Allgemeinpraktiker):\n\nEinstieg in die Schienenbehandlung — strukturiert begleitet:\n\n• Onboarding mit klinischer Beratung\n• Fallselektion: wir helfen bei der Einschätzung\n• Treatment-Plan als Diskussionsgrundlage\n• Academy-Materialien (Anleitungen, Webinare)\n• Direktversand, kein Mindestbestellwert\n\nEinstiegsberatung: info@nivellipso.com" },
 { keywords: ['referral','überweisung','ueberweisung','komplex','schwerer fall','complex case'],
   answer: "Komplexe Fälle:\n\nBei skelettalen Diskrepanzen, schweren Klasse II/III, Tiefbiss-Komponenten mit vertikaler Dysplasie oder kombinierten Behandlungen (kieferchirurgisch, parodontal):\n\n• Schiene + Brackets (kombinierte Therapie)\n• Schiene + Mini-Implantate (TADs)\n• Chirurgische Vor- oder Nachbehandlung\n\nSenden Sie uns den Fall zur Einschätzung: info@nivellipso.com" },
 { keywords: ['fortbildung','academy','kurse','webinar','weiterbildung','training'],
   answer: "Academy & Fortbildung:\n\nWir bieten:\n• Online-Webinare zu Indikation, Workflow, klinischen Tipps\n• Praxis-Onboarding für neue Anwender\n• Hands-on Workshops (Limited Editions)\n• Case Reviews mit unseren KFO-Beratern\n• Academy-Bibliothek mit Tutorials und Fall-Vorstellungen\n\nDetails: info@nivellipso.com oder im Doctor Portal" },

 // ═══ VISIBAL ═══
 { keywords: ['visibal','app','tracking','compliance','dashboard'],
   answer: "VISIBAL — die klinische Begleit-Plattform:\n\n• Patient-App: Behandlungsfortschritt, 22h-Tracking, Foto-Doku, Online-Assistent\n• Praxis-Dashboard: Compliance-Monitoring aller Patienten in Echtzeit\n• Monatliches Patient-Mailing in 6 Sprachen\n• Podcast für Patienten\n• Push-Notifications bei Schienenwechsel\n\nBasic gratis für nivellipso®-Kunden. Pro: CHF 89/Monat (multi-doc). Demo: info@nivellipso.com" },

 // ═══ RETAINER ═══
 { keywords: ['retainer','rezidiv','nachbehandlung','retention','nachher','nach behandlung'],
   answer: "Retainer nach der Behandlung:\n\nZähne haben natürliches Rezidiv-Potential. Ohne Retainer können sie zurückwandern.\n\nUnser Angebot:\n• Single Arch Paar: CHF 140\n• Dual Arch Paar: CHF 230\n• 3er-Set (Stabilität): CHF 380 / 620\n\nEmpfehlung: erste 12 Monate nachts tragen, dann lebenslang 2–3×/Woche nachts. Alternative: festsitzender Retainer (Draht hinter Frontzähnen)." },
 { keywords: ['bonded retainer','festsitzender retainer','permanent','draht'],
   answer: "Festsitzender Retainer (Bonded Retainer):\n\nDraht an der Innenseite der Unterkieferfront (3–3 oder 5–5) — klebt mit Komposit fest. Vorteil: keine Compliance nötig. Nachteil: Hygiene-Aufwand (Zahnseide-Knöpfli), gelegentliche Reparatur.\n\nKombination mit nivellipso®-Retainer (nachts) ist die sicherste Rezidiv-Prävention." },

 // ═══ BESONDERE SITUATIONEN ═══
 { keywords: ['weisheitszahn','wisdom','8er'],
   answer: "Weisheitszähne:\n\nVor Schienenbehandlung müssen Weisheitszähne nicht zwingend entfernt werden — entgegen alter Lehrmeinung gibt es keinen kausalen Zusammenhang zu Rezidiv.\n\nWenn aber: Druck auf 7er, Engstand mit Platzmangel, retinierte 8er — Extraktion vor Schienen-Start sinnvoll. Klinische Entscheidung individuell." },
 { keywords: ['implantat','implant','krone','brücke','bridge','crown'],
   answer: "Implantate, Kronen, Brücken:\n\n• Implantate: bewegen sich NICHT — werden im Plan als Anker verwendet, andere Zähne bewegen sich um sie herum\n• Kronen / Veneers: Attachments halten nur eingeschränkt — alternative Verankerung im Plan\n• Brücken: müssen vor Schienenbehandlung evaluiert werden — getrennte Glieder nötig?\n\nDetailbesprechung: info@nivellipso.com" },
 { keywords: ['parodont','parodontitis','knochenabbau','gingivitis'],
   answer: "Parodontalstatus vor Schienenbehandlung:\n\nVoraussetzung: parodontal stabil, kein aktiver Knochenabbau. Bei behandeltem Parodont mit Resttaschen sind langsame Bewegungsraten und engmaschige Kontrolle wichtig.\n\nVor Schienen-Start: gründliche PA-Therapie, Mundhygiene-Coaching, ggf. Erhaltungsphase. Kontraindikation bei aktiver schwerer Parodontitis." },
 { keywords: ['kiefergelenk','tmj','cmd','kg','craniomandibulär'],
   answer: "Kiefergelenk (TMJ/CMD):\n\nSchienen können bei CMD-Patienten zu Verbesserung beitragen (Bisslage stabilisiert), aber auch zu vorübergehender Verschlechterung führen (Adaptionsphase).\n\nBei symptomatischer CMD: vor Schienen-Start CMD-Therapie, ggf. Aufbiss-Schiene zur Bisslagebestimmung. Plan dann auf stabilisierte Position." },

 // ═══ KONTAKT / SERVICE ═══
 { keywords: ['demo','beratung','termin','visite','kennenlernen','appointment','meeting','call'],
   answer: "Demo & Beratung:\n\n• Wir kommen persönlich in Ihre Praxis (Schweiz, kostenfrei)\n• 30-Minuten Online-Beratung via Doctor Portal\n• VISIBAL-Demo: 5 Pilot-Praxen aktiv, kostenlos testen\n\nAnfrage: info@nivellipso.com · +41 79 469 71 76" },
 { keywords: ['swiss','schweiz','schweizer','made in','herkunft','herstellung','manufaktur'],
   answer: "Made in Switzerland:\n\n• Produktion 100% in der Schweiz seit 2015\n• PET-G biokompatibel, drei Wandstärken\n• Vollständige Rückverfolgbarkeit jeder Charge\n• Swiss Klinische Planung · Swiss Precision\n• Direktversand ab Manufaktur, kein Zwischenhändler" },
 { keywords: ['portal','doctor portal','bestellung','order','einloggen','login','konto'],
   answer: "Doctor Portal:\n\nBestellungen, Treatment-Pläne und Tracking laufen über nivellonlign.com:\n\n• STL/PLY Scans hochladen\n• Treatment-Plan reviewen und freigeben\n• Brackets, Bögen, Zubehör direkt bestellen\n• Bestellhistorie & Tracking\n• Persönlicher Promo-Code hinterlegt\n\nZugang anfragen: info@nivellipso.com" },
 { keywords: ['kontakt','erreich','anruf','mail','contact','wie erreich','telefon'],
   answer: "So erreichen Sie uns:\n\n• Klinische Beratung & Planung: nivellipso® Team\n  info@nivellipso.com\n  +41 79 469 71 76\n\n• WhatsApp: über die Website (grüner Button)\n\n• Online: Doctor Portal nivellonlign.com\n\nAntwortzeit typisch unter 4 Stunden während Geschäftszeiten." },
 { keywords: ['garantie','warranty','reklamation','beschwerde','umtausch'],
   answer: "Garantie & Reklamation:\n\n• 24 Monate Garantie auf Schienen und Brackets\n• Bei Materialfehler oder Nichterfüllung der Spezifikation: kostenlose Neuproduktion\n• Vollständiges Rückgaberecht\n• Bei Anwendungsfehler: Nachfertigung gegen Aufpreis\n\nReklamation: info@nivellipso.com mit Fotos und Falldoku — Bearbeitung typisch binnen 48h." }
];

function findAnswer(question) {
 const q = question.toLowerCase();
 let best = null, max = 0;
 for (const topic of NIVELLIPSO_KNOWLEDGE) {
  let score = 0;
  for (const kw of topic.keywords) { if (q.includes(kw)) score += kw.length; }
  if (score > max) { max = score; best = topic; }
 }
 return best ? best.answer : null;
}

// ── AI BACKEND CALL ──
// Tries to reach a backend endpoint that proxies to a real AI model (e.g. Claude API).
// Returns null on any failure → fallback to local KB.
async function tryAIBackend(question, conversationHistory) {
 try {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), NIVELL_CHAT_API_TIMEOUT_MS);
  const res = await fetch(NIVELL_CHAT_API, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({
    message: question,
    history: conversationHistory || []
   }),
   signal: ctrl.signal
  });
  clearTimeout(tid);
  if (!res.ok) return null;
  const data = await res.json();
  return (data && data.reply) ? data.reply.trim() : null;
 } catch (e) {
  // Network error, no backend deployed, timeout, etc. → silent fallback
  return null;
 }
}

// ── CHAT UI ──
let chatOpen = false;
const answeredTopics = new Set();
const chatHistory = []; // for AI context

function toggleNivellChat() {
 chatOpen = !chatOpen;
 const win = document.getElementById('chatWindow');
 const btn = document.getElementById('chatToggle');
 if (!win) return;
 win.classList.toggle('open', chatOpen);
 if (btn) {
  const icon = btn.querySelector('.chat-icon, .c-icon');
  const close = btn.querySelector('.chat-close, .c-close');
  const label = btn.querySelector('.chat-label, .c-label');
  if (icon) icon.style.display = chatOpen ? 'none' : 'block';
  if (close) close.style.display = chatOpen ? 'block' : 'none';
  if (label) label.style.display = chatOpen ? 'none' : 'inline';
 }
}

function addNivellMsg(text, role) {
 const msgs = document.getElementById('chatMessages');
 if (!msgs) return;
 const div = document.createElement('div');
 div.className = role === 'user' ? 'msg msg-user msg-u' : 'msg msg-bot msg-b';
 div.style.whiteSpace = 'pre-wrap';
 div.textContent = text;
 msgs.appendChild(div);
 msgs.scrollTop = msgs.scrollHeight;
}

function showNivellTyping() {
 const msgs = document.getElementById('chatMessages');
 if (!msgs) return;
 const d = document.createElement('div');
 d.id = 'typing';
 d.className = 'typing typing-dots typing-d';
 d.innerHTML = '<span></span><span></span><span></span>';
 msgs.appendChild(d);
 msgs.scrollTop = msgs.scrollHeight;
}

function hideNivellTyping() { const t = document.getElementById('typing'); if (t) t.remove(); }

async function sendNivellChat(systemPrompt) {
 const input = document.getElementById('chatInput');
 if (!input) return;
 const text = input.value.trim();
 if (!text) return;
 input.value = '';
 const suggs = document.getElementById('chatSugg');
 if (suggs) suggs.innerHTML = '';
 addNivellMsg(text, 'user');
 chatHistory.push({ role: 'user', content: text });
 showNivellTyping();

 // 1. Try AI backend first (will return null if no backend deployed)
 const aiReply = await tryAIBackend(text, chatHistory);

 if (aiReply) {
  hideNivellTyping();
  addNivellMsg(aiReply, 'bot');
  chatHistory.push({ role: 'assistant', content: aiReply });
  showFollowUpSuggs();
  return;
 }

 // 2. Fallback: local KB
 const localAnswer = findAnswer(text);
 // Add small natural delay
 await new Promise(r => setTimeout(r, 600 + Math.random() * 500));

 if (localAnswer) {
  hideNivellTyping();
  addNivellMsg(localAnswer, 'bot');
  chatHistory.push({ role: 'assistant', content: localAnswer });
  showFollowUpSuggs();
  return;
 }

 // 3. Final fallback — friendly handoff (language-aware)
 hideNivellTyping();
 const _lang = (function(){try{return localStorage.getItem('nivell_lang')||document.documentElement.lang||'de';}catch(e){return 'de';}})();
 const fallback = _lang.startsWith('en')
  ? "For this specific question I recommend reaching out to our team directly:\n\n• Clinical questions: nivellipso® Team — info@nivellipso.com\n• By phone: +41 79 469 71 76\n\nReplies are quick and personal. I can also help on the following topics: pricing, delivery times, the Three-Schienen-System, VISIBAL, Honor & Reward, or clinical indication questions."
  : "Für diese spezifische Frage empfehle ich den direkten Kontakt mit unserem Team:\n\n• Klinische Fragen: nivellipso® Team — info@nivellipso.com\n• Telefonisch: +41 79 469 71 76\n\nDie Antwort kommt schnell und persönlich. Gerne kann ich Ihnen auch zu folgenden Themen helfen: Preise, Lieferzeiten, das Three-Schienen-System, VISIBAL, Honor & Reward, oder klinische Fragen zu Indikationen.";
 addNivellMsg(fallback, 'bot');
 chatHistory.push({ role: 'assistant', content: fallback });
 showFollowUpSuggs();
}

function sendNivellSugg(btn, systemPrompt) {
 const input = document.getElementById('chatInput');
 if (input) input.value = btn.textContent.trim();
 sendNivellChat(systemPrompt);
}

// ── CHATBOT FOLLOW-UP SUGGESTIONS ──
const FOLLOW_UP_POOL = [
 { label: 'Preise & Kosten', q: 'Was kostet ein Aligner-Set?' },
 { label: 'Three-Schienen-System', q: 'Wie funktioniert das Three-Schienen-System?' },
 { label: 'Lieferzeiten', q: 'Wie lange dauert die Lieferung?' },
 { label: 'Honor & Reward', q: 'Was ist das Honor & Reward Programm?' },
 { label: 'Indikationen', q: 'Für welche Fälle sind Aligners geeignet?' },
 { label: 'Scan einreichen', q: 'Wie reiche ich einen Scan ein?' },
 { label: 'Brackets', q: 'Welche Bracket-Systeme gibt es?' },
 { label: 'Behandlungsdauer', q: 'Wie lange dauert eine Behandlung?' },
 { label: 'VISIBAL App', q: 'Was ist die VISIBAL App?' },
 { label: 'Retainer', q: 'Welche Retainer-Optionen gibt es?' },
 { label: 'Attachments', q: 'Wann braucht man Attachments?' },
 { label: 'Whitening', q: 'Gibt es ein Whitening-Angebot?' },
 { label: 'Doctor Portal', q: 'Wie bestelle ich im Doctor Portal?' },
 { label: 'Material & Qualität', q: 'Aus welchem Material sind die Schienen?' },
 { label: 'Klasse II', q: 'Kann ich Klasse-II-Fälle behandeln?' },
 { label: 'Klasse III', q: 'Wie sieht es mit Klasse-III-Fällen aus?' },
 { label: 'IPR', q: 'Wann ist eine IPR notwendig?' },
 { label: 'Loyalty', q: 'Wie funktioniert das Loyalty-Programm?' },
 { label: 'Express-Versand', q: 'Gibt es Express-Lieferung?' },
 { label: 'Kinderfälle', q: 'Ab welchem Alter sind Aligners möglich?' },
];

function showFollowUpSuggs() {
 const suggs = document.getElementById('chatSugg');
 if (!suggs) return;
 // Mark recently asked topics as answered
 chatHistory.forEach(msg => {
  if (msg.role === 'user') answeredTopics.add(msg.content.toLowerCase().slice(0,40));
 });
 // Get 3 unanswered suggestions
 const available = FOLLOW_UP_POOL.filter(s => !answeredTopics.has(s.q.toLowerCase().slice(0,40)));
 const picks = available.slice(0, 3);
 if (picks.length === 0) return;
 suggs.innerHTML = '';
 picks.forEach(function(s) {
  const btn = document.createElement('button');
  btn.className = 'sugg';
  btn.textContent = s.label;
  btn.onclick = function() {
   answeredTopics.add(s.q.toLowerCase().slice(0,40));
   const input = document.getElementById('chatInput');
   if (input) input.value = s.q;
   sendNivellChat();
  };
  suggs.appendChild(btn);
 });
 suggs.style.display = '';
}

// ── PROMO CODE SYSTEM ──
function activatePromoCode(code) {
 if (!code || code.length < 4) return false;
 localStorage.setItem('nivell_promo', code.toUpperCase());
 localStorage.setItem('nivell_promo_active', '1');
 showPromoUI(code);
 return true;
}

function showPromoUI(code) {
 const banner = document.getElementById('promoBanner');
 if (banner) {
  banner.innerHTML = '✓ Promo-Code <strong>' + code + '</strong> aktiv · Persönliche Konditionen werden angezeigt';
  banner.style.display = 'block';
 }
}

function getActivePromo() {
 return localStorage.getItem('nivell_promo_active') === '1' ? localStorage.getItem('nivell_promo') : null;
}

function checkUrlPromo() {
 const params = new URLSearchParams(window.location.search);
 const code = params.get('promo');
 if (code) activatePromoCode(code);
 else {
  const active = getActivePromo();
  if (active) showPromoUI(active);
 }
}

// ── INIT ON LOAD ──
document.addEventListener('DOMContentLoaded', () => {
 checkUrlPromo();
 // Mobile nav toggle if exists
 const mn = document.getElementById('mobileNav');
 if (mn) {
  document.querySelectorAll('.mobile-nav-trigger').forEach(t => {
   t.addEventListener('click', () => mn.classList.toggle('open'));
  });
 }
});

// ── LANGUAGE SWITCHER ──
// Called from index.html with translations object T and target language code.
// Updates all elements with [data-i18n] attribute using the dictionary.
function setNivellLang(lang, translations) {
 if (!translations || !translations[lang]) {
  console.warn('Translations not available for language:', lang);
  return;
 }
 const dict = translations[lang];
 // Persist preference
 try { localStorage.setItem('nivell_lang', lang); } catch (e) {}
 // Update document language attribute (for accessibility + SEO)
 document.documentElement.setAttribute('lang', lang);
 // Apply translations to all [data-i18n] elements
 document.querySelectorAll('[data-i18n]').forEach(el => {
  const key = el.getAttribute('data-i18n');
  if (!dict[key]) return;
  const value = dict[key];
  // Keys containing HTML markup (br, em) → use innerHTML
  // Detection: value contains < or known HTML chars
  if (/<[a-z]/i.test(value) || /&[a-z]+;/i.test(value)) {
   el.innerHTML = value;
  } else {
   // For placeholder attributes (input[placeholder]) handle separately
   if (el.tagName === 'INPUT' && el.type !== 'button' && el.type !== 'submit') {
    el.setAttribute('placeholder', value);
   } else {
    el.textContent = value;
   }
  }
 });
 // Update meta description if a localised version is available  
 // (optional — can be added per-language later)
}

// Expose globally for inline onclick handlers
window.setNivellLang = setNivellLang;

// ── SCROLL ANIMATIONS ──
// Fades in elements with .n-fade as they scroll into view
function initScrollAnimations() {
 // Skip if user prefers reduced motion
 if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.n-fade').forEach(el => el.classList.add('visible'));
  return;
 }
 if (!('IntersectionObserver' in window)) {
  // Fallback: just show everything
  document.querySelectorAll('.n-fade').forEach(el => el.classList.add('visible'));
  return;
 }
 const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
   if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
   }
  });
 }, {
  threshold: 0.05,
  rootMargin: '0px 0px 50px 0px'
 });
 // Reveal-on-scroll (covers any observer miss). NOT wrapped in requestAnimationFrame,
 // because rAF is throttled/never fires in backgrounded or non-painting tabs — which
 // would otherwise leave whole sections blank (e.g. the roadmap).
 const revealInView = () => {
  document.querySelectorAll('.n-fade:not(.visible)').forEach(el => {
   const rect = el.getBoundingClientRect();
   if (rect.top < window.innerHeight + 80 && rect.bottom > -80) el.classList.add('visible');
  });
 };
 window.addEventListener('scroll', revealInView, { passive: true });
 window.addEventListener('resize', revealInView, { passive: true });
 revealInView();
 setTimeout(revealInView, 300);
 // Hard guarantee, independent of rAF: nothing ever stays invisible.
 setTimeout(() => document.querySelectorAll('.n-fade:not(.visible)').forEach(el => el.classList.add('visible')), 1500);
 // Wire up the observer for the nice in-view fade animation when the page is actually painting.
 requestAnimationFrame(() => {
  document.querySelectorAll('.n-fade:not(.visible)').forEach(el => observer.observe(el));
 });
}
window.initScrollAnimations = initScrollAnimations;

// ── ACTIVE NAV HIGHLIGHTING ──
// Highlights the current page in the navigation
function setActiveNav() {
 const path = window.location.pathname.split('/').pop() || 'index.html';
 const navLinks = document.querySelectorAll('.n-nav-inner a[href], nav a[href]');
 navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
  const linkPath = href.split('/').pop().split('#')[0] || 'index.html';
  if (linkPath === path) {
   // Add subtle active styling
   link.style.color = 'var(--red)';
   link.style.fontWeight = '700';
  }
 });
}
window.setActiveNav = setActiveNav;

// Restore saved language from localStorage on page load (so EN/DE persists across pages)
// Falls back to 'de' if no preference saved (German is the site default)
function restoreNivellLang() {
 try {
  const saved = localStorage.getItem('nivell_lang');
  const lang = (saved && window.T && window.T[saved]) ? saved : 'de';
  if (window.T && window.T[lang]) {
   setNivellLang(lang, window.T);
   const opt = document.querySelector('.lang-opt[data-lang="'+lang+'"]');
   if (opt) updateLangUI(lang, opt);
  }
 } catch (e) {}
}
window.restoreNivellLang = restoreNivellLang;

// Auto-init on DOMContentLoaded
if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', () => { initScrollAnimations(); setActiveNav(); restoreNivellLang(); });
} else {
 initScrollAnimations();
 setActiveNav();
 restoreNivellLang();
}

// ── LANGUAGE UI UPDATE ──
// Updates the flag/code display in the lang switcher UI
function updateLangUI(lang, clickedEl) {
 const codeEl = document.getElementById('lCode');
 if (codeEl) codeEl.textContent = lang.toUpperCase();
 document.querySelectorAll('.lang-opt').forEach(el => el.classList.remove('active'));
 if (clickedEl) clickedEl.classList.add('active');
}
window.updateLangUI = updateLangUI;

// ── SCROLL-HIDE NAV (hysteresis) ──
(function(){
  var nav = document.querySelector('.n-nav, nav.n-nav, nav[class*="n-nav"]') || document.querySelector('nav');
  var lastY = 0;
  if (!nav) return;
  nav.classList.add('n-nav'); // ensure class exists for hdr-hide to work
  window.addEventListener('scroll', function(){
    var y = window.pageYOffset;
    if (y <= 0) { nav.classList.remove('hdr-hide'); lastY = 0; return; }
    if (y < lastY - 8) { nav.classList.remove('hdr-hide'); }
    else if (y > lastY + 5 && y > 80) { nav.classList.add('hdr-hide'); }
    lastY = y;
  }, { passive: true });
})();


// ── LANGUAGE DROPDOWN: click/tap toggle ──
// Hover alone is unreliable (gap to menu breaks it on desktop; no hover on touch).
document.addEventListener('click', function (e) {
  var lb = e.target.closest('.lang-btn');
  if (lb) {
    if (e.target.closest('.lang-opt')) lb.classList.remove('open'); // language chosen → close
    else lb.classList.toggle('open');                               // toggled the button
  } else {
    document.querySelectorAll('.lang-btn.open').forEach(function (x) { x.classList.remove('open'); });
  }
});

// ── MOBILE NAV TOGGLE ──
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburger');
  if (!menu) return;
  const open = menu.classList.toggle('open');
  if (btn) { btn.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); }
}
window.toggleMenu = toggleMenu;

// ── FAQ TOGGLE ──
function toggleNivellFaq(btn) {
  const item = btn.closest('.n-faq-item');
  if (!item) return;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.n-faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}
window.toggleNivellFaq = toggleNivellFaq;

// ── NAV DROPDOWN (JS-controlled with close delay) ──
(function() {
  var timers = new Map();
  function initDropdowns() {
    document.querySelectorAll('.n-dropdown').forEach(function(dd) {
      dd.addEventListener('mouseenter', function() {
        clearTimeout(timers.get(dd));
        dd.classList.add('open');
      });
      dd.addEventListener('mouseleave', function() {
        var t = setTimeout(function() { dd.classList.remove('open'); }, 200);
        timers.set(dd, t);
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDropdowns);
  } else {
    initDropdowns();
  }
})();
