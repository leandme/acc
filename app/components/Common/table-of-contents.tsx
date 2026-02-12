"use client";

import React, { useEffect, useMemo, useState } from "react";

export type TocItem = {
  id: string;          // matches the heading id
  label: string;       // text shown in TOC
  level?: 2 | 3;       // optional indentation (H2 vs H3)
};

type Props = {
  items: TocItem[];
  title?: string;
  className?: string;
};

export default function TableOfContents({
  items,
  title = "Table of Contents",
  className = "",
}: Props) {
  const [activeId, setActiveId] = useState<string>(items?.[0]?.id ?? "");

  const ids = useMemo(() => items.map((i) => i.id), [items]);

  useEffect(() => {
    if (!ids.length) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the most visible heading currently intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      {
        // triggers a bit before the heading hits the top
        root: null,
        threshold: [0.1, 0.25, 0.5],
        rootMargin: "-20% 0px -70% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  if (!items?.length) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={`rounded-2xl border bg-white p-6 ${className}`}
    >
      <h2 className="text-3xl lg:text-4xl font-semibold">{title}</h2>

      <ul className="text-gray-700 text-lg leading-relaxed space-y-4 pl-6 mt-4 text-primary">
        {items.map((item) => {
          const level = item.level ?? 2;

          return (
            <li key={item.id} className={level === 3 ? "ml-4" : ""}>
             <span className="text-gray-700">•&nbsp;</span> <a
                href={`#${item.id}`}
                className="block leading-snug hover:underline inline"
              >
                 {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
