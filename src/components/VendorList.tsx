import React from 'react';
import {
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { Vendor, RiskTier, ReviewStatus } from '../types/vendor';
import { getExpiryStatus } from '../utils/scoringEngine';

interface VendorListProps {
  vendors: Vendor[];
  viewMode: 'grid' | 'table';
  onSelectVendor: (vendor: Vendor) => void;
  onClearFilters?: () => void;
}

export const VendorList: React.FC<VendorListProps> = ({
  vendors,
  viewMode,
  onSelectVendor,
  onClearFilters,
}) => {
  if (vendors.length === 0) {
    return (
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          backdropFilter: 'blur(12px)',
        }}
      >
        <AlertTriangle size={36} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          No vendors match your search filters
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Try clearing your search keyword, category, or risk tier filters.
        </p>
        {onClearFilters && (
          <button type="button" className="btn btn-secondary" onClick={onClearFilters}>
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  const renderTierBadge = (tier: RiskTier) => {
    switch (tier) {
      case 'TIER_1_CRITICAL':
        return <span className="tier-badge tier-critical">Tier 1 • Critical</span>;
      case 'TIER_2_HIGH':
        return <span className="tier-badge tier-high">Tier 2 • High</span>;
      case 'TIER_3_MEDIUM':
        return <span className="tier-badge tier-medium">Tier 3 • Medium</span>;
      case 'TIER_4_LOW':
        return <span className="tier-badge tier-low">Tier 4 • Low</span>;
    }
  };

  const renderStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="status-badge status-approved">
            <CheckCircle2 size={12} /> Approved
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="status-badge status-in_review">
            <Clock size={12} /> In Review
          </span>
        );
      case 'NEEDS_REMEDIATION':
        return (
          <span className="status-badge status-needs_remediation">
            <AlertTriangle size={12} /> Needs Fixes
          </span>
        );
      case 'REJECTED':
        return (
          <span className="status-badge status-needs_remediation">
            <XCircle size={12} /> Rejected
          </span>
        );
    }
  };

  if (viewMode === 'table') {
    return (
      <div className="table-wrapper">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Category</th>
              <th>Risk Tier</th>
              <th>Scores (Inh / Mit / Res)</th>
              <th>Compliance Posture</th>
              <th>Review Status</th>
              <th>Next Review</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => {
              const soc2 = getExpiryStatus(v.certifications.soc2ExpiryDate);
              return (
                <tr key={v.id} onClick={() => onSelectVendor(v)}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{v.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Owner: {v.internalOwner}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {v.category}
                    </span>
                  </td>
                  <td>{renderTierBadge(v.scores.tier)}</td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      <span style={{ color: '#f87171' }}>{v.scores.inherentRisk}</span> /{' '}
                      <span style={{ color: '#34d399' }}>{v.scores.mitigatingScore}</span> /{' '}
                      <strong>{v.scores.residualRisk}</strong>
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {v.certifications.soc2Type2 && (
                        <span
                          className={`cert-pill ${
                            soc2.status === 'EXPIRED'
                              ? 'alert-expired'
                              : soc2.status === 'EXPIRING_SOON'
                              ? 'alert-soon'
                              : 'active'
                          }`}
                        >
                          SOC-2 {soc2.status === 'EXPIRED' && '⚠️'}
                        </span>
                      )}
                      {v.certifications.iso27001 && <span className="cert-pill active">ISO</span>}
                      {v.certifications.gdprDpaSigned ? (
                        <span className="cert-pill active">DPA</span>
                      ) : (
                        <span className="cert-pill alert-expired">No DPA</span>
                      )}
                      {v.isAIVendor && <span className="cert-pill ai-badge">AI</span>}
                    </div>
                  </td>
                  <td>{renderStatusBadge(v.reviewStatus)}</td>
                  <td style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                    {v.nextReviewDate}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVendor(v);
                      }}
                    >
                      Audit <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="vendor-cards-grid">
      {vendors.map((v) => {
        const soc2 = getExpiryStatus(v.certifications.soc2ExpiryDate);
        return (
          <div key={v.id} className="vendor-card" onClick={() => onSelectVendor(v)}>
            <div>
              {/* Card Top: Title, Category, Tier, Status */}
              <div className="vendor-card-top">
                <div className="vendor-title-wrap">
                  <div className="vendor-name">
                    <span>{v.name}</span>
                    {v.website && (
                      <a
                        href={v.website}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ color: 'var(--text-dim)' }}
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                  <span className="vendor-category">{v.category}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                  {renderTierBadge(v.scores.tier)}
                  {renderStatusBadge(v.reviewStatus)}
                </div>
              </div>

              {/* Description */}
              <p className="vendor-description">{v.description}</p>

              {/* Risk Score Section */}
              <div className="risk-meter-section">
                <div className="risk-meter-header">
                  <span>Residual Risk Index</span>
                  <span>
                    Controls: <strong>{v.scores.mitigatingScore}%</strong>
                  </span>
                </div>

                <div className="risk-meter-scores-row">
                  <div className="risk-residual-display">
                    <span
                      className="risk-score-big"
                      style={{
                        color:
                          v.scores.residualRisk >= 65
                            ? '#ef4444'
                            : v.scores.residualRisk >= 45
                            ? '#f59e0b'
                            : v.scores.residualRisk >= 25
                            ? '#818cf8'
                            : '#10b981',
                      }}
                    >
                      {v.scores.residualRisk}
                    </span>
                    <span className="risk-meter-subtext">/100 residual risk</span>
                  </div>

                  <span className="risk-meter-subtext" style={{ fontFamily: 'var(--font-mono)' }}>
                    Inherent: {v.scores.inherentRisk}
                  </span>
                </div>

                {/* Progress Visual */}
                <div className="progress-bar-container" style={{ marginTop: '0.5rem' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${v.scores.residualRisk}%`,
                      background:
                        v.scores.residualRisk >= 65
                          ? '#ef4444'
                          : v.scores.residualRisk >= 45
                          ? '#f59e0b'
                          : v.scores.residualRisk >= 25
                          ? '#818cf8'
                          : '#10b981',
                    }}
                  />
                </div>
              </div>

              {/* Certification & Compliance Badges */}
              <div className="cert-pills-row">
                {v.certifications.soc2Type2 && (
                  <span
                    className={`cert-pill ${
                      soc2.status === 'EXPIRED'
                        ? 'alert-expired'
                        : soc2.status === 'EXPIRING_SOON'
                        ? 'alert-soon'
                        : 'active'
                    }`}
                  >
                    SOC 2 Type II ({soc2.label})
                  </span>
                )}

                {v.certifications.iso27001 && <span className="cert-pill active">ISO 27001</span>}

                {v.certifications.gdprDpaSigned ? (
                  <span className="cert-pill active">Signed DPA</span>
                ) : v.processesCustomerData ? (
                  <span className="cert-pill alert-expired">Missing DPA</span>
                ) : null}

                {v.isAIVendor && (
                  <span className="cert-pill ai-badge">
                    <Sparkles size={10} style={{ display: 'inline', marginRight: '3px' }} />
                    {v.aiTrainingDataRetention ? 'AI (Trains Data)' : 'AI (Zero-Retention)'}
                  </span>
                )}

                {v.controls.ssoMfaEnforced && <span className="cert-pill active">SAML SSO</span>}
              </div>
            </div>

            {/* Footer */}
            <div className="vendor-card-footer">
              <span>
                Owner: <strong>{v.internalOwner}</strong>
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectVendor(v);
                }}
              >
                Inspect & Audit <ChevronRight size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
