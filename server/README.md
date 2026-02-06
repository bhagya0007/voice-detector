Server for voice detection (server-side)

This small Express server receives the client request, validates a lightweight mock key, and calls the Google GenAI SDK using a server-side environment variable `GEMINI_API_KEY`. Keep the real model key only on the server — never expose it to the browser.

Quick start (development):

1. Install dependencies (in the project root or inside `server/`):

```bash
npm install express body-parser @google/genai
```

2. Set environment variables (example):

Windows Powershell:
```powershell
$env:GEMINI_API_KEY = "your_real_gemini_key"
$env:MOCK_API_KEY = "sk_test_123456789"
node server/index.js
```

Linux/macOS:
```bash
export GEMINI_API_KEY="your_real_gemini_key"
export MOCK_API_KEY="sk_test_123456789"
node server/index.js
```

3. The server listens on port 3000 by default and exposes `POST /api/voice-detection`.

Deployment:
- Deploy this server to any Node-capable host (Heroku, Render, Vercel Serverless functions, AWS Lambda, etc.).
- Configure `GEMINI_API_KEY` and `MOCK_API_KEY` in the host's environment configuration.

Frontend notes:
- The frontend now POSTs to `/api/voice-detection` (see `API_ENDPOINT` in `constants.ts`). When deploying the site and server under the same domain (recommended), that path will work without extra CORS setup. If you host them separately, update `API_ENDPOINT` to the server origin and enable CORS on the server.
