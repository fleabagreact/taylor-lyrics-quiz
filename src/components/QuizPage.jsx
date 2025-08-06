import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizCard from './QuizCard';
import useClickSound from '../hooks/UseClickSound';

export default function QuizPage({ playerName, setPlayerName }) {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [playerRank, setPlayerRank] = useState(null);
  const navigate = useNavigate();
  const playClick = useClickSound();

  useEffect(() => {
    if (!playerName) {
      const stored = localStorage.getItem('swiftie-name');
      if (!stored) return navigate('/');
      setPlayerName(stored);
    }

    fetch('https://taylor-swift-api.sarbo.workers.dev/songs')
      .then((res) => res.json())
      .then((data) => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setSongs(shuffled.slice(0, 10));
      });
  }, []);

  const handleScoreUpdate = (correct) => {
    setScore((prev) => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      wrong: !correct ? prev.wrong + 1 : prev.wrong,
    }));
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    playClick();
    setPlayerName('');
    localStorage.removeItem('swiftie-name');
    navigate('/');
  };

  const handleRanking = () => {
    playClick();
    navigate('/ranking');
  };

  const saveToRanking = () => {
    const results = JSON.parse(localStorage.getItem('swiftie-ranking')) || [];
    results.push({ name: playerName, score: score.correct });
    const sorted = results.sort((a, b) => b.score - a.score);
    localStorage.setItem('swiftie-ranking', JSON.stringify(sorted));

    const index = sorted.findIndex((r) => r.name === playerName);
    setPlayerRank(index + 1);
  };

  useEffect(() => {
    if (currentIndex === songs.length && songs.length > 0) {
      saveToRanking();
    }
  }, [currentIndex]);

  const emoji =
    score.correct === 10
      ? '🌟'
      : score.correct >= 7
      ? '💖'
      : score.correct >= 5
      ? '🎶'
      : '😅';

  const currentSong = songs[currentIndex];

  return (
    <div className="game-screen">
      <header>
        <h2>Jogador: {playerName}</h2>
        <p>
          Acertos: {score.correct} | Erros: {score.wrong}
        </p>
      </header>

      {currentIndex < songs.length && currentSong && (
        <QuizCard
          song={currentSong}
          allSongs={songs}
          onScoreUpdate={handleScoreUpdate}
        />
      )}

      {currentIndex >= songs.length && (
        <div className="quiz-finished fade-in">
          <h2>Fim do Quiz! {emoji}</h2>
          <p>Total de acertos: {score.correct}</p>
          <p>Total de erros: {score.wrong}</p>

          {playerRank !== null && (
            playerRank > 0 ? (
              <p>Sua posição no ranking: <strong>{playerRank}º lugar</strong></p>
            ) : (
              <p>Você ainda não entrou no ranking 😅</p>
            )
          )}

          <br />

          <button onClick={handleRestart}>Jogar novamente</button>
          <button onClick={handleRanking} style={{ marginTop: '10px' }}>
            Ver Ranking
          </button>
        </div>
      )}
    </div>
  );
}
