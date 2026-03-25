import { NextRequest, NextResponse } from "next/server";

const CATEGORY_KEYWORDS: Record<string, string> = {
  options: "stock options trading finance",
  funding: "financial charts data analysis",
  onchain: "blockchain network technology",
  macro: "global economy finance markets",
  derivatives: "trading floor wall street",
  signals: "data analytics technology abstract",
};

export async function GET(request: NextRequest) {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Pexels API key not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "macro";
  const perPage = searchParams.get("per_page") || "5";

  const query = CATEGORY_KEYWORDS[category] || CATEGORY_KEYWORDS.macro;

  try {
    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", query);
    url.searchParams.set("orientation", "landscape");
    url.searchParams.set("size", "medium");
    url.searchParams.set("per_page", perPage);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: apiKey,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Pexels" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Pexels API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
