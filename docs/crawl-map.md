# Crawl Map Policy

Last updated: 2026-02-24

This policy defines which URL patterns should be indexed, noindexed, or canonicalized.

## Route Policy

| Route type | Example patterns | Indexing policy | Canonical policy | Sitemap policy |
| --- | --- | --- | --- | --- |
| Core landing pages | `/`, `/estimate`, `/tools`, `/guides`, `/examples` | `index, follow` | Self canonical | Include |
| Tool detail pages | `/<tool-slug>` | `index, follow` | Self canonical | Include |
| Guide detail pages | `/guides/<guide-slug>` | `index, follow` | Self canonical | Include |
| Company and legal pages | `/about`, `/contact`, `/privacy`, `/terms`, `/cookies`, `/security`, `/subprocessors` | `index, follow` | Self canonical | Include |
| Utility pages | `/sitemap-html` | `noindex, follow` | Self canonical | Exclude |
| Filter/tab query URLs | `/guides?tag=*`, `/tools?tag=*` | Canonicalize to clean route | `/guides`, `/tools` | Exclude (query URLs are never listed) |
| Ephemeral result query URLs | `/estimate?imageUrl=*&source=*`, `/body-shape-analyzer?imageUrl=*&source=*`, `/calorie-scanner?imageUrl=*&source=*`, `/face-symmetry-test?imageUrl=*&source=*`, `/face-shape-detector?imageUrl=*&source=*`, `/age-guesser?imageUrl=*&source=*`, `/attractiveness-test?imageUrl=*&source=*` | Canonicalize to clean route | Base route without query params | Exclude (query URLs are never listed) |
| API endpoints | `/api/*` | Not indexable pages | N/A | Exclude |

## Implementation Notes

1. Keep `public/robots.txt` open for crawlable pages and disallow `/api/`.
2. Ensure utility pages always set metadata robots to `noindex, follow`.
3. Ensure all indexable routes define a canonical URL that matches the preferred public URL.
4. For pages with UI-only query params (`tag`, `imageUrl`, `source`), keep canonical pointing to the clean route.
