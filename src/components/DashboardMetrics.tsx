import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Database,
} from 'lucide-react';
import type { DashboardMetrics as MetricsType, Vendor } from '../types/vendor';

interface DashboardMetricsProps {
  metrics: MetricsType;
  vendors: Vendor[];
  onFilterExpiring: () => void;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  metrics,
  vendors,
  onFilterExpiring,
}) => {
  // Find at-risk vendors for urgent notification banner
  const atRiskVendors = vendors.filter(
    (v) =>
      v.reviewStatus === 'NEEDS_REMEDIATION' ||
      (v.certifications.soc2ExpiryDate &&
        new Date(v.certifications.soc2ExpiryDate).getTime() < Date.now()) ||
      (v.processesCustomerData && !v.certifications.gdprDpaSigned)
  );

  return (
    <div>
      {/* Urgent Action Banner if at-risk vendors exist */}
      {atRiskVendors.length > 0 && (
        <div className="urgent-banner">
          <div className="urgent-banner-content">
            <AlertTriangle size={18} color="#ef4444" />
            <div>
              <strong>Compliance Attention Required:</strong> {atRiskVendors.length}{' '}
              vendor(s) have expired certifications, missing DPAs, or flagged remediation items.
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={onFilterExpiring}
          >
            Review At-Risk Vendors <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="metrics-grid">
        {/* Card 1: SOC 2 Readiness */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-label">SOC-2 CC9.2 Readiness</span>
            <div
              className="metric-card-icon"
              style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}
            >
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="metric-card-value">{metrics.complianceReadinessScore}%</div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${metrics.complianceReadinessScore}%` }}
            />
          </div>
          <div className="metric-card-footer" style={{ marginTop: '0.6rem' }}>
            <span className="badge-trend-good">
              {metrics.approvedCount}/{metrics.totalVendors} Approved
            </span>
            <span>meeting criteria</span>
          </div>
        </div>

        {/* Card 2: Risk Exposure Distribution */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-label">Risk Exposure</span>
            <div
              className="metric-card-icon"
              style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}
            >
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="metric-card-value">
            {metrics.tier1CriticalCount + metrics.tier2HighCount}
            <span style={{ fontSize: '1rem', color: 'var(--text-dim)', marginLeft: '0.35rem' }}>
              high/critical
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', fontSize: '0.75rem' }}>
            <span style={{ color: '#ef4444' }}>● Tier 1: {metrics.tier1CriticalCount}</span>
            <span style={{ color: '#f59e0b' }}>● Tier 2: {metrics.tier2HighCount}</span>
            <span style={{ color: '#818cf8' }}>● Tier 3: {metrics.tier3MediumCount}</span>
            <span style={{ color: '#10b981' }}>● Tier 4: {metrics.tier4LowCount}</span>
          </div>
        </div>

        {/* Card 3: Expiring Certifications */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-label">Expiring Certs (&lt;60d)</span>
            <div
              className="metric-card-icon"
              style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}
            >
              <Clock size={18} />
            </div>
          </div>
          <div className="metric-card-value">{metrics.expiringCertCount}</div>
          <div className="metric-card-footer">
            {metrics.expiringCertCount > 0 ? (
              <span className="badge-trend-alert">Action required before audit</span>
            ) : (
              <span className="badge-trend-good">All certificates active</span>
            )}
          </div>
        </div>

        {/* Card 4: AI & LLM Governance */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-label">AI & LLM Governance</span>
            <div
              className="metric-card-icon"
              style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#d8b4fe' }}
            >
              <Sparkles size={18} />
            </div>
          </div>
          <div className="metric-card-value">{metrics.aiVendorCount}</div>
          <div className="metric-card-footer">
            <span style={{ color: '#d8b4fe' }}>Zero-retention vetted</span>
            <span>& prompt isolated</span>
          </div>
        </div>

        {/* Card 5: Avg Security Posture */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-label">Avg Residual Risk</span>
            <div
              className="metric-card-icon"
              style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}
            >
              <Database size={18} />
            </div>
          </div>
          <div className="metric-card-value">{metrics.avgResidualRisk}/100</div>
          <div className="metric-card-footer">
            <span className="badge-trend-good">72% risk reduction</span>
            <span>via controls</span>
          </div>
        </div>
      </div>
    </div>
  );
};
