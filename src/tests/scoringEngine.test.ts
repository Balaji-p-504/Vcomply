import { describe, it, expect } from 'vitest';
import {
  calculateInherentRisk,
  calculateMitigatingScore,
  calculateResidualRisk,
  determineRiskTier,
  getExpiryStatus,
} from '../utils/scoringEngine';

describe('Vendor Risk Scoring Engine', () => {
  describe('calculateInherentRisk', () => {
    it('calculates maximum inherent risk for mission-critical direct-db PII processor', () => {
      const risk = calculateInherentRisk({
        businessCriticality: 'MISSION_CRITICAL', // 25
        dataClassification: 'CUSTOMER_PII', // 35
        integrationLevel: 'DATABASE_DIRECT', // 30
        processesCustomerData: true, // 5
        isAIVendor: true,
        aiTrainingDataRetention: true, // 10
      });
      // 25 + 35 + 30 + 5 + 10 = 105 -> capped at 100
      expect(risk).toBe(100);
    });

    it('calculates low inherent risk for non-essential public data SaaS portal', () => {
      const risk = calculateInherentRisk({
        businessCriticality: 'NON_ESSENTIAL', // 5
        dataClassification: 'PUBLIC_DATA', // 8
        integrationLevel: 'STANDALONE_PORTAL', // 8
        processesCustomerData: false,
        isAIVendor: false,
        aiTrainingDataRetention: false,
      });
      // 5 + 8 + 8 = 21
      expect(risk).toBe(21);
    });

    it('clamps minimum risk to at least 10', () => {
      const risk = calculateInherentRisk({
        businessCriticality: 'NON_ESSENTIAL',
        dataClassification: 'PUBLIC_DATA',
        integrationLevel: 'STANDALONE_PORTAL',
        processesCustomerData: false,
        isAIVendor: false,
        aiTrainingDataRetention: false,
      });
      expect(risk).toBeGreaterThanOrEqual(10);
    });
  });

  describe('calculateMitigatingScore', () => {
    it('awards high score for enterprise controls and certifications', () => {
      const score = calculateMitigatingScore({
        certifications: {
          soc2Type2: true, // 20
          iso27001: true, // 15
          gdprDpaSigned: true, // 12
          hipaa: true, // 5
          fedramp: true, // 6
        },
        controls: {
          encryptionAtRest: true, // 8
          encryptionInTransit: true, // 7
          ssoMfaEnforced: true, // 12
          annualPenTest: true, // 8
          incidentResponseWindowHours: 24, // 4
          slaUptimePercentage: 99.99, // 4
          disasterRecoveryTested: true, // 4
          subprocessorsDocumented: true, // 4
        },
        isAIVendor: false,
        aiTrainingDataRetention: false,
      });
      expect(score).toBe(100); // capped at 100
    });

    it('penalizes AI vendors who retain/train on customer prompts', () => {
      const baseParams = {
        certifications: {
          soc2Type2: true,
          iso27001: false,
          gdprDpaSigned: true,
          hipaa: false,
          fedramp: false,
        },
        controls: {
          encryptionAtRest: true,
          encryptionInTransit: true,
          ssoMfaEnforced: false,
          annualPenTest: false,
          incidentResponseWindowHours: 72,
          slaUptimePercentage: 99.5,
          disasterRecoveryTested: false,
          subprocessorsDocumented: true,
        },
      };

      const scoreZeroRetention = calculateMitigatingScore({
        ...baseParams,
        isAIVendor: true,
        aiTrainingDataRetention: false, // bonus +5
      });

      const scoreTraining = calculateMitigatingScore({
        ...baseParams,
        isAIVendor: true,
        aiTrainingDataRetention: true, // penalty -10
      });

      expect(scoreZeroRetention).toBeGreaterThan(scoreTraining);
    });
  });

  describe('calculateResidualRisk & Tier Assignment', () => {
    it('correctly reduces inherent risk with strong mitigating controls', () => {
      const inherent = 80;
      const mitigating = 90;
      const residual = calculateResidualRisk(inherent, mitigating);

      // reductionFactor = 0.90 * 0.72 = 0.648
      // residual = 80 * (1 - 0.648) = 28.16 -> 28
      expect(residual).toBe(28);
      expect(determineRiskTier(residual)).toBe('TIER_3_MEDIUM');
    });

    it('assigns TIER_1_CRITICAL when residual risk is high', () => {
      expect(determineRiskTier(75)).toBe('TIER_1_CRITICAL');
      expect(determineRiskTier(65)).toBe('TIER_1_CRITICAL');
    });

    it('assigns TIER_4_LOW when residual risk is minimal', () => {
      expect(determineRiskTier(20)).toBe('TIER_4_LOW');
    });
  });

  describe('Certification Expiration Engine', () => {
    it('returns EXPIRED for dates in the past', () => {
      const pastDate = '2020-01-01';
      const status = getExpiryStatus(pastDate);
      expect(status.status).toBe('EXPIRED');
      expect(status.daysRemaining).toBeLessThan(0);
    });

    it('returns NOT_APPLICABLE for empty or invalid dates', () => {
      expect(getExpiryStatus(undefined).status).toBe('NOT_APPLICABLE');
      expect(getExpiryStatus('').status).toBe('NOT_APPLICABLE');
      expect(getExpiryStatus('invalid-date').status).toBe('NOT_APPLICABLE');
    });
  });
});
