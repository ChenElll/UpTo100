import React, { useState, useEffect } from 'react';
import './App.css';
import Board from './Board';
import Register from './Register';

function App() {
  // State to manage the list of players, initialized from localStorage if available
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem('players');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });
  // State to track the index of the current player
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // State to manage whether the game has started or not
  const [isGameStarted, setIsGameStarted] = useState(false);

  // State to manage the top players list, initialized from localStorage if available
  const [topPlayers, setTopPlayers] = useState(() => {
    const savedTopPlayers = localStorage.getItem('topPlayers');
    return savedTopPlayers ? JSON.parse(savedTopPlayers) : [];
  });

  // useEffect to update player scores when the game starts
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

  // Function to generate a random number between 0 and 99
  const getRandomNumber = () => {
    return Math.floor(Math.random() * 100);
  };

  // Function to handle button clicks for game operations
  const handleButtonClick = (operation) => {
    const newPlayers = [...players];
    const currentPlayer = newPlayers[currentPlayerIndex];

    // Perform the operation on the current player's score
    switch (operation) {
      case '+1':
        currentPlayer.score += 1;
        break;
      case '-1':
        if (currentPlayer.score > 1) { // Ensure the score does not go below 1
          currentPlayer.score -= 1;
        }
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
    // Increment the number of actions performed by the current player
    currentPlayer.actions += 1;

    // Update the players state with the new score and actions
    setPlayers(newPlayers);

    //Check if the current player has reached a score of 100
    if (currentPlayer.score === 100) {
      // Record the end time of the game
      const endTime = new Date().toISOString();
      alert(`Player ${currentPlayer.name} reached 100 with ${currentPlayer.actions} actions!`);

      // Add the game result to the player's game history
      currentPlayer.games.push({ actions: currentPlayer.actions, endTime });

      // Update the list of top players
      const newTopPlayers = [...newPlayers]
        .filter(player => player.games.length > 0)
        .map(player => ({
          name: player.name,
          // Calculate the average number of actions per game
          averageActions: player.games.reduce((acc, game) => acc + game.actions, 0) / player.games.length,
        }))
        .sort((a, b) => a.averageActions - b.averageActions)
        .slice(0, 3);// Keep only the top 3 players

      // Update the top players state
      setTopPlayers(newTopPlayers);

      // Save the top players to localStorage
      localStorage.setItem('topPlayers', JSON.stringify(newTopPlayers));

      // Save the players to localStorage
      localStorage.setItem('players', JSON.stringify(newPlayers));

      // Ask the player if they want to continue playing
      const continuePlaying = window.confirm(`Player ${currentPlayer.name} wins! Do you want to continue playing?`);
      if (continuePlaying) {
        // Reset the player's actions
        currentPlayer.score = getRandomNumber();
        currentPlayer.actions = 0;
      } else {
        // Remove the player from the players array
        newPlayers.splice(currentPlayerIndex, 1);
      }
      setPlayers(newPlayers);

      // Update the current player index or end the game if no players are left
      if (newPlayers.length > 0) {
        setCurrentPlayerIndex(currentPlayerIndex % newPlayers.length);
      } else {
        setIsGameStarted(false);
      }
    } else {
      // Update the current player index to the next player
      setCurrentPlayerIndex((currentPlayerIndex + 1) % newPlayers.length);
    }
  };

  //  // Function to handle player registration
  const handleRegister = (name) => {
    if (players.length < 8) {
      // Limit the number of players to 8
      const newPlayers = [...players, { name, score: 0, actions: 0, games: [] }];
      // Update the players state with the new player
      setPlayers(newPlayers);
      localStorage.setItem('players', JSON.stringify(newPlayers));
    }
  };

  // Function to start the game
  const startGame = () => {
    setIsGameStarted(true);
    const initialScores = players.map(() => getRandomNumber());// Generate initial random scores for each player
    const updatedPlayers = players.map((player, index) => ({
      ...player,
      score: initialScores[index],// Set initial score
      actions: 0,
    }));
    setPlayers(updatedPlayers);// Update players state with initial scores and actions reset
  };

  // Function to reset the game
  const resetGame = () => {
    // Set the game started state to false
    setIsGameStarted(false);

    // Reset the current player index
    setCurrentPlayerIndex(0);
    const updatedPlayers = players.map(player => ({
      ...player,
      score: 0,
      actions: 0,
    }));
    // Update the players state
    setPlayers(updatedPlayers);
  };

  // Function to handle player withdrawal from the game
  const handleWithdraw = () => {

    // Create a copy of the players array
    const newPlayers = [...players];

    // Remove the current player from the players array
    newPlayers.splice(currentPlayerIndex, 1);

    // Update the players state
    setPlayers(newPlayers);
    if (newPlayers.length > 0) {
      // Update the current player index
      setCurrentPlayerIndex(currentPlayerIndex % newPlayers.length);
    } else {
      //// End the game if no players are left
      setIsGameStarted(false);
    }
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
              onWithdraw={handleWithdraw}
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
