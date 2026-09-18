# nivellipso.com — Fix-Paket (Mobile + Chat-AI)

Dieser Ordner ist der **vollständige, aktuelle Live-Stand von nivellipso.com** (am 01.06.2026 direkt von der Live-Seite gespiegelt) **plus alle Fixes**. Per Netlify-Drag&Drop deploybar.

---

## Was wurde geändert

| # | Problem | Fix | Dateien |
|---|---------|-----|---------|
| 1 | Chat-Button überdeckt auf Mobile Inhalte (Position/Funktion) | Button wird auf Mobile zum **kompakten runden Icon** statt breitem Balken | `index.html`, `nivell-design.css` |
| 2 | VISIBAL-Seite: horizontaler Overflow (Inhalt rechts abgeschnitten) | Inline-Grids (`Mailing` + `Clinic-Stats`) **kollabieren jetzt sauber** auf Mobile | `visibal.html` |
| 3 | Roadmap „Von der Vision…" erschien **leer** | Einblende-Logik abgesichert: garantiert sichtbar, **unabhängig von `requestAnimationFrame`** (das in Hintergrund-Tabs einfror) | `nivell-site.js`, `index.html` |
| 4 | Stock-Fotos fremder Personen (Fake-Instagram-Grid) | 3 Personen-/Defekt-Bilder durch **Marken-Kacheln** ersetzt (Swiss Made / Digitaler Workflow / nivellipso®). Klinik + Matterhorn (keine Personen) bleiben. | `index.html` |
| 5 | Doctor-Portal-Routing | Bereits korrekt auf **https://nivellonlign.com/** (alle 22 Links geprüft) — keine Änderung nötig | — |
| 6 | **Kein echtes AI** im Chat | **Sichere Netlify-Function** `netlify/functions/chat.mjs` als Anthropic-Proxy (echte KI mit Ortho-Wissen). **→ braucht 1× deinen API-Key, siehe unten.** | `netlify/functions/chat.mjs` |

---

## Deploy in 2 Schritten

### Schritt 1 — Hochladen (Drag & Drop)
1. Netlify öffnen → deine nivellipso-Site → Tab **„Deploys"**.
2. **Diesen ganzen Ordner** (`nivellipso-LIVE-fix`) in die Drag&Drop-Zone ziehen.
   - Die `netlify.toml` + der Ordner `netlify/functions/` sind enthalten → die Chat-Function wird mitdeployt.

### Schritt 2 — API-Key setzen (nur einmal, für den AI-Chat)
1. Netlify → **Site settings → Environment variables → Add a variable**
2. Key: `ANTHROPIC_API_KEY`  ·  Value: dein Anthropic-Key (`sk-ant-…`)
3. Danach **einmal neu deployen** (oder „Clear cache and deploy site"), damit die Function den Key sieht.

**Ohne Key:** Der Chat fällt automatisch sauber auf die bestehende lokale Wissensbasis + Kontakt-Hinweis zurück (kein Fehler sichtbar). Mit Key: echte KI-Antworten zu Ortho-Themen.

> Modell der Function: `claude-haiku-4-5` (schnell & günstig). Für noch bessere Antworten in `netlify/functions/chat.mjs` auf `claude-sonnet-4-6` umstellen (Zeile `MODEL`).

---

## Falls die Function nach Drag&Drop nicht antwortet
Netlify baut Functions auch bei manuellen Deploys — die `chat.mjs` ist bewusst **ohne npm-Abhängigkeiten** geschrieben, damit das klappt. Falls `/.netlify/functions/chat` trotzdem 404 liefert: Site einmal mit **Git oder Netlify CLI** deployen (dann werden Functions garantiert gebaut). Der statische Teil (Punkte 1–5) funktioniert per Drag&Drop in jedem Fall.

---

---

## Runde 2 (zusätzlich enthalten)

| Problem | Fix |
|---------|-----|
| **E-Mail bouncte** (`experte@nivellipso.com` → „Recipient rejected") | Überall (95×) ersetzt durch **`albin.brkic@nivellipso.com`** — in allen Seiten, Chatbot-Wissensbasis und der Chat-Function |
| **Sprach-Dropdown ging nicht** (nur `:hover`, brach am 2px-Spalt ab / kein Touch) | Dropdown jetzt **klickbar** (Klick öffnet, Auswahl schließt, Klick außerhalb schließt) — auf allen Seiten |
| **VISIBAL-Preis falsch beschriftet** | „CHF 89/mo · **Pro Praxis**" → „CHF 89/mo · **pro Patient / Monat**" (DE + EN) |

### ⚠️ Offene Preis-Frage (bitte bestätigen)
Auf der VISIBAL-Seite gibt es WEITER UNTEN eine **Preis-Tabelle** (Plan „Pro", **CHF 89/Monat**) mit dem Feature **„Unbegrenzte Patienten"**. Das passt nicht zu „89 CHF **pro Patient**/Monat". Sag mir das echte Modell, dann ziehe ich die ganze Preis-Sektion sauber nach:
- (a) 89 CHF pro Patient/Monat → dann muss „Unbegrenzte Patienten" raus, oder
- (b) anderes Modell (Staffel? Grundgebühr + pro Patient?).

---

## Runde 3 — Videos &amp; Podcasts eingebaut (academy.html)

- **6 YouTube-Videos** in die Videos-Rubrik — **click-to-load** über `youtube-nocookie.com` (kein YouTube-Cookie/iframe vor dem Klick → DSGVO-konform). Featured: „Invisible Aligners"; Grid: Doctors Portal, esthetic clinics, EVOK3D, + 2 Shorts (4 Tips, Trimlines).
- **2 Podcast-Folgen** in die Podcast-Rubrik mit **HTML5-Audio-Player** (`preload="none"`, lädt erst beim Abspielen): „Strategie gegen die US-Giganten" (Featured) + „Trojanisches Pferd für Zahnarztpraxen". Audios liegen unter `audio/` (~90 MB → Deploy-ZIP ist entsprechend groß).

### ⚠️ Bitte prüfen / bestätigen
- **Podcast-Titel** „Strategie gegen die US-Giganten" / „Trojanisches Pferd für Zahnarztpraxen" klingen nach **interner Strategie** — sollen die wirklich öffentlich? Titel ggf. anpassen, dann ändere ich sie.
- **Statistik-Zahlen** oben (`24+ Videos`, `12× Podcast Episoden`) passen nicht zu real 6 Videos / 2 Folgen. Sag mir, ob ich sie auf die echten Zahlen setzen soll.

---

## Runde 4 — Formulare integriert (academy.html → Ressourcen)

Die 4 entwickelten Dokumente liegen jetzt im Ordner **`dokumente/`** und sind aus der Sektion **„Dokumente & Downloads"** direkt verlinkt (Button **„Öffnen"** → öffnet das Dokument in neuem Tab, je mit DE/FR/IT/EN-Umschalter + Drucken/PDF):
- `dokumente/preisliste-2026.html` (Entwurf — Beträge bestätigen)
- `dokumente/patientenaufklaerung.html` (rechtlich/medizinisch prüfen)
- `dokumente/konformitaetserklaerung.html` (Regulatory-Daten ergänzen)
- `dokumente/praxis-onboarding-kit.html` (fertig)

→ **Dieses ZIP ist das komplette Deployment** (Website-Fixes + AI-Chat-Function + Videos + Podcasts + Formulare). Alles in einem Drag&Drop.

---

## Noch offen (separat, nicht in diesem Paket gefixt)
- **„Shop" im Menü** zeigt auf `href="#"` (toter Link) — Ziel bitte festlegen (Shop-Seite? nivellonlign.com?).
- **Footer-Links** Terms / Datenschutz / Impressum zeigen auf `href="#"` (tote Links) — **DSGVO-relevant**, sollten echte Seiten bekommen.

Beides kann ich im nächsten Durchgang erledigen, sobald die Ziele klar sind.
