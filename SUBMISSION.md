# VComply - Software Development Role Assignment Submission
**Candidate Submission Document**

---

## 1. Submission Details

| Requirement | Value / Link | Notes |
|---|---|---|
| **Candidate Name** | Balaji P | Campus Recruitment Round |
| **Project Name** | **VendorPulse** | B2B Third-Party Vendor Risk & SOC 2 CC9.2 Audit Readiness Platform |
| **Primary Domain** | Governance, Risk, and Compliance (GRC) & Developer Security | Directly aligned with VComply's core product ecosystem |
| **Deployed Application URL** | **https://balaji-p-504.github.io/Vcomply/** | Fully functional, zero-setup required, tested end-to-end |
| **GitHub Repository URL** | **https://github.com/Balaji-p-504/Vcomply** | Clean commit history, zero secrets, comprehensive README |
| **Tech Stack** | React 19, TypeScript 5.8, Vite, Vanilla CSS Design System, Vitest | Zero heavy UI frameworks; custom dark-mode glassmorphism tokens |
| **Automated Tests** | 10 Passing Unit Tests (`npm test`) | Covers Inherent Risk, Controls Score, Residual Risk, Expiry Calculation |

---

## 2. Product Write-Up (Max 400 Words)

### 1. What problem does your tool solve, and who is the user?
VendorPulse solves the chaotic, spreadsheet-driven vendor risk review process for Engineering Managers, CTOs, and Startup Compliance Leads preparing for SOC 2 Type II (Common Criteria CC9.2: Vendor Risk Management) and ISO 27001 (A.15) audits. As engineering teams rapidly adopt external cloud infrastructure and AI APIs (OpenAI, Anthropic, AWS, Supabase, Stripe), tracking expiring annual SOC 2 reports, countersigned Data Processing Agreements (DPAs), and third-party model training retention policies becomes a high-stakes compliance liability. VendorPulse provides real-time algorithmic risk scoring, continuous certification tracking, and 1-click auditor-ready dossiers.

### 2. What were the two or three most important product decisions you made, and why?
1. **Deterministic mathematical scoring over black-box AI:** Auditors reject opaque automated scores. We engineered a transparent, defensible formula ($\text{Residual Risk} = \text{Inherent Risk} \times [1 - \text{Mitigating Controls} \times 0.72]$) based on data classification, integration depth, and tested compensating controls.
2. **AI Governance as a first-class citizen:** Modern companies face new liabilities from generative AI. Distinguishing between zero-data retention agreements and model training retention directly impacts the vendor's data classification and residual risk tier.
3. **Zero-friction client-side persistence with benchmark seeding:** Providing pre-seeded realistic vendors (AWS, Stripe, OpenAI, Supabase, Datadog) with LocalStorage synchronization allows any evaluator to test the complete end-to-end flow immediately without sign-up friction.

### 3. What did you cut from scope, and what would you build next if you had more time?
We cut automated webhook scraping of vendor status pages and multi-tenant SSO procurement ticketing to focus strictly on the core auditor-readiness workflow. If given more time, we would build:
- Automated SOC 2 Type II PDF report parsing via OCR to verify audit periods, testing exceptions, and auditor opinions automatically.
- Slack & Email webhook alerts triggering 30 and 60 days prior to vendor certification expiration.

### 4. What broke or surprised you during development, and how did you handle it?
TypeScript's strict `verbatimModuleSyntax` and `noUnusedLocals` in Vite initially flagged type imports and unused icon bindings. We resolved this by refactoring to explicit `import type` definitions and pruning unreferenced symbols. Furthermore, handling date arithmetic for edge-case certification expiry (e.g. past dates vs leap days) required dedicated helper unit tests in Vitest to ensure accurate badge labeling.

---

## 3. Demo Walkthrough Script (For 2–3 Minute Video)

Follow this 5-step script when recording your 2–3 minute Loom or screen recording:

1. **Introduction & Animated Dashboard (0:00 – 0:30):**
   - Introduce **VendorPulse**: B2B SaaS & AI vendor risk management tool built for SOC 2 CC9.2 compliance.
   - Point out the **Executive Dashboard**: Animated SVG Donut Ring Charts for SOC 2 Readiness and Residual Risk, smooth count-up KPI metrics, risk exposure distribution bar, and the red **Urgent Compliance Attention Required** banner.
2. **SOC 2 CC9.2 Readiness Checklist & 2D Matrix (0:30 – 1:00):**
   - Click the **SOC 2 Readiness** tab to show the 8 automated pre-flight audit validation criteria with real-time pass/fail progress bar.
   - Switch to the **Risk Matrix Heatmap** tab: show how vendors are placed into a 3x4 grid mapping **Inherent Impact** against **Control Maturity**.
3. **Deep-Dive Audit Inspection & Side-by-Side Comparison (1:00 – 1:45):**
   - Click on **Amazon Web Services (AWS)** or **PulseTrack Metrics** to open the inspection workspace.
   - **Toggle a control checkbox live:** Show how the Inherent Risk, Controls Score, and Residual Risk update dynamically in real time, and show the audit log trail.
   - Click **Compare** in the navbar to open the **Side-by-Side Vendor Comparison Modal**: highlight the color-coded score advantages and controls comparison.
4. **Vendor Onboarding & Search/Filters (1:45 – 2:20):**
   - Click **New Vendor** in the top bar.
   - Click the **+ Cloudflare** or **+ Anthropic** quick pre-fill button to show the live risk score estimator in action.
   - Click **Complete Intake & Onboard** to add the vendor.
   - Test the search bar (type "OpenAI") and toggle the quick filters (**Expiring Soon**, **AI Services**, **Missing DPA**).
   - Switch between **Card Grid** and **Compact Table View**.
5. **Auditor Dossier & Conclusion (2:20 – 2:45):**
   - Click **Audit Dossier** in the header.
   - Show the formal AICPA-formatted SOC 2 CC9.2 evidence dossier with executive summary, exception tracking, vendor risk register, and management sign-off signature blocks.
   - Mention the 10 passing Vitest unit tests (`npm test`) and wrap up.

---

## 4. How to Publish & Submit

1. **Push to your GitHub:**
   ```bash
   git remote add origin https://github.com/<your-username>/vendorpulse.git
   git branch -M main
   git push -u origin main
   ```
   *(The included GitHub Actions workflow `.github/workflows/deploy.yml` will automatically build and publish to GitHub Pages!)*
2. **Deploy to Vercel / Netlify (Alternative 1-click):**
   - Import the GitHub repo into Vercel or Netlify.
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Send Email Submission:**
   - **To:** `swati.m@v-comply.com`
   - **Subject:** `VComply Software Development Role Assignment - Candidate Name`
   - **Body:** Attach the live URL, GitHub URL, Product Write-Up from above, and your demo video link.
