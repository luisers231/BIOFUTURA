import React, { useState } from 'react';
import { 
  Dna, Baby, Activity, User, Users, 
  Gamepad2, BookOpen, PenTool, LayoutDashboard 
} from 'lucide-react';
import Activities from './components/Activities';
import Quiz from './components/Quiz';
import TicTacToe from './components/Games/TicTacToe';
import Hangman from './components/Games/Hangman';
import Jeopardy from './components/Games/Jeopardy';
import FamilyFeud from './components/Games/FamilyFeud';
import { AppView, TopicId, Topic, GameType } from './types';

const TOPICS: Topic[] = [
  { id: TopicId.HUMAN_REPRO, title: "Reproducción Humana", description: "Conceptos generales de biología reproductiva", icon: "🧬" },
  { id: TopicId.FETAL_DEV, title: "Desarrollo Fetal", description: "Etapas del embarazo semana a semana", icon: "👶" },
  { id: TopicId.MENSTRUAL, title: "Ciclo Menstrual", description: "Fases hormonales y cambios biológicos", icon: "📅" },
  { id: TopicId.MALE_SYSTEM, title: "Sistema Masculino", description: "Anatomía y funciones del aparato masculino", icon: "mars" },
  { id: TopicId.FEMALE_SYSTEM, title: "Sistema Femenino", description: "Anatomía y funciones del aparato femenino", icon: "venus" },
];

function App() {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setView(AppView.ACTIVITIES); // Default to activities when topic picked
  };

  const renderContent = () => {
    switch (view) {
      case AppView.HOME:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            <div className="col-span-full text-center mb-8">
               <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple mb-4">
                 BIOFUTURA
               </h1>
               <p className="text-xl text-slate-400 font-rajdhani">Plataforma Interactiva de Ciencias Naturales</p>
            </div>
            
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic)}
                className="group relative bg-dark-card border border-slate-700 p-6 rounded-xl hover:border-neon-blue transition-all duration-300 hover:scale-[1.02] flex flex-col items-center"
              >
                <div className="absolute inset-0 bg-neon-blue/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
                <span className="text-5xl mb-4 grayscale group-hover:grayscale-0 transition-all">{topic.icon === "mars" ? "♂️" : topic.icon === "venus" ? "♀️" : topic.icon}</span>
                <h3 className="text-2xl font-orbitron text-white mb-2">{topic.title}</h3>
                <p className="text-slate-400 text-center font-rajdhani">{topic.description}</p>
              </button>
            ))}

            <button
                onClick={() => setView(AppView.GAMES)}
                className="col-span-full mt-8 bg-gradient-to-r from-purple-900 to-slate-900 border border-neon-purple p-8 rounded-xl hover:shadow-[0_0_30px_rgba(188,19,254,0.3)] transition-all flex flex-col items-center justify-center group"
            >
                <Gamepad2 className="w-16 h-16 text-neon-purple mb-4 group-hover:rotate-12 transition-transform" />
                <h2 className="text-4xl font-orbitron text-white">Sala de Juegos</h2>
                <p className="text-neon-purple font-rajdhani text-xl">Aprende jugando: Jeopardy, Trivia y más</p>
            </button>
          </div>
        );

      case AppView.ACTIVITIES:
      case AppView.QUIZ:
        return selectedTopic ? (
           <div className="w-full">
             <div className="flex justify-center gap-4 mb-6 p-4 border-b border-slate-800">
               <button 
                 onClick={() => setView(AppView.ACTIVITIES)}
                 className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors ${view === AppView.ACTIVITIES ? 'bg-neon-blue text-black' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
               >
                 <BookOpen size={18} /> Actividades
               </button>
               <button 
                 onClick={() => setView(AppView.QUIZ)}
                 className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors ${view === AppView.QUIZ ? 'bg-neon-blue text-black' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
               >
                 <PenTool size={18} /> Quiz (20 Preguntas)
               </button>
             </div>
             {view === AppView.ACTIVITIES ? <Activities topic={selectedTopic} /> : <Quiz topic={selectedTopic} />}
           </div>
        ) : null;

      case AppView.GAMES:
        if (!selectedGame) {
           return (
             <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-4xl font-orbitron text-white text-center mb-12">Selecciona un Juego</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <GameCard title="Tic Tac Toe Trivia" icon={<Users />} onClick={() => setSelectedGame(GameType.TICTACTOE)} color="blue" />
                   <GameCard title="El Ahorcado" icon={<Activity />} onClick={() => setSelectedGame(GameType.HANGMAN)} color="green" />
                   <GameCard title="Jeopardy Bio" icon={<LayoutDashboard />} onClick={() => setSelectedGame(GameType.JEOPARDY)} color="purple" />
                   <GameCard title="100 Galileanos Dicen" icon={<Users />} onClick={() => setSelectedGame(GameType.GALILEANS)} color="red" />
                </div>
             </div>
           );
        }
        
        switch (selectedGame) {
          case GameType.TICTACTOE: return <TicTacToe />;
          case GameType.HANGMAN: return <Hangman />;
          case GameType.JEOPARDY: return <Jeopardy />;
          case GameType.GALILEANS: return <FamilyFeud />;
          default: return null;
        }
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col items-center lg:items-start py-8 sticky top-0 h-screen z-10">
        <div className="mb-12 px-4 lg:px-8">
          <Dna className="w-10 h-10 text-neon-blue animate-pulse" />
        </div>
        
        <nav className="w-full flex flex-col gap-2 px-2">
          <NavBtn active={view === AppView.HOME} onClick={() => { setView(AppView.HOME); setSelectedTopic(null); setSelectedGame(null); }} icon={<LayoutDashboard />} label="Inicio" />
          <div className="h-px bg-slate-800 my-4 mx-4"></div>
          <p className="hidden lg:block text-xs text-slate-500 px-6 mb-2 uppercase tracking-wider font-bold">Temas</p>
          {TOPICS.map(t => (
            <NavBtn 
                key={t.id} 
                active={selectedTopic?.id === t.id && view !== AppView.GAMES && view !== AppView.HOME} 
                onClick={() => handleTopicSelect(t)} 
                icon={<BookOpen size={18} />} 
                label={t.title} 
                sub={true}
            />
          ))}
          <div className="h-px bg-slate-800 my-4 mx-4"></div>
          <NavBtn active={view === AppView.GAMES} onClick={() => { setView(AppView.GAMES); setSelectedGame(null); }} icon={<Gamepad2 />} label="Juegos" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur sticky top-0 z-20">
            <div className="font-orbitron text-xl text-white">
                {selectedGame ? selectedGame : selectedTopic ? selectedTopic.title : "Panel Principal"}
            </div>
            {selectedGame && (
                <button onClick={() => setSelectedGame(null)} className="text-sm text-neon-blue hover:text-white underline">
                    Volver a Juegos
                </button>
            )}
        </header>
        <div className="p-4 lg:p-8 pb-20">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

const NavBtn = ({ active, onClick, icon, label, sub = false }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200
      ${active ? 'bg-neon-blue/10 text-neon-blue border-r-2 border-neon-blue' : 'text-slate-400 hover:text-white hover:bg-slate-800'}
      ${sub ? 'lg:pl-8 text-sm' : ''}
    `}
  >
    {icon}
    <span className="hidden lg:block font-rajdhani font-semibold">{label}</span>
  </button>
);

const GameCard = ({ title, icon, onClick, color }: any) => {
    const colorClass = 
        color === 'blue' ? 'text-neon-blue border-neon-blue hover:shadow-neon-blue' :
        color === 'purple' ? 'text-neon-purple border-neon-purple hover:shadow-neon-purple' :
        color === 'green' ? 'text-neon-green border-neon-green hover:shadow-neon-green' :
        'text-neon-red border-neon-red hover:shadow-neon-red';

    return (
        <button 
            onClick={onClick}
            className={`h-48 rounded-2xl border bg-slate-900 flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 hover:shadow-lg ${colorClass}`}
        >
            <div className="scale-150">{icon}</div>
            <h3 className="text-2xl font-orbitron text-white">{title}</h3>
        </button>
    )
}

export default App;
