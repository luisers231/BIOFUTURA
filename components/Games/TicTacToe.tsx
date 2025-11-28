import React, { useState } from 'react';
import { generateSingleTriviaQuestion } from '../../services/geminiService';
import { Loader2, X, Circle } from 'lucide-react';

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [triviaModal, setTriviaModal] = useState<{ isOpen: boolean; index: number; question: string; answer: string } | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleSquareClick = async (index: number) => {
    if (board[index] || winner || loading) return;

    setLoading(true);
    const trivia = await generateSingleTriviaQuestion();
    setLoading(false);
    
    setTriviaModal({
      isOpen: true,
      index,
      question: trivia.question,
      answer: trivia.answer
    });
    setUserAnswer('');
    setMessage('');
  };

  const handleTriviaSubmit = () => {
    if (!triviaModal) return;

    // Simple normalization for checking
    const correct = triviaModal.answer.toLowerCase().trim();
    const user = userAnswer.toLowerCase().trim();

    // Very basic check, in a real app use semantic similarity
    if (user.includes(correct) || correct.includes(user)) {
      const newBoard = [...board];
      newBoard[triviaModal.index] = isXNext ? 'X' : 'O';
      setBoard(newBoard);
      
      const gameWinner = checkWinner(newBoard);
      if (gameWinner) setWinner(gameWinner);
      else setIsXNext(!isXNext);
      
      setTriviaModal(null);
    } else {
      setMessage(`Incorrecto. La respuesta era: ${triviaModal.answer}. Pierdes el turno.`);
      setTimeout(() => {
        setTriviaModal(null);
        setIsXNext(!isXNext); // Skip turn
      }, 3000);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsXNext(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-dark-card rounded-xl border border-neon-blue/30 w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-orbitron text-neon-blue mb-6">Tic-Tac-Trivia</h2>
      
      <div className="flex justify-between w-full mb-4 text-xl font-rajdhani">
        <div className={`flex items-center gap-2 ${isXNext ? 'text-neon-purple font-bold' : 'text-gray-500'}`}>
          <X size={24} /> Jugador 1
        </div>
        <div className={`flex items-center gap-2 ${!isXNext ? 'text-neon-green font-bold' : 'text-gray-500'}`}>
          <Circle size={24} /> Jugador 2
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {board.map((square, i) => (
          <button
            key={i}
            onClick={() => handleSquareClick(i)}
            disabled={!!square || !!winner}
            className={`w-24 h-24 bg-slate-800 rounded-lg flex items-center justify-center text-4xl font-bold 
              hover:bg-slate-700 transition-colors border border-slate-600
              ${square === 'X' ? 'text-neon-purple' : 'text-neon-green'}
              ${!square && !winner ? 'cursor-pointer' : 'cursor-default'}
            `}
          >
            {square}
          </button>
        ))}
      </div>

      {winner && (
        <div className="text-2xl text-neon-blue mb-4 animate-bounce">
          ¡Ganador: {winner === 'X' ? 'Jugador 1' : 'Jugador 2'}!
        </div>
      )}

      <button onClick={resetGame} className="px-6 py-2 bg-neon-blue text-black font-bold rounded hover:bg-white transition-colors">
        Reiniciar Juego
      </button>

      {/* Trivia Modal */}
      {triviaModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-8 rounded-xl border border-neon-blue w-96">
            <h3 className="text-xl text-neon-blue mb-4">Para marcar la casilla...</h3>
            <p className="mb-4 text-white text-lg">{triviaModal.question}</p>
            
            {message ? (
              <p className="text-neon-red mb-4">{message}</p>
            ) : (
              <>
                <input 
                  type="text" 
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white mb-4"
                  placeholder="Tu respuesta..."
                />
                <button 
                  onClick={handleTriviaSubmit}
                  className="w-full bg-neon-green text-black font-bold py-2 rounded"
                >
                  Enviar Respuesta
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loader2 className="animate-spin text-neon-blue w-12 h-12" />
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
