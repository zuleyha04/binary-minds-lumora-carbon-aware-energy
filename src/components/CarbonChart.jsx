import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ReferenceArea, ResponsiveContainer, Dot,
} from 'recharts';
import { formatHour } from '../utils/calculations';

const CustomDot = (props) => {
  const { cx, cy, payload, candidateHours, currentHour, recommendedHour } = props;
  const h = payload.hour;

  if (h === recommendedHour) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={10} fill="#1a7a4a" opacity={0.2} />
        <circle cx={cx} cy={cy} r={6} fill="#1a7a4a" stroke="white" strokeWidth={2} />
      </g>
    );
  }
  if (h === currentHour) {
    return (
      <circle cx={cx} cy={cy} r={5} fill="#d97706" stroke="white" strokeWidth={2} />
    );
  }
  if (candidateHours.includes(h) && h !== recommendedHour && h !== currentHour) {
    return (
      <circle cx={cx} cy={cy} r={3} fill="#a5c9b3" stroke="white" strokeWidth={1} />
    );
  }
  return null;
};

const CustomTooltip = ({ active, payload, candidateHours, currentHour, recommendedHour }) => {
  if (!active || !payload || !payload.length) return null;
  const h = payload[0].payload.hour;
  const intensity = payload[0].value;

  let tag = null;
  if (h === recommendedHour) tag = { label: 'Önerilen', color: '#1a7a4a', bg: '#dcf5e7' };
  else if (h === currentHour) tag = { label: 'Mevcut', color: '#92400e', bg: '#fef3c7' };
  else if (candidateHours.includes(h)) tag = { label: 'Aday', color: '#528e6e', bg: '#f0faf4' };

  return (
    <div style={{
      background: 'white',
      border: '1.5px solid #cde1d4',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 8px 24px -4px rgba(15,76,42,0.15)',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{ fontSize: '13px', fontWeight: '600', color: '#145335', marginBottom: '4px' }}>
        {formatHour(h)}
      </div>
      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f4c2a', fontFamily: 'JetBrains Mono, monospace' }}>
        {intensity.toFixed(0)} <span style={{ fontSize: '11px', fontWeight: '400' }}>gCO₂/kWh</span>
      </div>
      {tag && (
        <div style={{
          display: 'inline-flex',
          marginTop: '6px',
          padding: '2px 8px',
          borderRadius: '999px',
          background: tag.bg,
          color: tag.color,
          fontSize: '11px',
          fontWeight: '600',
        }}>
          {tag.label}
        </div>
      )}
    </div>
  );
};

export default function CarbonChart({ carbonData, currentHour, recommendedHour, candidateHours }) {
  if (!carbonData || carbonData.length === 0) {
    return (
      <div style={{
        height: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#528e6e',
        fontSize: '14px',
      }}>
        Karbon verisi yükleniyor...
      </div>
    );
  }

  const data = [...carbonData].sort((a, b) => a.hour - b.hour);

  // Aday saatler için ReferenceArea hesapla (wrap-around durumu)
  const candidateSet = new Set(candidateHours);

  return (
    <div id="carbon-chart-section" style={{ width: '100%' }}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4dbf84" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#4dbf84" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e6f0e9" vertical={false} />

          <XAxis
            dataKey="hour"
            tickFormatter={h => `${String(h).padStart(2, '0')}:00`}
            tick={{ fontSize: 11, fill: '#528e6e', fontFamily: 'JetBrains Mono, monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#cde1d4' }}
            interval={3}
          />

          <YAxis
            tick={{ fontSize: 11, fill: '#528e6e', fontFamily: 'JetBrains Mono, monospace' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}`}
            width={40}
          />

          <Tooltip
            content={<CustomTooltip
              candidateHours={candidateHours}
              currentHour={currentHour}
              recommendedHour={recommendedHour}
            />}
          />

          {/* Aday saatler alanı highlight */}
          {candidateHours.length > 0 && candidateHours.map((h, i) => (
            <ReferenceLine
              key={`cand-${h}`}
              x={h}
              stroke="#a5c9b3"
              strokeWidth={1}
              strokeDasharray="4 2"
            />
          ))}

          {/* Mevcut saat çizgisi */}
          <ReferenceLine
            x={currentHour}
            stroke="#d97706"
            strokeWidth={2}
            label={{ value: 'Mevcut', fill: '#92400e', fontSize: 11, fontFamily: 'DM Sans', position: 'top' }}
          />

          {/* Önerilen saat çizgisi */}
          {recommendedHour !== currentHour && (
            <ReferenceLine
              x={recommendedHour}
              stroke="#1a7a4a"
              strokeWidth={2.5}
              strokeDasharray="0"
              label={{ value: 'Önerilen', fill: '#145335', fontSize: 11, fontFamily: 'DM Sans', position: 'top' }}
            />
          )}

          <Line
            type="monotone"
            dataKey="carbon_intensity_g_per_kwh"
            stroke="#28a262"
            strokeWidth={2.5}
            dot={(props) => (
              <CustomDot
                {...props}
                candidateHours={candidateHours}
                currentHour={currentHour}
                recommendedHour={recommendedHour}
              />
            )}
            activeDot={{ r: 6, fill: '#1a7a4a', stroke: 'white', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Grafik açıklaması */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px', paddingLeft: '8px' }}>
        <LegendItem color="#1a7a4a" label="Önerilen saat" filled />
        <LegendItem color="#d97706" label="Mevcut saat" />
        <LegendItem color="#a5c9b3" label="Aday saatler" dashed />
        <LegendItem color="#28a262" label="Karbon profili" line />
      </div>
    </div>
  );
}

function LegendItem({ color, label, filled, dashed, line }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{
        width: dashed || line ? '18px' : '8px',
        height: '8px',
        borderRadius: filled ? '50%' : line ? '2px' : '50%',
        background: line ? color : filled ? color : 'transparent',
        border: !filled && !line ? `2px solid ${color}` : 'none',
        borderTop: dashed ? `2px dashed ${color}` : undefined,
        background: line ? color : filled ? color : undefined,
      }} />
      <span style={{ fontSize: '11px', color: '#528e6e', fontFamily: 'DM Sans, sans-serif' }}>
        {label}
      </span>
    </div>
  );
}
