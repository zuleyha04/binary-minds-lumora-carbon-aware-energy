import React, { useEffect, useMemo, useState } from 'react';

export default function ImpactCelebration({
  saving,
  savingPercent,
  longTermEnabled,
  weeklyUsage = 0,
}) {
  const [animatedSaving, setAnimatedSaving] = useState(0);
  const [burst, setBurst] = useState(false);
  const [pageConfetti, setPageConfetti] = useState(false);

  const safeSaving = Math.max(0, Number(saving || 0));
  const safePercent = Math.max(0, Number(savingPercent || 0));

  const savingKg = safeSaving / 1000;
  const weeklySavingKg = longTermEnabled ? (safeSaving * weeklyUsage) / 1000 : 0;
  const monthlySavingKg = longTermEnabled ? (safeSaving * weeklyUsage * 4) / 1000 : 0;
  const yearlySavingKg = longTermEnabled ? (safeSaving * weeklyUsage * 52) / 1000 : 0;

  const impactLevel = useMemo(() => {
    if (safePercent >= 20) {
      return {
        label: 'Yüksek Etki',
        emoji: '🏆',
        message: 'Harika! Bu seçim güçlü bir karbon azaltımı sağladı.',
        color: '#0f6b3d',
        bg: '#dff8e9',
      };
    }

    if (safePercent >= 10) {
      return {
        label: 'Orta Etki',
        emoji: '🌿',
        message: 'Güzel tercih! Düzenli kullanımda etkisi daha görünür olur.',
        color: '#1a7a4a',
        bg: '#e8f8ef',
      };
    }

    return {
      label: 'Pozitif Etki',
      emoji: '🍃',
      message: 'Küçük adımlar da önemlidir. Her doğru zamanlama doğaya katkıdır.',
      color: '#3c855c',
      bg: '#f0faf4',
    };
  }, [safePercent]);

  useEffect(() => {
    let start = 0;
    const end = safeSaving;
    const duration = 1300;
    const frame = 16;
    const totalSteps = duration / frame;
    const increment = end / totalSteps;

    setAnimatedSaving(0);
    setBurst(false);
    setPageConfetti(false);

    const interval = setInterval(() => {
      start += increment;

      if (start >= end) {
        start = end;
        clearInterval(interval);

        setBurst(true);
        setPageConfetti(true);

        setTimeout(() => {
          setBurst(false);
        }, 1600);

        setTimeout(() => {
          setPageConfetti(false);
        }, 2600);
      }

      setAnimatedSaving(start);
    }, frame);

    return () => clearInterval(interval);
  }, [safeSaving]);

  if (!safeSaving || safeSaving <= 0) return null;

  return (
    <>
      {pageConfetti && <FullPageEcoConfetti />}

      <div style={containerStyle}>
        <style>
          {`
            @keyframes popIn {
              0% { opacity: 0; transform: scale(0.92) translateY(16px); }
              60% { opacity: 1; transform: scale(1.02) translateY(-3px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }

            @keyframes burstRing {
              0% { transform: scale(0.2); opacity: 0.7; }
              80% { transform: scale(1.45); opacity: 0; }
              100% { transform: scale(1.55); opacity: 0; }
            }

            @keyframes localLeafPop {
              0% { transform: translate(0, 0) scale(0.2) rotate(0deg); opacity: 0; }
              15% { opacity: 1; }
              100% { transform: translate(var(--x), var(--y)) scale(1) rotate(var(--r)); opacity: 0; }
            }

            @keyframes floatGlow {
              0% { transform: translateY(0); opacity: 0.35; }
              50% { transform: translateY(-12px); opacity: 0.62; }
              100% { transform: translateY(0); opacity: 0.35; }
            }

            @keyframes shine {
              0% { left: -120%; }
              60% { left: 120%; }
              100% { left: 120%; }
            }

            @keyframes numberPulse {
              0% { transform: scale(1); }
              45% { transform: scale(1.08); }
              100% { transform: scale(1); }
            }
          `}
        </style>

        <div style={shineStyle} />

        <div style={decorCircleOne} />
        <div style={decorCircleTwo} />

        {burst && (
          <div style={burstLayerStyle}>
            {LOCAL_CONFETTI_ITEMS.map((item, index) => (
              <span
                key={index}
                style={{
                  ...localConfettiStyle,
                  '--x': item.x,
                  '--y': item.y,
                  '--r': item.r,
                  animationDelay: item.delay,
                }}
              >
                {item.icon}
              </span>
            ))}
          </div>
        )}

        <div style={headerStyle}>
          <div style={earthWrapStyle}>
            <div style={ringOneStyle} />
            <div style={ringTwoStyle} />
            <span style={earthStyle}>🌍</span>
          </div>

          <div>
            <div style={badgeStyle}>DÜNYAYA KATKIN</div>
            <h3 style={titleStyle}>Tebrikler, daha temiz bir seçim yaptın!</h3>
            <p style={subtitleStyle}>
              Cihazını daha düşük karbonlu bir saate kaydırarak çevresel etkinin azalmasına katkı sağladın.
            </p>
          </div>
        </div>

        <div style={impactMainStyle}>
          <div>
            <p style={miniLabelStyle}>Tek kullanımda azaltılan emisyon</p>

            <div style={valueRowStyle}>
              <span style={{
                ...bigValueStyle,
                animation: burst ? 'numberPulse 0.7s ease' : 'none',
              }}>
                {animatedSaving.toFixed(0)}
              </span>
              <span style={unitStyle}>gCO₂</span>
            </div>

            <p style={smallTextStyle}>
              Yaklaşık <strong>{savingKg.toFixed(3)} kg CO₂</strong> azaltımı.
            </p>
          </div>

          <div style={levelBoxStyle}>
            <div style={{
              ...impactBadgeStyle,
              color: impactLevel.color,
              background: impactLevel.bg,
            }}>
              <span style={{ fontSize: '18px' }}>{impactLevel.emoji}</span>
              {impactLevel.label}
            </div>

            <p style={impactMessageStyle}>
              {impactLevel.message}
            </p>
          </div>
        </div>

        <div style={messageBoxStyle}>
          <p style={{ margin: 0 }}>
            Bu tercihle yaklaşık <strong>%{safePercent.toFixed(0)}</strong> daha az karbon salımı oluşturdun.
            Aynı cihazı düzenli olarak daha temiz saatlerde çalıştırmak, küçük bir tercihi
            sürdürülebilir bir alışkanlığa dönüştürür.
          </p>
        </div>

        {longTermEnabled && (
          <div style={longTermGridStyle}>
            <ImpactMiniCard icon="📅" label="Haftalık katkı" value={`${weeklySavingKg.toFixed(2)} kg CO₂`} />
            <ImpactMiniCard icon="🗓️" label="Aylık katkı" value={`${monthlySavingKg.toFixed(2)} kg CO₂`} />
            <ImpactMiniCard icon="🌱" label="Yıllık katkı" value={`${yearlySavingKg.toFixed(2)} kg CO₂`} />
          </div>
        )}
      </div>
    </>
  );
}

function FullPageEcoConfetti() {
  return (
    <div style={fullPageLayerStyle}>
      <style>
        {`
          @keyframes pageConfettiBurst {
            0% {
              transform: translate(-50%, -50%) scale(0.2) rotate(0deg);
              opacity: 0;
            }

            12% {
              opacity: 1;
            }

            72% {
              opacity: 1;
            }

            100% {
              transform:
                translate(calc(-50% + var(--tx)), calc(-50% + var(--ty)))
                scale(var(--s))
                rotate(var(--rot));
              opacity: 0;
            }
          }

          @keyframes pageGlowFade {
            0% { opacity: 0; transform: scale(0.4); }
            20% { opacity: 0.55; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.65); }
          }

          @keyframes ecoMessagePop {
            0% { opacity: 0; transform: translateY(16px) scale(0.95); }
            18% { opacity: 1; transform: translateY(0) scale(1); }
            78% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-10px) scale(0.98); }
          }
        `}
      </style>

      <div style={pageGlowStyle} />

      <div style={pageMessageStyle}>
        <span style={{ fontSize: '30px' }}>🌍</span>
        <span>Dünyaya katkı sağladın!</span>
      </div>

      {PAGE_CONFETTI_ITEMS.map((item, index) => (
        <span
          key={index}
          style={{
            ...pageParticleStyle,
            '--tx': item.tx,
            '--ty': item.ty,
            '--rot': item.rot,
            '--s': item.s,
            animationDelay: item.delay,
            fontSize: item.size,
          }}
        >
          {item.icon}
        </span>
      ))}
    </div>
  );
}

function ImpactMiniCard({ icon, label, value }) {
  return (
    <div style={miniCardStyle}>
      <div style={miniIconStyle}>{icon}</div>
      <div>
        <div style={miniLabelTextStyle}>{label}</div>
        <div style={miniValueStyle}>{value}</div>
      </div>
    </div>
  );
}

const PAGE_CONFETTI_ITEMS = [
  { icon: '🍃', tx: '-46vw', ty: '-32vh', rot: '-220deg', s: 1.2, delay: '0s', size: '26px' },
  { icon: '🌿', tx: '-34vw', ty: '-44vh', rot: '180deg', s: 1.0, delay: '0.02s', size: '24px' },
  { icon: '✨', tx: '-18vw', ty: '-48vh', rot: '360deg', s: 1.1, delay: '0.04s', size: '22px' },
  { icon: '🍀', tx: '0vw', ty: '-50vh', rot: '-160deg', s: 1.2, delay: '0.06s', size: '24px' },
  { icon: '🌱', tx: '18vw', ty: '-48vh', rot: '210deg', s: 1.0, delay: '0.08s', size: '24px' },
  { icon: '🍃', tx: '34vw', ty: '-42vh', rot: '-260deg', s: 1.15, delay: '0.1s', size: '26px' },
  { icon: '✨', tx: '46vw', ty: '-30vh', rot: '320deg', s: 1.1, delay: '0.12s', size: '22px' },

  { icon: '🌿', tx: '-52vw', ty: '-6vh', rot: '250deg', s: 1.0, delay: '0.03s', size: '26px' },
  { icon: '🍃', tx: '-44vw', ty: '12vh', rot: '-320deg', s: 1.15, delay: '0.06s', size: '24px' },
  { icon: '✨', tx: '-32vw', ty: '32vh', rot: '180deg', s: 1.0, delay: '0.09s', size: '22px' },
  { icon: '🍀', tx: '-12vw', ty: '45vh', rot: '-240deg', s: 1.15, delay: '0.12s', size: '24px' },
  { icon: '🌱', tx: '12vw', ty: '45vh', rot: '260deg', s: 1.1, delay: '0.15s', size: '24px' },
  { icon: '✨', tx: '32vw', ty: '32vh', rot: '-180deg', s: 1.0, delay: '0.18s', size: '22px' },
  { icon: '🍃', tx: '44vw', ty: '12vh', rot: '320deg', s: 1.1, delay: '0.21s', size: '24px' },
  { icon: '🌿', tx: '52vw', ty: '-6vh', rot: '-250deg', s: 1.0, delay: '0.24s', size: '26px' },

  { icon: '🍃', tx: '-22vw', ty: '-12vh', rot: '-180deg', s: 0.9, delay: '0.14s', size: '20px' },
  { icon: '✨', tx: '22vw', ty: '-14vh', rot: '160deg', s: 0.9, delay: '0.16s', size: '20px' },
  { icon: '🌱', tx: '-24vw', ty: '14vh', rot: '220deg', s: 0.9, delay: '0.18s', size: '20px' },
  { icon: '🍀', tx: '24vw', ty: '14vh', rot: '-220deg', s: 0.9, delay: '0.2s', size: '20px' },
];

const LOCAL_CONFETTI_ITEMS = [
  { icon: '🍃', x: '-120px', y: '-90px', r: '-35deg', delay: '0s' },
  { icon: '🌿', x: '110px', y: '-100px', r: '30deg', delay: '0.03s' },
  { icon: '✨', x: '-80px', y: '-145px', r: '20deg', delay: '0.05s' },
  { icon: '🍀', x: '80px', y: '-150px', r: '-15deg', delay: '0.07s' },
  { icon: '🌱', x: '-150px', y: '10px', r: '-45deg', delay: '0.1s' },
  { icon: '🍃', x: '150px', y: '5px', r: '40deg', delay: '0.12s' },
  { icon: '✨', x: '-100px', y: '85px', r: '25deg', delay: '0.16s' },
  { icon: '🌿', x: '115px', y: '80px', r: '-20deg', delay: '0.18s' },
];

const fullPageLayerStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  pointerEvents: 'none',
  overflow: 'hidden',
};

const pageGlowStyle = {
  position: 'absolute',
  left: '50%',
  top: '47%',
  width: '340px',
  height: '340px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(82, 190, 120, 0.32), rgba(82, 190, 120, 0.08), transparent 70%)',
  transform: 'translate(-50%, -50%)',
  animation: 'pageGlowFade 2.2s ease-out forwards',
};

const pageMessageStyle = {
  position: 'absolute',
  left: '50%',
  top: '47%',
  transform: 'translate(-50%, -50%)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  background: 'rgba(255, 255, 255, 0.92)',
  color: '#145335',
  border: '1px solid #c8ecd4',
  borderRadius: '999px',
  padding: '14px 22px',
  fontFamily: 'DM Sans, sans-serif',
  fontWeight: 900,
  fontSize: '18px',
  boxShadow: '0 18px 42px rgba(31, 123, 72, 0.18)',
  animation: 'ecoMessagePop 2.25s ease-out forwards',
};

const pageParticleStyle = {
  position: 'absolute',
  left: '50%',
  top: '47%',
  transform: 'translate(-50%, -50%)',
  animation: 'pageConfettiBurst 2.25s cubic-bezier(.16,.84,.3,1) forwards',
  filter: 'drop-shadow(0 8px 10px rgba(27, 67, 50, 0.18))',
};

const containerStyle = {
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #f7fff9 0%, #edf9f1 45%, #e1f5e9 100%)',
  border: '1.5px solid #c8ecd4',
  borderRadius: '26px',
  padding: '26px',
  boxShadow: '0 16px 34px rgba(41, 125, 78, 0.13)',
  animation: 'popIn 0.55s ease',
};

const shineStyle = {
  position: 'absolute',
  top: 0,
  left: '-120%',
  width: '80%',
  height: '100%',
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
  transform: 'skewX(-20deg)',
  animation: 'shine 2.6s ease 0.4s',
};

const decorCircleOne = {
  position: 'absolute',
  width: '220px',
  height: '220px',
  borderRadius: '50%',
  right: '-70px',
  top: '-80px',
  background: 'radial-gradient(circle, rgba(80, 190, 120, 0.18), rgba(80,190,120,0))',
  animation: 'floatGlow 3.5s infinite ease-in-out',
};

const decorCircleTwo = {
  position: 'absolute',
  width: '180px',
  height: '180px',
  borderRadius: '50%',
  left: '-70px',
  bottom: '-70px',
  background: 'radial-gradient(circle, rgba(20, 130, 75, 0.12), rgba(20,130,75,0))',
  animation: 'floatGlow 4.2s infinite ease-in-out',
};

const burstLayerStyle = {
  position: 'absolute',
  left: '50%',
  top: '42%',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
  zIndex: 5,
};

const localConfettiStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  fontSize: '24px',
  animation: 'localLeafPop 1.35s ease-out forwards',
};

const headerStyle = {
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  gap: '18px',
  marginBottom: '22px',
};

const earthWrapStyle = {
  position: 'relative',
  width: '76px',
  height: '76px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #dcfce7, #ffffff)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxShadow: '0 10px 24px rgba(31, 123, 72, 0.12)',
};

const ringOneStyle = {
  position: 'absolute',
  inset: '-8px',
  borderRadius: '50%',
  border: '2px solid rgba(52, 122, 75, 0.18)',
  animation: 'burstRing 2.2s infinite ease-out',
};

const ringTwoStyle = {
  position: 'absolute',
  inset: '-16px',
  borderRadius: '50%',
  border: '2px solid rgba(52, 122, 75, 0.11)',
  animation: 'burstRing 2.2s infinite ease-out 0.35s',
};

const earthStyle = {
  position: 'relative',
  zIndex: 2,
  fontSize: '36px',
};

const badgeStyle = {
  display: 'inline-block',
  background: '#dff4e6',
  color: '#247044',
  fontSize: '11px',
  fontWeight: 900,
  letterSpacing: '0.1em',
  padding: '7px 11px',
  borderRadius: '999px',
  marginBottom: '8px',
  fontFamily: 'DM Sans, sans-serif',
};

const titleStyle = {
  margin: '0 0 6px 0',
  fontSize: '25px',
  color: '#145335',
  fontWeight: 900,
  fontFamily: 'DM Sans, sans-serif',
};

const subtitleStyle = {
  margin: 0,
  fontSize: '14px',
  color: '#4d7b63',
  lineHeight: '1.6',
  fontFamily: 'DM Sans, sans-serif',
};

const impactMainStyle = {
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  justifyContent: 'space-between',
  gap: '18px',
  flexWrap: 'wrap',
  background: 'rgba(255,255,255,0.75)',
  border: '1px solid #d8efdf',
  borderRadius: '22px',
  padding: '20px',
  marginBottom: '16px',
};

const miniLabelStyle = {
  margin: '0 0 10px 0',
  fontSize: '12px',
  color: '#5a846a',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontWeight: 900,
  fontFamily: 'DM Sans, sans-serif',
};

const valueRowStyle = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: '8px',
};

const bigValueStyle = {
  fontSize: '48px',
  fontWeight: 1000,
  lineHeight: 1,
  color: '#168447',
  fontFamily: 'DM Sans, sans-serif',
};

const unitStyle = {
  fontSize: '17px',
  fontWeight: 800,
  color: '#49745b',
  marginBottom: '5px',
  fontFamily: 'DM Sans, sans-serif',
};

const smallTextStyle = {
  margin: '9px 0 0 0',
  fontSize: '13px',
  color: '#4d7b63',
  fontFamily: 'DM Sans, sans-serif',
};

const levelBoxStyle = {
  textAlign: 'right',
  maxWidth: '300px',
};

const impactBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '7px',
  fontSize: '12px',
  fontWeight: 900,
  padding: '9px 13px',
  borderRadius: '999px',
  marginBottom: '10px',
  fontFamily: 'DM Sans, sans-serif',
};

const impactMessageStyle = {
  margin: 0,
  fontSize: '13px',
  lineHeight: '1.6',
  color: '#4d7b63',
  fontFamily: 'DM Sans, sans-serif',
};

const messageBoxStyle = {
  position: 'relative',
  zIndex: 2,
  background: 'rgba(255,255,255,0.78)',
  border: '1px solid #d8efdf',
  borderRadius: '18px',
  padding: '16px 18px',
  marginBottom: '16px',
  color: '#1d4d37',
  fontSize: '14px',
  lineHeight: 1.7,
  fontFamily: 'DM Sans, sans-serif',
};

const longTermGridStyle = {
  position: 'relative',
  zIndex: 2,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '12px',
};

const miniCardStyle = {
  background: 'white',
  border: '1px solid #d8efdf',
  borderRadius: '18px',
  padding: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  boxShadow: '0 6px 14px rgba(31, 123, 72, 0.06)',
};

const miniIconStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '14px',
  background: '#effaf3',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  flexShrink: 0,
};

const miniLabelTextStyle = {
  fontSize: '12px',
  color: '#6c8b79',
  marginBottom: '4px',
  fontFamily: 'DM Sans, sans-serif',
};

const miniValueStyle = {
  fontSize: '18px',
  fontWeight: 900,
  color: '#1a7a4a',
  fontFamily: 'DM Sans, sans-serif',
};