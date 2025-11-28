import React, { useState, useEffect, useCallback } from 'react';
import { generateDefinitions } from '../../services/geminiService';
import { TopicId } from '../../types';
import { Loader2 } from 'lucide-react';

const Hangman: React.FC = () => {
    const [word, setWord] = useState('');
    const [definition, setDefinition] = useState('');
    const [guessed, setGuessed] = useState<string[]>([]);
    const [mistakes, setMistakes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [won, setWon] = useState(false);
    const [lost, setLost] = useState(false);

    const maxMistakes = 6;

    const fetchWord = async () => {
        setLoading(true);
        setGuessed([]);
        setMistakes(0);
        setWon(false);
        setLost(false);
        // Reuse definitions API to get terms
        const defs = await generateDefinitions(TopicId.HUMAN_REPRO); // Defaulting for randomness
        if (defs.length > 0) {
            const random = defs[Math.floor(Math.random() * defs.length)];
            setWord(random.term.toUpperCase());
            setDefinition(random.definition);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchWord();
    }, []);

    const handleKey = useCallback((letter: string) => {
        if (won || lost || guessed.includes(letter)) return;

        setGuessed(prev => [...prev, letter]);

        if (!word.includes(letter)) {
            const newMistakes = mistakes + 1;
            setMistakes(newMistakes);
            if (newMistakes >= maxMistakes) setLost(true);
        } else {
            const allGuessed = word.split('').every(char => char === ' ' || [...guessed, letter].includes(char));
            if (allGuessed) setWon(true);
        }
    }, [guessed, mistakes, word, won, lost]);

    // Keyboard layout
    const keyboard = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('');

    if (loading) return <div className="flex justify-center h-full items-center"><Loader2 className="animate-spin text-neon-blue w-12 h-12" /></div>;

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-orbitron text-neon-green mb-8">El Ahorcado Biológico</h2>

            <div className="flex flex-col md:flex-row gap-12 w-full items-center justify-center">
                {/* Canvas Drawing Area (CSS/SVG) */}
                <div className="relative w-64 h-64 border-b-4 border-white">
                    <div className="absolute left-10 bottom-0 w-2 h-60 bg-white"></div>
                    <div className="absolute left-10 top-0 w-32 h-2 bg-white"></div>
                    <div className="absolute left-40 top-0 w-2 h-8 bg-white"></div>
                    
                    {mistakes >= 1 && <div className="absolute left-36 top-8 w-10 h-10 rounded-full border-4 border-neon-red"></div>} {/* Head */}
                    {mistakes >= 2 && <div className="absolute left-40 top-16 w-1 h-24 bg-neon-red"></div>} {/* Body */}
                    {mistakes >= 3 && <div className="absolute left-40 top-24 w-12 h-1 bg-neon-red rotate-[-45deg] origin-left"></div>} {/* Left Arm */}
                    {mistakes >= 4 && <div className="absolute left-40 top-24 w-12 h-1 bg-neon-red rotate-[45deg] origin-left"></div>} {/* Right Arm */}
                    {mistakes >= 5 && <div className="absolute left-40 top-40 w-12 h-1 bg-neon-red rotate-[-45deg] origin-left"></div>} {/* Left Leg */}
                    {mistakes >= 6 && <div className="absolute left-40 top-40 w-12 h-1 bg-neon-red rotate-[45deg] origin-left"></div>} {/* Right Leg */}
                </div>

                <div className="flex-1">
                    <p className="text-slate-400 mb-4 text-center italic">"{definition}"</p>
                    
                    <div className="flex flex-wrap gap-2 justify-center mb-8">
                        {word.split('').map((char, i) => (
                            <div key={i} className="w-10 h-12 border-b-2 border-neon-blue flex items-end justify-center text-3xl font-bold font-rajdhani">
                                {char === ' ' ? ' ' : guessed.includes(char) || lost ? char : ''}
                            </div>
                        ))}
                    </div>

                    {won && <div className="text-neon-green text-2xl font-bold text-center mb-4">¡GANASTE!</div>}
                    {lost && <div className="text-neon-red text-2xl font-bold text-center mb-4">PERDISTE. Era: {word}</div>}

                    {(won || lost) && (
                        <button onClick={fetchWord} className="block mx-auto mb-6 bg-neon-blue text-black px-4 py-2 rounded font-bold">Siguiente Palabra</button>
                    )}

                    <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                        {keyboard.map(char => (
                            <button
                                key={char}
                                onClick={() => handleKey(char)}
                                disabled={guessed.includes(char) || won || lost}
                                className={`w-10 h-10 rounded font-bold transition-all
                                    ${guessed.includes(char) 
                                        ? 'bg-slate-800 text-slate-600' 
                                        : 'bg-slate-700 text-white hover:bg-neon-blue hover:text-black'}
                                `}
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hangman;
