import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import QuizPage from './components/QuizPage';
import './App.css';
import Ranking from './components/Ranking';

export default function App() {
  const [playerName, setPlayerName] = useState('');

  return (
    <Routes>
      <Route path="/" element={<Home setPlayerName={setPlayerName} />} />
      <Route
        path="/game"
        element={
          playerName ? (
            <QuizPage playerName={playerName} setPlayerName={setPlayerName} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/ranking" element={<Ranking />} />
    </Routes>
  );
}
