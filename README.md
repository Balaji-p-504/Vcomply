# VendorPulse

A SaaS and AI vendor risk assessment platform built for SOC 2 (CC9.2) and ISO 27001 audit preparation.

## Links

- **Live Site:** [https://balaji-p-504.github.io/Vcomply/](https://balaji-p-504.github.io/Vcomply/)
- **Repository:** [https://github.com/Balaji-p-504/Vcomply](https://github.com/Balaji-p-504/Vcomply)

## Overview

Most engineering and security teams manage third-party vendor reviews in static spreadsheets. Over time, SOC 2 reports expire, Data Processing Agreements (DPAs) get forgotten, and teams lose track of whether new AI services are training on company data.

VendorPulse replaces manual spreadsheets with:
- A deterministic risk scoring model based on data sensitivity, integration depth, and tested security controls.
- Automatic certification expiration tracking (warning under 60 days, expired alerts).
- An 8-point SOC 2 CC9.2 readiness checklist with live progress tracking.
- A 2D risk matrix heatmap (inherent impact vs. control maturity).
- Side-by-side vendor comparisons.
- Printable auditor evidence dossiers (`window.print()`).
- Client-side LocalStorage persistence with realistic sample benchmark vendors.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Custom Vanilla CSS with CSS variables
- **Icons:** Lucide React
- **Testing:** Vitest (10 unit tests covering risk scoring and expiry logic)

## Getting Started

### Prerequisites

Node.js (v18 or higher) and npm.

### Installation

```bash
git clone https://github.com/Balaji-p-504/Vcomply.git
cd Vcomply
npm install
```

### Running Locally

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

The compiled output will be generated in `dist/`.

## Risk Scoring Model

The risk calculation uses a two-stage formula:

1. **Inherent Risk (10 - 100):**
   - **Data Classification:** Customer PII (35 pts), Financial/PCI (35 pts), Proprietary Code (30 pts), Internal Only (18 pts), Public (8 pts)
   - **Integration Depth:** Direct Database (30 pts), Production VPC (24 pts), Webhook/API (16 pts), Standalone Portal (8 pts)
   - **Business Criticality:** Mission Critical (25 pts), Essential (18 pts), Operational (11 pts), Non-Essential (5 pts)
   - **Customer Data Modifier:** +5 pts if processing customer data
   - **AI Data Policy:** +10 pts penalty if an AI vendor trains models on inputs; +5 mitigating credit if zero-retention is verified

2. **Residual Risk:**
   $$\text{Residual Risk} = \text{Inherent Risk} \times \left(1 - \frac{\text{Mitigating Score}}{100} \times 0.72\right)$$
   Compensating controls (SOC 2, ISO 27001, DPA, MFA/SSO, AES-256 encryption, annual pen-tests, and SLA hygiene) reduce risk by up to 72%.

3. **Risk Tiers:**
   - **Tier 1 (Critical):** Score $\ge 65$ (Quarterly review required)
   - **Tier 2 (High):** Score $45 - 64$ (Semi-annual review)
   - **Tier 3 (Medium):** Score $25 - 44$ (Annual review)
   - **Tier 4 (Low):** Score $< 25$ (Annual review)

## Author

Balaji P — Built for the VComply software development campus recruitment assignment.
