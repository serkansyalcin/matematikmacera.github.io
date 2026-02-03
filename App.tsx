
import React, { useState } from 'react';
import { GameState, Mission, Difficulty } from './types';
import AdventureMap from './components/AdventureMap';
import QuestOverlay from './components/QuestOverlay';
import { getCelebrationMessage } from './services/geminiService';

const INITIAL_MISSIONS: Mission[] = [
  { id: 1, type: 'riddle', title: 'İlk Durak', completed: false },
  { id: 2, type: 'story', title: 'Ay Üssü', completed: false },
  { id: 3, type: 'riddle', title: 'Sayı Gezegeni', completed: false },
  { id: 4, type: 'story', title: 'Mars Keşfi', completed: false },
  { id: 5, type: 'boss', title: 'Yıldız Kapısı', completed: false },
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    currentLevel: 1,
    missions: INITIAL_MISSIONS,
    status: 'map',
    difficulty: 'easy',
    activeMissionId: null,
  });

  const [celebration, setCelebration] = useState('');

  const handleSelectMission = (id: number) => {
    setGameState(prev => ({ ...prev, status: 'challenge', activeMissionId: id }));
  };

  const handleMissionSuccess = async () => {
    const updatedMissions = gameState.missions.map(m => 
      m.id === gameState.activeMissionId ? { ...m, completed: true } : m
    );
    
    const isLastMission = gameState.activeMissionId === INITIAL_MISSIONS.length;
    
    if (isLastMission) {
      const msg = await getCelebrationMessage(gameState.score + 100);
      setCelebration(msg);
      setGameState(prev => ({ 
        ...prev, 
        missions: updatedMissions,
        score: prev.score + 100,
        status: 'finished' 
      }));
    } else {
      setGameState(prev => ({ 
        ...prev, 
        missions: updatedMissions,
        score: prev.score + 100,
        currentLevel: prev.currentLevel + 1,
        status: 'map',
        activeMissionId: null
      }));
    }
  };

  return (
    <div className="min-h-screen math-gradient text-slate-100 flex flex-col">
      {/* HUD Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/5 px-6 py-4 flex justify-between items-center shadow-2xl">
        <div className="flex items-center space-x-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">PUAN</span>
            <div className="flex items-center space-x-1">
              <span className="text-2xl font-black text-white">⭐ {gameState.score}</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-700"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest leading-none mb-1">GÖREV</span>
            <span className="text-xl font-black text-white">{gameState.currentLevel} / {gameState.missions.length}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ZORLUK:</label>
          <select 
            value={gameState.difficulty}
            onChange={(e) => setGameState({...gameState, difficulty: e.target.value as Difficulty})}
            className="bg-slate-800/80 border border-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
          >
            <option value="easy">1. Sınıf</option>
            <option value="medium">2-3. Sınıf</option>
            <option value="hard">4. Sınıf</option>
          </select>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 pb-32">
        <div className="text-center py-16">
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-300 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] mb-4 uppercase italic">
            MATEMATİK GALAKSİSİ
          </h1>
          <p className="text-lg font-bold text-indigo-400/80 uppercase tracking-[0.4em] drop-shadow-sm">
            Bilmeceleri Çöz • Evreni Kurtar
          </p>
        </div>

        <AdventureMap 
          missions={gameState.missions}
          currentLevel={gameState.currentLevel}
          onSelectMission={handleSelectMission}
        />
      </main>

      {/* Quest Modal */}
      {gameState.status === 'challenge' && gameState.activeMissionId !== null && (
        <QuestOverlay
          mission={gameState.missions.find(m => m.id === gameState.activeMissionId)!}
          difficulty={gameState.difficulty}
          onSuccess={handleMissionSuccess}
          onClose={() => setGameState(prev => ({ ...prev, status: 'map', activeMissionId: null }))}
        />
      )}

      {/* Game End Modal */}
      {gameState.status === 'finished' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-6">
          <div className="bg-slate-900 p-12 rounded-[4rem] text-center max-w-lg w-full border-[8px] border-yellow-400/50 shadow-[0_0_100px_rgba(250,204,21,0.2)] space-y-8 animate-in zoom-in duration-500">
            <div className="text-9xl animate-float drop-shadow-2xl">🏆</div>
            <h2 className="text-6xl font-black text-white tracking-tighter">GALAKSİ KRALI!</h2>
            <p className="text-2xl text-slate-400 italic font-medium leading-relaxed px-4">
              "{celebration}"
            </p>
            <div className="p-8 bg-slate-800 rounded-3xl border border-slate-700">
              <span className="text-slate-500 font-black block uppercase text-sm mb-2">TOPLAM SKOR</span>
              <span className="text-6xl font-black text-yellow-400">⭐ {gameState.score}</span>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 rounded-3xl text-3xl font-black shadow-2xl hover:brightness-110 active:scale-95 transition-all transform"
            >
              YENİDEN BAŞLA 🛸
            </button>
          </div>
        </div>
      )}

      {/* Persistent Decorative Elements */}
      <div className="fixed bottom-10 left-10 text-9xl opacity-10 pointer-events-none select-none animate-float hidden md:block">🪐</div>
      <div className="fixed top-40 right-10 text-8xl opacity-10 pointer-events-none select-none animate-float hidden md:block" style={{ animationDelay: '1.5s' }}>☄️</div>
    </div>
  );
};

export default App;
