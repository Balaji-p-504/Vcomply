export type VendorCategory =
  | 'AI & LLMs'
  | 'Cloud Infrastructure'
  | 'Developer Tooling'
  | 'Data & Analytics'
  | 'Payments & Billing'
  | 'Security & Auth'
  | 'Productivity & Collaboration';

export type ReviewStatus = 'APPROVED' | 'IN_REVIEW' | 'NEEDS_REMEDIATION' | 'REJECTED';

export type BusinessCriticality =
  | 'MISSION_CRITICAL' // < 1hr downtime tolerance
  | 'BUSINESS_ESSENTIAL' // < 4hr downtime tolerance
  | 'OPERATIONAL' // < 24hr downtime tolerance
  | 'NON_ESSENTIAL'; // > 24hr downtime tolerance

export type DataClassification =
  | 'CUSTOMER_PII' // Sensitive user information, GDPR/CCPA scoped
  | 'FINANCIAL_PAYMENTS' // Credit cards, invoices, bank accounts, PCI-DSS scoped
  | 'PROPRIETARY_CODE' // Source code, IP, secrets, API keys
  | 'INTERNAL_ONLY' // Non-public business communications
  | 'PUBLIC_DATA'; // Marketing or publicly available data

export type IntegrationLevel =
  | 'DATABASE_DIRECT' // Direct DB connection or raw data dump
  | 'PRODUCTION_VPC' // Cloud VPC peering or Kubernetes operator
  | 'API_WEBHOOK' // Standard REST API or webhook ingestion
  | 'STANDALONE_PORTAL'; // Browser-only SaaS without direct app hookup

export type RiskTier =
  | 'TIER_1_CRITICAL' // Residual Risk >= 70
  | 'TIER_2_HIGH' // Residual Risk 50 - 69
  | 'TIER_3_MEDIUM' // Residual Risk 30 - 49
  | 'TIER_4_LOW'; // Residual Risk < 30

export interface VendorCertifications {
  soc2Type2: boolean;
  soc2ExpiryDate?: string;
  iso27001: boolean;
  iso27001ExpiryDate?: string;
  hipaa: boolean;
  gdprDpaSigned: boolean;
  fedramp: boolean;
}

export interface VendorControls {
  encryptionAtRest: boolean;
  encryptionInTransit: boolean;
  ssoMfaEnforced: boolean;
  annualPenTest: boolean;
  incidentResponseWindowHours: number; // e.g. 24, 48, 72
  slaUptimePercentage: number; // e.g. 99.9, 99.99
  disasterRecoveryTested: boolean;
  subprocessorsDocumented: boolean;
}

export interface RiskScores {
  inherentRisk: number; // 0 - 100
  mitigatingScore: number; // 0 - 100
  residualRisk: number; // 0 - 100
  tier: RiskTier;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  description: string;
  website: string;
  logoUrl?: string;
  reviewStatus: ReviewStatus;
  lastAssessedDate: string;
  nextReviewDate: string;
  primaryContact: string;
  internalOwner: string;
  businessCriticality: BusinessCriticality;
  dataClassification: DataClassification;
  integrationLevel: IntegrationLevel;
  processesCustomerData: boolean;
  isAIVendor: boolean;
  aiTrainingDataRetention: boolean; // true = vendor retains/trains on prompt data (riskier)
  certifications: VendorCertifications;
  controls: VendorControls;
  scores: RiskScores;
  auditNotes: string;
  auditLog: AuditLogEntry[];
}

export interface FilterState {
  search: string;
  category: string;
  tier: string;
  reviewStatus: string;
  onlyExpiringSoon: boolean;
  onlyMissingDpa: boolean;
  onlyAIVendors: boolean;
  onlyCustomerData: boolean;
}

export interface DashboardMetrics {
  totalVendors: number;
  approvedCount: number;
  inReviewCount: number;
  needsRemediationCount: number;
  tier1CriticalCount: number;
  tier2HighCount: number;
  tier3MediumCount: number;
  tier4LowCount: number;
  avgResidualRisk: number;
  complianceReadinessScore: number; // % score out of 100 for SOC 2 CC9.2
  expiringCertCount: number; // within 60 days or already expired
  aiVendorCount: number;
}
