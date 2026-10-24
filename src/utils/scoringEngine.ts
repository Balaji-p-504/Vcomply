import type {
  BusinessCriticality,
  DataClassification,
  IntegrationLevel,
  RiskScores,
  RiskTier,
  VendorCertifications,
  VendorControls,
} from '../types/vendor';

/**
 * Calculates the Inherent Risk Score (10 - 100) based on data sensitivity,
 * integration level, business criticality, and AI privacy factors.
 */
export function calculateInherentRisk(params: {
  businessCriticality: BusinessCriticality;
  dataClassification: DataClassification;
  integrationLevel: IntegrationLevel;
  processesCustomerData: boolean;
  isAIVendor: boolean;
  aiTrainingDataRetention: boolean;
}): number {
  let score = 0;

  // 1. Data Classification Weight (up to 35 pts)
  switch (params.dataClassification) {
    case 'CUSTOMER_PII':
      score += 35;
      break;
    case 'FINANCIAL_PAYMENTS':
      score += 35;
      break;
    case 'PROPRIETARY_CODE':
      score += 30;
      break;
    case 'INTERNAL_ONLY':
      score += 18;
      break;
    case 'PUBLIC_DATA':
      score += 8;
      break;
  }

  // 2. Integration Level Weight (up to 30 pts)
  switch (params.integrationLevel) {
    case 'DATABASE_DIRECT':
      score += 30;
      break;
    case 'PRODUCTION_VPC':
      score += 24;
      break;
    case 'API_WEBHOOK':
      score += 16;
      break;
    case 'STANDALONE_PORTAL':
      score += 8;
      break;
  }

  // 3. Business Criticality Weight (up to 25 pts)
  switch (params.businessCriticality) {
    case 'MISSION_CRITICAL':
      score += 25;
      break;
    case 'BUSINESS_ESSENTIAL':
      score += 18;
      break;
    case 'OPERATIONAL':
      score += 11;
      break;
    case 'NON_ESSENTIAL':
      score += 5;
      break;
  }

  // 4. Modifiers
  if (params.processesCustomerData) {
    score += 5;
  }

  // AI Vendor with training data retention represents a severe IP/PII exposure risk
  if (params.isAIVendor && params.aiTrainingDataRetention) {
    score += 10;
  }

  // Clamp inherent risk between 10 and 100
  return Math.min(100, Math.max(10, score));
}

/**
 * Calculates the Mitigating Controls / Security Maturity Score (0 - 100)
 * based on certifications, encryption, identity protection, and operational hygiene.
 */
export function calculateMitigatingScore(params: {
  certifications: VendorCertifications;
  controls: VendorControls;
  isAIVendor: boolean;
  aiTrainingDataRetention: boolean;
}): number {
  let score = 0;

  // Certifications (up to 45 pts)
  if (params.certifications.soc2Type2) score += 20;
  if (params.certifications.iso27001) score += 15;
  if (params.certifications.gdprDpaSigned) score += 12;
  if (params.certifications.hipaa) score += 5;
  if (params.certifications.fedramp) score += 6;

  // Security & Identity Controls (up to 40 pts)
  if (params.controls.encryptionAtRest) score += 8;
  if (params.controls.encryptionInTransit) score += 7;
  if (params.controls.ssoMfaEnforced) score += 12;
  if (params.controls.annualPenTest) score += 8;

  // Operational Hygiene (up to 15 pts)
  if (params.controls.slaUptimePercentage >= 99.9) score += 4;
  if (params.controls.incidentResponseWindowHours <= 48) score += 4;
  if (params.controls.disasterRecoveryTested) score += 4;
  if (params.controls.subprocessorsDocumented) score += 4;

  // AI Safety bonus / penalty
  if (params.isAIVendor) {
    if (!params.aiTrainingDataRetention) {
      // Verified zero data retention guarantee
      score += 5;
    } else {
      score -= 10;
    }
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Computes Residual Risk Score (10 - 100) and maps to appropriate Risk Tier.
 * Residual Risk = Inherent Risk * (1 - (Mitigating Score / 100) * 0.72)
 */
export function calculateResidualRisk(inherent: number, mitigating: number): number {
  const reductionFactor = (mitigating / 100) * 0.72; // Maximum 72% risk reduction via controls
  const residual = Math.round(inherent * (1 - reductionFactor));
  return Math.min(100, Math.max(10, residual));
}

export function determineRiskTier(residualRisk: number): RiskTier {
  if (residualRisk >= 65) return 'TIER_1_CRITICAL';
  if (residualRisk >= 45) return 'TIER_2_HIGH';
  if (residualRisk >= 25) return 'TIER_3_MEDIUM';
  return 'TIER_4_LOW';
}

export function computeCompleteScores(params: {
  businessCriticality: BusinessCriticality;
  dataClassification: DataClassification;
  integrationLevel: IntegrationLevel;
  processesCustomerData: boolean;
  isAIVendor: boolean;
  aiTrainingDataRetention: boolean;
  certifications: VendorCertifications;
  controls: VendorControls;
}): RiskScores {
  const inherentRisk = calculateInherentRisk(params);
  const mitigatingScore = calculateMitigatingScore(params);
  const residualRisk = calculateResidualRisk(inherentRisk, mitigatingScore);
  const tier = determineRiskTier(residualRisk);

  return {
    inherentRisk,
    mitigatingScore,
    residualRisk,
    tier,
  };
}

export type ExpiryStatus = 'EXPIRED' | 'EXPIRING_SOON' | 'VALID' | 'NOT_APPLICABLE';

export function getDaysUntil(dateString?: string): number | null {
  if (!dateString) return null;
  const targetDate = new Date(dateString);
  if (isNaN(targetDate.getTime())) return null;

  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(dateString?: string): {
  status: ExpiryStatus;
  daysRemaining: number | null;
  label: string;
} {
  const days = getDaysUntil(dateString);
  if (days === null) {
    return { status: 'NOT_APPLICABLE', daysRemaining: null, label: 'Not Provided' };
  }

  if (days < 0) {
    return { status: 'EXPIRED', daysRemaining: days, label: `Expired ${Math.abs(days)}d ago` };
  } else if (days <= 60) {
    return { status: 'EXPIRING_SOON', daysRemaining: days, label: `Expires in ${days}d` };
  } else {
    return { status: 'VALID', daysRemaining: days, label: `Valid (${days}d left)` };
  }
}
