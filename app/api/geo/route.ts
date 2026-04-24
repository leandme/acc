import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const COUNTRY_HEADER_CANDIDATES = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "cloudfront-viewer-country",
  "x-appengine-country",
  "x-geo-country",
  "x-country-code",
];

const IP_HEADER_CANDIDATES = [
  "x-forwarded-for",
  "x-real-ip",
  "true-client-ip",
  "cf-connecting-ip",
];

function normalizeCountryCode(value?: string | null) {
  const normalized = (value ?? "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return null;
  if (normalized === "XX" || normalized === "T1") return null;
  return normalized;
}

function countryFromAcceptLanguage(headerValue?: string | null) {
  const value = (headerValue ?? "").trim();
  if (!value) return null;

  const primary = value.split(",")[0]?.trim() ?? "";
  const parts = primary.split("-");
  if (parts.length < 2) return null;

  return normalizeCountryCode(parts[parts.length - 1]);
}

function extractClientIp(req: NextRequest) {
  for (const key of IP_HEADER_CANDIDATES) {
    const raw = req.headers.get(key);
    if (!raw) continue;

    if (key === "x-forwarded-for") {
      const first = raw.split(",")[0]?.trim();
      if (first) return first;
      continue;
    }

    const ip = raw.trim();
    if (ip) return ip;
  }
  return null;
}

function maskIpAddress(ip?: string | null) {
  const value = (ip ?? "").trim();
  if (!value) return null;

  if (value.includes(":")) {
    const parts = value.split(":").filter(Boolean);
    if (parts.length === 0) return null;
    return `${parts.slice(0, 3).join(":")}:*`;
  }

  const octets = value.split(".");
  if (octets.length === 4) {
    return `${octets[0]}.${octets[1]}.${octets[2]}.x`;
  }

  return null;
}

export async function GET(req: NextRequest) {
  let countryCode: string | null = null;
  let source = "none";

  for (const headerName of COUNTRY_HEADER_CANDIDATES) {
    const candidate = normalizeCountryCode(req.headers.get(headerName));
    if (candidate) {
      countryCode = candidate;
      source = headerName;
      break;
    }
  }

  if (!countryCode) {
    const geoCountry = normalizeCountryCode(
      (req as NextRequest & { geo?: { country?: string } }).geo?.country ?? null
    );
    if (geoCountry) {
      countryCode = geoCountry;
      source = "request.geo";
    }
  }

  if (!countryCode) {
    const fallback = countryFromAcceptLanguage(req.headers.get("accept-language"));
    if (fallback) {
      countryCode = fallback;
      source = "accept-language";
    }
  }

  return NextResponse.json(
    {
      countryCode,
      ipAddress: maskIpAddress(extractClientIp(req)),
      source,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
