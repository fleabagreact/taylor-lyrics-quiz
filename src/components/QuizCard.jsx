import { useEffect, useState } from 'react';

export default function QuizCard({ song, onScoreUpdate, allSongs }) {
  const [lyrics, setLyrics] = useState('');
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState('');
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setAnswered(false);
    setSelected('');

    fetch(`https://taylor-swift-api.sarbo.workers.dev/lyrics/${song.song_id}`)
      .then((res) => res.json())
      .then((data) => {
        const verses = data.lyrics
          ?.split('\n')
          .map((line) => line.trim())
          .filter((line) => line && !line.toLowerCase().includes('instrumental'));

        if (!verses || verses.length === 0) {
          setError(true);
          setTimeout(() => onScoreUpdate(false), 1000);
          return;
        }

        setLyrics(verses[0]);

        const otherTitles = allSongs
          .filter((s) => s.song_id !== song.song_id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((s) => s.title);

        const shuffled = [...otherTitles, song.title].sort(() => 0.5 - Math.random());
        setOptions(shuffled);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setTimeout(() => onScoreUpdate(false), 1000);
        setLoading(false);
      });
  }, [song]);

  const playSound = (type) => {
    const audio = new Audio(`/${type}.mp3`);
    audio.play();
  };

  const handleAnswer = (choice) => {
    if (answered) return;
    playSound('click');
    setSelected(choice);
    setAnswered(true);
    const correct = choice === song.title;
    playSound(correct ? 'correct' : 'wrong');
    setTimeout(() => onScoreUpdate(correct), 1200);
  };

  if (loading) return <p className="swiftie-loading">✨ Carregando letra encantada... ✨</p>;
  if (error) return <p className="swiftie-error">🚫 Música sem letra... Pulando! 🚫</p>;

  return (
    <div className="quiz-card fade-in">
      <h3>🌟 Que música tem esse trecho? 🌟</h3>
      <blockquote className="lyric-line">“{lyrics}”</blockquote>
      <ul className="options">
        {options.map((opt) => (
          <li
            key={opt}
            className={`option ${
              answered
                ? opt === song.title
                  ? 'correct'
                  : opt === selected
                  ? 'wrong'
                  : ''
                : ''
            }`}
            onClick={() => handleAnswer(opt)}
            style={{ pointerEvents: answered ? 'none' : 'auto' }}
          >
            {opt}
          </li>
        ))}
      </ul>
    </div>
  );
}
