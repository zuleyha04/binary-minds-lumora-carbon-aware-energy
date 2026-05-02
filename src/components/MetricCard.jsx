import React from 'react';

export default function MetricCard({ label, value, unit, sublabel, accent, icon }) {
  // accent: 'current' | 'recommended' | 'saving' | 'percent'
  const styles = {
    current: {
      border: '2px solid #f59e0b22',
      background: 'linear-gradient(145deg, #fffbeb, #fef3c7)',
      valueColor: '#92400e',
      labelColor: '#b45309',
      iconBg: '#fef3c7',
    },
    recommended: {
      border: '2px solid #22c55e22',
      background: 'linear-gradient(145deg, #f0faf4, #dcf5e7)',
      valueColor: '#145335',
      labelColor: '#1a7a4a',
      iconBg: '#dcf5e7',
    },
    saving: {
      border: '2px solid #28a26222',
      background: 'linear-gradient(145deg, #ffffff, #f0faf4)',
      valueColor: '#0f4c2a',
      labelColor: '#1a7a4a',
      iconBg: '#dcf5e7',
    },
    percent: {
      border: '2px solid #1a7a4a33',
      background: 'linear-gradient(145deg, #0f4c2a, #1a7a4a)',
      valueColor: 'white',
      labelColor: 'rgba(255,255,255,0.75)',
      iconBg: 'rgba(255,255,255,0.15)',
    },
  };

  const s = styles[accent] || styles.saving;

  return (
    <div
      className="metric-card animate-slide-up"
      style={{
        background: s.background,
        border: s.border,
        borderRadius: '20px',
        padding: '20px 22px',
        boxShadow: '0 2px 12px -2px rgba(15, 76, 42, 0.1)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* İkon */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: s.iconBg,
          fontSize: '18px',
          marginBottom: '12px',
        }}
      >
        {icon}
      </div>

      {/* Etiket */}
      <div style={{
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        color: s.labelColor,
        marginBottom: '6px',
        fontFamily: 'DM Sans, sans-serif',
      }}>
        {label}
      </div>

      {/* Değer */}
      <div style={{
        fontSize: '28px',
        fontWeight: '700',
        color: s.valueColor,
        lineHeight: '1',
        fontFamily: 'JetBrains Mono, monospace',
        letterSpacing: '-0.02em',
      }}>
        {value}
        <span style={{
          fontSize: '13px',
          fontWeight: '500',
          marginLeft: '5px',
          opacity: 0.7,
          fontFamily: 'DM Sans, sans-serif',
        }}>
          {unit}
        </span>
      </div>

      {/* Alt etiket */}
      {sublabel && (
        <div style={{
          fontSize: '12px',
          color: s.labelColor,
          marginTop: '6px',
          opacity: 0.8,
          fontFamily: 'DM Sans, sans-serif',
        }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}
