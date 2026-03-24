# Research

**[Live demo →](https://you.com/examples/research)**

Ask a complex question, get a comprehensive cited answer from the [You.com Research API](https://docs.you.com/api-reference/research/v1-research).

The Research API goes beyond a single web search. It runs multiple searches, reads through the sources, and synthesizes everything into a thorough, well-cited Markdown answer. Think of it as having a research assistant that reads dozens of pages and writes you a report with footnotes.

This repo includes two ways to use it: a Python script for the command line, and a Next.js web app you can deploy to Vercel.

## Quick start

### Python

```bash
pip install youdotcom
export YDC_API_KEY="your-api-key-here"
python research.py "What are the latest breakthroughs in quantum computing?"
```

Three lines is all it takes:

```python
from youdotcom import You

you = You(api_key_auth="your-api-key")
response = you.research(input="What are the latest breakthroughs in quantum computing?")
print(response.output.content)
```

The response is a Markdown string with inline citations like `[1]`, `[2]`, plus a list of sources with URLs and titles.

### Web app

```bash
cp .env.example .env.local    # add your API key
npm install
npm run dev                    # open localhost:3000
```

The web app calls the Research API server-side so your API key stays safe. It renders the Markdown answer with proper formatting and lists sources at the bottom.

## Research effort levels

The API supports four effort levels that control how deep the research goes:

| Level | Speed | Description |
|---|---|---|
| `lite` | ~5s | Fast answers for straightforward questions |
| `standard` | ~10-15s | Balanced speed and depth (default) |
| `deep` | ~20-30s | Thorough research with cross-referencing |
| `exhaustive` | ~30-60s | Most comprehensive, explores the topic fully |

```python
# quick answer
response = you.research(input="what is RAG", research_effort="lite")

# deep dive
response = you.research(input="compare RAG architectures", research_effort="exhaustive")
```

The web app includes an effort level picker so you can see the difference in real time.

## Response format

The Research API returns a structured response:

```json
{
  "output": {
    "content": "## Quantum Computing Breakthroughs\n\nQuantum computing has seen several major advances... [1]\n\n...",
    "content_type": "text",
    "sources": [
      {
        "url": "https://blog.google/technology/research/google-willow-quantum-chip/",
        "title": "Google Quantum AI — Willow Chip",
        "snippets": ["Google's Willow chip demonstrated..."]
      }
    ]
  }
}
```

- `output.content` is a Markdown string with numbered inline citations (`[1]`, `[2]`, etc.)
- `output.sources` is the list of web sources used, each with a URL, title, and relevant snippets

## Sample output

```
## Recent Breakthroughs in Quantum Computing

Quantum computing has seen several major advances in recent years...

**Error correction milestones.** Google's Willow chip demonstrated that
increasing the number of qubits can actually reduce errors [1], a key
threshold for practical quantum computing...

Sources:
[1] Google Quantum AI — Willow Chip
    https://blog.google/technology/research/google-willow-quantum-chip/
[2] IBM Quantum — Heron Processor
    https://www.ibm.com/quantum/blog/ibm-quantum-heron
```

## When to use Research vs Search

| | Search API | Research API |
|---|---|---|
| **Speed** | Fast (~1s) | Slower (5-60s depending on effort) |
| **Output** | List of web results (title, URL, snippet) | Comprehensive Markdown answer with citations |
| **Best for** | Quick lookups, building search UIs, RAG pipelines | Complex questions, report generation, deep analysis |
| **Example query** | "nextjs docs" | "how does next.js compare to remix for production apps" |

Use **Search** when you need raw results fast. Use **Research** when you need a synthesized, cited answer to a complex question.

See the [Simple Search sample](https://github.com/youdotcom-oss/ydc-simple-search-sample) for a Search API example.

## Deploy to Vercel

1. Fork or push this repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Add `YDC_API_KEY` as an environment variable
4. Deploy

The Research API can take up to 60 seconds for exhaustive queries. The app sets `maxDuration = 60` on the API route, which requires Vercel Pro for timeouts beyond 10 seconds.

## Project structure

```
research.py              # Python script — standalone CLI usage
requirements.txt         # Python dependencies (just the SDK)
app/
  page.tsx               # React UI with effort picker, markdown rendering
  layout.tsx             # Next.js root layout
  api/research/route.ts  # Server-side API route (calls Research API via fetch)
  globals.css            # Tailwind styles
```

## Links

- [You.com API docs](https://docs.you.com)
- [Research API reference](https://docs.you.com/api-reference/research/v1-research)
- [Python SDK](https://pypi.org/project/youdotcom/) (`pip install youdotcom`)
- [TypeScript SDK](https://www.npmjs.com/package/@youdotcom-oss/sdk) (`npm install @youdotcom-oss/sdk`)
- [Simple Search sample](https://github.com/youdotcom-oss/ydc-simple-search-sample)
- [Get an API key](https://you.com/platform)
- [Discord](https://discord.com/invite/youdotcom/)
