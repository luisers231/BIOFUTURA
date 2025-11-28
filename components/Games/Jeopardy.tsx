import React, { useState, useEffect } from 'react';
import { generateJeopardyData } from '../../services/geminiService';
import { Loader2 } from 'lucide-react';

const Jeopardy: React.FC = () => {
    const [categories, setCategories] = useState<{category: string, questions: {points: number, question: string, answer: string}[]}[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuestion, setSelectedQuestion] = useState<{cIndex: number, qIndex: number, data: any} | null>(null);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState<string[]>([]); // "cIndex-qIndex"
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        const init = async () => {
            const data = await generateJeopardyData();
            setCategories(data);
            setLoading(false);
        };
        init();
    }, []);

    const handleQuestionClick = (cIndex: number, qIndex: number) => {
        const key = `${cIndex}-${qIndex}`;
        if (answered.includes(key)) return;
        setSelectedQuestion({
            cIndex, 
            qIndex, 
            data: categories[cIndex].questions[qIndex]
        });
        setShowAnswer(false);
    };

    const handleAnswer = (correct: boolean) => {
        if (selectedQuestion) {
            if (correct) setScore(score + selectedQuestion.data.points);
            else setScore(score - selectedQuestion.data.points);
            
            setAnswered([...answered, `${selectedQuestion.cIndex}-${selectedQuestion.qIndex}`]);
            setSelectedQuestion(null);
        }
    };

    if (loading) return <div className="flex justify-center h-full items-center"><Loader2 className="animate-spin text-neon-blue w-12 h-12" /></div>;

    return (
        <div className="w-full max-w-6xl mx-auto p-4 overflow-x-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-orbitron text-neon-purple">JEOPARDY BIOLÓGICO</h2>
                <div className="text-2xl font-rajdhani bg-slate-800 px-4 py-2 rounded border border-neon-blue">
                    Puntaje: <span className={score >= 0 ? "text-neon-green" : "text-red-500"}>{score}</span>
                </div>
            </div>

            {selectedQuestion ? (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border-2 border-neon-blue p-8 rounded-xl max-w-2xl w-full text-center">
                        <h3 className="text-2xl text-neon-blue mb-2">{categories[selectedQuestion.cIndex].category} por {selectedQuestion.data.points}</h3>
                        <p className="text-3xl font-bold text-white mb-8 mt-6 leading-relaxed">
                            {selectedQuestion.data.question}
                        </p>
                        
                        {!showAnswer ? (
                            <button 
                                onClick={() => setShowAnswer(true)}
                                className="bg-yellow-500 text-black font-bold py-3 px-8 rounded text-xl hover:bg-yellow-400"
                            >
                                Ver Respuesta
                            </button>
                        ) : (
                            <div className="animate-in fade-in zoom-in duration-300">
                                <p className="text-2xl text-neon-green mb-8">{selectedQuestion.data.answer}</p>
                                <div className="flex justify-center gap-4">
                                    <button onClick={() => handleAnswer(true)} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold">Acerté</button>
                                    <button onClick={() => handleAnswer(false)} className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded font-bold">Fallé</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}

            <div className="grid grid-cols-5 gap-2 min-w-[800px]">
                {/* Headers */}
                {categories.map((cat, i) => (
                    <div key={i} className="bg-neon-blue text-black font-bold p-4 text-center rounded-t h-24 flex items-center justify-center leading-tight">
                        {cat.category}
                    </div>
                ))}
                
                {/* Grid */}
                {[0, 1, 2].map((qIdx) => (
                    <React.Fragment key={qIdx}>
                        {categories.map((cat, cIdx) => {
                            const q = cat.questions[qIdx];
                            const isAnswered = answered.includes(`${cIdx}-${qIdx}`);
                            return (
                                <button 
                                    key={`${cIdx}-${qIdx}`}
                                    onClick={() => handleQuestionClick(cIdx, qIdx)}
                                    disabled={isAnswered}
                                    className={`
                                        h-24 border border-slate-600 rounded flex items-center justify-center text-3xl font-rajdhani font-bold transition-all
                                        ${isAnswered 
                                            ? 'bg-slate-900 text-slate-700 cursor-default' 
                                            : 'bg-slate-800 text-neon-yellow hover:bg-slate-700 hover:scale-105 text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]'
                                        }
                                    `}
                                >
                                    {isAnswered ? '' : `$${q?.points}`}
                                </button>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Jeopardy;
