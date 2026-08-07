# Canonical Process — all divisions

**Source:** Gridsmith Ltd's actual working process, as stated by the founder. This supersedes every process module previously specified in the division files (Design's 5-step, Digital's 6-stage, Press's 8-stage). All three now express the **same six stages** with the same names.

This matters beyond accuracy. A visitor who moves between divisions sees one company with one way of working, which is the entire argument for the master brand. Three different process diagrams would undermine it.

---

## The six stages

| # | Stage | What happens | Client involvement |
|---|---|---|---|
| 1 | **Consultation** | Understanding the business, project goals, target audience, and current digital presence | High — this is a conversation |
| 2 | **Planning & Scope** | Clear project scope, timeline, pricing structure and required deliverables prepared before work begins | Review and questions |
| 3 | **Approval & Start** | Work begins once scope is confirmed and the agreed initial payment is received | Approval + payment |
| 4 | **Design, Development & Updates** | The project is developed with regular updates, feedback opportunities and clear communication throughout | Ongoing — feedback at agreed points |
| 5 | **Delivery** | Final deliverables reviewed, completed and provided according to the agreed scope | Review and acceptance |
| 6 | **Support** *(if applicable)* | Ongoing support, maintenance, SEO improvements and digital assistance where required | Optional, ongoing |

## Rules for rendering this

1. **Stage names are fixed.** Do not reword them per division. "Consultation" is Consultation everywhere.
2. **Stage 6 always carries the "(if applicable)" qualifier.** It is genuinely optional and presenting it as automatic would misrepresent the offer.
3. **Each division adds a `divisionDetail` line per stage** — what that stage concretely means for that division's work. This is where the differentiation lives, not in the stage names.
4. **Durations are per-service, not per-stage-globally.** They come from `service.process[].duration` in the CMS, so a CAD package and a ghostwritten book can show honest, different timelines under identical stage names.
5. **Client time commitment is named at stages 1, 4 and 5** where the division has that data. Research finding R6 (all three divisions) shows buyers value knowing what the work costs them in hours, not just money.

## Per-division detail lines

### Gridsmith Design

| Stage | Division detail |
|---|---|
| 1 Consultation | Brand & Visual: brand position, audience, references. Technical: discipline, standards required, drawing inputs available, software |
| 2 Planning & Scope | Deliverables listed sheet by sheet or asset by asset, with revision allowance stated |
| 3 Approval & Start | Scope signed off; initial payment received; drawing register or asset list opened |
| 4 Design, Development & Updates | Technical: drafting, internal check, revision cycle against the named standard. Brand: concept, direction lock, refinement |
| 5 Delivery | Technical: issued file set in agreed formats with revision numbering. Brand: full asset pack plus usage guidance |
| 6 Support *(if applicable)* | Design Desk retained capacity, or ad-hoc revisions and additional sheets |

### Gridsmith Digital

| Stage | Division detail |
|---|---|
| 1 Consultation | Current systems, the process that is breaking, users and roles, integration landscape |
| 2 Planning & Scope | Technical specification, feature list, stack decisions, timeline including realistic iteration allowance |
| 3 Approval & Start | Scope confirmed; initial payment received; repository created in your ownership from day one |
| 4 Design, Development & Updates | Build in stages with a working preview environment and regular review points |
| 5 Delivery | Deployment, handover of code, data and infrastructure access, documentation, walkthrough |
| 6 Support *(if applicable)* | Care Plan — hosting, monitoring, security, monthly improvement allocation |

### Gridsmith Press

| Stage | Division detail |
|---|---|
| 1 Consultation | The book's purpose, readership, manuscript state, and what success actually looks like for you |
| 2 Planning & Scope | Package or bespoke scope, editorial approach, revision rounds, production schedule, distribution plan |
| 3 Approval & Start | Scope confirmed; initial payment received; editorial schedule issued |
| 4 Design, Development & Updates | Editing, cover and interior design, typesetting, proofing — with your review at each named point |
| 5 Delivery | Print-ready files, ebook files, ISBN registration, distribution setup on the agreed platforms |
| 6 Support *(if applicable)* | Content Programme, further titles, reprints, additional formats |

## Data model

The process is content, not code. In Sanity:

```ts
processStep {
  number: 1..6,
  title: string,          // fixed — from the canonical list
  description: text,      // canonical description
  divisionDetail: text,   // per-division, from the tables above
  duration: string,       // per-service, optional
  clientTime: string      // per-service, optional
}
```

A `processStep` with a `title` outside the canonical six is rejected by a Sanity validator. This keeps the three divisions aligned as content is edited over time by different people.

## Where it renders

| Location | Form |
|---|---|
| Master site `/approach` | Full six stages, canonical descriptions, no division detail |
| Division hub | Six stages, condensed, with division detail |
| Service page | Six stages with that service's durations and client time |
| Proposal / scope document | Same six stages — the site and the paperwork must match |

The last row is the point of all this. A buyer who reads the process on the site and then receives a proposal structured the same way experiences a company that does what it says. That consistency is worth more than any individual page.
