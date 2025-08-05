import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useClickSound from '../hooks/UseClickSound';

export default function Home({ setPlayerName }) {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const playClick = useClickSound();

  const handleStart = () => {
    if (name.trim()) {
      playClick();
      localStorage.setItem('swiftie-name', name.trim());
      setPlayerName(name.trim());
      navigate('/game');
    }
  };

  const handleRankingClick = () => {
    playClick();
    navigate('/ranking');
  };

  return (
    <div className="start-screen fade-in">
      <h1>Taylor Swift Quiz</h1>
      <p>Adivinhe a música pela letra</p>
      <input
        type="text"
        placeholder="Digite seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="name-input"
      />
      <button onClick={handleStart} disabled={!name.trim()} className="start-btn">
        Começar
      </button>
      <br />
      <button onClick={handleRankingClick} className="start-btn">
        Ver Ranking
      </button>
    </div>
  );
}
