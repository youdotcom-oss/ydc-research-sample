import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  let input: unknown;
  try {
    ({ input } = await request.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (!input || typeof input !== "string") {
    return NextResponse.json(
      { error: "input is required" },
      { status: 400 },
    );
  }

  const apiKey = process.env.YDC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "YDC_API_KEY is not configured" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch("https://ydc-index.io/v1/research", {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return NextResponse.json(
        { error: data?.message || "Research API request failed" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Research API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Research failed" },
      { status: 502 },
    );
  }
}
