import React from 'react';
import type { Vendor } from '../types/vendor';

interface RiskMatrixProps {
  vendors: Vendor[];
  onSelectVendor: (vendor: Vendor) => void;
}

export const RiskMatrix: React.FC<RiskMatrixProps> = ({ vendors, onSelectVendor }) => {
  // Categorize vendors into 3x4 grid cells
  // Rows: Inherent Risk (Critical >=80, High 60-79, Medium 40-59, Low <40)
  // Cols: Mitigating Controls (Weak <60, Moderate 60-84, Strong >=85)

  const rows = [
    { label: 'Critical (80-100)', minInherent: 80, maxInherent: 100 },
    { label: 'High (60-79)', minInherent: 60, maxInherent: 79 },
    { label: 'Medium (40-59)', minInherent: 40, maxInherent: 59 },
    { label: 'Low (<40)', minInherent: 0, maxInherent: 39 },
  ];

  const cols = [
    { label: 'Weak Controls (<60%)', minControl: 0, maxControl: 59, cellRiskClass: 'cell-critical' },
    { label: 'Moderate Controls (60-84%)', minControl: 60, maxControl: 84, cellRiskClass: 'cell-medium' },
    { label: 'Strong Controls (≥85%)', minControl: 85, maxControl: 100, cellRiskClass: 'cell-low' },
  ];

  const getVendorsForCell = (
    minInherent: number,
    maxInherent: number,
    minControl: number,
    maxControl: number
  ) => {
    return vendors.filter(
      (v) =>
        v.scores.inherentRisk >= minInherent &&
        v.scores.inherentRisk <= maxInherent &&
        v.scores.mitigatingScore >= minControl &&
        v.scores.mitigatingScore <= maxControl
    );
  };

  return (
    <div className="risk-matrix-container">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
          Vendor Risk vs Controls Matrix
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Real-time heat map plotting <strong>Inherent Business Impact</strong> against{' '}
          <strong>Security Control Maturity</strong>. Click any vendor to inspect their audit trail.
        </p>
      </div>

      <div className="risk-matrix-grid">
        {/* Top-Left empty corner */}
        <div className="matrix-axis-label" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          Inherent \ Controls
        </div>

        {/* Column Headers */}
        {cols.map((col, idx) => (
          <div
            key={idx}
            className="matrix-axis-label"
            style={{
              paddingBottom: '0.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              color: col.cellRiskClass === 'cell-critical' ? '#f87171' : col.cellRiskClass === 'cell-low' ? '#34d399' : '#a5b4fc',
            }}
          >
            {col.label}
          </div>
        ))}

        {/* Matrix Rows */}
        {rows.map((row, rowIdx) => (
          <React.Fragment key={rowIdx}>
            {/* Row Header */}
            <div className="matrix-axis-label" style={{ justifyContent: 'flex-start' }}>
              <span>{row.label}</span>
            </div>

            {/* 3 Cells in this row */}
            {cols.map((col, colIdx) => {
              const cellVendors = getVendorsForCell(
                row.minInherent,
                row.maxInherent,
                col.minControl,
                col.maxControl
              );

              return (
                <div key={colIdx} className={`matrix-cell ${col.cellRiskClass}`}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.7rem',
                      color: 'var(--text-dim)',
                    }}
                  >
                    <span>{cellVendors.length} vendor(s)</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {cellVendors.map((v) => (
                      <div
                        key={v.id}
                        className="matrix-vendor-pill"
                        onClick={() => onSelectVendor(v)}
                      >
                        <span style={{ color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {v.name}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            color:
                              v.scores.residualRisk >= 65
                                ? '#ef4444'
                                : v.scores.residualRisk >= 45
                                ? '#f59e0b'
                                : '#10b981',
                          }}
                        >
                          {v.scores.residualRisk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
