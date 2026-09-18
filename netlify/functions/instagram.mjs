// Vercel serverless function — returns recent Instagram media for @nivellipso.
//
// SETUP (one-time): create a long-lived Instagram access token and add it as an
// environment variable named IG_TOKEN in the Vercel project
// (Settings → Environment Variables). Options to get a token:
//   1. Instagram Graph API (recommended): Business/Creator account linked to a
//      Facebook Page → Meta App → generate a long-lived token. Uses the
//      graph.instagram.com /me/media endpoint below.
//   2. Any service that issues an IG long-lived token also works.
//
// Without IG_TOKEN set, this returns { ok:false } and the website gracefully
// shows its static fallback tiles — nothing breaks.

export default async function handler(req, res) {
  const token = process.env.IG_TOKEN;
  if (!token) {
    return res.status(200).json({ ok: false, reason: 'no_token', media: [] });
  }
  try {
    const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption';
    const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=12&access_token=${encodeURIComponent(token)}`;
    const r = await fetch(url);
    if (!r.ok) {
      return res.status(200).json({ ok: false, reason: 'ig_error_' + r.status, media: [] });
    }
    const data = await r.json();
    const media = (data.data || [])
      .map((m) => ({
        img: m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url,
        permalink: m.permalink,
        caption: (m.caption || '').slice(0, 140),
      }))
      .filter((m) => m.img);
    // Cache at the edge for an hour; serve stale while revalidating for a day.
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ ok: true, count: media.length, media });
  } catch (err) {
    return res.status(200).json({ ok: false, reason: 'fetch_failed', media: [] });
  }
}
