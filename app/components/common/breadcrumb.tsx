"use client";

import React, { ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type TBreadCrumbProps = {
  homeElement?: ReactNode;
  separator?: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
  includeSchema?: boolean;
};

const DEFAULT_SITE_URL = "https://aicaloriecounter.ai";

const Breadcrumb = ({
  homeElement = "Home",
  separator = <span> &gt; </span>,
  containerClasses = "flex text-sm text-gray-400 hidden sm:flex pb-4 justify-center",
  listClasses = "hover:underline mx-2",
  activeClasses = "",
  capitalizeLinks = true,
  includeSchema = true,
}: TBreadCrumbProps) => {
  // Gate client-only hooks until after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Only call usePathname once mounted, otherwise use a safe fallback.
  const pathname = mounted ? usePathname() : "/";
  const pathNames = useMemo(() => {
    // Avoid splitting an empty/undefined pathname
    return (pathname || "/").split("/").filter(Boolean);
  }, [pathname]);

  const siteUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "") || DEFAULT_SITE_URL;

  const capitalizeText = (text: string) =>
    text.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const crumbs = useMemo(() => {
    // If not mounted, keep crumbs minimal to avoid SSR/prerender weirdness.
    if (!mounted) {
      return [{ name: typeof homeElement === "string" ? homeElement : "Home", href: "/" }];
    }

    return [
      { name: typeof homeElement === "string" ? homeElement : "Home", href: "/" },
      ...pathNames.map((seg, i) => ({
        name: capitalizeLinks ? capitalizeText(seg) : seg,
        href: `/${pathNames.slice(0, i + 1).join("/")}`,
      })),
    ];
  }, [mounted, homeElement, pathNames, capitalizeLinks]);

  const breadcrumbJsonLd = useMemo(() => {
    if (!includeSchema) return null;
    // Only output full JSON-LD once mounted (so it matches client path).
    if (!mounted) return null;

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: c.name,
        item: `${siteUrl}${c.href}`,
      })),
    };
  }, [mounted, includeSchema, crumbs, siteUrl]);

  const generateLink = (link: string, index: number) => {
    const href = `/${pathNames.slice(0, index + 1).join("/")}`;
    const itemClasses = pathname === href ? `${listClasses} ${activeClasses}` : listClasses;
    const itemLink = capitalizeLinks ? capitalizeText(link) : link;

    return (
      <React.Fragment key={index}>
        <li className={itemClasses}>
          <Link href={href}>{itemLink}</Link>
        </li>
        {pathNames.length !== index + 1 && separator}
      </React.Fragment>
    );
  };

  return (
    <div>
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}

      <ul className={containerClasses}>
        <li className={listClasses}>
          <Link href="/">{homeElement}</Link>
        </li>

        {mounted && pathNames.length > 0 && separator}

        {mounted && pathNames.map((link, index) => generateLink(link, index))}
      </ul>
    </div>
  );
};

export default Breadcrumb;
