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
