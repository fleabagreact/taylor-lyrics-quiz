import { useNavigate } from 'react-router-dom';
import useClickSound from '../hooks/UseClickSound';

export default function Ranking() {
  const ranking = JSON.parse(localStorage.getItem('swiftie-ranking')) || [];
  const navigate = useNavigate();
  const playClick = useClickSound();

  const handleBack = () => {
    playClick();
    navigate('/');
  };

  return (
    <div className="ranking-screen fade-in">
      <h1 className="ranking-title">🏆 Ranking Swiftie 🏆</h1>
      {ranking.length === 0 ? (
        <p className="ranking-empty">Ninguém jogou ainda 😢</p>
      ) : (
        <ol className="ranking-list">
          {ranking.map((entry, index) => (
            <li key={index} className={`ranking-item ${index === 0 ? 'top-one' : ''}`}>
              <span>{index + 1}º</span>
              <span>{entry.name}</span>
              <span>🎯 {entry.score}/10</span>
            </li>
          ))}
        </ol>
      )}
      <button onClick={handleBack} className="ranking-back-btn">⬅ Voltar</button>
    </div>
  );
}
