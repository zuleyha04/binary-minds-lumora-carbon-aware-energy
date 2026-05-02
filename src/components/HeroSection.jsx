import React from 'react';

export default function HeroSection({ onStartTour }) {
  return (
    <div
      className="relative overflow-hidden animate-fade-in"
      style={{
        background: 'linear-gradient(135deg, #0d4228 0%, #166840 35%, #1a9656 65%, #2ab870 100%)',
        borderRadius: '28px',
        padding: '48px 56px',
        boxShadow: '0 25px 60px -10px rgba(8, 38, 25, 0.38)',
        marginBottom: '32px',
      }}
    >
      {/* Dekoratif arka plan blob'ları */}
      <div
        className="hero-blob"
        style={{
          width: '320px',
          height: '320px',
          background: '#4dbf84',
          top: '-80px',
          right: '200px',
        }}
      />
      <div
        className="hero-blob"
        style={{
          width: '200px',
          height: '200px',
          background: '#87d9ae',
          bottom: '-60px',
          right: '80px',
          opacity: 0.2,
        }}
      />
      <div
        className="hero-blob"
        style={{
          width: '150px',
          height: '150px',
          background: '#0d4228',
          top: '40px',
          left: '40%',
          opacity: 0.3,
        }}
      />

      {/* Sağ dekoratif illüstrasyon */}
      <div
        style={{
          position: 'absolute',
          right: '48px',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.12,
          pointerEvents: 'none',
        }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Dünya küre illüstrasyonu */}
          <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="3" fill="none" />
          <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="1.5" fill="none" />
          <circle cx="100" cy="100" r="50" stroke="white" strokeWidth="1" fill="none" />
          {/* Enlem çizgileri */}
          <ellipse cx="100" cy="100" rx="90" ry="30" stroke="white" strokeWidth="1.5" fill="none" />
          <ellipse cx="100" cy="100" rx="90" ry="60" stroke="white" strokeWidth="1" fill="none" />
          {/* Boylam */}
          <line x1="100" y1="10" x2="100" y2="190" stroke="white" strokeWidth="1.5" />
          <line x1="10" y1="100" x2="190" y2="100" stroke="white" strokeWidth="1.5" />
          {/* Yaprak motifi */}
          <path d="M100 40 C120 60 130 80 100 100 C70 80 80 60 100 40Z" fill="white" opacity="0.6" />
          <path d="M60 100 C80 80 100 70 100 100 C80 120 60 120 60 100Z" fill="white" opacity="0.4" />
          {/* Güneş / enerji sembolü */}
          <circle cx="148" cy="52" r="18" stroke="white" strokeWidth="2" fill="none" />
          <line x1="148" y1="30" x2="148" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="148" y1="74" x2="148" y2="82" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="126" y1="52" x2="118" y2="52" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="170" y1="52" x2="178" y2="52" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="133" y1="37" x2="127" y2="31" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="163" y1="67" x2="169" y2="73" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="163" y1="37" x2="169" y2="31" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="133" y1="67" x2="127" y2="73" stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* CO2 azalma oku */}
          <path d="M30 160 L50 140 L70 150 L90 130 L110 145 L130 120 L150 135" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <polygon points="148,120 158,128 150,135" fill="white" />
        </svg>
      </div>

      {/* İçerik */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '620px' }}>
        {/* Badge */}
     

        {/* Ana başlık */}
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '700',
            color: 'white',
            lineHeight: '1.15',
            marginBottom: '16px',
            letterSpacing: '-0.01em',
          }}
        >
          Lumora<br />
          <span style={{ color: '#87d9ae' }}>Doğru zaman, temiz enerji!</span>
        </h1>

        {/* Açıklama */}
        <p
          style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.78)',
            lineHeight: '1.65',
            marginBottom: '28px',
            maxWidth: '520px',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: '300',
          }}
        >
          Ev cihazlarınızı daha düşük karbon yoğunluğuna sahip saatlerde çalıştırarak
          hem emisyonu hem enerji etkisini daha akıllı yönetmenize yardımcı olur.
        </p>

        {/* Buton */}
        <button
          onClick={onStartTour}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(255,255,255,0.35)',
            borderRadius: '12px',
            padding: '11px 22px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'DM Sans, sans-serif',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.26)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>🧭</span>
          Rehberi tekrar göster
        </button>
      </div>
    </div>
  );
}
