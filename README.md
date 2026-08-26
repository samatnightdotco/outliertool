# Outlier Console

A tool that pulls every long-form episode from one or more YouTube podcast channels
over the last 18 months and ranks which episodes broke from the channel's average
views/comments. Supports CSV upload for bulk analysis and exports results as CSV
(per channel) or a multi-sheet Excel workbook (all channels at once).

The YouTube API key lives **server-side only** — the browser never sees it. Requests
go through a small serverless function (`api/youtube.js`) that holds the key and
proxies calls to YouTube's API.

## Deploying on Vercel

1. Push this repo to GitHub, then import it at [vercel.com/new](https://vercel.com/new).
   Framework preset: **Other**. No build command or output directory needed.
2. **Set the API key** — in the Vercel project, go to **Settings → Environment
   Variables** and add:
   - Name: `YOUTUBE_API_KEY`
   - Value: your key from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
     (with "YouTube Data API v3" enabled)
   - Environment: Production (and Preview/Development if you want it there too)

   This has to be set in **Vercel's** settings, not GitHub's — GitHub just hosts the
   code, Vercel is what actually runs the serverless function that reads this
   variable at request time. (GitHub *Actions* secrets are a separate thing, for CI
   workflows — not relevant here unless you're deploying some other way.)
3. Redeploy after adding the variable (Vercel doesn't pick up new env vars on an
   already-running deployment — trigger a new deploy from the dashboard, or just
   push a commit).

## Local development

`vercel dev` will run both the static frontend and the `/api/youtube` serverless
function locally. You'll need a `.env` file (or `vercel env pull`) with
`YOUTUBE_API_KEY=...` set for local testing.
