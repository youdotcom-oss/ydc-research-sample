import { NextResponse } from "next/server";
import { You } from "@youdotcom-oss/sdk";
import { ResearchUnauthorizedError } from "@youdotcom-oss/sdk/models/errors";

export const maxDuration = 60;

const VALID_EFFORTS = ["lite", "standard", "deep", "exhaustive"] as const;
type Effort = (typeof VALID_EFFORTS)[number];

export async function POST(request: Request) {
  let input: unknown;
  let research_effort: unknown;
  let clientApiKey: unknown;
  try {
    ({ input, research_effort, apiKey: clientApiKey } = await request.json());
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

  const effort: Effort =
    typeof research_effort === "string" &&
    VALID_EFFORTS.includes(research_effort as Effort)
      ? (research_effort as Effort)
      : "standard";

  const apiKey =
    (typeof clientApiKey === "string" && clientApiKey) || process.env.YDC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "An API key is required. Enter one above or set YDC_API_KEY." },
      { status: 401 },
    );
  }

  try {
    const you = new You({ apiKeyAuth: apiKey });
    const result = await you.research({
      input,
      researchEffort: effort,
    });

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ResearchUnauthorizedError) {
      return NextResponse.json(
        { error: "Invalid or expired API key" },
        { status: 401 },
      );
    }
    console.error("Research API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Research failed" },
      { status: 502 },
    );
  }
}
