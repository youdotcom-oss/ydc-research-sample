"use client";

import { useState } from "react";
import Image from "next/image";
import Markdown from "react-markdown";

type Source = {
  url?: string;
  title?: string;
  snippets?: string[];
};

type ResearchResponse = {
  output?: {
    content?: string;
    sources?: Source[];
  };
};

type Status = "idle" | "loading" | "done";

const EFFORT_LEVELS = [
  { value: "lite", label: "Lite", description: "Fast answers for simple questions" },
  { value: "standard", label: "Standard", description: "Balanced speed and depth" },
  { value: "deep", label: "Deep", description: "Thorough research and cross-referencing" },
  { value: "exhaustive", label: "Exhaustive", description: "Most comprehensive analysis" },
] as const;

type Effort = (typeof EFFORT_LEVELS)[number]["value"];

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [query, setQuery] = useState("");
  const [effort, setEffort] = useState<Effort>("standard");
  const [content, setContent] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const exampleQueries = [
    "latest breakthroughs in quantum computing",
    "how do mRNA vaccines work",
    "what caused the 2008 financial crisis",
    "next.js vs remix for production apps",
  ];

  async function handleSubmit(searchQuery?: string) {
    const q = searchQuery ?? query;
    if (!q.trim()) return;

    setStatus("loading");
    setError("");
    setContent("");
    setSources([]);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: q, research_effort: effort, apiKey: apiKey.trim() || undefined }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Research failed");
        setStatus("idle");
        return;
      }

      const data: ResearchResponse = await res.json();
      setContent(data.output?.content ?? "");
      setSources(data.output?.sources ?? []);
      setStatus("done");
    } catch {
      setError("Something went wrong. Check your connection and try again.");
      setStatus("idle");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4">
        <a
          href="https://you.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-[6px]"
        >
          <Image
            src="/ydc-logo-icon.svg"
            alt=""
            width={22}
            height={22}
            aria-hidden
          />
          <Image
            src="/ydc-logo-text.svg"
            alt="you.com"
            width={76}
            height={15}
          />
        </a>
        <nav className="flex items-center gap-2">
          <a
            href="https://you.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[38px] items-center rounded-full px-4 text-[14px] font-semibold leading-5 text-[#101012] transition-colors hover:bg-black/5"
          >
            Pricing
          </a>
          <a
            href="https://you.com/platform"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[38px] items-center rounded-full bg-[#101012] px-4 text-[14px] font-semibold leading-5 text-white transition-colors hover:bg-[#2d2d30]"
          >
            Try our APIs
          </a>
        </nav>
      </header>

      {/* Main */}
      <div className="flex flex-1 flex-col items-center px-8 pt-16 pb-8">
        <main className="flex w-full max-w-[640px] flex-col gap-6">
          <h1 className="text-[28px] font-bold leading-9 text-[#101012]">
            Research
          </h1>
          <p className="text-[16px] leading-6 text-[#81828c]">
            Ask a complex question and get a comprehensive, cited answer. The
            Research API runs multiple searches, reads through sources, and
            synthesizes everything into a thorough response.
          </p>

          {/* Code snippet */}
          <div className="rounded-xl border border-[#e7e8ec] bg-[#f9f9fb] px-5 py-4">
            <pre className="overflow-x-auto font-mono text-[13px] leading-5 text-[#4a4b57]">
              <code>{`you = You(api_key_auth="ydc-...")
response = you.research(input="your question", research_effort="${effort}")
print(response.output.content)`}</code>
            </pre>
            <p className="mt-3 text-[12px] leading-4 text-[#81828c]">
              Powered by the{" "}
              <a
                href="https://docs.you.com/api-reference/research/v1-research"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors hover:text-[#101012]"
              >
                You.com Research API
              </a>
            </p>
          </div>

          {/* API key input */}
          <div className="flex flex-col gap-2">
            <div className="flex h-[50px] items-center rounded-full border border-[#e7e8ec] px-5 shadow-sm transition-colors focus-within:border-[#101012]">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your You.com API key"
                aria-label="API key"
                className="flex-1 bg-transparent text-[16px] leading-6 text-[#101012] placeholder:text-[#81828c] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="ml-2 text-[13px] font-medium text-[#81828c] transition-colors hover:text-[#101012]"
              >
                {showApiKey ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-[12px] leading-4 text-[#81828c]">
              A unique API Key is required to use this demo.{" "}
              <a
                href="https://you.com/platform"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors hover:text-[#101012]"
              >
                Get your API Key with free credits.
              </a>
            </p>
          </div>

          {/* Effort level selector */}
          <div className="flex flex-col gap-2">
            <p className="text-[13px] leading-4 text-[#81828c]">
              Research depth
            </p>
            <div className="flex gap-2">
              {EFFORT_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  disabled={status === "loading"}
                  onClick={() => setEffort(level.value)}
                  title={level.description}
                  className={[
                    "rounded-full border px-3 py-1.5 text-[13px] leading-4 transition-colors disabled:opacity-40",
                    effort === level.value
                      ? "border-[#101012] bg-[#101012] text-white"
                      : "border-[#e7e8ec] text-[#4a4b57] hover:border-[#101012] hover:text-[#101012]",
                  ].join(" ")}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex gap-3"
          >
            <div className="flex flex-1 items-center rounded-full border border-[#e7e8ec] px-5 py-3 transition-colors focus-within:border-[#101012]">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={status === "loading"}
                placeholder="Ask a complex question..."
                aria-label="Research question"
                className="flex-1 bg-transparent text-[16px] leading-6 text-[#101012] placeholder:text-[#81828c] focus:outline-none disabled:opacity-40"
              />
            </div>
            <button
              type="submit"
              disabled={!query.trim() || !apiKey.trim() || status === "loading"}
              className={[
                "h-[50px] shrink-0 rounded-full px-5 text-[16px] font-semibold leading-5 transition-colors",
                query.trim() && apiKey.trim() && status !== "loading"
                  ? "bg-[#101012] text-white hover:bg-[#2d2d30]"
                  : "cursor-default bg-[#f9f9fb] text-[#cdced6]",
              ].join(" ")}
            >
              {status === "loading" ? "Researching..." : "Research"}
            </button>
          </form>

          {/* Example queries */}
          {status === "idle" && !error && (
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((eq) => (
                <button
                  key={eq}
                  type="button"
                  onClick={() => {
                    setQuery(eq);
                    handleSubmit(eq);
                  }}
                  className="rounded-full border border-[#e7e8ec] px-3 py-1.5 text-[13px] leading-4 text-[#4a4b57] transition-colors hover:border-[#101012] hover:text-[#101012]"
                >
                  {eq}
                </button>
              ))}
            </div>
          )}

          {/* Loading hint */}
          {status === "loading" && (
            <p className="text-[13px] leading-5 text-[#81828c]">
              Researching... this can take up to a minute.
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-[14px] leading-5 text-red-600">{error}</p>
          )}

          {/* Results */}
          {status === "done" && (
            <>
              {/* Answer */}
              {content ? (
                <div className="prose prose-sm max-w-none text-[#101012] prose-headings:text-[#101012] prose-a:text-[#101012] prose-a:underline">
                  <Markdown>{content}</Markdown>
                </div>
              ) : (
                <p className="text-[14px] leading-5 text-[#81828c]">
                  No answer returned. Try a different question.
                </p>
              )}

              {/* Sources */}
              {sources.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-[#e7e8ec] pt-4">
                  <p className="text-[13px] font-semibold leading-5 text-[#81828c]">
                    Sources ({sources.length})
                  </p>
                  <div className="flex flex-col gap-2">
                    {sources.map((s, i) => (
                      <div key={s.url ?? i} className="flex flex-col gap-0.5">
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[14px] font-semibold leading-5 text-[#101012] hover:underline"
                        >
                          [{i + 1}] {s.title}
                        </a>
                        <span className="truncate text-[12px] leading-4 text-[#81828c]">
                          {s.url}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer
        className="flex items-center justify-between px-8 py-5 backdrop-blur-[7px]"
        style={{
          backgroundImage:
            "linear-gradient(84deg, rgba(255,255,255,0.757) 30%, rgba(255,255,255,0.7) 69%)",
        }}
      >
        <span className="text-[14px] leading-5 text-[#81828c]">
          &copy;2026, You.com
        </span>
        <nav className="flex items-center gap-8">
          {[
            {
              label: "Project code",
              href: "https://github.com/youdotcom-oss/ydc-research-sample",
            },
            {
              label: "More demos",
              href: "https://docs.you.com/integrations/overview",
            },
            { label: "Docs", href: "https://docs.you.com" },
            {
              label: "Discord",
              href: "https://discord.com/invite/youdotcom/",
            },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-medium leading-5 text-[#81828c] transition-colors hover:text-[#101012]"
            >
              {label}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
