# PRIO
TONIGHT:
- make body visualizer
- Make CTA to download good-looking shareable card. Save to camera role CTA, nice looking card, no accuracy label, branded, category

AT SOmE POinT
Get AHREFS and find all the best terms

- Rewrite the About page
- Redo the contact page
- Ensure privacy pages and legal all up to scratch
- Rewrite existing articles
- Even breaks between sections
- consistent formatting and layout
- Update existing tools
- 100k pageviews
- test OpenAI instead of via replicate.

Add references to disclimaer
- where this data comes from
- what models we use etc

Articles:
- why calorie counter apps work (despite being inaccurate)
- weight yourself every day
- psychological tricks to lose weight
- 2 eggs for breakfast
- drink water with your meals

Add section- goal weight/body fat%
- link to weight loss calculator
- Add links on tools page to filter by tool type All, body composition, etc like on the guides page
- Internal linking for blogs
- Bam animation with score
- All tools added to the footer
- Homepage section linking to all tools
- Pagination for blog posts
- Examples page searchable section
- Estimate counter
- dd company name on legal pages and contact

# BACKLINKS
- PH
- Interview Rory Sutherland on weight lose behavioural side of things.

# KEYWORDS
best calorie tracker app
best food tracker app
weight loss planner
free weight loss planner
weight loss calendar
weekly weigh in calendar
weekly weigh in tracker
weight loss tracker
body weight planner
free weight loss planner
weight loss planner pdf
body weight planner calculato

## Search Console data pull

Use this command to pull Google Search Console performance rows to local files:

```bash
npm run gsc:pull -- --property=sc-domain:bodyfatestimator.ai --start=2026-01-01 --end=2026-01-31
```

Exports are written to `data/search-console/` as both JSON and CSV.

### Auth option A: Service account (recommended)

1. Create a Google Cloud service account and download the key JSON.
2. In Google Search Console, add that service account email as a user on your property.
3. Set:

```bash
export GSC_SERVICE_ACCOUNT_KEY_FILE="$PWD/secrets/gsc-service-account.json"
```

Optional (Workspace/domain-wide delegation only):

```bash
export GSC_IMPERSONATE_USER="you@yourdomain.com"
```

### Auth option B: OAuth refresh token

Set:

```bash
export GSC_OAUTH_CLIENT_ID="..."
export GSC_OAUTH_CLIENT_SECRET="..."
export GSC_OAUTH_REFRESH_TOKEN="..."
```

### Extra options

```bash
# default dims: date,page,query,country,device
export GSC_DIMENSIONS="date,page,query,country,device"
export GSC_OUTPUT_DIR="data/search-console"
export GSC_ROW_LIMIT="25000"
export GSC_MAX_ROWS="100000"
export GSC_SEARCH_TYPE="web"
export GSC_DATA_STATE="final"
```
