import React, { useEffect, useMemo, useState } from 'react';

const TOUR_STEPS = [
  {
    title: 'Cihazı Seç',
    description:
      'Veri setindeki cihazlardan birini seçebilir veya kendi cihazınızı ekleyebilirsiniz.',
    targetId: 'tour-device-panel',
    icon: '🔌',
  },
  {
    title: 'Kullanım Saatini Belirle',
    description:
      'Cihazı genelde hangi saatte çalıştırdığınızı ve kaç saat erteleyebileceğinizi seçin.',
    targetId: 'tour-hour-section',
    icon: '⏱️',
  },
  {
    title: 'Karbon Sonuçlarını Gör',
    description:
      'Mevcut saat ile önerilen saat arasındaki CO₂ farkını ve tasarruf oranını burada görebilirsiniz.',
    targetId: 'result-section',
    icon: '🌿',
  },
  {
    title: 'Karbon Grafiğini İncele',
    description:
      'Saatlik karbon yoğunluğu grafiğinde mevcut saat, aday saatler ve önerilen düşük karbonlu saati görebilirsiniz.',
    targetId: 'carbon-chart-section',
    icon: '📈',
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function ProductTour({
  currentStep = 0,
  onNext,
  onPrev,
  onFinish,
}) {
  const [targetRect, setTargetRect] = useState(null);

  const step = TOUR_STEPS[currentStep];
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  const scrollToTarget = () => {
    if (!step?.targetId) return;

    const element = document.getElementById(step.targetId);
    if (!element) return;

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  };

  const updateRect = () => {
    if (!step?.targetId) return;

    const element = document.getElementById(step.targetId);

    if (!element) {
      setTargetRect(null);
      return;
    }

    const rect = element.getBoundingClientRect();
    setTargetRect(rect);
  };

  useEffect(() => {
    scrollToTarget();

    const timer1 = setTimeout(updateRect, 120);
    const timer2 = setTimeout(updateRect, 420);
    const timer3 = setTimeout(updateRect, 720);

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [currentStep, step?.targetId]);

  const highlightStyle = useMemo(() => {
    if (!targetRect) return null;

    return {
      position: 'fixed',
      top: Math.max(targetRect.top - 14, 8),
      left: Math.max(targetRect.left - 14, 8),
      width: targetRect.width + 28,
      height: targetRect.height + 28,
      borderRadius: '26px',
      border: '4px solid #4ade80',
      background: 'transparent',
      pointerEvents: 'none',
      zIndex: 10001,
      animation: 'tourPulse 1.35s ease-in-out infinite',
      boxShadow: `
        0 0 0 9999px rgba(15, 23, 42, 0.42),
        0 0 0 7px rgba(74, 222, 128, 0.22),
        0 0 28px rgba(34, 197, 94, 0.45),
        0 0 90px rgba(34, 197, 94, 0.22)
      `,
    };
  }, [targetRect]);

  const badgeStyle = useMemo(() => {
    if (!targetRect) return null;

    return {
      position: 'fixed',
      top: Math.max(targetRect.top - 48, 8),
      left: Math.max(targetRect.left, 8),
      background: 'linear-gradient(135deg, #166534, #22c55e)',
      color: 'white',
      padding: '8px 14px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 900,
      letterSpacing: '0.04em',
      boxShadow: '0 10px 26px rgba(22, 101, 52, 0.38)',
      zIndex: 10002,
      pointerEvents: 'none',
      fontFamily: 'DM Sans, sans-serif',
    };
  }, [targetRect]);

  const cardStyle = useMemo(() => {
    const baseStyle = {
      position: 'fixed',
      background: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '26px',
      padding: '24px',
      boxShadow: '0 26px 70px rgba(15, 23, 42, 0.30)',
      zIndex: 10003,
      animation: 'tourCardPop 0.28s ease',
      border: '1.5px solid #d9e8de',
      fontFamily: 'DM Sans, sans-serif',
    };

    if (!targetRect) {
      return {
        ...baseStyle,
        left: '50%',
        bottom: '24px',
        transform: 'translateX(-50%)',
        width: 'min(92vw, 440px)',
      };
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const PADDING = 16;
    const GAP = 22;
    const CARD_WIDTH = Math.min(440, vw - PADDING * 2);
    const CARD_HEIGHT = 250;

    const spaceAbove = targetRect.top;
    const spaceBelow = vh - targetRect.bottom;
    const spaceLeft = targetRect.left;
    const spaceRight = vw - targetRect.right;

    let top = null;
    let left = null;

    // 1) Önce alta koy
    if (spaceBelow >= CARD_HEIGHT + GAP + PADDING) {
      top = targetRect.bottom + GAP;
      left = clamp(targetRect.left, PADDING, vw - CARD_WIDTH - PADDING);
    }
    // 2) Sonra üste koy
    else if (spaceAbove >= CARD_HEIGHT + GAP + PADDING) {
      top = targetRect.top - CARD_HEIGHT - GAP;
      left = clamp(targetRect.left, PADDING, vw - CARD_WIDTH - PADDING);
    }
    // 3) Sonra sağa koy
    else if (spaceRight >= CARD_WIDTH + GAP + PADDING) {
      left = targetRect.right + GAP;
      top = clamp(
        targetRect.top + targetRect.height / 2 - CARD_HEIGHT / 2,
        PADDING,
        vh - CARD_HEIGHT - PADDING
      );
    }
    // 4) Sonra sola koy
    else if (spaceLeft >= CARD_WIDTH + GAP + PADDING) {
      left = targetRect.left - CARD_WIDTH - GAP;
      top = clamp(
        targetRect.top + targetRect.height / 2 - CARD_HEIGHT / 2,
        PADDING,
        vh - CARD_HEIGHT - PADDING
      );
    }
    // 5) Hiçbiri olmazsa ekranın alt orta kısmı
    else {
      left = clamp((vw - CARD_WIDTH) / 2, PADDING, vw - CARD_WIDTH - PADDING);
      top = vh - CARD_HEIGHT - 20;
    }

    return {
      ...baseStyle,
      width: `${CARD_WIDTH}px`,
      left: `${left}px`,
      top: `${top}px`,
      transform: 'none',
    };
  }, [targetRect]);

  const handleNextClick = () => {
    onNext();
  };

  const handlePrevClick = () => {
    onPrev();
  };

  return (
    <>
      <style>
        {`
          @keyframes tourPulse {
            0% {
              transform: scale(1);
              box-shadow:
                0 0 0 9999px rgba(15, 23, 42, 0.42),
                0 0 0 7px rgba(74, 222, 128, 0.22),
                0 0 28px rgba(34, 197, 94, 0.45),
                0 0 80px rgba(34, 197, 94, 0.18);
            }

            50% {
              transform: scale(1.012);
              box-shadow:
                0 0 0 9999px rgba(15, 23, 42, 0.42),
                0 0 0 12px rgba(74, 222, 128, 0.16),
                0 0 48px rgba(34, 197, 94, 0.62),
                0 0 115px rgba(34, 197, 94, 0.28);
            }

            100% {
              transform: scale(1);
              box-shadow:
                0 0 0 9999px rgba(15, 23, 42, 0.42),
                0 0 0 7px rgba(74, 222, 128, 0.22),
                0 0 28px rgba(34, 197, 94, 0.45),
                0 0 80px rgba(34, 197, 94, 0.18);
            }
          }

          @keyframes tourCardPop {
            0% {
              opacity: 0;
              transform: translateY(20px) scale(0.96);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes focusLabelFloat {
            0% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>

      {highlightStyle && <div style={highlightStyle} />}

   

      <div style={cardStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '13px',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #eef8f1, #dff4e7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 8px 18px rgba(47, 125, 78, 0.10)',
            }}
          >
            {step.icon}
          </div>

          <div>
            <div
              style={{
                fontSize: '12px',
                color: '#5c8769',
                fontWeight: 900,
                marginBottom: '3px',
              }}
            >
              {currentStep + 1}/{TOUR_STEPS.length}
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: '20px',
                color: '#1f4f35',
                fontFamily: 'Playfair Display, serif',
              }}
            >
              {step.title}
            </h3>
          </div>
        </div>

        <p
          style={{
            margin: '0 0 18px 0',
            fontSize: '15px',
            color: '#4c6655',
            lineHeight: 1.65,
          }}
        >
          {step.description}
        </p>

        <div
          style={{
            width: '100%',
            height: '7px',
            background: '#dbe7df',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #2f7d4e, #6bc48d)',
              borderRadius: '999px',
              transition: 'width 0.25s ease',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '7px',
              alignItems: 'center',
            }}
          >
            {TOUR_STEPS.map((_, index) => (
              <span
                key={index}
                style={{
                  width: index === currentStep ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background: index === currentStep ? '#2f7d4e' : '#cbd9cf',
                  transition: 'all 0.25s ease',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {currentStep > 0 && (
              <button onClick={handlePrevClick} style={secondaryBtn}>
                Geri
              </button>
            )}

            {currentStep < TOUR_STEPS.length - 1 ? (
              <button onClick={handleNextClick} style={primaryBtn}>
                Geç →
              </button>
            ) : (
              <button onClick={onFinish} style={primaryBtn}>
                Paneli kullanmaya başla
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const primaryBtn = {
  background: 'linear-gradient(135deg, #2f7d4e, #4fa36f)',
  color: 'white',
  border: 'none',
  borderRadius: '14px',
  padding: '12px 18px',
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'DM Sans, sans-serif',
  boxShadow: '0 8px 18px rgba(47, 125, 78, 0.26)',
};

const secondaryBtn = {
  background: '#eef4f0',
  color: '#2f7d4e',
  border: 'none',
  borderRadius: '14px',
  padding: '12px 18px',
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'DM Sans, sans-serif',
};