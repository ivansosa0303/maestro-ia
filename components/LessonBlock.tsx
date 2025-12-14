import React, { useState } from 'react';
import { Lightbulb, Beaker, PenTool, CheckCircle, HelpCircle } from 'lucide-react';
import { QuizQuestion } from '../types';
import { Button } from './Button';

interface BlockProps {
  type: 'idea' | 'example' | 'activity' | 'quiz';
  title: string;
  content?: string;
  quizData?: QuizQuestion[];
}

export const LessonBlock: React.FC<BlockProps> = ({ type, title, content, quizData }) => {
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'idea': return <Lightbulb className="w-6 h-6 text-amber-500" />;
      case 'example': return <Beaker className="w-6 h-6 text-blue-500" />;
      case 'activity': return <PenTool className="w-6 h-6 text-green-500" />;
      case 'quiz': return <HelpCircle className="w-6 h-6 text-indigo-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'idea': return 'border-amber-200 bg-amber-50';
      case 'example': return 'border-blue-200 bg-blue-50';
      case 'activity': return 'border-green-200 bg-green-50';
      case 'quiz': return 'border-indigo-200 bg-indigo-50';
    }
  };

  const handleOptionSelect = (qIndex: number, optIndex: number) => {
    if (showResults) return;
    setQuizAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  return (
    <div className={`rounded-xl border-2 p-6 mb-6 shadow-sm transition-all hover:shadow-md ${getBorderColor()}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          {getIcon()}
        </div>
        <h3 className="font-bold text-lg text-slate-800 uppercase tracking-wide text-xs md:text-base">{title}</h3>
      </div>

      {content && <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">{content}</div>}

      {type === 'quiz' && quizData && (
        <div className="space-y-6 mt-2">
          {quizData.map((q, qIdx) => (
            <div key={qIdx} className="bg-white p-4 rounded-lg border border-indigo-100">
              <p className="font-medium text-slate-900 mb-3">{qIdx + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  let btnClass = "w-full text-left px-4 py-2 rounded-md border text-sm transition-colors ";
                  
                  if (showResults) {
                     if (optIdx === q.correctOptionIndex) {
                       btnClass += "bg-green-100 border-green-500 text-green-800 font-medium";
                     } else if (quizAnswers[qIdx] === optIdx) {
                       btnClass += "bg-red-50 border-red-300 text-red-700";
                     } else {
                       btnClass += "bg-slate-50 border-slate-200 text-slate-400";
                     }
                  } else {
                    if (quizAnswers[qIdx] === optIdx) {
                      btnClass += "bg-indigo-100 border-indigo-500 text-indigo-900";
                    } else {
                      btnClass += "bg-white border-slate-200 hover:bg-indigo-50 hover:border-indigo-200";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(qIdx, optIdx)}
                      className={btnClass}
                      disabled={showResults}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {!showResults && (
             <Button 
               onClick={() => setShowResults(true)} 
               variant="primary" 
               disabled={Object.keys(quizAnswers).length < quizData.length}
             >
               Verificar Respuestas
             </Button>
          )}
          {showResults && (
            <div className="flex items-center gap-2 text-indigo-800 font-medium bg-indigo-100 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              Has completado el test. Revisa tus respuestas arriba.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
