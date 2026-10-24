# VComply - Software Development Role Assignment Submission
**Candidate Submission Document**

---

## 1. Submission Details

| Requirement | Value / Link | Notes |
|---|---|---|
| **Candidate Name** | Balaji P | Campus Recruitment Round |
| **Project Name** | **VendorPulse** | Third-Party Vendor Risk & SOC 2 CC9.2 Audit Readiness Platform |
| **Primary Domain** | Governance, Risk, and Compliance (GRC) & Developer Security | Aligned with VComply's core product domain |
| **Deployed Application URL** | **https://balaji-p-504.github.io/Vcomply/** | Live, client-side persistence, fully interactive |
| **GitHub Repository URL** | **https://github.com/Balaji-p-504/Vcomply** | Clean commit history, zero secrets, complete documentation |
| **Tech Stack** | React 19, TypeScript, Vite, Vanilla CSS, Vitest | Fast, lightweight, zero bloated UI libraries |
| **Automated Tests** | 10 Unit Tests (`npm test`) | Inherent Risk, Controls Score, Residual Risk, Expiry Checks |

---

## 2. Product Write-Up

### 1. What problem does your tool solve, and who is the user?
I built VendorPulse to solve the chaotic, spreadsheet-driven vendor risk review process that engineering teams and compliance leads face when preparing for SOC 2 Type II audits (specifically CC9.2 for vendor risk management) and ISO 27001. As teams adopt cloud infrastructure and AI APIs (OpenAI, Anthropic, AWS, Supabase, Stripe), keeping track of expiring annual SOC 2 reports, signed Data Processing Agreements (DPAs), and third-party AI data retention policies becomes hard to manage manually. VendorPulse centralizes this into a single dashboard with real-time risk scoring, expiration tracking, and an audit-ready dossier export.

### 2. What were the two or three most important product decisions you made, and why?
1. **Deterministic scoring formula:** Auditors need to understand exactly how a risk score was produced. I chose a transparent formula based on data classification, integration depth, and tested compensating controls rather than arbitrary numbers.
2. **First-class AI governance:** With teams adopting LLM APIs, whether a vendor trains models on company data or provides a zero-retention guarantee is a major compliance question. I made this an explicit factor in the risk calculation.
3. **Client-side persistence with realistic seed data:** I pre-loaded realistic benchmark vendors (AWS, Stripe, OpenAI, GitHub, Supabase) and synced changes with LocalStorage. This allows anyone evaluating the app to test the full workflow immediately without needing to set up an account or database.

### 3. What did you cut from scope, and what would you build next if you had more time?
I kept the initial scope focused tightly on the auditor-readiness workflow. If I had more time, I would build:
- Automated PDF report parsing to read audit periods and auditor opinions directly from uploaded SOC 2 reports.
- Slack and email notifications to warn internal vendor owners 30 and 60 days before a certification expires.

### 4. What broke or surprised you during development, and how did you handle it?
One thing that required careful attention was handling date arithmetic for certification expirations. Different vendors provide reports at different points in the year, and calculating "expiring soon" (under 60 days) versus "expired" across leap years and timezone offsets needed dedicated unit tests in Vitest to ensure the UI badges always stayed accurate.

---

## 3. Demo Walkthrough Script (2–3 Minute Video)

Here is the flow for a quick screen recording demo:

1. **Overview & Dashboard (0:00 – 0:30):**
   - Introduce **VendorPulse**: A third-party vendor risk and SOC 2 CC9.2 readiness platform.
   - Walk through the **Dashboard Metrics**: Total vendors, SOC 2 readiness ring chart, residual risk average, and the red banner flagging vendors that need immediate remediation or have expired certs.
2. **SOC 2 Readiness Checklist & Risk Matrix (0:30 – 1:00):**
   - Switch to the **SOC 2 Readiness** tab to show the 8-point automated audit checklist and overall pass/fail status.
   - Switch to the **Risk Matrix Heatmap** tab to show how vendors are placed in a 3x4 grid mapping business impact against control maturity.
3. **Inspection Modal & Side-by-Side Comparison (1:00 – 1:45):**
   - Open a vendor like **AWS** or **PulseTrack Metrics** to show the detailed security controls checklist.
   - Toggle a control live to show the risk scores recalculating instantly.
   - Click **Compare** in the navbar to open the side-by-side comparison modal between any two vendors.
4. **Onboarding & Filters (1:45 – 2:20):**
   - Click **New Vendor** and use a quick preset (like Cloudflare or Anthropic) to demonstrate the intake form and live score preview.
   - Filter by **AI Services** or **Expiring Soon**, and toggle between grid and table views.
5. **Audit Dossier & Conclusion (2:20 – 2:45):**
   - Click **Audit Dossier** to display the formal printable SOC 2 report view with signature blocks.
   - Mention the 10 passing unit tests (`npm test`) and conclude.

---

## 4. Manual Deployment & Local Run

- **Run Locally:**
  ```bash
  git clone https://github.com/Balaji-p-504/Vcomply.git
  cd Vcomply
  npm install
  npm run dev
  ```
- **Run Tests:**
  ```bash
  npm test
  ```
- **Manual Build & Deploy:**
  ```bash
  npm run build
  ```
  *(To deploy manually to GitHub Pages, trigger the workflow from the Actions tab on GitHub or publish the `dist/` directory).*
