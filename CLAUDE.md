Overview
Base URL and getting started

Base URL
+
All API requests use this base URL:

https://getillustrations.com/api/v1/plugin
Append the endpoint path to the base URL. For example, to search:

GET https://getillustrations.com/api/v1/plugin/search?q=business
Quick Start: Your First API Call
+







Authentication
API key setup and usage

API Key Authentication
+
Every API request must include your API key in the Authorization header:

Authorization: Bearer YOUR_API_KEY
API keys are prefixed by tier: gi_free_ (Free — 1,500 calls/mo; free assets clean, and your own library included clean if you're subscribed), gi_pro_ (Pro — the entire library + 300,000 calls/mo, $49/mo or $409/yr), gi_ent_ (Enterprise). API access is a separate plan — a download subscription gives you the FREE API tier reaching your own library, not Pro.

Your API key is shown only once when created. Save it securely. You cannot retrieve it later. You can regenerate a new key if needed.
Email/Password Authentication (Alternative)
+



Who Can Use the API
Access requirements and tiers

API Access Requirements
+
API access is a premium feature. To protect our assets from unauthorized distribution, API access is available only to:

Customer Type	API Access	Calls/Month
Illustration All Access	Included	1,500
Icons All Access	Included	1,500
Ultimate Bundle	Included	1,500
Pro API (add-on)	$49/month	300,000
Enterprise API	Custom	Unlimited
Free account	No access	—
Individual pack purchase	No access	—
Need more than the free tier? Get API Pro ($49/mo or $409/yr) for the entire library + 300,000 calls/mo, or contact us for Enterprise pricing.
Search
Find illustrations and icons

GET
/search
: Search illustrations and icons
+










Illustration Packs
Browse and list illustration packs

GET
/packs
: List illustration packs
+
GET
/packs/:packId/illustrations
: Get pack illustrations
+

Icon Packs
Browse and list icon packs

GET
/icon-packs
: List icon packs
+
GET
/icon-packs/:packId/icons
: Get pack icons
+
Downloads
Download individual assets

GET
/download/:type/:packId/:assetId
: Download asset
+
SVG Inline
Get raw SVG content for direct embedding

Retrieve raw SVG markup for icons and illustrations, ready to embed directly into HTML, slides, or applications.

GET /api/v1/plugin/svg/{type}/{id}
Path Parameters:

type: icon or illustration
id: Asset ID from search results
Query Parameters:

json=true: Returns JSON wrapper instead of raw SVG
Raw SVG Response:

Content-Type: image/svg+xml

<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <path d="M3 9l9-7 9 7v11..."></path>
</svg>
JSON Response (with ?json=true):

{
  "id": "abc123",
  "name": "Home",
  "tags": "home, house, building",
  "type": "icon",
  "svg_inline": "<svg>...</svg>",
  "svg_url": "https://api.iconify.design/feather/home.svg",
  "pack": { "name": "Feather Icons" }
}
Use case: AI slide generators, SaaS tools, and design apps that need to embed SVG directly into their output without downloading files.

Batch & Browse
Batch operations and browsing endpoints

Batch SVG Retrieval
POST /api/icons/batch-svg
Get SVG content for up to 50 icons in a single request. Pro subscribers only.

Request Body (JSON):

{
  "iconIds": ["id1", "id2", "id3"]
}
Response:

{
  "icons": [
    { "id": "id1", "name": "Home", "svg": "<svg>...</svg>", "tags": "home, house" }
  ],
  "count": 3
}
Rate limit: 10 batch requests per minute. Maximum 50 icons per request.
Icon Categories
GET /api/icon-categories
List all icon categories with counts. Useful for building category navigation in your app.

Icon Pack Statistics
GET /api/icon-packs/stats
Get summary statistics for all icon packs including total counts, free vs paid breakdown.

Random Icons
GET /api/icons/random?count=24&pack=feather-free-icons
Get a random selection of free icons. Great for showcases, hero sections, or placeholder content.

Parameter	Type	Description
count	int	Number of icons (1-100, default 24)
pack	string	Filter by pack urlName (optional)
Favorites
Save and manage favorite assets

GET
/favorites
: Get favorites
+

POST
/favorites
: Add/remove favorite
+
Rate Limits
Usage limits and headers

Rate Limit Tiers
+
Tier	Calls/Month	Price	Downloads
Included (Bundle)	1,500	Included with bundle	Full quality SVG + PNG
Pro API	300,000	$49/month	Full quality SVG + PNG
Enterprise	Unlimited	Custom	Full quality + SLA
Rate limit information is included in every response header:

X-RateLimit-Limit: 1500
X-RateLimit-Remaining: 1423
X-RateLimit-Reset: 2026-04-01T00:00:00Z
Error Handling
HTTP status codes and error responses

Status Codes
+
200 OK 400 Bad Request 401 Unauthorized 403 Forbidden 404 Not Found 429 Rate Limited

// Error response format
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMITED",
  "retryAfter": 3600
}
File Formats
Available download formats via API

Supported Formats
+
Format	Available via API	Notes
SVG	Yes	Full scalable vector
PNG 1x	Yes	Standard resolution
PNG 2x	Yes	Retina / HiDPI
Thumbnails	Yes	Low-res for UI previews
AI / Source	No	Download from website only
IconJar	No	Download from website only
SDKs & Code Examples
Integration examples

JavaScript / Node.js
−
// Search for illustrations
const API_KEY = 'gi_pro_your_key_here';
const BASE = 'https://getillustrations.com/api/v1/plugin';

const res = await fetch(`${BASE}/search?q=teamwork&limit=5`, {
  headers: { 'Authorization': `Bearer ${API_KEY}` }
});
const { hits } = await res.json();

// Download an SVG
const dl = await fetch(`${BASE}/download/illustration/${packId}/${assetId}?format=svg`, {
  headers: { 'Authorization': `Bearer ${API_KEY}` }
});
const svgContent = await dl.text();