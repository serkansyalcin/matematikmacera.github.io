
import React, { useState, useEffect } from 'react';
import { generateAIRiddle, generateAIStoryQuest } from '../services/geminiService';
import { AIRiddle, AIStoryQuest, Difficulty, Mission } from '../types';

interface QuestOverlayProps {
  mission: Mission;
  difficulty: Difficulty;
  onSuccess: () => void;
  onClose: () => void;
}

const QuestOverlay: React.FC<QuestOverlayProps> = ({ mission, difficulty, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AIRiddle | AIStoryQuest | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const loadQuest = async () => {
      setLoading(true);
      try {
        if (mission.type === 'riddle') {
          const r = await generateAIRiddle(difficulty);
          setData(r);
        } else {
          const s = await generateAIStoryQuest(difficulty);
          setData(s);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadQuest();
  }, [mission, difficulty]);

  const handleCheck = (val?: string) => {
    const answer = val || userAnswer;
    if (!answer) return;

    let correct = false;
    if ('riddle' in data!) {
      correct = answer.toString().toLowerCase() === (data as AIRiddle).correctAnswer.toString().toLowerCase();
    } else {
      correct = parseInt(answer) === (data as AIStoryQuest).answer;
    }

    if (correct) {
      setFeedback('Mükemmel! Yolun açıldı! 🚀✨');
      setTimeout(onSuccess, 1500);
    } else {
      setFeedback('Hımm, tekrar bir düşün bakalım... 🛸');
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl">
        <div className="text-center">
          <div className="w-24 h-24 border-8 border-indigo-500 border-t-pink-500 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-2xl font-black text-white tracking-widest animate-pulse">GEZEGEN TARANIYOR...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border-4 border-indigo-500/50 rounded-[2.5rem] max-w-2xl w-full p-8 shadow-[0_0_50px_rgba(79,70,229,0.3)] relative overflow-hidden animate-in zoom-in duration-300">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors text-2xl z-20"
        >
          ✕
        </button>
        
        <div className="relative z-10 space-y-8">
          <header className="flex items-center space-x-4 border-b border-slate-800 pb-6">
            <span className="text-6xl drop-shadow-lg">
              {mission.type === 'riddle' ? '🧩' : '📖'}
            </span>
            <div>
              <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em]">ÖZEL GÖREV</p>
              <h2 className="text-3xl font-black text-white tracking-tight">{mission.title}</h2>
            </div>
          </header>

          <section className="space-y-6">
            {'riddle' in data! ? (
              <>
                <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-inner">
                  <p className="text-2xl font-medium text-slate-100 leading-relaxed italic text-center">
                    "{data.riddle}"
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {data.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleCheck(opt)}
                      className="group p-5 text-xl font-bold bg-slate-800 hover:bg-indigo-600 border-2 border-slate-700 hover:border-indigo-400 text-slate-300 hover:text-white rounded-2xl transition-all shadow-lg active:scale-95"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-lg text-slate-400 leading-relaxed italic bg-slate-800/30 p-6 rounded-2xl border border-slate-800/50">
                  {(data as AIStoryQuest).story}
                </p>
                <div className="p-8 bg-indigo-600/20 rounded-3xl border-2 border-indigo-500/30">
                  <p className="text-2xl font-black text-indigo-100 text-center">
                    {(data as AIStoryQuest).question}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    value={userAnswer}
                    autoFocus
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
                    placeholder="Cevabın?"
                    className="flex-1 text-2xl p-5 rounded-2xl bg-slate-800 border-2 border-slate-700 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  />
                  <button
                    onClick={() => handleCheck()}
                    className="px-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                  >
                    GÖNDER!
                  </button>
                </div>
              </>
            )}
          </section>

          {feedback && (
            <div className={`
              p-5 rounded-2xl text-center font-black text-xl animate-in slide-in-from-bottom-4 duration-300
              ${feedback.includes('Mükemmel') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'}
            `}>
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestOverlay;
