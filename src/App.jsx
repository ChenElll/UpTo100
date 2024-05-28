import React, { useState, useEffect } from 'react';
import './App.css';
import Board from './Board';
import Register from './Register';

function App() {
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem('players');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [topPlayers, setTopPlayers] = useState(() => {
    const savedTopPlayers = localStorage.getItem('topPlayers');
    return savedTopPlayers ? JSON.parse(savedTopPlayers) : [];
  });

  useEffect(() => {
    if (isGameStarted) {
      const initialScores = players.map(() => getRandomNumber());
      const updatedPlayers = players.map((player, index) => ({
        ...player,
        score: initialScores[index],
        actions: 0,
      }));
      setPlayers(updatedPlayers);
    }
  }, [isGameStarted]);

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 100);
  };

  const handleButtonClick = (operation) => {
    const newPlayers = [...players];
    const currentPlayer = newPlayers[currentPlayerIndex];

    switch (operation) {
      case '+1':
        currentPlayer.score += 1;
        break;
      case '-1':
        currentPlayer.score -= 1;
        break;
      case '*2':
        currentPlayer.score *= 2;
        break;
      case '/2':
        currentPlayer.score = Math.floor(currentPlayer.score / 2);
        break;
      default:
        break;
    }

    currentPlayer.actions += 1;
    setPlayers(newPlayers);

    if (currentPlayer.score === 100) {
      const endTime = new Date().toISOString();
      alert(`Player ${currentPlayer.name} reached 100 with ${currentPlayer.actions} actions!`);

      currentPlayer.games.push({ actions: currentPlayer.actions, endTime });
      const newTopPlayers = [...newPlayers]
        .filter(player => player.games.length > 0)
        .map(player => ({
          name: player.name,
          averageActions: player.games.reduce((acc, game) => acc + game.actions, 0) / player.games.length,
        }))
        .sort((a, b) => a.averageActions - b.averageActions)
        .slice(0, 3);
      setTopPlayers(newTopPlayers);
      localStorage.setItem('topPlayers', JSON.stringify(newTopPlayers));
      localStorage.setItem('players', JSON.stringify(newPlayers));

      const continuePlaying = window.confirm(`Player ${currentPlayer.name} wins! Do you want to continue playing?`);
      if (continuePlaying) {
        currentPlayer.score = getRandomNumber();
        currentPlayer.actions = 0;
      } else {
        newPlayers.splice(currentPlayerIndex, 1);
      }
      setPlayers(newPlayers);

      if (newPlayers.length > 0) {
        setCurrentPlayerIndex(currentPlayerIndex % newPlayers.length);
      } else {
        setIsGameStarted(false);
      }
    } else {
      setCurrentPlayerIndex((currentPlayerIndex + 1) % newPlayers.length);
    }
  };

  const handleRegister = (name) => {
    if (players.length < 8) {
      const newPlayers = [...players, { name, score: 0, actions: 0, games: [] }];
      setPlayers(newPlayers);
      localStorage.setItem('players', JSON.stringify(newPlayers));
    }
  };

  const startGame = () => {
    setIsGameStarted(true);
    const initialScores = players.map(() => getRandomNumber());
    const updatedPlayers = players.map((player, index) => ({
      ...player,
      score: initialScores[index],
      actions: 0,
    }));
    setPlayers(updatedPlayers);
  };

  const resetGame = () => {
    setIsGameStarted(false);
    setCurrentPlayerIndex(0);
    const updatedPlayers = players.map(player => ({
      ...player,
      score: 0,
      actions: 0,
    }));
    setPlayers(updatedPlayers);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Reach 100 Game</h1>
      </header>
      {!isGameStarted ? (
        <Register onRegister={handleRegister} startGame={startGame} players={players} />
      ) : (
        <div className="game-board">
          {players.map((player, index) => (
            <Board
              key={player.name}
              player={player}
              isCurrentPlayer={currentPlayerIndex === index}
              onButtonClick={handleButtonClick}
            />
          ))}
        </div>
      )}
      <div className="top-players">
        <h2>Top Players</h2>
        <ul>
          {topPlayers.map((player, index) => (
            <li key={index}>{player.name}: {player.averageActions.toFixed(2)} actions/game</li>
          ))}
        </ul>
      </div>
      {isGameStarted && (
        <button className="reset-button" onClick={resetGame}>
          Start New Game
        </button>
      )}
    </div>
  );
}

export default App;
