import React, { useState } from 'react';
import { X, ArrowLeftRight, CheckCircle2, XCircle, Minus } from 'lucide-react';
import type { Vendor } from '../types/vendor';
import { getExpiryStatus } from '../utils/scoringEngine';

interface VendorCompareModalProps {
  vendors: Vendor[];
  onClose: () => void;
  onSelectVendor: (vendor: Vendor) => void;
}

export const VendorCompareModal: React.FC<VendorCompareModalProps> = ({
  vendors,
  onClose,
  onSelectVendor,
}) => {
  const [leftId, setLeftId] = useState(vendors[0]?.id || '');
  const [rightId, setRightId] = useState(vendors[1]?.id || '');

  const left = vendors.find((v) => v.id === leftId);
  const right = vendors.find((v) => v.id === rightId);

  const renderCheck = (val: boolean) =>
    val ? (
      <CheckCircle2 size={16} color="#34d399" />
    ) : (
      <XCircle size={16} color="#f87171" />
    );

  const renderScoreCell = (val: number, otherVal: number, lowerIsBetter = false) => {
    const isBetter = lowerIsBetter ? val < otherVal : val > otherVal;
    const isWorse = lowerIsBetter ? val > otherVal : val < otherVal;
    return (
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          color: isBetter ? '#34d399' : isWorse ? '#f87171' : 'var(--text-main)',
        }}
      >
        {val}
      </span>
    );
  };

  type ComparisonRow = {
    label: string;
    getLeft: (v: Vendor) => React.ReactNode;
    getRight: (v: Vendor) => React.ReactNode;
  };

  const rows: ComparisonRow[] = [
    {
      label: 'Category',
      getLeft: (v) => v.category,
      getRight: (v) => v.category,
    },
    {
      label: 'Risk Tier',
      getLeft: (v) => <span className={`tier-badge ${v.scores.tier === 'TIER_1_CRITICAL' ? 'tier-critical' : v.scores.tier === 'TIER_2_HIGH' ? 'tier-high' : v.scores.tier === 'TIER_3_MEDIUM' ? 'tier-medium' : 'tier-low'}`}>{v.scores.tier.replace(/_/g, ' ')}</span>,
      getRight: (v) => <span className={`tier-badge ${v.scores.tier === 'TIER_1_CRITICAL' ? 'tier-critical' : v.scores.tier === 'TIER_2_HIGH' ? 'tier-high' : v.scores.tier === 'TIER_3_MEDIUM' ? 'tier-medium' : 'tier-low'}`}>{v.scores.tier.replace(/_/g, ' ')}</span>,
    },
    {
      label: 'Inherent Risk',
      getLeft: (v) => right ? renderScoreCell(v.scores.inherentRisk, right.scores.inherentRisk, true) : v.scores.inherentRisk,
      getRight: (v) => left ? renderScoreCell(v.scores.inherentRisk, left.scores.inherentRisk, true) : v.scores.inherentRisk,
    },
    {
      label: 'Controls Maturity',
      getLeft: (v) => right ? renderScoreCell(v.scores.mitigatingScore, right.scores.mitigatingScore) : v.scores.mitigatingScore,
      getRight: (v) => left ? renderScoreCell(v.scores.mitigatingScore, left.scores.mitigatingScore) : v.scores.mitigatingScore,
    },
    {
      label: 'Residual Risk',
      getLeft: (v) => right ? renderScoreCell(v.scores.residualRisk, right.scores.residualRisk, true) : v.scores.residualRisk,
      getRight: (v) => left ? renderScoreCell(v.scores.residualRisk, left.scores.residualRisk, true) : v.scores.residualRisk,
    },
    {
      label: 'Data Classification',
      getLeft: (v) => v.dataClassification.replace(/_/g, ' '),
      getRight: (v) => v.dataClassification.replace(/_/g, ' '),
    },
    {
      label: 'Integration Level',
      getLeft: (v) => v.integrationLevel.replace(/_/g, ' '),
      getRight: (v) => v.integrationLevel.replace(/_/g, ' '),
    },
    {
      label: 'SOC 2 Type II',
      getLeft: (v) => <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>{renderCheck(v.certifications.soc2Type2)} {v.certifications.soc2Type2 ? getExpiryStatus(v.certifications.soc2ExpiryDate).label : 'None'}</div>,
      getRight: (v) => <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>{renderCheck(v.certifications.soc2Type2)} {v.certifications.soc2Type2 ? getExpiryStatus(v.certifications.soc2ExpiryDate).label : 'None'}</div>,
    },
    {
      label: 'ISO 27001',
      getLeft: (v) => renderCheck(v.certifications.iso27001),
      getRight: (v) => renderCheck(v.certifications.iso27001),
    },
    {
      label: 'GDPR DPA Signed',
      getLeft: (v) => renderCheck(v.certifications.gdprDpaSigned),
      getRight: (v) => renderCheck(v.certifications.gdprDpaSigned),
    },
    {
      label: 'SAML SSO / MFA',
      getLeft: (v) => renderCheck(v.controls.ssoMfaEnforced),
      getRight: (v) => renderCheck(v.controls.ssoMfaEnforced),
    },
    {
      label: 'Encryption at Rest',
      getLeft: (v) => renderCheck(v.controls.encryptionAtRest),
      getRight: (v) => renderCheck(v.controls.encryptionAtRest),
    },
    {
      label: 'Annual Pen Test',
      getLeft: (v) => renderCheck(v.controls.annualPenTest),
      getRight: (v) => renderCheck(v.controls.annualPenTest),
    },
    {
      label: 'AI Vendor?',
      getLeft: (v) => v.isAIVendor ? (v.aiTrainingDataRetention ? '⚠️ Trains on Data' : '✅ Zero-Retention') : <Minus size={14} color="var(--text-dim)" />,
      getRight: (v) => v.isAIVendor ? (v.aiTrainingDataRetention ? '⚠️ Trains on Data' : '✅ Zero-Retention') : <Minus size={14} color="var(--text-dim)" />,
    },
    {
      label: 'SLA Uptime',
      getLeft: (v) => `${v.controls.slaUptimePercentage}%`,
      getRight: (v) => `${v.controls.slaUptimePercentage}%`,
    },
    {
      label: 'Incident Response',
      getLeft: (v) => `${v.controls.incidentResponseWindowHours}h`,
      getRight: (v) => `${v.controls.incidentResponseWindowHours}h`,
    },
    {
      label: 'Review Status',
      getLeft: (v) => v.reviewStatus,
      getRight: (v) => v.reviewStatus,
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '960px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ArrowLeftRight size={22} color="#6366f1" />
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                Side-by-Side Vendor Comparison
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Compare security posture, certifications, and risk scores
              </div>
            </div>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.25rem 1.75rem' }}>
          {/* Vendor Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <select
              className="form-select"
              value={leftId}
              onChange={(e) => setLeftId(e.target.value)}
              style={{ fontSize: '0.95rem', fontWeight: 700 }}
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>

            <div style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center' }}>
              <ArrowLeftRight size={18} />
            </div>

            <select
              className="form-select"
              value={rightId}
              onChange={(e) => setRightId(e.target.value)}
              style={{ fontSize: '0.95rem', fontWeight: 700 }}
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Comparison Table */}
          {left && right && (
            <div className="table-wrapper">
              <table className="vendor-table" style={{ fontSize: '0.82rem' }}>
                <thead>
                  <tr>
                    <th style={{ width: '30%' }}>Criterion</th>
                    <th style={{ width: '35%', cursor: 'pointer' }} onClick={() => onSelectVendor(left)}>
                      {left.name} ↗
                    </th>
                    <th style={{ width: '35%', cursor: 'pointer' }} onClick={() => onSelectVendor(right)}>
                      {right.name} ↗
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{row.label}</td>
                      <td>{row.getLeft(left)}</td>
                      <td>{row.getRight(right)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer no-print">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
