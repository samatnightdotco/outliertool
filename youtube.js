// Vercel serverless function: proxies YouTube Data API v3 requests so the API key
// never reaches the browser. Set YOUTUBE_API_KEY in Vercel Project Settings →
// Environment Variables (not GitHub — Vercel runs this function, so that's where
// the variable needs to live).

const ALLOWED_ENDPOINTS = new Set(['channels', 'playlistItems', 'videos', 'search']);

module.exports = async (req, res) => {
  const { endpoint, ...params } = req.query;

  if (!endpoint || !ALLOWED_ENDPOINTS.has(endpoint)) {
    res.status(400).json({ error: { message: 'Missing or invalid "endpoint" parameter.' } });
    return;
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: { message: 'Server is missing the YOUTUBE_API_KEY environment variable. Set it in Vercel → Project Settings → Environment Variables, then redeploy.' }
    });
    return;
  }

  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    url.searchParams.set(key, Array.isArray(value) ? value[0] : value);
  }
  url.searchParams.set('key', apiKey);

  try {
    const ytRes = await fetch(url.toString());
    const data = await ytRes.json();
    res.status(ytRes.status).json(data);
  } catch (err) {
    res.status(502).json({ error: { message: 'Failed to reach the YouTube API: ' + err.message } });
  }
};
