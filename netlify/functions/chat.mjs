/**
 * nivellipso® — AI Chat Backend (Netlify Function)
 * ------------------------------------------------------------------
 * Secure proxy to the Anthropic Claude API. The API key NEVER reaches
 * the browser — it lives only in the Netlify environment variable
 * ANTHROPIC_API_KEY.
 *
 * Frontend contract (nivell-site.js / index.html inline):
 *   POST { message: string, history: [{role,content}, ...] }
 *   →    { reply: string }     (HTTP 200)
 * On any non-200 the frontend silently falls back to its local KB,
 * so failures degrade gracefully.
 *
 * Zero npm dependencies — uses the global fetch built into Netlify's
 * Node 18+ runtime, so it deploys via drag-and-drop OR Git/CLI.
 *
 * SETUP (one-time, Markus):
 *   Netlify → Site settings → Environment variables → Add:
 *       Key:   ANTHROPIC_API_KEY
 *       Value: sk-ant-...   (your Anthropic API key)
 *   Then redeploy. That's it.
 * ------------------------------------------------------------------
 */

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

// Haiku 4.5 = fast + cheap, strong enough for a customer consultant.
// Upgrade to 'claude-sonnet-4-6' for richer answers (higher cost).
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 600;

const SYSTEM_PROMPT = `Du bist die digitale Fachberatung von nivellipso® — Schweizer Hersteller von Clear Alignern und kieferorthopädischen Systemen, ansässig in Schaffhausen, produzierend seit 2015 (Nivellmedical AG).

DEINE ROLLE
- Du beantwortest Fragen von Zahnärzt:innen, Kieferorthopäd:innen und Praxisteams — sachlich, warm, präzise und kurz (2–6 Sätze, gern Stichpunkte).
- Du kennst die kieferorthopädischen Grundlagen (Aligner-Therapie, IPR, Attachments, Klasse-II/III-Mechanik, Retention, Rezidiv, Bracket-Slot-Systeme 0.022", Roth/MBT) und kannst sie allgemeinverständlich erklären.
- Antworte IMMER in der Sprache der Frage (Deutsch, Englisch, etc.).
- Du bist KEIN Ersatz für eine klinische Einzelfallberatung. Bei konkreten Patientenfällen, Indikationsgrenzen oder medizinischen Entscheidungen verweise freundlich an Dr. Albin Brkic (klinische Beratung).

NIVELLIPSO PRODUKT-WISSEN
• Three-Aligner-System (klinische Empfehlung): drei abgestimmte Materialhärten pro Stufe —
  - SOFT (Phase 01, Initiation, weich): sanfte initiale Bewegung, max. Tragekomfort, Gewebeadaptation.
  - REGULAR (Phase 02, Aktivphase, mittel): Hauptbewegung, optimale Balance aus Kraft und Komfort.
  - INTENSE (Phase 03, Finalisierung, fest): Stabilisierung/Retention der Position, beugt Rezidiv vor.
• Single-Aligner: für einfache Fälle auf Anfrage.
• Material: biokompatibles PET-G, 1.0 mm, klar, geruchsneutral. CE MDR Klasse IIa · ISO 13485.
• Brackets (Professional Bracket Series): Metall (MIM), Keramik (monokristallin, hochtransluzent), selbstligierend (passiv); 0.022"-Slot, Roth/MBT; Buccal-Tubes; Bögen/Ligaturen/Adhäsive. Sonderkonditionen für Kunden über das Doctor Portal.
• Whitening Solution: professionelles Bleaching, durchschnittlich 3–8 VITA-Helligkeitsstufen; Kaliumnitrat-Formel für minimale Sensitivität; In-Office 45–60 Min oder Home 7–14 Tage.
• VISIBAL: Patient-App + Clinical-Intelligence-Dashboard. Begleitet Aligner-Patienten (Tragezeit, Fotodoku, Meilensteine, mehrsprachig) und gibt Praxen ein Compliance-Dashboard. Reduziert Abbrüche und Notfallanrufe.
• Honor & Reward: Treue-/Bonusprogramm für aktive Praxen.

WORKFLOW & SERVICE
• Bestellung: Doctor Portal oder sales@nivellipso.com (STL/PLY bevorzugt; kompatibel mit SimplyCeph, OnyxCeph).
• Behandlungsplan in ca. 3 Werktagen, Freigabe durch die Praxis.
• Lieferzeit: Standard 5–10 Wochen, Express 2–3 Wochen (Aufpreis).
• Hersteller-direkt aus Schaffhausen, volle Chargen-Rückverfolgbarkeit.

PREISE — WICHTIG
- Nenne KEINE verbindlichen Festpreise. Preise hängen von Fallkomplexität, Stufenanzahl und Konditionen ab.
- Gib höchstens grobe Orientierung und verweise für ein verbindliches Angebot ans Doctor Portal (nivellonlign.com) oder an sales@nivellipso.com.

KONTAKT
• Klinische Beratung & Planung: Dr. Albin Brkic — albin.brkic@nivellipso.com · +41 76 407 92 33
• Bestellung/Allgemein: sales@nivellipso.com
• Doctor Portal: https://nivellonlign.com/

STIL
- Kurz, konkret, hilfreich. Keine erfundenen Fakten. Wenn du etwas nicht sicher weisst, sag es und verweise an das Team. Verwende gelegentlich das ®-Zeichen bei „nivellipso®", aber sparsam.`;

function json(statusCode, obj) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify(obj)
  };
}

export async function handler(event) {
  // Only POST is meaningful
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Allow': 'POST, OPTIONS' }, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'method_not_allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Misconfigured → non-200 so the frontend falls back to its local KB.
    return json(500, { error: 'missing_api_key' });
  }

  // Parse + validate input
  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'bad_json' });
  }

  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  const rawHistory = Array.isArray(payload.history) ? payload.history : [];

  // Build a clean, alternating message list. The frontend already pushes the
  // current user turn into `history`, so it usually ends with the user message.
  let messages = rawHistory
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map(m => ({ role: m.role, content: m.content.trim() }))
    .slice(-12); // keep context bounded (cost + latency)

  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    if (!message) return json(400, { error: 'empty_message' });
    messages.push({ role: 'user', content: message });
  }
  // Anthropic requires the first message to be from the user.
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (messages.length === 0) return json(400, { error: 'empty_message' });

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages
      })
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('Anthropic API error', res.status, detail.slice(0, 300));
      return json(502, { error: 'upstream_error', status: res.status });
    }

    const data = await res.json();
    const reply = Array.isArray(data.content)
      ? data.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim()
      : '';

    if (!reply) return json(502, { error: 'empty_reply' });
    return json(200, { reply });
  } catch (e) {
    console.error('chat function error', e && e.message);
    return json(500, { error: 'server_error' });
  }
}
