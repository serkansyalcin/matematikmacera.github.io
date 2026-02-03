
import React from 'react';
import { Mission } from '../types';

interface AdventureMapProps {
  missions: Mission[];
  currentLevel: number;
  onSelectMission: (id: number) => void;
}

const AdventureMap: React.FC<AdventureMapProps> = ({ missions, currentLevel, onSelectMission }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto py-12">
      {/* Dynamic SVG Path */}
      <svg 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20" 
        style={{ zIndex: 0, minHeight: '800px' }}
        viewBox="0 0 400 1000"
        preserveAspectRatio="none"
      >
        <path
          d="M 200 50 C 350 150, 50 250, 200 450 C 350 650, 50 750, 200 950"
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="12"
          strokeDasharray="20,20"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 flex flex-col items-center">
        {missions.map((m, idx) => {
          const isLocked = m.id > currentLevel;
          const isCurrent = m.id === currentLevel;
          const isCompleted = m.completed;

          // S-curve positioning
          const xOffset = Math.sin(idx * 1.5) * 100;

          return (
            <div 
              key={m.id}
              className="w-full flex justify-center mb-32 last:mb-0"
              style={{ transform: `translateX(${xOffset}px)` }}
            >
              <div className="relative group">
                <button
                  disabled={isLocked}
                  onClick={() => onSelectMission(m.id)}
                  className={`
                    relative w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-2xl transition-all duration-300 transform
                    ${isLocked 
                      ? 'bg-slate-800 border-4 border-slate-700 grayscale opacity-40 cursor-not-allowed' 
                      : 'hover:scale-125 active:scale-95 border-4 border-white'
                    }
                    ${isCurrent ? 'bg-gradient-to-br from-yellow-300 to-orange-500 planet-glow-active animate-pulse' : 'bg-gradient-to-br from-indigo-500 to-purple-700 planet-glow'}
                    ${isCompleted ? 'bg-gradient-to-br from-green-400 to-emerald-600' : ''}
                  `}
                >
                  <span className="drop-shadow-md">
                    {isCompleted ? '⭐' : m.type === 'riddle' ? '🧩' : m.type === 'story' ? '📖' : '👽'}
                  </span>

                  {/* Planet Rings for current level */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-400 scale-125 opacity-30 animate-ping"></div>
                  )}
                </button>

                {/* Info Label */}
                <div className={`
                  absolute top-full mt-4 left-1/2 -translate-x-1/2 transition-opacity duration-300
                  ${isLocked ? 'opacity-40' : 'opacity-100'}
                `}>
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 px-4 py-1.5 rounded-full whitespace-nowrap">
                    <span className={`text-sm font-bold ${isCurrent ? 'text-yellow-400' : 'text-slate-300'}`}>
                      {m.title}
                    </span>
                  </div>
                </div>

                {/* Floating "You" indicator */}
                {isCurrent && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-indigo-900 px-3 py-1 rounded-full text-xs font-black shadow-xl whitespace-nowrap animate-float">
                    BURADASIN! 🚀
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdventureMap;
