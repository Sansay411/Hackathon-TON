# Mira

Mira is the intelligence layer used to review freelance jobs and deals.

## No public API yet — WorkPay uses Intent Sourcing

Mira currently has **no public REST API, no webhook system, and no SDK** for
Mini App → Mira communication. WorkPay therefore does **not** call Mira directly
and does **not** claim any direct API integration.

Instead WorkPay uses **Mira Intent Sourcing**: the app builds a structured
review intent and lets the user send it to Mira through Telegram, then bring the
result back manually.

Flow:

```
User creates job/deal
  ↓
Clicks "Review with Mira"
  ↓
WorkPay generates a compact structured intent payload
  ↓
User can:
  1. Copy the full prompt
  2. Open Mira via deep link (t.me/mira?start=<payload>)
  3. Use @mira inline mode
  4. Paste Mira's result back into WorkPay
  ↓
WorkPay parses and displays the Mira review
```

The implementation lives in `lib/mira/intent.ts` (payload/prompt/parse helpers),
`components/mira/MiraIntentPanel.tsx` (the UI panel embedded on Job Detail,
Deal Detail, and the Create Job/Deal AI review step), and
`components/mira/MiraReviewResult.tsx` (the parsed review renderer).

### Deep link

```
https://t.me/mira?start=<payload>
```

Telegram start parameters are short and limited to `[A-Za-z0-9_-]`, so the deep
link carries only a **compact** payload — never a full description, never any
secret or wallet data. The compact payload contains only safe context:

- `source: workpay`
- `type: job_review | deal_review | proposal_review | dispute_summary`
- `id`
- short `title`
- `budget`
- `token`
- `deadline`
- short `risk_context`

The full job/deal context travels in the **copyable full prompt**, not in the
URL.

### Inline mode

Users can also type `@mira` in any Telegram chat and paste the WorkPay prompt
for a quick review without leaving Telegram.

## Custom skill prompt — WorkPay Deal Reviewer

Register this reusable instruction as a Mira skill.

**Skill name:** WorkPay Deal Reviewer

**Trigger:** When the user sends `/workpay_review` or opens Mira with a WorkPay
payload.

**Instructions:**

```
You are WorkPay Deal Reviewer.
Analyze freelance jobs and deals.
Find unclear requirements, missing deliverables, deadline risks, payment risks, dispute risks.
Return a structured review with:
- Clarity Score 0-100
- Risk Level: Low | Medium | High
- Missing Items
- Suggested Terms
- Dispute Prevention Checklist
- Final Recommendation
```

## Full prompt format

`createFullMiraPrompt()` produces this exact structure (Deliverables /
Acceptance Criteria filled when available):

```
/workpay_review

You are WorkPay Deal Reviewer.

Analyze this freelance job before funding.

Return this exact structure:

Clarity Score:
Risk Level:
Missing Items:
Suggested Terms:
Dispute Prevention Checklist:
Final Recommendation:

Job:
Title:
Description:
Budget:
Deadline:
Deliverables:
Acceptance Criteria:
```

## Parsing Mira's response

`parseMiraReview(rawText)` extracts the structured sections back out
(case-insensitive headers, bullet or comma lists, inline or multi-line values):

- Clarity Score (0–100)
- Risk Level (Low | Medium | High)
- Missing Items
- Suggested Terms
- Dispute Prevention Checklist
- Final Recommendation

If no structured section is recognized, the parser returns `ok: false` and the
UI shows the raw text labelled **"Unstructured Mira response"** instead of
fabricating a structured result.

## Honesty rules

- This is **Mira Intent Sourcing**, not "Mira API connected".
- There is no automatic Mira response, no background webhook, no direct API, no
  SDK communication.
- An optional `NEXT_PUBLIC_MIRA_CONFIGURED` flag only changes a label; it does
  not imply a live API connection.
