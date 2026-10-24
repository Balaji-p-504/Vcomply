import React, { useState, useEffect, useMemo } from 'react';
import {
  loadVendors,
  saveVendors,
  resetToDefaultVendors,
  calculateDashboardMetrics,
} from './utils/storage';
import type { Vendor, FilterState } from './types/vendor';
import { Navbar } from './components/Navbar';
import { DashboardMetrics } from './components/DashboardMetrics';
import { VendorFilters } from './components/VendorFilters';
import { VendorList } from './components/VendorList';
import { RiskMatrix } from './components/RiskMatrix';
import { VendorDetailModal } from './components/VendorDetailModal';
import { VendorFormModal } from './components/VendorFormModal';
import { AuditReportModal } from './components/AuditReportModal';
import { VendorCompareModal } from './components/VendorCompareModal';
import { ComplianceChecklist } from './components/ComplianceChecklist';
import { getExpiryStatus } from './utils/scoringEngine';
import {
  Shield,
  Layers,
  Clock,
  Sparkles,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export const App: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuditReportOpen, setIsAuditReportOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'matrix' | 'checklist' | 'expiring' | 'ai'>('inventory');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    tier: '',
    reviewStatus: '',
    onlyExpiringSoon: false,
    onlyMissingDpa: false,
    onlyAIVendors: false,
    onlyCustomerData: false,
  });

  // Load vendors on mount
  useEffect(() => {
    const loaded = loadVendors();
    setVendors(loaded);
  }, []);

  // Update storage whenever vendors change
  const updateVendorsState = (newVendors: Vendor[]) => {
    setVendors(newVendors);
    saveVendors(newVendors);
  };

  const handleAddVendor = (newVendor: Vendor) => {
    const updated = [newVendor, ...vendors];
    updateVendorsState(updated);
  };

  const handleUpdateVendor = (updated: Vendor) => {
    const newVendors = vendors.map((v) => (v.id === updated.id ? updated : v));
    updateVendorsState(newVendors);
    if (selectedVendor && selectedVendor.id === updated.id) {
      setSelectedVendor(updated);
    }
  };

  const handleDeleteVendor = (id: string) => {
    const newVendors = vendors.filter((v) => v.id !== id);
    updateVendorsState(newVendors);
    if (selectedVendor && selectedVendor.id === id) {
      setSelectedVendor(null);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all vendors to default benchmark dataset?')) {
      const reset = resetToDefaultVendors();
      setVendors(reset);
      setSelectedVendor(null);
    }
  };

  // Aggregated Metrics
  const metrics = useMemo(() => calculateDashboardMetrics(vendors), [vendors]);

  // Tab Filtering
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      // Tab filter overrides
      if (activeTab === 'expiring') {
        const soc2 = getExpiryStatus(v.certifications.soc2ExpiryDate);
        const iso = getExpiryStatus(v.certifications.iso27001ExpiryDate);
        const isExpiring =
          soc2.status === 'EXPIRED' ||
          soc2.status === 'EXPIRING_SOON' ||
          iso.status === 'EXPIRED' ||
          iso.status === 'EXPIRING_SOON';
        if (!isExpiring) return false;
      }

      if (activeTab === 'ai' && !v.isAIVendor) {
        return false;
      }

      // Search keyword
      if (filters.search.trim()) {
        const term = filters.search.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(term);
        const matchesDesc = v.description.toLowerCase().includes(term);
        const matchesOwner = v.internalOwner.toLowerCase().includes(term);
        const matchesCategory = v.category.toLowerCase().includes(term);
        if (!matchesName && !matchesDesc && !matchesOwner && !matchesCategory) {
          return false;
        }
      }

      // Category filter
      if (filters.category && v.category !== filters.category) {
        return false;
      }

      // Tier filter
      if (filters.tier && v.scores.tier !== filters.tier) {
        return false;
      }

      // Status filter
      if (filters.reviewStatus && v.reviewStatus !== filters.reviewStatus) {
        return false;
      }

      // Quick filter chips
      if (filters.onlyExpiringSoon) {
        const soc2 = getExpiryStatus(v.certifications.soc2ExpiryDate);
        const iso = getExpiryStatus(v.certifications.iso27001ExpiryDate);
        const hasExpiring =
          soc2.status === 'EXPIRED' ||
          soc2.status === 'EXPIRING_SOON' ||
          iso.status === 'EXPIRED' ||
          iso.status === 'EXPIRING_SOON';
        if (!hasExpiring) return false;
      }

      if (filters.onlyAIVendors && !v.isAIVendor) {
        return false;
      }

      if (filters.onlyCustomerData && !v.processesCustomerData) {
        return false;
      }

      if (filters.onlyMissingDpa && (v.certifications.gdprDpaSigned || !v.processesCustomerData)) {
        return false;
      }

      return true;
    });
  }, [vendors, filters, activeTab]);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        vendors={vendors}
        onAddVendorClick={() => setIsAddModalOpen(true)}
        onOpenAuditReport={() => setIsAuditReportOpen(true)}
        onResetData={handleResetData}
        onOpenCompare={() => setIsCompareModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Dashboard Metrics */}
        <DashboardMetrics
          metrics={metrics}
          vendors={vendors}
          onFilterExpiring={() => {
            setActiveTab('expiring');
          }}
        />

        {/* Navigation Tabs */}
        <div className="tabs-navigation">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Shield size={16} />
            <span>Vendor Inventory</span>
            <span className="nav-tab-count">{vendors.length}</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveTab('matrix')}
          >
            <Layers size={16} />
            <span>Risk Matrix Heatmap</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklist')}
          >
            <ShieldCheck size={16} />
            <span>SOC 2 Readiness</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'expiring' ? 'active' : ''}`}
            onClick={() => setActiveTab('expiring')}
          >
            <Clock size={16} />
            <span>Expiring / Overdue Certs</span>
            <span className="nav-tab-count">{metrics.expiringCertCount}</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            <Sparkles size={16} />
            <span>AI & LLM Governance</span>
            <span className="nav-tab-count">{metrics.aiVendorCount}</span>
          </button>

          <div style={{ flex: 1 }} />

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsAuditReportOpen(true)}
          >
            <FileText size={14} />
            <span>Generate Auditor Report</span>
          </button>
        </div>

        {/* Tab View Selection */}
        {activeTab === 'matrix' ? (
          <RiskMatrix
            vendors={vendors}
            onSelectVendor={(v) => setSelectedVendor(v)}
          />
        ) : activeTab === 'checklist' ? (
          <ComplianceChecklist vendors={vendors} />
        ) : (
          /* Tabs: Inventory, Expiring, AI */
          <>
            <VendorFilters
              filters={filters}
              onFilterChange={setFilters}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <VendorList
              vendors={filteredVendors}
              viewMode={viewMode}
              onSelectVendor={(v) => setSelectedVendor(v)}
              onClearFilters={() =>
                setFilters({
                  search: '',
                  category: '',
                  tier: '',
                  reviewStatus: '',
                  onlyExpiringSoon: false,
                  onlyMissingDpa: false,
                  onlyAIVendors: false,
                  onlyCustomerData: false,
                })
              }
            />
          </>
        )}
      </main>

      {/* Modals */}
      {selectedVendor && (
        <VendorDetailModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onUpdateVendor={handleUpdateVendor}
          onDeleteVendor={handleDeleteVendor}
        />
      )}

      {isAddModalOpen && (
        <VendorFormModal
          onClose={() => setIsAddModalOpen(false)}
          onSaveVendor={handleAddVendor}
        />
      )}

      {isCompareModalOpen && (
        <VendorCompareModal
          vendors={vendors}
          onClose={() => setIsCompareModalOpen(false)}
          onSelectVendor={(v) => {
            setSelectedVendor(v);
            setIsCompareModalOpen(false);
          }}
        />
      )}

      {isAuditReportOpen && (
        <AuditReportModal
          vendors={vendors}
          onClose={() => setIsAuditReportOpen(false)}
        />
      )}

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.5rem',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-dim)',
          background: 'rgba(9, 13, 22, 0.95)',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <strong>VendorPulse</strong> — Third-Party Risk &amp; Compliance Platform
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>React + TypeScript</span>
            <span>•</span>
            <span>SOC 2 CC9.2</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
