import React, { useState } from 'react';
import './Board.css';

function Board({ player, isCurrentPlayer, onButtonClick, onWithdraw }) {
  const [showGames, setShowGames] = useState(false);

  const toggleShowGames = () => {
    setShowGames(!showGames);
  };

  return (
    <div className={`board ${isCurrentPlayer ? 'current' : 'dimmed'}`}>
      <h2>{player.name}</h2>
      <p>Score: {player.score}</p>
      <div className="buttons">
        {['+1', '-1', '*2', '/2'].map((operation) => (
          <button
            key={operation}
            onClick={() => onButtonClick(operation)}
            disabled={!isCurrentPlayer}
          >
            {operation}
          </button>
        ))}
        <button onClick={onWithdraw} disabled={!isCurrentPlayer}>
          Withdraw
        </button>
      </div>
      <button className="toggle-games-button" onClick={toggleShowGames}>
        {showGames ? 'Hide Games' : 'Show Games'}
      </button>
      {showGames && (
        <div className="player-games">
          <h3>Previous Games</h3>
          <ul>
            {player.games.map((game, index) => (
              <li key={index}>
                Actions: {game.actions}, End Time: {new Date(game.endTime).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Board;
