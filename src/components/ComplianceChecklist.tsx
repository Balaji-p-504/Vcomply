import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Lock,
  Users,
  Activity,
  RefreshCw,
  Globe,
} from 'lucide-react';
import type { Vendor } from '../types/vendor';
import { getExpiryStatus } from '../utils/scoringEngine';

interface ComplianceChecklistProps {
  vendors: Vendor[];
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  check: (vendors: Vendor[]) => { passed: boolean; detail: string };
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'vendor-inventory',
    title: 'Complete Vendor Inventory',
    description: 'All third-party vendors are documented in a centralized register.',
    icon: <FileText size={18} />,
    check: (vendors) => {
      const count = vendors.length;
      return {
        passed: count >= 3,
        detail: `${count} vendor(s) registered.${count < 3 ? ' Add more vendors for complete coverage.' : ''}`,
      };
    },
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment Completed',
    description: 'Every vendor has been assessed with inherent and residual risk scores.',
    icon: <Activity size={18} />,
    check: (vendors) => {
      const assessed = vendors.filter((v) => v.scores.inherentRisk > 0 && v.scores.residualRisk > 0);
      return {
        passed: assessed.length === vendors.length && vendors.length > 0,
        detail: `${assessed.length}/${vendors.length} vendor(s) have completed risk scoring.`,
      };
    },
  },
  {
    id: 'soc2-coverage',
    title: 'SOC 2 Type II Coverage',
    description: 'All high-risk vendors have valid SOC 2 Type II reports on file.',
    icon: <ShieldCheck size={18} />,
    check: (vendors) => {
      const highRisk = vendors.filter(
        (v) => v.scores.tier === 'TIER_1_CRITICAL' || v.scores.tier === 'TIER_2_HIGH'
      );
      const withSoc2 = highRisk.filter((v) => {
        if (!v.certifications.soc2Type2) return false;
        const status = getExpiryStatus(v.certifications.soc2ExpiryDate);
        return status.status !== 'EXPIRED';
      });
      return {
        passed: highRisk.length === 0 || withSoc2.length === highRisk.length,
        detail: `${withSoc2.length}/${highRisk.length} high/critical-risk vendor(s) have valid SOC 2 reports.`,
      };
    },
  },
  {
    id: 'dpa-signed',
    title: 'DPA Signed for Customer Data Processors',
    description: 'All vendors processing customer PII have countersigned Data Processing Agreements.',
    icon: <Globe size={18} />,
    check: (vendors) => {
      const dataProcessors = vendors.filter((v) => v.processesCustomerData);
      const withDpa = dataProcessors.filter((v) => v.certifications.gdprDpaSigned);
      return {
        passed: dataProcessors.length === 0 || withDpa.length === dataProcessors.length,
        detail: `${withDpa.length}/${dataProcessors.length} data processor(s) have signed DPAs.`,
      };
    },
  },
  {
    id: 'encryption',
    title: 'Encryption Standards Met',
    description: 'All vendors enforce encryption at rest and in transit.',
    icon: <Lock size={18} />,
    check: (vendors) => {
      const encrypted = vendors.filter(
        (v) => v.controls.encryptionAtRest && v.controls.encryptionInTransit
      );
      return {
        passed: encrypted.length === vendors.length && vendors.length > 0,
        detail: `${encrypted.length}/${vendors.length} vendor(s) meet encryption requirements.`,
      };
    },
  },
  {
    id: 'identity-security',
    title: 'Identity & Access Controls',
    description: 'All business-essential vendors enforce SAML SSO and Multi-Factor Authentication.',
    icon: <Users size={18} />,
    check: (vendors) => {
      const essential = vendors.filter(
        (v) =>
          v.businessCriticality === 'MISSION_CRITICAL' ||
          v.businessCriticality === 'BUSINESS_ESSENTIAL'
      );
      const withSso = essential.filter((v) => v.controls.ssoMfaEnforced);
      return {
        passed: essential.length === 0 || withSso.length === essential.length,
        detail: `${withSso.length}/${essential.length} essential vendor(s) enforce SSO/MFA.`,
      };
    },
  },
  {
    id: 'cert-validity',
    title: 'No Expired Certifications',
    description: 'All vendor SOC 2 and ISO 27001 certifications are current and not expired.',
    icon: <RefreshCw size={18} />,
    check: (vendors) => {
      const expired = vendors.filter((v) => {
        const soc2 = getExpiryStatus(v.certifications.soc2ExpiryDate);
        const iso = getExpiryStatus(v.certifications.iso27001ExpiryDate);
        return soc2.status === 'EXPIRED' || iso.status === 'EXPIRED';
      });
      return {
        passed: expired.length === 0,
        detail:
          expired.length === 0
            ? 'All certifications are current.'
            : `${expired.length} vendor(s) have expired certifications: ${expired.map((v) => v.name).join(', ')}`,
      };
    },
  },
  {
    id: 'review-status',
    title: 'All Vendors Reviewed',
    description: 'No vendors remain in "Needs Remediation" status without a resolution plan.',
    icon: <CheckCircle2 size={18} />,
    check: (vendors) => {
      const needsFix = vendors.filter((v) => v.reviewStatus === 'NEEDS_REMEDIATION');
      return {
        passed: needsFix.length === 0,
        detail:
          needsFix.length === 0
            ? 'All vendor reviews are resolved.'
            : `${needsFix.length} vendor(s) need remediation: ${needsFix.map((v) => v.name).join(', ')}`,
      };
    },
  },
];

export const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({ vendors }) => {
  const results = CHECKLIST_ITEMS.map((item) => ({
    ...item,
    result: item.check(vendors),
  }));

  const passedCount = results.filter((r) => r.result.passed).length;
  const totalCount = results.length;
  const overallPercentage = Math.round((passedCount / totalCount) * 100);

  return (
    <div className="compliance-checklist-container">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={22} color="#6366f1" />
          SOC 2 CC9.2 Audit Readiness Checklist
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Pre-flight compliance verification against AICPA Trust Services Criteria for Vendor Management.
        </p>
      </div>

      {/* Overall Progress */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Audit Readiness Score
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              fontFamily: "'JetBrains Mono', monospace",
              color: overallPercentage >= 80 ? '#34d399' : overallPercentage >= 50 ? '#f59e0b' : '#ef4444',
            }}
          >
            {passedCount}/{totalCount} criteria met ({overallPercentage}%)
          </div>
        </div>

        <div className="progress-bar-container" style={{ width: '200px', height: '8px' }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${overallPercentage}%`,
              background:
                overallPercentage >= 80
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : overallPercentage >= 50
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
            }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {results.map((item, idx) => (
          <div
            key={item.id}
            className="checklist-item"
            style={{
              animationDelay: `${idx * 60}ms`,
            }}
          >
            <div className="checklist-status-indicator">
              {item.result.passed ? (
                <CheckCircle2 size={20} color="#34d399" />
              ) : (
                <AlertTriangle size={20} color="#f59e0b" />
              )}
            </div>

            <div className="checklist-icon-wrap" style={{ color: item.result.passed ? '#34d399' : '#f59e0b' }}>
              {item.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: item.result.passed ? '#fff' : '#fcd34d',
                }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>
                {item.description}
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: item.result.passed ? '#34d399' : '#fbbf24',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginTop: '0.25rem',
                }}
              >
                {item.result.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
