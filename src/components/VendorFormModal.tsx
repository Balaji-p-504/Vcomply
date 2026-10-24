import React, { useState } from 'react';
import { X, PlusCircle, Sparkles, ShieldCheck } from 'lucide-react';
import type {
  Vendor,
  VendorCategory,
  BusinessCriticality,
  DataClassification,
  IntegrationLevel,
  VendorCertifications,
} from '../types/vendor';
import { computeCompleteScores } from '../utils/scoringEngine';
import { VENDOR_PRESETS } from '../utils/sampleData';

interface VendorFormModalProps {
  onClose: () => void;
  onSaveVendor: (newVendor: Vendor) => void;
}

export const VendorFormModal: React.FC<VendorFormModalProps> = ({
  onClose,
  onSaveVendor,
}) => {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VendorCategory>('Developer Tooling');
  const [internalOwner, setInternalOwner] = useState('Platform Team');
  const [primaryContact, setPrimaryContact] = useState('');
  const [businessCriticality, setBusinessCriticality] = useState<BusinessCriticality>('BUSINESS_ESSENTIAL');
  const [dataClassification, setDataClassification] = useState<DataClassification>('CUSTOMER_PII');
  const [integrationLevel, setIntegrationLevel] = useState<IntegrationLevel>('API_WEBHOOK');
  const [processesCustomerData, setProcessesCustomerData] = useState(true);
  const [isAIVendor, setIsAIVendor] = useState(false);
  const [aiTrainingDataRetention, setAiTrainingDataRetention] = useState(false);

  const [certifications, setCertifications] = useState<VendorCertifications>({
    soc2Type2: true,
    soc2ExpiryDate: '2027-06-30',
    iso27001: true,
    iso27001ExpiryDate: '2027-05-30',
    hipaa: false,
    gdprDpaSigned: true,
    fedramp: false,
  });

  const [controls, setControls] = useState({
    encryptionAtRest: true,
    encryptionInTransit: true,
    ssoMfaEnforced: true,
    annualPenTest: true,
    incidentResponseWindowHours: 24,
    slaUptimePercentage: 99.95,
    disasterRecoveryTested: true,
    subprocessorsDocumented: true,
  });

  const [auditNotes, setAuditNotes] = useState('');

  // Live real-time score calculation preview
  const liveScores = computeCompleteScores({
    businessCriticality,
    dataClassification,
    integrationLevel,
    processesCustomerData,
    isAIVendor,
    aiTrainingDataRetention,
    certifications,
    controls,
  });

  const loadPreset = (presetIndex: number) => {
    const preset = VENDOR_PRESETS[presetIndex];
    if (!preset) return;
    setName(preset.name);
    setWebsite(preset.website);
    setDescription(preset.description);
    setCategory(preset.category);
    setInternalOwner(preset.internalOwner);
    setPrimaryContact(preset.primaryContact);
    setBusinessCriticality(preset.businessCriticality);
    setDataClassification(preset.dataClassification);
    setIntegrationLevel(preset.integrationLevel);
    setProcessesCustomerData(preset.processesCustomerData);
    setIsAIVendor(preset.isAIVendor);
    setAiTrainingDataRetention(preset.aiTrainingDataRetention);
    setCertifications(preset.certifications);
    setControls(preset.controls);
    setAuditNotes(preset.auditNotes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a vendor name.');
      return;
    }

    const newVendor: Vendor = {
      id: `vend-${Date.now()}`,
      name: name.trim(),
      website: website.trim(),
      description: description.trim() || 'No description provided.',
      category,
      internalOwner: internalOwner.trim() || 'Engineering',
      primaryContact: primaryContact.trim() || 'security@vendor.com',
      reviewStatus: 'IN_REVIEW',
      lastAssessedDate: new Date().toISOString().split('T')[0],
      nextReviewDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      businessCriticality,
      dataClassification,
      integrationLevel,
      processesCustomerData,
      isAIVendor,
      aiTrainingDataRetention,
      certifications,
      controls,
      scores: liveScores,
      auditNotes: auditNotes.trim() || 'Initial vendor security onboarding.',
      auditLog: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          action: 'Vendor Intake Onboarding Completed',
          actor: 'Security Reviewer',
          details: `Initial risk assessment computed: ${liveScores.tier} (Residual: ${liveScores.residualRisk})`,
        },
      ],
    };

    onSaveVendor(newVendor);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          {/* Modal Header */}
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <PlusCircle size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  Onboard New Third-Party Vendor
                </h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  SOC-2 CC9.2 Security Intake & Inherent Risk Assessment
                </div>
              </div>
            </div>

            <button type="button" className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            {/* Quick Preset Selector */}
            <div
              style={{
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
                <Sparkles size={16} color="#818cf8" />
                <span style={{ color: '#e0e7ff', fontWeight: 600 }}>Quick Pre-fill Template:</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {VENDOR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem' }}
                    onClick={() => loadPreset(idx)}
                  >
                    + {preset.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Risk Score Preview Bar */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-bright)',
                borderRadius: '10px',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={20} color="#6366f1" />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    LIVE ESTIMATED RISK SCORE
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                    Inherent:{' '}
                    <span style={{ color: '#f87171' }}>{liveScores.inherentRisk}</span> | Controls:{' '}
                    <span style={{ color: '#34d399' }}>{liveScores.mitigatingScore}%</span> | Residual:{' '}
                    <span
                      style={{
                        color:
                          liveScores.residualRisk >= 65
                            ? '#ef4444'
                            : liveScores.residualRisk >= 45
                            ? '#f59e0b'
                            : '#10b981',
                      }}
                    >
                      {liveScores.residualRisk}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`tier-badge ${
                  liveScores.tier === 'TIER_1_CRITICAL'
                    ? 'tier-critical'
                    : liveScores.tier === 'TIER_2_HIGH'
                    ? 'tier-high'
                    : liveScores.tier === 'TIER_3_MEDIUM'
                    ? 'tier-medium'
                    : 'tier-low'
                }`}
              >
                {liveScores.tier.replace(/_/g, ' ')}
              </div>
            </div>

            {/* Section 1: Basic Information */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Vendor Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Supabase, OpenAI, Pinecone"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Website URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as VendorCategory)}
                >
                  <option value="AI & LLMs">AI & LLMs</option>
                  <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                  <option value="Developer Tooling">Developer Tooling</option>
                  <option value="Data & Analytics">Data & Analytics</option>
                  <option value="Payments & Billing">Payments & Billing</option>
                  <option value="Security & Auth">Security & Auth</option>
                  <option value="Productivity & Collaboration">Productivity</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Internal Engineering Owner</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. SRE Team, Alex Mercer"
                  value={internalOwner}
                  onChange={(e) => setInternalOwner(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Service Description & Use Case</label>
              <textarea
                className="form-textarea"
                placeholder="Describe how this vendor interacts with production data or engineering systems..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Section 2: Architecture & Data Sensitivity */}
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginTop: '0.5rem' }}>
              Architecture & Data Sensitivity
            </h3>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Data Classification</label>
                <select
                  className="form-select"
                  value={dataClassification}
                  onChange={(e) => setDataClassification(e.target.value as DataClassification)}
                >
                  <option value="CUSTOMER_PII">Customer PII (Names, Emails, User Records)</option>
                  <option value="FINANCIAL_PAYMENTS">Financial & Payment Card Data</option>
                  <option value="PROPRIETARY_CODE">Proprietary Source Code & Secrets</option>
                  <option value="INTERNAL_ONLY">Internal Only Business Telemetry</option>
                  <option value="PUBLIC_DATA">Public Data / Marketing Telemetry</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Integration Level</label>
                <select
                  className="form-select"
                  value={integrationLevel}
                  onChange={(e) => setIntegrationLevel(e.target.value as IntegrationLevel)}
                >
                  <option value="DATABASE_DIRECT">Direct Database Connection</option>
                  <option value="PRODUCTION_VPC">Production VPC Peering / Cloud Operator</option>
                  <option value="API_WEBHOOK">API Endpoints / Webhook Ingestion</option>
                  <option value="STANDALONE_PORTAL">Standalone Browser SaaS Portal</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Business Criticality</label>
                <select
                  className="form-select"
                  value={businessCriticality}
                  onChange={(e) => setBusinessCriticality(e.target.value as BusinessCriticality)}
                >
                  <option value="MISSION_CRITICAL">Mission Critical (Outage halts business &lt;1h)</option>
                  <option value="BUSINESS_ESSENTIAL">Business Essential (Tolerates &lt;4h outage)</option>
                  <option value="OPERATIONAL">Operational (Tolerates &lt;24h outage)</option>
                  <option value="NON_ESSENTIAL">Non-Essential (Tolerates &gt;24h outage)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Primary Vendor Contact Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="security@vendor.com"
                  value={primaryContact}
                  onChange={(e) => setPrimaryContact(e.target.value)}
                />
              </div>
            </div>

            {/* AI Flags */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <label className="checkbox-card">
                <input
                  type="checkbox"
                  checked={isAIVendor}
                  onChange={(e) => setIsAIVendor(e.target.checked)}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                    Is Generative AI / LLM Vendor?
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Processes text embeddings, chat, or models
                  </div>
                </div>
              </label>

              {isAIVendor && (
                <label className="checkbox-card" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                  <input
                    type="checkbox"
                    checked={aiTrainingDataRetention}
                    onChange={(e) => setAiTrainingDataRetention(e.target.checked)}
                  />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f87171' }}>
                      Vendor Trains on Prompts?
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Checked = high exposure risk (lacks zero-retention)
                    </div>
                  </div>
                </label>
              )}
            </div>

            {/* Initial Audit Notes */}
            <div className="form-group">
              <label className="form-label">Auditor Intake Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Initial security intake evaluation or SOC 2 scope notes..."
                value={auditNotes}
                onChange={(e) => setAuditNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Complete Intake & Onboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
