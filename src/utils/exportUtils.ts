import type { Vendor } from '../types/vendor';

export function exportVendorsAsJSON(vendors: Vendor[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(vendors, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `vendorpulse_audit_register_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportVendorsAsCSV(vendors: Vendor[]): void {
  const headers = [
    'Vendor Name',
    'Category',
    'Status',
    'Risk Tier',
    'Inherent Risk',
    'Mitigating Controls',
    'Residual Risk',
    'Data Classification',
    'Integration Level',
    'Processes Customer Data',
    'Is AI Vendor',
    'AI Training Retention',
    'SOC2 Type II',
    'SOC2 Expiry',
    'ISO 27001',
    'GDPR DPA Signed',
    'SSO/MFA Enforced',
    'Encryption at Rest',
    'Last Assessed Date',
    'Next Review Date',
    'Internal Owner',
  ];

  const rows = vendors.map((v) => [
    `"${v.name.replace(/"/g, '""')}"`,
    `"${v.category}"`,
    `"${v.reviewStatus}"`,
    `"${v.scores.tier}"`,
    v.scores.inherentRisk,
    v.scores.mitigatingScore,
    v.scores.residualRisk,
    `"${v.dataClassification}"`,
    `"${v.integrationLevel}"`,
    v.processesCustomerData ? 'YES' : 'NO',
    v.isAIVendor ? 'YES' : 'NO',
    v.aiTrainingDataRetention ? 'YES' : 'NO',
    v.certifications.soc2Type2 ? 'YES' : 'NO',
    `"${v.certifications.soc2ExpiryDate || 'N/A'}"`,
    v.certifications.iso27001 ? 'YES' : 'NO',
    v.certifications.gdprDpaSigned ? 'YES' : 'NO',
    v.controls.ssoMfaEnforced ? 'YES' : 'NO',
    v.controls.encryptionAtRest ? 'YES' : 'NO',
    `"${v.lastAssessedDate}"`,
    `"${v.nextReviewDate}"`,
    `"${v.internalOwner}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', `vendorpulse_soc2_cc9_2_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
