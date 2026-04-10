---
name: wf-social-seo-geo
description: >
  Social media content workflow optimized for AI search visibility. Chains
  social-content, ai-seo, and geo-platform-optimizer into a 4-step pipeline
  with hard quality gates between each step. Produces platform-native posts
  tuned for Google AI Overviews, ChatGPT, Perplexity, Gemini, and Copilot.
  Use when user says "social post with SEO", "social content for AI search",
  "social + GEO", "AEO social content", "AI-optimized social posts",
  "social media workflow", "post with AI visibility", or wants social content
  that ranks in both traditional and AI-powered search.
metadata:
  version: 2.0.0
  skills-chained: [social-content, ai-seo, geo-platform-optimizer]
  optional-addons: [article-writing, seo-content, schema-markup, marketing-psychology]
---

# Social + SEO + GEO Workflow v2

Create social media content that performs on platforms AND gets cited by AI search engines.

CRITICAL: This is a 4-step sequential pipeline. Each step produces output. Each gate BLOCKS progress until every check passes. Do NOT combine steps. Do NOT skip gates.

---

## Pre-Flight

1. Check for `.agents/product-marketing-context.md`. If it exists, load it.
2. Gather from user (ask if not provided):
   - Topic or source — What to post about
   - Target platforms — Which social platforms
   - Target AI engines — Which AI search engines matter
   - Goal — Awareness, traffic, leads, authority, launch support
   - Audience — Who reads this
3. Research platform constraints BEFORE writing anything:

### Platform Constraints Reference

| Platform | Hard character limit | Hashtag rules | Format |
|----------|---------------------|---------------|--------|
| X/Twitter | 280 chars per tweet (4000 Premium) | 1-2 per tweet, mid/end placement, must be active communities | Thread = linked tweets, all posted at once |
| LinkedIn post | 3000 chars | 3-5 max, broad+niche mix, research active tags first | Link in first comment, not body |
| LinkedIn article | Unlimited | N/A (use on sharing post only) | H2/H3 headings, professional tone |
| Reddit | 40,000 chars body, 300 chars title | None — Reddit does not use hashtags | Subreddit norms vary, check rules |
| Product Hunt tagline | 60 chars max | N/A — uses Topics | No hype, no emojis unless part of name |
| Product Hunt description | 500 chars max | N/A | Value prop + features |
| Threads | 500 chars | Similar to Twitter | Short takes |
| Bluesky | 300 chars | Minimal | Short takes |

4. Research hashtags BEFORE writing:
   - Web search for trending hashtags in the relevant category + current month
   - Verify each hashtag has an active community (not made-up)
   - Twitter: pick 1-2 per tweet from verified active tags
   - LinkedIn: pick 3-5 from verified active tags
   - Never use hashtags with zero community (#UXValidation, #AITesting = bad)
   - Prefer engaged niche communities (#BuildInPublic, #OpenSource) over saturated broad tags (#AI)

---

## Step 1: Create Platform-Native Content

Invoke `social-content`.

Input: Topic, platforms, audience, brand voice.

Produce per platform:
- Post text that fits within the platform's hard character limit
- Platform-appropriate formatting (no markdown on platforms that don't render it)
- Hook (curiosity, story, value, or contrarian)
- CTA
- Hashtags (researched, verified active communities)
- Content pillar tag

Rules:
- One post per platform — never identical cross-posts
- Plain text only — no markdown formatting (no **bold**, no - bullets, no `code`)
- Every post must be copy-paste ready into the platform's native editor
- Count characters for every tweet/post BEFORE moving to Gate 1

### GATE 1 — Platform Compliance (BLOCKING)

Verify EVERY item. If ANY fails, rewrite before proceeding.

| Check | How to verify | Fail action |
|-------|--------------|-------------|
| Character limit | Count characters for each post/tweet | Rewrite to fit |
| Platform formatting | No markdown on platforms that render plain text | Strip formatting |
| Hook present | First 1-2 sentences create curiosity or value | Rewrite opening |
| Single CTA | One clear action per post | Remove extra CTAs |
| Hashtags verified | Each hashtag has active community (web searched) | Replace with verified tag |
| Copy-paste clean | Paste into a text editor — does it look right? | Fix formatting |
| No identical cross-posts | Compare all posts — none are the same | Differentiate |

DO NOT proceed to Step 2 until Gate 1 passes 100%.

---

## Step 2: Optimize for AI Extraction

Invoke `ai-seo`.

Input: Gate 1-approved posts from Step 1.

For EACH post, apply these optimizations in order:

1. Brand entity anchoring
   - Product/brand name appears in the first 2 sentences
   - Never use "it", "the tool", "our product", "a tool" when the brand name should appear
   - Full brand name in every self-contained passage

2. Extractable passage creation
   - Write 1-2 sentences per post that are self-contained (15-40 words for social, 134-167 words for articles)
   - The passage must answer a question like "What is [Product]?" without surrounding context
   - Test: if you copy JUST that sentence, does it make complete sense alone?

3. Statistical density
   - At least one specific number per post (not vague like "minutes" — use "under 5 minutes" or "in 3 minutes")
   - Named sources when possible
   - Avoid unsubstantiated superlatives ("best", "leading", "revolutionary")

4. Adjacent search terms
   - Include terms people actually search for, not just your brand vocabulary
   - Example: if your product does "UX validation", also mention "automated testing", "QA", "user testing" at least once across the content set
   - Each post doesn't need every term — distribute across the set

5. Source citations (long-form only)
   - For LinkedIn articles, Reddit posts: add data points with attribution
   - For tweets: one stat per tweet is sufficient

Rules:
- Optimizations must NOT break platform character limits (re-count after edits)
- Optimizations must NOT make the post sound robotic or keyword-stuffed
- Short-form (tweets, Threads): apply only items 1 and 2
- Long-form (LinkedIn, Reddit, articles): apply all 5

### GATE 2 — AI Extraction Quality (BLOCKING)

| Check | How to verify | Fail action |
|-------|--------------|-------------|
| Brand name in first 2 sentences | Read each post opening | Add brand name |
| Zero generic references | Search for "it", "the tool", "our product", "a tool", "the system", "the workflow" | Replace with product name |
| Extractable passage exists | Copy the passage alone — does it answer "What is X?" | Rewrite passage |
| Specific numbers, not vague | Search for "minutes", "fast", "easy", "many" without a number | Add specific number |
| Character limits still pass | Re-count after all edits | Trim to fit |
| Adjacent terms present | Check that the full content set mentions how real people search | Add bridging sentence |

DO NOT proceed to Step 3 until Gate 2 passes 100%.

---

## Step 3: Tune Per AI Platform

Invoke `geo-platform-optimizer`.

Input: Gate 2-approved posts + user's target AI engines.

For EACH target AI platform, verify and apply:

### Google AI Overviews
- At least one question-based heading per long-form post ("What is X?", "How does X work?")
- Direct answer immediately after the question (not 3 paragraphs of backstory first)
- Lists or structured formatting where appropriate

### ChatGPT
- Full brand/product names used consistently (ChatGPT uses entity recognition)
- Freshness signal: include a date or "as of [month year]" in at least one post
- Ensure Reddit posts exist (ChatGPT indexes Reddit heavily)

### Perplexity
- Reddit posts have quotable standalone paragraphs (not just narrative flow)
- Original data or first-party insights present
- Conversational but factual tone

### Gemini
- YouTube video link included in at least one post (or noted as companion action)
- Google ecosystem signals mentioned if relevant (Google Business, Knowledge Panel)

### Copilot
- LinkedIn post is detailed and rich (Copilot weights LinkedIn heavily)
- Linked pages load fast
- IndexNow submission noted as companion action

### Claude / Deepseek / Others
- Clear factual claims with structured comparisons
- No hedged language ("might", "could", "possibly")
- Technical accuracy in any code or commands (verify they actually work)

### GATE 3 — Platform-Specific AI Signals (BLOCKING)

| Check | How to verify | Fail action |
|-------|--------------|-------------|
| Question headings (long-form) | Count question-format headings per post | Add at least 1 per long-form post |
| Brand names in every extractable passage | Re-read each quotable sentence | Fix missing names |
| YouTube/video companion | Is a video link or companion action noted? | Add it |
| Reddit posts are quotable | Read each Reddit paragraph in isolation | Rewrite weak paragraphs |
| LinkedIn is rich enough for Copilot | Is the LinkedIn post the most detailed? | Expand if thin |
| All commands/code verified | Test every install command, URL, and code block | Fix or remove |
| Character limits STILL pass | Final count after all edits | Trim to fit |
| Freshness date included | At least one post has a date reference | Add one |

DO NOT proceed to Step 4 until Gate 3 passes 100%.

---

## Step 4: Review and Deliver

Final assembly and cross-file consistency check.

### GATE 4 — Cross-Content Consistency (BLOCKING)

| Check | How to verify | Fail action |
|-------|--------------|-------------|
| Same stats everywhere | Are numbers consistent across all posts? (e.g., "70+ tools" not "70 tools" in one and "100+ tools" in another) | Align |
| Same positioning | Is the product described the same way across platforms? | Align |
| No conflicting information | Check pricing, feature claims, dates | Fix conflicts |
| No leftover references | Search for removed campaigns (e.g., April Fools), draft placeholder text, TODO notes | Remove |
| Dates are correct | Every date reference matches the actual launch date | Fix |
| URLs are correct and live | Test every URL in the content | Fix or remove |
| Engagement plans are actionable | Does each post file have clear instructions for the person posting? | Add instructions |

### Final Output Format

Deliver each post as a separate file. Each file contains:

1. Platform name and posting instructions (timing, format, actions after posting)
2. COPY-PASTE section clearly marked — plain text, ready to paste with zero edits
3. Companion content (first comment, reply, follow-up) also copy-paste ready
4. Engagement plan for that platform

Plus one summary report:

| Post | Platform | Chars | Gate 1 | Gate 2 | Gate 3 | Gate 4 | Status |
|------|----------|-------|--------|--------|--------|--------|--------|
| ... | ... | ... | Pass/Fail | Pass/Fail | Pass/Fail | Pass/Fail | Ready / Needs work |

---

## Optional Add-Ons

| Situation | Add this skill | Why |
|-----------|---------------|-----|
| Post links to a long-form article | `article-writing` + `seo-content` | The linked page needs its own SEO/GEO optimization |
| Site needs structured data | `schema-markup` | `sameAs` and `speakable` properties boost entity recognition |
| Want psychology-driven hooks | `marketing-psychology` | Ground hooks in cognitive biases |
| Scaling to a content calendar | `content-strategy` | Build a full editorial plan first |
| Running paid amplification | `ad-creative` | Adapt top organic posts into ad variations |

---

## Metrics to Track

| Metric | Tool | What it tells you |
|--------|------|-------------------|
| AI citation appearance | Otterly AI, Peec AI, manual checks | Are AI engines citing your content? |
| Platform engagement | Native analytics | Are humans engaging? |
| Click-through to site | UTM tracking | Is social driving traffic? |
| Brand mention growth | Google Alerts, social listening | Is your authority signal growing? |
