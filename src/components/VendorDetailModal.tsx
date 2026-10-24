import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  History,
  Save,
  Check,
} from 'lucide-react';
import type { Vendor, ReviewStatus } from '../types/vendor';
import { computeCompleteScores, getExpiryStatus } from '../utils/scoringEngine';

interface VendorDetailModalProps {
  vendor: Vendor;
  onClose: () => void;
  onUpdateVendor: (updated: Vendor) => void;
  onDeleteVendor: (id: string) => void;
}

export const VendorDetailModal: React.FC<VendorDetailModalProps> = ({
  vendor,
  onClose,
  onUpdateVendor,
  onDeleteVendor,
}) => {
  const [formData, setFormData] = useState<Vendor>({ ...vendor });
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Recalculate scores whenever controls or certifications are updated
  const recalculateAndSet = (updates: Partial<Vendor>) => {
    const updatedVendor = { ...formData, ...updates };
    const newScores = computeCompleteScores({
      businessCriticality: updatedVendor.businessCriticality,
      dataClassification: updatedVendor.dataClassification,
      integrationLevel: updatedVendor.integrationLevel,
      processesCustomerData: updatedVendor.processesCustomerData,
      isAIVendor: updatedVendor.isAIVendor,
      aiTrainingDataRetention: updatedVendor.aiTrainingDataRetention,
      certifications: updatedVendor.certifications,
      controls: updatedVendor.controls,
    });

    updatedVendor.scores = newScores;
    setFormData(updatedVendor);
  };

  const toggleCertification = (key: keyof Vendor['certifications']) => {
    const newCerts = {
      ...formData.certifications,
      [key]: !formData.certifications[key],
    };
    recalculateAndSet({ certifications: newCerts });
  };

  const toggleControl = (key: keyof Vendor['controls']) => {
    const newControls = {
      ...formData.controls,
      [key]: !formData.controls[key],
    };
    recalculateAndSet({ controls: newControls });
  };

  const handleReviewStatusChange = (newStatus: ReviewStatus) => {
    const newLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action: `Status changed to ${newStatus}`,
      actor: 'Current Auditor / Security Lead',
      details: formData.auditNotes || 'Updated vendor assessment status in audit register.',
    };

    const updated = {
      ...formData,
      reviewStatus: newStatus,
      lastAssessedDate: new Date().toISOString().split('T')[0],
      auditLog: [newLogEntry, ...formData.auditLog],
    };

    setFormData(updated);
    onUpdateVendor(updated);
    triggerSaved();
  };

  const handleSave = () => {
    onUpdateVendor(formData);
    triggerSaved();
  };

  const triggerSaved = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const soc2Status = getExpiryStatus(formData.certifications.soc2ExpiryDate);
  const isoStatus = getExpiryStatus(formData.certifications.iso27001ExpiryDate);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  {formData.name}
                </h2>
                {formData.website && (
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {formData.category} • Internal Owner: <strong>{formData.internalOwner}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {showSavedToast && (
              <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Check size={14} /> Changes Saved!
              </span>
            )}
            <button type="button" className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Top Risk Scores Summary Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              background: 'rgba(15, 23, 42, 0.7)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                INHERENT RISK
              </div>
              <div
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  fontFamily: var_mono,
                  color: '#f87171',
                }}
              >
                {formData.scores.inherentRisk}
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>/100</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Based on data sensitivity & architecture
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                CONTROLS MATURITY
              </div>
              <div
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  fontFamily: var_mono,
                  color: '#34d399',
                }}
              >
                {formData.scores.mitigatingScore}
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>%</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Verified security controls
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                RESIDUAL AUDIT RISK
              </div>
              <div
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  fontFamily: var_mono,
                  color:
                    formData.scores.residualRisk >= 65
                      ? '#ef4444'
                      : formData.scores.residualRisk >= 45
                      ? '#f59e0b'
                      : '#10b981',
                }}
              >
                {formData.scores.residualRisk}
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>/100</span>
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                {formData.scores.tier.replace(/_/g, ' ')}
              </div>
            </div>
          </div>

          {/* Interactive SOC-2 Control Verification Checklist */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                Interactive Compliance & Security Controls Checklist
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Toggling controls updates score dynamically
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <label className="checkbox-card">
                <input
                  type="checkbox"
                  checked={formData.certifications.soc2Type2}
                  onChange={() => toggleCertification('soc2Type2')}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                    SOC 2 Type II Certified
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    AICPA Trust Services Criteria report on file
                  </div>
                </div>
              </label>

              <label className="checkbox-card">
                <input
                  type="checkbox"
                  checked={formData.certifications.iso27001}
                  onChange={() => toggleCertification('iso27001')}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                    ISO/IEC 27001 Certified
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Information security management system verified
                  </div>
                </div>
              </label>

              <label className="checkbox-card">
                <input
                  type="checkbox"
                  checked={formData.certifications.gdprDpaSigned}
                  onChange={() => toggleCertification('gdprDpaSigned')}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                    Countersigned GDPR / CCPA DPA
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Data Processing Agreement with SCCs
                  </div>
                </div>
              </label>

              <label className="checkbox-card">
                <input
                  type="checkbox"
                  checked={formData.controls.ssoMfaEnforced}
                  onChange={() => toggleControl('ssoMfaEnforced')}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                    Enforced SAML SSO / Multi-Factor Auth
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Corporate IdP integration (Okta, Azure AD)
                  </div>
                </div>
              </label>

              <label className="checkbox-card">
                <input
                  type="checkbox"
                  checked={formData.controls.encryptionAtRest}
                  onChange={() => toggleControl('encryptionAtRest')}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                    Data Encrypted at Rest (AES-256)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    KMS-managed keys with rotation
                  </div>
                </div>
              </label>

              <label className="checkbox-card">
                <input
                  type="checkbox"
                  checked={formData.controls.annualPenTest}
                  onChange={() => toggleControl('annualPenTest')}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                    Annual Independent Pen Test
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Third-party CREST/OSCP security audit
                  </div>
                </div>
              </label>

              {formData.isAIVendor && (
                <label className="checkbox-card" style={{ gridColumn: 'span 2', borderColor: 'rgba(168, 85, 247, 0.4)' }}>
                  <input
                    type="checkbox"
                    checked={!formData.aiTrainingDataRetention}
                    onChange={() =>
                      recalculateAndSet({ aiTrainingDataRetention: !formData.aiTrainingDataRetention })
                    }
                  />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#d8b4fe' }}>
                      Zero Data Retention / No AI Prompt Training Guarantee
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Checked: Vendor contractually commits NOT to train models on company prompts or customer data.
                    </div>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Certification Expiry Dates */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                SOC 2 Type II Expiry Date ({soc2Status.label})
              </label>
              <input
                type="date"
                className="form-input"
                value={formData.certifications.soc2ExpiryDate || ''}
                onChange={(e) => {
                  const newCerts = { ...formData.certifications, soc2ExpiryDate: e.target.value };
                  recalculateAndSet({ certifications: newCerts });
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                ISO 27001 Expiry Date ({isoStatus.label})
              </label>
              <input
                type="date"
                className="form-input"
                value={formData.certifications.iso27001ExpiryDate || ''}
                onChange={(e) => {
                  const newCerts = { ...formData.certifications, iso27001ExpiryDate: e.target.value };
                  recalculateAndSet({ certifications: newCerts });
                }}
              />
            </div>
          </div>

          {/* Audit Notes Field */}
          <div className="form-group">
            <label className="form-label">Auditor Notes & Remediation Directives</label>
            <textarea
              className="form-textarea"
              placeholder="Enter audit observations, compensating controls, or specific remediation instructions for engineering..."
              value={formData.auditNotes}
              onChange={(e) => setFormData({ ...formData, auditNotes: e.target.value })}
            />
          </div>

          {/* Audit History Timeline */}
          <div>
            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <History size={15} color="#818cf8" />
              Audit Log & Review Timeline
            </h4>
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.75rem',
                maxHeight: '130px',
                overflowY: 'auto',
                fontSize: '0.75rem',
              }}
            >
              {formData.auditLog.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '0.4rem 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <strong>{log.action}</strong>
                    <span style={{ fontFamily: var_mono }}>{log.timestamp}</span>
                  </div>
                  <div style={{ color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                    By {log.actor} • {log.details}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer: Decisions & Actions */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${formData.name} from the audit register?`)) {
                onDeleteVendor(formData.id);
                onClose();
              }
            }}
          >
            Delete Vendor
          </button>

          <div style={{ flex: 1 }} />

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleReviewStatusChange('NEEDS_REMEDIATION')}
          >
            <AlertTriangle size={14} color="#f87171" />
            <span>Flag Remediation</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleReviewStatusChange('APPROVED')}
          >
            <CheckCircle2 size={14} color="#34d399" />
            <span>Approve Vendor</span>
          </button>

          <button type="button" className="btn btn-primary btn-sm" onClick={handleSave}>
            <Save size={14} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const var_mono = "'JetBrains Mono', monospace";
