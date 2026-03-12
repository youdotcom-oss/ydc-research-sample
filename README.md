# Research

Ask a complex question, get a comprehensive cited answer from the [You.com Research API](https://docs.you.com).

The Research API goes beyond a single web search. It runs multiple searches, reads through the sources, and synthesizes everything into a thorough, well-cited answer in Markdown.

Two ways to run it: a Python script for the command line, or a Next.js web app you can deploy to Vercel.

## Prerequisites

- A You.com API key — grab one at [you.com/platform](https://you.com/platform)

## Python script

```bash
pip install -r requirements.txt
export YDC_API_KEY="your-api-key-here"
python research.py "What are the latest breakthroughs in quantum computing?"
```

If you don't pass a question it uses a default one, so `python research.py` works too. Note: Research typically takes 10-30 seconds since it runs multiple searches and reads through sources.

### Sample output

```
## Recent Breakthroughs in Quantum Computing

Quantum computing has seen several major advances in recent years...

**Error correction milestones.** Google's Willow chip demonstrated that
increasing the number of qubits can actually reduce errors [1], a key
threshold for practical quantum computing...

[1] Google Quantum AI — Willow Chip
    https://blog.google/technology/research/google-willow-quantum-chip/
```

## Web app

Set up your API key first:

```bash
cp .env.example .env.local
# edit .env.local with your actual API key
```

Then install and run:

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000), ask a question, and see the research answer with citations. The app calls the Research API server-side so your API key stays safe.

### Deploy to Vercel

1. Push this repo to GitHub
2. Import it in [vercel.com/new](https://vercel.com/new)
3. Add `YDC_API_KEY` as an environment variable
4. Deploy

Note: the Research API can take 30+ seconds to respond. Vercel's hobby plan has a 10-second function timeout, so you may need the Pro plan for reliable responses.

## When to use Research vs Search

| | Search API | Research API |
|---|---|---|
| **Speed** | Fast (~1s) | Slower (10-30s) |
| **Output** | List of web results (title, URL, snippet) | Comprehensive markdown answer with citations |
| **Best for** | Quick lookups, building search UIs, RAG pipelines | Complex questions, report generation, deep analysis |
| **Example** | "nextjs docs" | "how does next.js compare to remix for production apps" |

Use **Search** when you need raw results fast. Use **Research** when you need a synthesized, cited answer to a complex question.

## How it works

Both the script and the web app do the same thing:

1. Take a complex question
2. Call the You.com Research API (Python SDK or REST API)
3. Display the markdown answer and numbered sources

The web app adds a UI on top: question input, rendered markdown answer, and a sources list. The API route (`app/api/research/route.ts`) keeps your API key server-side.

## Links

- [You.com API docs](https://docs.you.com)
- [Python SDK on PyPI](https://pypi.org/project/youdotcom/)
- [TypeScript SDK on npm](https://www.npmjs.com/package/@youdotcom-oss/sdk)
- [Get an API key](https://you.com/platform)
