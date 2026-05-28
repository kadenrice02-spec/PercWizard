# GovSignal

GovSignal is a starter website for tracking government-related stock and IPO catalysts.

It currently includes:

- Home page
- Dashboard
- Signal feed
- Source tracking page
- Report schedule page
- GitHub setup page
- Wednesday and Friday report placeholders
- Basic smoke tests

## The easiest way to run it

1. Download and unzip this folder.
2. Open the folder in VS Code.
3. Open the terminal in VS Code.
4. Run:

```bash
npm install
npm run dev
```

5. Open this in your browser:

```text
http://localhost:3000
```

## Test it

```bash
npm test
```

## Put it on GitHub

The easiest way is GitHub Desktop:

1. Open GitHub Desktop.
2. Click **File**.
3. Click **Add Local Repository**.
4. Choose this `govsignal` folder.
5. Click **Publish Repository**.

## Put it online with Vercel

1. Go to Vercel.
2. Sign in with GitHub.
3. Click **Add New Project**.
4. Pick the `govsignal` repo.
5. Click **Deploy**.

## Important

Do not put real API keys inside the code.

When you add real stock/government APIs later, put keys in:

- Vercel Environment Variables
- GitHub Secrets
- `.env.local` on your own computer only

## Next features to add

- Real stock price API
- SEC EDGAR scanning
- USAspending/SAM.gov contract tracking
- Email report sending
- Supabase database
- Login system
