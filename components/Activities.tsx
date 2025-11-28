import React, { useState, useEffect } from 'react';
import { generateDefinitions } from '../services/geminiService';
import { Topic, Definition } from '../types';
import { Loader2, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';

interface Props {
  topic: Topic;
}

const Activities: React.FC<Props> = ({ topic }) => {
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await generateDefinitions(topic.id);
      setDefinitions(data);
      setLoading(false);
      setCurrentIndex(0);
      setIsFlipped(false);
    };
    fetch();
  }, [topic]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % definitions.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + definitions.length) % definitions.length);
    }, 200);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-16 h-16 text-neon-blue animate-spin mb-4" />
        <p className="text-neon-blue text-lg animate-pulse">Generando contenido educativo con IA...</p>
      </div>
    );
  }

  if (definitions.length === 0) {
    return <div className="text-center text-red-500">Error cargando actividades. Intenta recargar.</div>;
  }

  const currentDef = definitions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="text-neon-purple w-8 h-8" />
        <h2 className="text-3xl font-orbitron text-white">Actividades Interactivas: <span className="text-neon-blue">{topic.title}</span></h2>
      </div>

      <div className="relative perspective-1000 h-96 w-full cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full duration-700 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front Side */}
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-neon-blue rounded-2xl p-8 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.2)]">
            <span className="text-slate-400 uppercase tracking-widest text-sm mb-4">Concepto {currentIndex + 1} de {definitions.length}</span>
            <h3 className="text-5xl font-rajdhani font-bold text-white text-center drop-shadow-lg">{currentDef.term}</h3>
            <p className="mt-8 text-neon-green text-sm animate-bounce">Haz click para ver la definición</p>
          </div>

          {/* Back Side */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-neon-purple rounded-2xl p-8 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(188,19,254,0.3)]">
             <h3 className="text-2xl font-bold text-neon-purple mb-6">{currentDef.term}</h3>
             <p className="text-xl text-white text-center leading-relaxed font-rajdhani">{currentDef.definition}</p>
          </div>

        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={handlePrev} className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all text-white">
          <ChevronLeft /> Anterior
        </button>
        <button onClick={handleNext} className="flex items-center gap-2 px-6 py-3 rounded-full bg-neon-blue hover:bg-cyan-400 text-black font-bold transition-all shadow-neon">
          Siguiente <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Activities;
