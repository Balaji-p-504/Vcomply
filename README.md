# VendorPulse 🛡️
> **Automated SaaS & AI Vendor Risk Assessment & SOC-2 CC9.2 Audit Readiness Platform**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/tests-10%20passed-success.svg)]()
[![Standard](https://img.shields.io/badge/compliance-SOC%202%20CC9.2%20%7C%20ISO%2027001-blue.svg)]()
[![Stack](https://img.shields.io/badge/tech-React%2019%20%7C%20TypeScript%20%7C%20Vite%20%7C%20Vanilla%20CSS-6366f1.svg)]()

---

## 📌 Executive Summary

Modern engineering teams adopt dozens of third-party SaaS vendors and AI APIs (OpenAI, AWS, GitHub, Stripe, Supabase, Datadog). During SOC 2 Type II or ISO 27001 audits, auditors evaluate **CC9.2 ("The entity assesses and manages risks associated with vendors and business partners")**.

Today, companies track this in chaotic, stale Google Sheets where SOC 2 renewals are missed, DPAs are unverified, and AI prompt training policies are unknown. **VendorPulse** replaces spreadsheets with an interactive, deterministic risk assessment engine, continuous certification tracking, and 1-click auditor-ready dossiers.

---

## 🚀 Live Demo & Local Quickstart

- **Live URL:** Deployed to Vercel / Netlify (accessible publicly)
- **Local Dev Server:**
  ```bash
  git clone <repo-url>
  cd Vcomply
  npm install
  npm run dev
  ```
- **Automated Test Suite:**
  ```bash
  npm test
  ```
  *(10/10 unit tests covering inherent risk calculation, residual risk equations, AI policy penalties, and certification expiry boundaries)*

- **Production Build:**
  ```bash
  npm run build
  ```

---

## 🎯 Target User & The Core Problem

- **Target Persona:** Engineering Managers, CTOs, Tech Leads, and Startup Compliance Officers / GRC Leads.
- **The Problem:** 
  1. **Audit Panic:** SOC 2 Type II reports expire every 12 months. Teams miss expirations and fail audits.
  2. **AI Exposure Risk:** In 2026, uncontrolled adoption of generative AI tools exposes proprietary code and customer PII to LLM training pipelines without signed zero-data-retention DPAs.
  3. **Subjective Risk Guessing:** Teams lack consistent mathematical formulas to weigh direct database integrations vs. standalone SaaS tools.

---

## 🧠 Risk Scoring Engine & Methodology

VendorPulse uses a transparent, deterministic algorithm:

$$\text{Inherent Risk (10--100)} = \text{Data Sensitivity} + \text{Integration Depth} + \text{Business Criticality} + \text{AI Retention Modifier}$$

$$\text{Residual Risk} = \text{Inherent Risk} \times \left(1 - \frac{\text{Mitigating Controls Score}}{100} \times 0.72\right)$$

- **Inherent Risk Factors:**
  - Data Classification: Customer PII (35 pts), Financial/PCI (35 pts), Proprietary Code (30 pts), Internal Only (18 pts), Public (8 pts)
  - Integration Level: Direct Database (30 pts), Production VPC (24 pts), Webhook/API (16 pts), Standalone Portal (8 pts)
  - Business Criticality: Mission Critical (25 pts), Essential (18 pts), Operational (11 pts), Non-Essential (5 pts)
  - AI Safety: Prompt data retention/training adds a +10 penalty; zero-retention guarantee adds +5 mitigating credit.
- **Residual Risk Tiers:**
  - **Tier 1 (Critical):** Residual $\ge 65$ (Quarterly Review)
  - **Tier 2 (High):** Residual $45 - 64$ (Semi-Annual Review)
  - **Tier 3 (Medium):** Residual $25 - 44$ (Annual Review)
  - **Tier 4 (Low):** Residual $< 25$ (Annual Review)

---

## ⚡ Key Features

1. **Executive GRC Dashboard:** Real-time KPI stat cards for SOC 2 CC9.2 Readiness %, High/Critical Risk Exposure count, Expiring/Expired Certifications alert banner, and Average Residual Risk index.
2. **2D Risk Matrix Heatmap:** Interactive heat map plotting Inherent Business Impact against Control Maturity with direct drill-down into vendor files.
3. **Interactive 5-Domain Control Checklist:** Toggle SOC 2, ISO 27001, DPA, SAML SSO/MFA, AES-256 encryption, and pen-tests inside any vendor profile with **real-time recalculation of risk scores**.
4. **Certification Expiration Tracking:** Automatically flags certificates expired or expiring within 60 days.
5. **SOC 2 CC9.2 Auditor Dossier:** Formatted AICPA-standard printable report (`window.print()`) featuring executive sign-off lines, vendor inventory register, and exception remediation tracking.
6. **Data Portability:** Instant 1-click CSV and JSON export, plus single-click benchmark demo data reset.

---

## 📝 Product Write-Up (Assignment Submission)

### 1. What problem does your tool solve, and who is the user?
VendorPulse solves the chaotic, spreadsheet-driven vendor risk review process for Engineering Managers and Startup Compliance Leads preparing for SOC 2 Type II (CC9.2) and ISO 27001 audits. As startups adopt cloud infrastructure and AI APIs (OpenAI, Anthropic, AWS, Supabase), tracking expiring annual audit reports, signed Data Processing Agreements (DPAs), and model training retention policies becomes a high-stakes liability. VendorPulse provides real-time risk scoring, continuous certification tracking, and 1-click auditor dossiers.

### 2. What were the two or three most important product decisions you made, and why?
First, **transparent deterministic risk scoring over black-box AI**: Auditors reject opaque AI scores; our mathematical formula (Inherent Risk $\times$ Mitigating Controls) produces defensible, auditable metrics.  
Second, **AI Governance as a first-class citizen**: Modern teams treat AI vendors differently; distinguishing between zero-data retention agreements and model training retention directly impacts data classification and residual risk.  
Third, **zero-friction client-side persistence with benchmark seeding**: Allowing instant evaluation with pre-seeded realistic industry vendors (AWS, Stripe, OpenAI, Supabase) and LocalStorage persistence means anyone can evaluate the tool end-to-end without login barriers.

### 3. What did you cut from scope, and what would you build next if you had more time?
We cut automated webhook scraping of vendor status pages and multi-tenant SSO procurement ticketing to focus strictly on the core auditor-readiness workflow. If given more time, we would build:
- Automated SOC 2 PDF report parsing via OCR to verify audit periods and auditor opinions automatically.
- Slack & Email webhook alerts 30 and 60 days prior to vendor certification expiry.

### 4. What broke or surprised you during development, and how did you handle it?
TypeScript's strict `verbatimModuleSyntax` and `noUnusedLocals` in Vite initially flagged type imports and unused icon bindings. We resolved this by refactoring to explicit `import type` definitions and pruning unreferenced symbols. Furthermore, handling date arithmetic for edge-case certification expiry (e.g. past dates vs leap days) required dedicated helper unit tests in Vitest to ensure accurate badge labeling.

---

## 🧪 Automated Testing Evidence

Vitest test suite runs with 10 passing tests in `<300ms`:
- `calculateInherentRisk`: Validates maximum risk bounds (100 cap), minimum bounds (10 min), and AI training penalties.
- `calculateMitigatingScore`: Tests enterprise control credits (SOC 2, ISO 27001, DPA, SSO, encryption).
- `calculateResidualRisk & Tier Assignment`: Tests risk reduction scaling and boundary tier thresholds (Tier 1 to Tier 4).
- `Certification Expiration Engine`: Tests past expired dates, future valid dates, and null/invalid date safety.

Run tests locally:
```bash
npm test
```

---

## 📄 License
MIT License. Built for VComply Campus Recruitment Build & Deploy Assignment.
