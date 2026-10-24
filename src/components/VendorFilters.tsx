import React from 'react';
import { Search, LayoutGrid, List, Sparkles, AlertCircle, ShieldAlert, Database } from 'lucide-react';
import type { FilterState } from '../types/vendor';

interface VendorFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
}

export const VendorFilters: React.FC<VendorFiltersProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
}) => {
  const updateField = (key: keyof FilterState, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleChip = (key: keyof FilterState) => {
    onFilterChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  return (
    <div className="toolbar-container">
      {/* Primary Row: Search + Category + Tier + Status + View Toggle */}
      <div className="toolbar-primary-row">
        <div className="search-box-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search vendors by name, owner, tech stack, or description..."
            value={filters.search}
            onChange={(e) => updateField('search', e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => updateField('category', e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="AI & LLMs">AI & LLMs</option>
          <option value="Cloud Infrastructure">Cloud Infrastructure</option>
          <option value="Developer Tooling">Developer Tooling</option>
          <option value="Data & Analytics">Data & Analytics</option>
          <option value="Payments & Billing">Payments & Billing</option>
          <option value="Security & Auth">Security & Auth</option>
          <option value="Productivity & Collaboration">Productivity</option>
        </select>

        <select
          className="filter-select"
          value={filters.tier}
          onChange={(e) => updateField('tier', e.target.value)}
        >
          <option value="">All Risk Tiers</option>
          <option value="TIER_1_CRITICAL">Tier 1 - Critical Risk</option>
          <option value="TIER_2_HIGH">Tier 2 - High Risk</option>
          <option value="TIER_3_MEDIUM">Tier 3 - Medium Risk</option>
          <option value="TIER_4_LOW">Tier 4 - Low Risk</option>
        </select>

        <select
          className="filter-select"
          value={filters.reviewStatus}
          onChange={(e) => updateField('reviewStatus', e.target.value)}
        >
          <option value="">All Review Statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="NEEDS_REMEDIATION">Needs Remediation</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <div className="view-mode-group">
          <button
            type="button"
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Card Grid View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => onViewModeChange('table')}
            title="Compact Table View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Secondary Row: Quick Filter Chips */}
      <div className="filter-chips-row">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
          Quick Filters:
        </span>

        <button
          type="button"
          className={`filter-chip-btn ${filters.onlyExpiringSoon ? 'active' : ''}`}
          onClick={() => toggleChip('onlyExpiringSoon')}
        >
          <AlertCircle size={13} color="#f59e0b" />
          <span>Expiring / Overdue (&lt;60d)</span>
        </button>

        <button
          type="button"
          className={`filter-chip-btn ${filters.onlyAIVendors ? 'active' : ''}`}
          onClick={() => toggleChip('onlyAIVendors')}
        >
          <Sparkles size={13} color="#a855f7" />
          <span>AI & LLM Services</span>
        </button>

        <button
          type="button"
          className={`filter-chip-btn ${filters.onlyCustomerData ? 'active' : ''}`}
          onClick={() => toggleChip('onlyCustomerData')}
        >
          <Database size={13} color="#06b6d4" />
          <span>Processes Customer PII</span>
        </button>

        <button
          type="button"
          className={`filter-chip-btn ${filters.onlyMissingDpa ? 'active' : ''}`}
          onClick={() => toggleChip('onlyMissingDpa')}
        >
          <ShieldAlert size={13} color="#ef4444" />
          <span>Missing Signed DPA</span>
        </button>
      </div>
    </div>
  );
};
