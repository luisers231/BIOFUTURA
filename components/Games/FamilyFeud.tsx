import React, { useState, useEffect } from 'react';
import { generateFeudQuestion } from '../../services/geminiService';
import { FamilyFeudQuestion } from '../../types';
import { Loader2, AlertTriangle, Trophy } from 'lucide-react';

const FamilyFeud: React.FC = () => {
  const [data, setData] = useState<FamilyFeudQuestion | null>(null);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState({ team1: 0, team2: 0 });
  const [currentTeam, setCurrentTeam] = useState<1 | 2>(1);
  const [strikes, setStrikes] = useState(0);
  const [input, setInput] = useState('');
  const [roundPoints, setRoundPoints] = useState(0);
  const [stealMode, setStealMode] = useState(false);
  const [message, setMessage] = useState('');

  const loadNewRound = async () => {
    setLoading(true);
    const q = await generateFeudQuestion();
    if (q) {
      setData(q);
      setRevealed(new Array(q.answers.length).fill(false));
      setStrikes(0);
      setRoundPoints(0);
      setStealMode(false);
      setMessage('');
      setCurrentTeam(prev => prev === 1 ? 2 : 1); // Alternate starter
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGuess = () => {
    if (!data) return;

    const guess = input.toLowerCase().trim();
    let found = false;
    let alreadyRevealed = false;

    data.answers.forEach((item, index) => {
      if (item.answer.toLowerCase().includes(guess) || guess.includes(item.answer.toLowerCase())) {
        if (revealed[index]) {
            alreadyRevealed = true;
        } else {
            const newRevealed = [...revealed];
            newRevealed[index] = true;
            setRevealed(newRevealed);
            setRoundPoints(prev => prev + item.points);
            found = true;
        }
      }
    });

    if (alreadyRevealed) {
        setMessage("¡Ya se dijo esa respuesta!");
    } else if (found) {
        setMessage("¡Correcto!");
        // Check if all revealed
        const allRevealed = revealed.filter(r => r).length + 1 === data.answers.length;
        if (allRevealed) {
            // End round, award points
            const teamKey = currentTeam === 1 ? 'team1' : 'team2';
            setScores(prev => ({ ...prev, [teamKey]: prev[teamKey] + roundPoints + (found ? data.answers.find(a => a.answer.toLowerCase().includes(guess))?.points || 0 : 0) }));
            setTimeout(loadNewRound, 3000);
        }
    } else {
        // Strike logic
        setMessage("¡X INCORRECTO X!");
        const newStrikes = strikes + 1;
        setStrikes(newStrikes);

        if (stealMode) {
            // Steal failed, original team keeps points
            const originalTeam = currentTeam === 1 ? 2 : 1;
            setScores(prev => ({ ...prev, [`team${originalTeam}`]: prev[`team${originalTeam}`] + roundPoints }));
            setTimeout(loadNewRound, 3000);
        } else if (newStrikes >= 3) {
            setStealMode(true);
            setCurrentTeam(prev => prev === 1 ? 2 : 1);
            setStrikes(0); // Reset strikes for the steal attempt
            setMessage("¡ROBO DE PUNTOS! El otro equipo tiene 1 oportunidad.");
        }
    }
    setInput('');
  };

  if (loading || !data) return <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-neon-blue w-10 h-10" /></div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-xl border border-neon-blue">
        <div className={`text-center p-4 rounded ${currentTeam === 1 && !stealMode ? 'bg-neon-blue/20 border border-neon-blue' : ''}`}>
           <h3 className="text-neon-blue font-orbitron text-xl">Equipo Galileanos 1</h3>
           <p className="text-4xl font-bold">{scores.team1}</p>
        </div>
        <div className="text-center">
            <h2 className="text-3xl text-neon-purple font-rajdhani font-bold mb-2">100 GALILEANOS DICEN</h2>
            <div className="text-white text-xl">Puntos en juego: <span className="text-neon-green">{roundPoints}</span></div>
            <div className="flex gap-2 justify-center mt-2">
                {[...Array(strikes)].map((_, i) => <XIcon key={i} />)}
            </div>
        </div>
        <div className={`text-center p-4 rounded ${currentTeam === 2 && !stealMode ? 'bg-neon-blue/20 border border-neon-blue' : ''}`}>
           <h3 className="text-neon-blue font-orbitron text-xl">Equipo Galileanos 2</h3>
           <p className="text-4xl font-bold">{scores.team2}</p>
        </div>
      </div>

      <div className="bg-dark-card border border-slate-700 rounded-2xl p-6 mb-6 shadow-neon">
        <h3 className="text-2xl text-center mb-8 font-bold text-white">"{data.question}"</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.answers.map((item, idx) => (
                <div key={idx} className="h-16 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-600 rounded flex items-center justify-between px-4 overflow-hidden relative">
                    {revealed[idx] ? (
                        <>
                            <span className="text-xl font-bold uppercase text-neon-blue">{item.answer}</span>
                            <span className="text-xl font-bold bg-slate-700 px-3 py-1 rounded text-white">{item.points}</span>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-slate-600 font-orbitron text-2xl">{idx + 1}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {message && <div className="text-xl text-neon-green font-bold animate-pulse">{message}</div>}
        
        <div className="flex w-full max-w-md gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                className="flex-1 bg-slate-800 border border-slate-600 text-white p-3 rounded text-lg focus:outline-none focus:border-neon-blue"
                placeholder={`Turno Equipo ${currentTeam}...`}
            />
            <button 
                onClick={handleGuess}
                className="bg-neon-blue text-black font-bold px-6 rounded hover:bg-white transition-colors"
            >
                RESPONDER
            </button>
        </div>
        
        <button onClick={loadNewRound} className="mt-4 text-slate-400 underline text-sm hover:text-white">
            Saltar Pregunta / Nueva Ronda
        </button>
      </div>
    </div>
  );
};

const XIcon = () => (
    <div className="w-8 h-8 flex items-center justify-center bg-red-600 text-white font-bold rounded border border-red-400">X</div>
);

export default FamilyFeud;
