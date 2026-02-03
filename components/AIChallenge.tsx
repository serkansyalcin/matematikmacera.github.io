
import React, { useState, useEffect } from 'react';
import { generateAIStoryProblem } from '../services/geminiService';
import { AIProblem, Difficulty, Operation } from '../types';

interface AIChallengeProps {
  difficulty: Difficulty;
  operation: Operation | 'mixed';
  onComplete: (success: boolean) => void;
}

const AIChallenge: React.FC<AIChallengeProps> = ({ difficulty, operation, onComplete }) => {
  const [problem, setProblem] = useState<AIProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const p = await generateAIStoryProblem(difficulty, operation);
        setProblem(p);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [difficulty, operation]);

  const handleSubmit = () => {
    if (!problem) return;
    const isCorrect = parseInt(userInput) === problem.correctAnswer;
    if (isCorrect) {
      setFeedback('Harika! Doğru cevap! 🌟');
      setTimeout(() => onComplete(true), 1500);
    } else {
      setFeedback(`Hımm, biraz daha düşün. İpucu: ${problem.hint}`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-4 p-10 text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xl font-medium text-purple-700">Yapay zeka sana özel bir macera hazırlıyor...</p>
      </div>
    );
  }

  if (!problem) return <div>Bir hata oluştu :(</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white/80 rounded-3xl shadow-2xl border-2 border-purple-200 space-y-6">
      <div className="flex items-center space-x-3">
        <span className="text-4xl">🤖</span>
        <h2 className="text-2xl font-bold text-purple-800">Özel Görev!</h2>
      </div>
      
      <p className="text-lg text-gray-700 leading-relaxed italic">"{problem.story}"</p>
      <div className="p-6 bg-purple-50 rounded-2xl border-l-8 border-purple-400">
        <p className="text-xl font-bold text-purple-900">{problem.question}</p>
      </div>

      <div className="flex space-x-4">
        <input
          type="number"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Cevabın?"
          className="flex-1 text-2xl p-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none"
        />
        <button
          onClick={handleSubmit}
          className="px-8 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors"
        >
          Gönder
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-center font-bold ${feedback.includes('Harika') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
};

export default AIChallenge;
