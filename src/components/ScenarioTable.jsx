import React from 'react';
import { formatHour, resultsToCSV } from '../utils/calculations';
import { APPLIANCE_TR } from '../utils/dataLoader';

function TableRow({ label, value, highlight }) {
  return (
    <tr style={{ borderBottom: '1px solid #f0faf4' }}>
      <td style={{
        padding: '10px 16px',
        fontSize: '13px',
        color: '#528e6e',
        fontFamily: 'DM Sans, sans-serif',
        width: '55%',
      }}>
        {label}
      </td>
      <td style={{
        padding: '10px 16px',
        fontSize: '13px',
        fontWeight: highlight ? '600' : '500',
        color: highlight ? '#145335' : '#2e3a30',
        fontFamily: 'JetBrains Mono, monospace',
        textAlign: 'right',
      }}>
        {value}
      </td>
    </tr>
  );
}

export default function ScenarioTable({
  applianceName,
  energyKwh,
  currentHour,
  flexibilityHours,
  weeklyUsage,
  results,
  longTermEnabled,
}) {
  if (!results) return null;

  const displayName = APPLIANCE_TR[applianceName] || applianceName || '—';

  const handleDownload = () => {
    const csv = resultsToCSV({
      applianceName: displayName,
      energyKwh,
      currentHour,
      flexibilityHours,
      weeklyUsage: longTermEnabled ? weeklyUsage : null,
      results,
    });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `co2-senaryo-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="control-card animate-slide-up" style={{ padding: '0', overflow: 'hidden' }}>
      {/* Başlık */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 20px',
        borderBottom: '1.5px solid #f0faf4',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}></span>
          <h3 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '16px',
            fontWeight: '600',
            color: '#145335',
            margin: 0,
          }}>
            Senaryo Detayları
          </h3>
        </div>

        <button
          onClick={handleDownload}
          className="btn-secondary"
          style={{ padding: '7px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>⬇</span> CSV İndir
        </button>
      </div>

      {/* Tablo */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <TableRow label="Cihaz" value={displayName} />
          <TableRow label="Mevcut kullanım saati" value={formatHour(currentHour)} />
          <TableRow label="Önerilen saat" value={formatHour(results.recommendedHour)} highlight />
          <TableRow label="Erteleme esnekliği" value={`${flexibilityHours} saat`} />
          <TableRow label="Enerji tüketimi" value={`${energyKwh.toFixed(3)} kWh`} />
          <TableRow label="Mevcut karbon yoğunluğu" value={`${results.currentCarbonIntensity.toFixed(1)} gCO₂/kWh`} />
          <TableRow label="Önerilen karbon yoğunluğu" value={`${results.recommendedCarbonIntensity.toFixed(1)} gCO₂/kWh`} />
          <TableRow label="Mevcut emisyon" value={`${results.currentEmission.toFixed(1)} gCO₂`} />
          <TableRow label="Önerilen emisyon" value={`${results.recommendedEmission.toFixed(1)} gCO₂`} />
          <TableRow label="Tek kullanım CO₂ kazancı" value={`${Math.max(0, results.saving).toFixed(1)} gCO₂`} highlight />
          <TableRow label="Azalma oranı" value={`%${Math.max(0, results.savingPercent).toFixed(1)}`} highlight />

          {longTermEnabled && results.longTerm && (
            <>
              <tr>
                <td colSpan={2} style={{
                  padding: '10px 16px',
                  background: '#f0faf4',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#528e6e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  Uzun Dönem Projeksiyon
                </td>
              </tr>
              <TableRow label="Haftalık kullanım" value={`${weeklyUsage} kez/hafta`} />
              <TableRow label="Haftalık tahmini kazanç" value={`${results.longTerm.weeklySavingKg.toFixed(3)} kgCO₂`} highlight />
              <TableRow label="Aylık tahmini kazanç" value={`${results.longTerm.monthlySavingKg.toFixed(3)} kgCO₂`} highlight />
              <TableRow label="Yıllık tahmini kazanç" value={`${results.longTerm.yearlySavingKg.toFixed(2)} kgCO₂`} highlight />
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
