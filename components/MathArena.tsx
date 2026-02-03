
import React, { useState, useEffect, useCallback } from 'react';
import { Question, Operation, Difficulty } from '../types';

interface MathArenaProps {
  operation: Operation | 'mixed';
  difficulty: Difficulty;
  onCorrect: () => void;
  onWrong: () => void;
}

const MathArena: React.FC<MathArenaProps> = ({ operation, difficulty, onCorrect, onWrong }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateQuestion = useCallback(() => {
    const ops: Operation[] = operation === 'mixed' 
      ? ['addition', 'subtraction', 'multiplication', 'division'] 
      : [operation];
    
    const currentOp = ops[Math.floor(Math.random() * ops.length)];
    let n1 = 0, n2 = 0, ans = 0;

    const range = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 50 : 100;

    switch (currentOp) {
      case 'addition':
        n1 = Math.floor(Math.random() * range) + 1;
        n2 = Math.floor(Math.random() * range) + 1;
        ans = n1 + n2;
        break;
      case 'subtraction':
        n1 = Math.floor(Math.random() * range) + (range / 2);
        n2 = Math.floor(Math.random() * n1);
        ans = n1 - n2;
        break;
      case 'multiplication':
        n1 = Math.floor(Math.random() * (difficulty === 'easy' ? 5 : 10)) + 1;
        n2 = Math.floor(Math.random() * (difficulty === 'easy' ? 5 : 10)) + 1;
        ans = n1 * n2;
        break;
      case 'division':
        n2 = Math.floor(Math.random() * (difficulty === 'easy' ? 5 : 10)) + 1;
        ans = Math.floor(Math.random() * (difficulty === 'easy' ? 5 : 10)) + 1;
        n1 = ans * n2;
        break;
    }

    const options = new Set<number>();
    options.add(ans);
    while (options.size < 4) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const fake = ans + (offset === 0 ? 1 : offset);
      if (fake >= 0) options.add(fake);
    }

    setQuestion({
      id: Math.random().toString(),
      num1: n1,
      num2: n2,
      operation: currentOp,
      answer: ans,
      options: Array.from(options).sort(() => Math.random() - 0.5),
    });
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [operation, difficulty]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (val: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(val);
    const correct = val === question?.answer;
    setIsCorrect(correct);

    setTimeout(() => {
      if (correct) {
        onCorrect();
        generateQuestion();
      } else {
        onWrong();
        generateQuestion();
      }
    }, 800);
  };

  if (!question) return null;

  const getOpSymbol = (op: Operation) => {
    switch(op) {
      case 'addition': return '+';
      case 'subtraction': return '-';
      case 'multiplication': return '×';
      case 'division': return '÷';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="text-6xl md:text-8xl font-bold text-indigo-900 flex items-center space-x-4 bg-white/50 px-10 py-6 rounded-3xl shadow-xl border-4 border-white">
        <span>{question.num1}</span>
        <span className="text-purple-500">{getOpSymbol(question.operation)}</span>
        <span>{question.num2}</span>
        <span className="text-purple-500">=</span>
        <span className="text-gray-300">?</span>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {question.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={selectedAnswer !== null}
            className={`
              py-6 text-3xl font-bold rounded-2xl transition-all transform hover:scale-105 active:scale-95
              ${selectedAnswer === opt 
                ? (isCorrect ? 'bg-green-500 text-white border-b-8 border-green-700' : 'bg-red-500 text-white border-b-8 border-red-700')
                : 'bg-white text-indigo-700 hover:bg-indigo-50 border-b-8 border-indigo-200'
              }
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MathArena;
