# AI-Powered Parametric Insurance for Delivery Partners

A parametric insurance platform that protects gig delivery workers from **income loss caused by external disruptions** such as heavy rain, floods, extreme heat, severe pollution, curfews, strikes, and sudden zone closures.

Unlike salaried workers, delivery partners do not get paid leave or income protection. Our platform fills that gap with **weekly insurance plans, hyperlocal risk prediction, automatic claim triggering, and fraud-aware validation**.

---

## Problem

Delivery workers are highly exposed to external disruptions that can stop them from earning, but traditional insurance is not designed for:

| Challenge | Why It Matters |
|---|---|
| Dynamic work schedules | Workers do not have fixed shifts like salaried employees |
| Fluctuating weekly income | Income protection cannot rely on fixed salary assumptions |
| Location-based risk | Risk changes by zone, time, and disruption type |
| Slow manual claims | Workers need fast support when income stops immediately |

Existing protections mostly focus on accident or health coverage, not **loss of earning opportunity**.

---

## Solution

We build an **intelligent insurance orchestration layer** between delivery platforms, insurers, and workers.

| Stakeholder | Role |
|---|---|
| **Delivery Platform** | Shares worker verification, activity, earnings, and location data through APIs |
| **Insurance Provider** | Underwrites the policy, collects premiums, and handles payouts |
| **Our Platform** | Calculates premiums, predicts risk, validates claims, detects fraud, and powers dashboards |

Our platform handles:

- worker onboarding and verification
- weekly premium calculation
- disruption monitoring
- risk-zone classification
- safe-zone recommendations
- automatic claim initiation
- fraud detection
- insurer/admin dashboards

---

## Core Idea: Parametric Insurance

Instead of asking workers to manually prove exact loss after every event, the system monitors predefined external triggers and automatically evaluates claims.

### Covered disruptions

| Disruption Type | Example Impact |
|---|---|
| Heavy rain / floods | Worker cannot safely operate in affected zones |
| Extreme heat | Unsafe outdoor delivery conditions |
| Severe pollution | Outdoor work becomes risky or restricted |
| Curfews / strikes | Movement restrictions reduce earning opportunity |
| Sudden zone closures | Market/area shutdown stops work unexpectedly |
| Traffic shutdowns | Routes become unusable, reducing workability |

Claims are evaluated using **verified disruption signals + worker eligibility**, not traditional reimbursement.

---

## Weekly Dynamic Premium Model

Premiums are calculated weekly using two categories of signals:

| Signal Group | Inputs |
|---|---|
| **Earnings Signals** | Recent weekly income, delivery volume, login consistency, working hours |
| **Risk Signals** | Flood exposure, rainfall frequency, heat severity, pollution, congestion, curfew/closure history, strike-prone areas |

This creates a **personalized weekly plan** that reflects both earnings dependence and real-world disruption risk.

---

## Geographic Risk Intelligence

The city is divided into **hexagonal grids**. Each grid is continuously scored and classified as:

| Zone Color | Meaning | Insurance Relevance |
|---|---|---|
| **Yellow** | Safe / normal | Preferred working zone |
| **Orange** | Caution / possible disruption | Worker may be advised to move |
| **Red** | Severe disruption | High-risk or non-insurable zone |

This map powers:

- worker alerts
- safe-zone suggestions
- route guidance
- claim automation
- fraud checks
- payout reasoning

---

## Why Mobile App First

A mobile app is better than a website for delivery workers because it supports:

| Need | Why Mobile App Fits Better |
|---|---|
| Real-time location awareness | Workers operate entirely on the move |
| Push notifications | Instant risk alerts and claim updates |
| Live route guidance | Workers need turn-by-turn safe-zone suggestions |
| Better field usability | Native app works better under poor network conditions |

### Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | Expo / React Native |
| Backend & Realtime DB | Convex |
| Authentication | Clerk |
| Payments | Stripe |
| Maps & Risk Visualization | Leaflet |

---

## Dynamic Pricing Engine

We use a **multi-modal pricing model** with three specialized branches.

| Component / Branch | Model Type | Input Data | What It Contributes |
|---|---|---|---|
| **Spatial Layer** | GNN | Hexagon risk map, routine pickup/drop zones | Geographic exposure and spatial risk |
| **Temporal Layer** | LSTM | Weekly earnings, working-hours sequence | Income trend, volatility, and earning consistency |
| **Tabular Layer** | XGBoost | Worker metadata, claims history, trust score | Baseline actuarial and behavioral risk |
| **Fusion Layer** | Dense Layers + MDN | Outputs from all branches | Final weekly premium + confidence margin |

---

## Risk Scoring Model

We use a separate model to classify each hexagon in advance.

| Branch | Model Type | Input Data | Output |
|---|---|---|---|
| **Environmental Layer** | LSTM / Time-Series Model | Rainfall, heat, AQI | Environmental threat level |
| **Unstructured Intelligence Layer** | NLP Transformer | Police alerts, civic notices, local news | Civic disruption score |
| **Cascade Layer** | ST-GCN | Traffic flow, hexagon adjacency | Spillover / contagion risk |
| **Fusion Layer** | Dense Layers + Softmax | Outputs from all branches | Final zone color: Yellow / Orange / Red |

---

## Worker Eligibility Logic

Workers are informed about risk **24 hours in advance**.

| Rule | Decision |
|---|---|
| Worker starts in **Red** zone knowingly | Not insured |
| Worker knowingly enters **Orange** and it becomes **Red** | Usually not insured |
| Worker starts in **Yellow** and disruption escalates suddenly | Insured |
| No safe route exists | Coverage may still apply |
| System misclassified zone or failed to notify | Manual review allowed |

This keeps the system fair while preventing intentional misuse.

---

## Slot-Based + Flexible Work Support

| Worker Type | How Eligibility Is Verified |
|---|---|
| **Slot-based worker** | Pre-selected working hours and operating zones |
| **Flexible worker** | Live login status, active location, delivery activity, route compliance |

This makes the product usable across multiple gig platform models.

---

## Claim Automation

Claims are automatically created when disruption + eligibility conditions match.

| Validation Input | Why It Matters |
|---|---|
| Worker identity | Confirms valid insured worker |
| Zone history | Verifies whether worker entered risk knowingly |
| Disruption severity | Confirms qualifying external event |
| Login and delivery activity | Confirms worker was active |
| Safe-route availability | Checks whether safer alternative existed |
| Route compliance | Detects whether worker ignored guidance |
| Notification status | Ensures fairness in eligibility decisions |

Claims are approved only for **eligible exposure**, not deliberate risky movement.

---

## Manual Review and Fraud Prevention

### Manual Review Cases

| Case | Why Review Is Needed |
|---|---|
| Wrong zone classification | Model may have misclassified the area |
| Disruption not captured | External feeds may have missed the event |
| Notification failure | Worker may not have received warning |
| Platform data inconsistency | Monitoring or sync issue may affect decision |

### Fraud Signals

| Fraud Signal | Meaning |
|---|---|
| Claiming while inactive | Worker was not actually working |
| Knowingly entering high-risk zones | Deliberate exposure for benefit |
| Ignoring safer route suggestions | Avoidable risk-taking |
| Location mismatch | Inconsistent platform vs insurance logs |
| Duplicate event claims | Multiple claims for same event window |
| Incentive + insurance abuse | Worker tries to gain both surge benefit and payout for same risk |

If multiple disruptions overlap, the system pays the **highest valid eligible payout path**, not fully stacked payouts.

---

## Dashboards

| Dashboard | Key Features |
|---|---|
| **Worker Dashboard** | Coverage status, premium paid, payout history, risk map, safe-zone guidance |
| **Insurer/Admin Dashboard** | Claim monitoring, fraud review, manual review, zone validation, analytics |

---

## AI/ML Opportunities

| Area | Purpose |
|---|---|
| Risk Scoring | Predict disruption exposure by grid |
| Dynamic Pricing | Calculate weekly premium fairly |
| Route Recommendation | Suggest safer and economically viable movement |
| Fraud Detection | Detect suspicious claim behavior |
| Misclassification Detection | Reduce wrongful denials |

---

## Claims Philosophy

> Insurance should protect workers from uncontrollable loss of earning opportunity, not reward knowingly entering high-risk zones for extra gain.

This principle drives:

- eligibility rules
- route guidance
- claim approval
- fraud checks
- payout fairness

---

## Technical Overview

| Component | Function |
|---|---|
| Worker Mobile App | Coverage management, alerts, claims, navigation |
| Insurer/Admin Dashboard | Claim and risk operations |
| Partner Integration Layer | Connects delivery platform APIs |
| Risk Engine | Scores hexagonal zones |
| Pricing Engine | Calculates weekly premium |
| Claim Engine | Triggers and validates claims |
| Fraud Layer | Flags suspicious patterns |
| Payout Layer | Orchestrates settlement flow |

---

## Why This Approach Stands Out

| Strength | Benefit |
|---|---|
| Hyperlocal hexagon risk mapping | More precise than city-level insurance logic |
| Weekly premium design | Better suited to gig worker income cycles |
| Parametric claims | Faster than reimbursement-based workflows |
| Operational validation | Reduces fraud using live platform data |
| Multi-model AI architecture | Improves pricing and disruption prediction |
| Flexible + slot-based support | Works across different platform models |

---

## Market Crash Solution

A major weakness in parametric insurance is that **GPS alone can be spoofed**. If workers fake their location and appear inside a red-alert zone while actually staying safe elsewhere, the system may trigger false payouts at scale.

To prevent this, our platform adds an **Adversarial Defense & Anti-Spoofing Strategy** that validates claims using **multi-signal consistency**, not just coordinates.

---

### Adversarial Defense & Anti-Spoofing Strategy

#### 1. How we differentiate real workers from spoofers

Instead of trusting GPS alone, we check whether the worker’s **full operational story is consistent**.

| Genuine stranded worker | Spoofing attacker |
|---|---|
| Recently active on platform | No matching delivery activity |
| Realistic movement path into affected zone | Sudden teleportation into red zone |
| Pickup/drop history matches claimed area | No route progression leading there |
| Device/network behavior matches outdoor movement | Device/session signals look abnormal |
| Nearby workers show similar disruption impact | Suspicious cluster of identical claims |

So the key question is not *“Is the worker inside the red zone?”* but:

> *“Does the worker’s activity, route, device behavior, and surrounding peer pattern make the claim believable?”*

---

#### 2. What data we analyze beyond GPS

| Signal Category | Data Points | Why it matters |
|---|---|---|
| **Platform activity** | Login/logout time, order acceptance, pickup/drop history, online status, delivery timestamps, earnings activity | Confirms whether the worker was genuinely active |
| **Mobility realism** | Speed, path continuity, travel feasibility, impossible jumps, road-network consistency, historical operating zones | Detects teleportation and unrealistic travel patterns |
| **Device/session integrity** | Mock-location flags, rooted-device signals, IP/network inconsistencies, motion consistency, repeated suspicious session signatures | Detects device-level spoofing risk |
| **Environmental corroboration** | Traffic slowdown, disruption severity nearby, delays reported by nearby workers, density of active workers | Verifies whether field conditions support the claim |
| **Coordination/ring signals** | Synchronized claims, repeated route patterns, cluster anomalies, shared suspicious signatures | Detects organized fraud rings rather than isolated fraud |

---

#### 3. Anti-spoofing AI/ML architecture

We extend the system with an **Anti-Spoofing & Adversarial Fraud Detection Engine**.

| Branch | What it checks | Output |
|---|---|---|
| **Trajectory Consistency Model** | Whether recent movement path is physically realistic | Trajectory authenticity score |
| **Platform Activity Consistency Model** | Whether claim matches actual delivery activity | Operational authenticity score |
| **Device Integrity Model** | Whether phone/session shows spoofing indicators | Device trust score |
| **Ring Detection Graph** | Whether the claim is part of a coordinated fraud cluster | Ring-fraud probability score |
| **Fusion Layer** | Combines all branch outputs | Final fraud-risk level |

Final fraud-risk levels:

| Risk Level | Action |
|---|---|
| **Low** | Claim proceeds automatically |
| **Medium** | Claim enters soft verification |
| **High** | Claim is frozen and escalated for fraud review |

---

#### 4. UX balance: how we avoid hurting honest workers

A strong anti-fraud system should not punish genuine workers just because bad weather caused poor signal or delayed sync.

| Claim state | System response |
|---|---|
| **Low-risk claim** | Auto-processed normally |
| **Medium-risk claim** | Soft verification, delayed sync checks, lightweight confirmation if needed |
| **High-risk claim** | Temporarily held for fraud review, not instantly rejected |

We use a **progressive trust model**, not immediate rejection.

This means:
- honest workers are not unfairly blocked due to network drops
- suspicious claims are investigated before payout
- only strong fraud signals lead to payout freeze

---

#### 5. Flagged claim workflow

| Step | Action |
|---|---|
| 1 | Claim enters fraud scoring |
| 2 | Multi-signal consistency is evaluated |
| 3 | Claim is labeled low, medium, or high risk |
| 4 | Low-risk claims continue automatically |
| 5 | Medium-risk claims enter soft verification |
| 6 | High-risk claims are frozen and sent for fraud review |
| 7 | If validated later, payout is restored without permanent worker penalty |
| 8 | Repeated confirmed spoofing lowers trust score and may restrict future coverage |

---

#### 6. Why this is resilient

| Weak system | Our system |
|---|---|
| Trusts only GPS | Uses multiple signals together |
| Easy to spoof with fake location apps | Harder to fake route, activity, device, and peer-group consistency together |
| Detects only individual suspicious claims | Detects both individual fraud and coordinated fraud rings |
| Binary approve/reject behavior | Uses risk-based review flow with fairness safeguards |

---

### Outcome

With this addition, the platform can:

- detect GPS spoofing attempts
- identify coordinated fraud rings
- distinguish real stranded workers from false claims
- protect the liquidity pool from mass payout abuse
- maintain fairness for honest workers during real disruptions

This makes the product not only intelligent, but also **market-resilient under adversarial conditions**.

## Scope Boundaries

This solution only covers **income loss due to external disruptions**.

| Included | Not Included |
|---|---|
| Income-loss protection from rain, flood, heat, pollution, curfews, strikes, closures | Health insurance |
| Parametric payout logic | Life insurance |
| Weekly disruption-based coverage | Accident insurance |
| Hyperlocal risk-driven claims | Vehicle repair |

---

## Final Pitch

We are building a fair, scalable, and AI-driven insurance layer for gig workers.

By combining:

- parametric insurance
- hyperlocal hexagon-based risk intelligence
- dynamic weekly pricing
- automatic claim triggering
- insurer-grade fraud validation

we create a practical income-protection product for delivery workers who are currently underserved by traditional insurance.

## VIDEO 
<iframe width="560" height="315" src="https://www.youtube.com/embed/SeZs7KUXNXQ?si=DozhwZ7edoJ86lby" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


