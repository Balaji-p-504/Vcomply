import type { DashboardMetrics, Vendor } from '../types/vendor';
import { INITIAL_VENDORS } from './sampleData';
import { getExpiryStatus } from './scoringEngine';

const STORAGE_KEY = 'vendorpulse_vendors_v1';

export function loadVendors(): Vendor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveVendors(INITIAL_VENDORS);
      return INITIAL_VENDORS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_VENDORS;
  } catch (err) {
    console.warn('Failed to parse vendors from localStorage, using initial seed data.', err);
    return INITIAL_VENDORS;
  }
}

export function saveVendors(vendors: Vendor[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors));
  } catch (err) {
    console.error('Failed to save vendors to localStorage', err);
  }
}

export function resetToDefaultVendors(): Vendor[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  saveVendors(INITIAL_VENDORS);
  return INITIAL_VENDORS;
}

export function calculateDashboardMetrics(vendors: Vendor[]): DashboardMetrics {
  const total = vendors.length;
  if (total === 0) {
    return {
      totalVendors: 0,
      approvedCount: 0,
      inReviewCount: 0,
      needsRemediationCount: 0,
      tier1CriticalCount: 0,
      tier2HighCount: 0,
      tier3MediumCount: 0,
      tier4LowCount: 0,
      avgResidualRisk: 0,
      complianceReadinessScore: 0,
      expiringCertCount: 0,
      aiVendorCount: 0,
    };
  }

  let approved = 0;
  let inReview = 0;
  let needsRemediation = 0;
  let tier1 = 0;
  let tier2 = 0;
  let tier3 = 0;
  let tier4 = 0;
  let totalResidualRisk = 0;
  let compliantVendors = 0;
  let expiringCount = 0;
  let aiCount = 0;

  vendors.forEach((v) => {
    if (v.reviewStatus === 'APPROVED') approved++;
    if (v.reviewStatus === 'IN_REVIEW') inReview++;
    if (v.reviewStatus === 'NEEDS_REMEDIATION' || v.reviewStatus === 'REJECTED') needsRemediation++;

    if (v.scores.tier === 'TIER_1_CRITICAL') tier1++;
    if (v.scores.tier === 'TIER_2_HIGH') tier2++;
    if (v.scores.tier === 'TIER_3_MEDIUM') tier3++;
    if (v.scores.tier === 'TIER_4_LOW') tier4++;

    totalResidualRisk += v.scores.residualRisk;

    if (v.isAIVendor) aiCount++;

    // Check SOC 2 & ISO expiration
    const soc2Status = getExpiryStatus(v.certifications.soc2ExpiryDate);
    const isoStatus = getExpiryStatus(v.certifications.iso27001ExpiryDate);

    const hasExpiring =
      soc2Status.status === 'EXPIRED' ||
      soc2Status.status === 'EXPIRING_SOON' ||
      isoStatus.status === 'EXPIRED' ||
      isoStatus.status === 'EXPIRING_SOON';

    if (hasExpiring) {
      expiringCount++;
    }

    // Compliant definition for SOC 2 CC9.2:
    // Vendor has at least SOC 2 or ISO, signed DPA if customer data processed, and is not in remediation
    const hasAuditCert = v.certifications.soc2Type2 || v.certifications.iso27001;
    const dpaSatisfied = !v.processesCustomerData || v.certifications.gdprDpaSigned;
    const notExpired = soc2Status.status !== 'EXPIRED';

    if (hasAuditCert && dpaSatisfied && notExpired && v.reviewStatus === 'APPROVED') {
      compliantVendors++;
    }
  });

  const avgResidualRisk = Math.round(totalResidualRisk / total);
  const complianceReadinessScore = Math.round((compliantVendors / total) * 100);

  return {
    totalVendors: total,
    approvedCount: approved,
    inReviewCount: inReview,
    needsRemediationCount: needsRemediation,
    tier1CriticalCount: tier1,
    tier2HighCount: tier2,
    tier3MediumCount: tier3,
    tier4LowCount: tier4,
    avgResidualRisk,
    complianceReadinessScore,
    expiringCertCount: expiringCount,
    aiVendorCount: aiCount,
  };
}
