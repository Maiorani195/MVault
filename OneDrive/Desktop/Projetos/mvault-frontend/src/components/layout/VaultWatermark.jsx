import React from 'react';

export default function VaultWatermark() {
  // Configuração dos favos com 3 planos de profundidade (Depth of Field)
  // Tonalidades douradas atenuadas para elegância sutil e sem ofuscar
  const driftingFavos = [
    // Plano de fundo (Deep / Bokeh - muito discreto)
    { id: 1, top: '7%', size: 30, duration: '15s', delay: '-3s', blur: '2.5px', opacity: 0.12, sway: '18px' },
    { id: 2, top: '22%', size: 24, duration: '16s', delay: '-9s', blur: '2px', opacity: 0.10, sway: '14px' },
    { id: 3, top: '48%', size: 28, duration: '17s', delay: '-5s', blur: '2.5px', opacity: 0.11, sway: '20px' },
    { id: 4, top: '74%', size: 22, duration: '15.5s', delay: '-11s', blur: '2px', opacity: 0.12, sway: '16px' },
    { id: 5, top: '91%', size: 26, duration: '16.5s', delay: '-7s', blur: '2.5px', opacity: 0.09, sway: '15px' },

    // Plano médio (Midground - suave e integrado)
    { id: 6, top: '14%', size: 38, duration: '13s', delay: '-1s', blur: '0.8px', opacity: 0.22, sway: '12px' },
    { id: 7, top: '33%', size: 34, duration: '12.5s', delay: '-6s', blur: '0.8px', opacity: 0.20, sway: '15px' },
    { id: 8, top: '56%', size: 36, duration: '13.5s', delay: '-10s', blur: '0.8px', opacity: 0.24, sway: '10px' },
    { id: 9, top: '80%', size: 32, duration: '12.8s', delay: '-4s', blur: '0.8px', opacity: 0.21, sway: '14px' },
    { id: 10, top: '41%', size: 42, duration: '13.2s', delay: '-8s', blur: '0.8px', opacity: 0.22, sway: '16px' },

    // Primeiro plano (Foreground - delicado e nítido, sem brilho agressivo)
    { id: 11, top: '18%', size: 46, duration: '10.5s', delay: '-2.5s', blur: '0px', opacity: 0.35, sway: '8px' },
    { id: 12, top: '38%', size: 50, duration: '11s', delay: '-7.5s', blur: '0px', opacity: 0.32, sway: '12px' },
    { id: 13, top: '64%', size: 44, duration: '10.8s', delay: '-3.8s', blur: '0px', opacity: 0.34, sway: '10px' },
    { id: 14, top: '85%', size: 48, duration: '11.5s', delay: '-9.2s', blur: '0px', opacity: 0.30, sway: '9px' },
    { id: 15, top: '27%', size: 36, duration: '10.2s', delay: '-5.2s', blur: '0px', opacity: 0.28, sway: '11px' },
    { id: 16, top: '52%', size: 40, duration: '11.8s', delay: '-11.5s', blur: '0px', opacity: 0.32, sway: '13px' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden select-none bg-[#0c0b0a]">
      {/* ======================================================== */}
      {/* 1. LUZ AMBIENTE ATENUADA (AURA SUTIL E SOFISTICADA)      */}
      {/* ======================================================== */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[800px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 60% 40%, rgba(217, 119, 6, 0.04) 0%, rgba(245, 158, 11, 0.015) 50%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />
      <div
        className="absolute bottom-[-15%] left-[-5%] w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 40% 60%, rgba(180, 83, 9, 0.02) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />

      <style>{`
        @keyframes driftWithSway {
          0% {
            transform: translate3d(105vw, 0, 0);
          }
          30% {
            transform: translate3d(65vw, -8px, 0);
          }
          65% {
            transform: translate3d(25vw, 10px, 0);
          }
          100% {
            transform: translate3d(-20vw, 0, 0);
          }
        }
      `}</style>

      {/* ======================================================== */}
      {/* 2. 3 FAVOS DE MEL SEPARADOS COM TRAÇOS FINOS E SUAVES    */}
      {/* ======================================================== */}
      <div className="absolute top-8 right-4 lg:right-16 w-[740px] h-[560px]">
        <svg viewBox="0 0 720 540" fill="none" className="w-full h-full">
          <defs>
            {/* Preenchimento ultra sutil */}
            <radialGradient id="favoInnerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.02" />
              <stop offset="85%" stopColor="#d97706" stopOpacity="0.005" />
              <stop offset="100%" stopColor="#0c0b0a" stopOpacity="0" />
            </radialGradient>

            {/* Gradientes de borda com opacidade atenuada */}
            <linearGradient id="strokeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#d97706" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#92400e" stopOpacity="0.12" />
            </linearGradient>

            <linearGradient id="strokeGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.48" />
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.10" />
            </linearGradient>

            <linearGradient id="strokeGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.38" />
              <stop offset="70%" stopColor="#b45309" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#451a03" stopOpacity="0.08" />
            </linearGradient>

            {/* Brilho suave contido */}
            <filter id="favoSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Favo 1: Superior Central (Separado) */}
          <polygon
            points="350,40 445,95 445,205 350,260 255,205 255,95"
            stroke="url(#strokeGrad1)"
            strokeWidth="1.1"
            fill="url(#favoInnerGlow)"
            filter="url(#favoSoftGlow)"
          />

          {/* Favo 2: Direito (Separado com espaçamento limpo) */}
          <polygon
            points="580,150 675,205 675,315 580,370 485,315 485,205"
            stroke="url(#strokeGrad2)"
            strokeWidth="1.1"
            fill="url(#favoInnerGlow)"
            filter="url(#favoSoftGlow)"
          />

          {/* Favo 3: Inferior Esquerdo (Separado com espaçamento limpo) */}
          <polygon
            points="240,280 335,335 335,445 240,500 145,445 145,335"
            stroke="url(#strokeGrad3)"
            strokeWidth="1.0"
            fill="url(#favoInnerGlow)"
            filter="url(#favoSoftGlow)"
          />
        </svg>
      </div>

      {/* ======================================================== */}
      {/* 3. MINI-FAVOS ATENUADOS E DELICADOS                      */}
      {/* ======================================================== */}
      {driftingFavos.map((item) => (
        <div
          key={item.id}
          className="absolute pointer-events-none"
          style={{
            top: item.top,
            width: `${item.size}px`,
            height: `${item.size}px`,
            animation: `driftWithSway ${item.duration} ease-in-out infinite`,
            animationDelay: item.delay,
            filter: `blur(${item.blur})`,
            opacity: item.opacity,
            willChange: 'transform',
          }}
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <polygon
              points="50,5 89,27.5 89,72.5 50,95 11,72.5 11,27.5"
              stroke="#d97706"
              strokeWidth="1.1"
              strokeOpacity="0.5"
              fill="rgba(217, 119, 6, 0.015)"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
