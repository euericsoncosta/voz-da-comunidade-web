import React from 'react';

/**
 * BrandLogo - Identidade Visual Oficial do Voz da Comunidade.
 * @param {string} color - Cor dos traços do logótipo (Padrão: preto).
 * @param {number} size - Largura base do logótipo.
 * @param {boolean} showSubtitle - Define se exibe o texto "da comunidade".
 */
const BrandLogo = ({ color = "#000000", size = 180, showSubtitle = true }) => {
  return (
    <div className="flex flex-col items-center select-none transform hover:scale-105 transition-all duration-500">
      <svg 
        width={size} 
        height={size * 0.5} 
        viewBox="0 0 400 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {}
        <path 
          d="M60 50 L105 160 L150 50" 
          stroke={color} 
          strokeWidth="18" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {}
        <g transform="translate(160, 40)">
          <path 
            d="M10 100 A 70 70 0 0 1 150 100" 
            stroke={color} 
            strokeWidth="14" 
            strokeLinecap="round" 
          />
          <path 
            d="M15 125 Q 80 105 145 125" 
            stroke={color} 
            strokeWidth="6" 
            strokeLinecap="round" 
          />
          <path 
            d="M25 145 Q 80 125 135 145" 
            stroke={color} 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
        </g>

        {}
        <path 
          d="M320 50 H380 L320 160 H380" 
          stroke={color} 
          strokeWidth="18" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
      
      {}
      {showSubtitle && (
        <span 
          className="text-lg font-black tracking-[4px] mt-[-10px] uppercase italic" 
          style={{ color }}
        >
          da comunidade
        </span>
      )}
    </div>
  );
};

export default BrandLogo;