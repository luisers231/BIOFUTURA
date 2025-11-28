import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../services/geminiService';
import { Topic, Question } from '../types';
import { Loader2, CheckCircle, XCircle, Award } from 'lucide-react';

interface Props {
  topic: Topic;
}

const Quiz: React.FC<Props> = ({ topic }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await generateQuiz(topic.id);
      setQuestions(data);
      setLoading(false);
      setCurrentQIndex(0);
      setScore(0);
      setCompleted(false);
      setSelectedOption(null);
      setShowExplanation(false);
    };
    fetch();
  }, [topic]);

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === questions[currentQIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-16 h-16 text-neon-blue animate-spin mb-4" />
        <p className="text-neon-blue text-lg">Preparando tu evaluación con IA...</p>
      </div>
    );
  }

  if (questions.length === 0) return <div>Error cargando quiz.</div>;

  if (completed) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Award className="w-24 h-24 text-neon-yellow mx-auto mb-6 animate-bounce" />
        <h2 className="text-4xl font-orbitron text-white mb-4">¡Quiz Completado!</h2>
        <p className="text-2xl font-rajdhani text-slate-300 mb-8">Puntaje Final</p>
        <div className="text-6xl font-bold text-neon-blue mb-8">{score} / {questions.length}</div>
        <p className="text-xl text-white mb-8">
            {percentage >= 80 ? '¡Excelente trabajo, científico!' : percentage >= 50 ? 'Buen intento, sigue estudiando.' : 'Necesitas repasar los conceptos.'}
        </p>
        <button onClick={() => window.location.reload()} className="bg-neon-purple text-white px-8 py-3 rounded font-bold hover:bg-purple-600 transition-colors">
            Volver al Inicio
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6 text-slate-400 font-rajdhani">
        <span>Pregunta {currentQIndex + 1} de {questions.length}</span>
        <span>Puntaje: {score}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full mb-8">
        <div 
            className="bg-neon-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl">
        <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed">{currentQ.question}</h3>
        
        <div className="space-y-4">
          {currentQ.options.map((option, idx) => {
             let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-semibold ";
             if (selectedOption === null) {
                 btnClass += "border-slate-700 hover:border-neon-blue hover:bg-slate-800 text-slate-200";
             } else {
                 if (idx === currentQ.correctAnswer) {
                     btnClass += "border-neon-green bg-green-900/20 text-green-400";
                 } else if (idx === selectedOption) {
                     btnClass += "border-neon-red bg-red-900/20 text-red-400";
                 } else {
                     btnClass += "border-slate-800 text-slate-600 opacity-50";
                 }
             }

             return (
               <button 
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={selectedOption !== null}
                className={btnClass}
               >
                 <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedOption !== null && idx === currentQ.correctAnswer && <CheckCircle size={20} />}
                    {selectedOption !== null && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle size={20} />}
                 </div>
               </button>
             );
          })}
        </div>

        {showExplanation && (
            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border-l-4 border-neon-purple animate-in fade-in slide-in-from-top-4">
                <p className="text-neon-purple font-bold mb-1">Explicación:</p>
                <p className="text-slate-300">{currentQ.explanation}</p>
                <div className="mt-4 text-right">
                    <button onClick={nextQuestion} className="bg-neon-blue text-black px-6 py-2 rounded font-bold hover:bg-white transition-colors">
                        Siguiente
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
