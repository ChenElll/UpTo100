import React, { useState } from 'react';
import './Register.css';

function Register({ onRegister, startGame, players }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      onRegister(name);
      setName('');
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <label>
          Player Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button type="submit" disabled={players.length >= 8}>Register</button>
      </form>
      <button onClick={startGame} disabled={players.length === 0}>Start Game</button>
      <div>
        <h3>Registered Players:</h3>
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Register;
