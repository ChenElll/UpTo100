import React, { useState } from 'react';
import './Register.css';

// Register component for registering new players and starting the game
function Register({ onRegister, startGame, players }) {

  // State to manage the new player's name
  const [name, setName] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    // Prevent page refresh on form submission
    e.preventDefault();
    // Check if the name is not empty
    if (name) {
      // Call the function to register the new player
      onRegister(name);
      // Reset the input field after registration
      setName('');
    }
  };
  //Returning JSX to Render the Registration Form
  return (
    <div className="register">
      {/* Form to register a new player */}
      <form onSubmit={handleSubmit}>
        <label>
          Player Name:
          <input
            type="text"
            value={name}// Set the value of the input field to the state
            onChange={(e) => setName(e.target.value)}// Update the state on input change
          />
        </label>
        <button type="submit" disabled={players.length >= 8}>Register</button>{/* Disable the button if there are already 8 players */}
      </form>
      <button onClick={startGame} disabled={players.length === 0}>Start Game</button>{/* Disable the button if there are no registered players */}
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
