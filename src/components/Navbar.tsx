import React from 'react';
import {
  ShieldCheck,
  PlusCircle,
  FileText,
  Download,
  RotateCcw,
  FileSpreadsheet,
  ArrowLeftRight,
} from 'lucide-react';
import { exportVendorsAsCSV, exportVendorsAsJSON } from '../utils/exportUtils';
import type { Vendor } from '../types/vendor';

interface NavbarProps {
  vendors: Vendor[];
  onAddVendorClick: () => void;
  onOpenAuditReport: () => void;
  onResetData: () => void;
  onOpenCompare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  vendors,
  onAddVendorClick,
  onOpenAuditReport,
  onResetData,
  onOpenCompare,
}) => {
  return (
    <header className="header-nav">
      <div className="header-inner">
        <div className="brand-section">
          <div className="brand-logo-icon">
            <ShieldCheck size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="brand-title">VendorPulse</span>
              <span className="soc2-badge-pill">SOC-2 CC9.2</span>
            </div>
            <div className="brand-subtitle">
              <span>Third-Party Risk & Compliance Engine</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onResetData}
            title="Reset to default benchmark dataset"
          >
            <RotateCcw size={14} />
            <span>Reset Demo</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => exportVendorsAsCSV(vendors)}
            title="Export CSV for audit spreadsheets"
          >
            <FileSpreadsheet size={14} />
            <span>CSV</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => exportVendorsAsJSON(vendors)}
            title="Export JSON register"
          >
            <Download size={14} />
            <span>JSON</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenCompare}
            title="Side-by-side vendor comparison"
          >
            <ArrowLeftRight size={16} />
            <span>Compare</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenAuditReport}
          >
            <FileText size={16} />
            <span>Audit Dossier</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onAddVendorClick}
          >
            <PlusCircle size={16} />
            <span>New Vendor</span>
          </button>
        </div>
      </div>
    </header>
  );
};
