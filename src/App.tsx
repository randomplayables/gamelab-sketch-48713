import RPLogo2 from './assets/RPLogo2.png';
import React, { useState } from 'react';
import './styles.css';



export default function App() {
  const [targetNumber, setTargetNumber] = useState<number>(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [previousGuesses, setPreviousGuesses] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numGuess = parseInt(guess, 10);
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
      setFeedback('Please enter a valid number between 1 and 100.');
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setPreviousGuesses([...previousGuesses, numGuess]);
    let result: string;
    if (numGuess < targetNumber) {
      result = 'Too low!';
    } else if (numGuess > targetNumber) {
      result = 'Too high!';
    } else {
      result = 'Congratulations! You got it right!';
      setIsGameOver(true);
    }
    setFeedback(result);
    setGuess('');
    if (typeof window.sendDataToGameLab === 'function') {
      window.sendDataToGameLab({
        event: 'guess',
        guess: numGuess,
        result,
        attempts: newAttempts,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const resetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setFeedback('');
    setAttempts(0);
    setPreviousGuesses([]);
    setIsGameOver(false);
    if (typeof window.sendDataToGameLab === 'function') {
      window.sendDataToGameLab({
        event: 'reset',
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="App">
      <img src={RPLogo2} alt="Uploaded asset" className="logo" />
      <h1>Number Guessing Game</h1>
      <p>I'm thinking of a number between 1 and 100. Can you guess it?</p>
      <form onSubmit={handleGuessSubmit}>
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={isGameOver}
          min="1"
          max="100"
          placeholder="Your guess"
        />
        <button type="submit" disabled={isGameOver}>Guess</button>
      </form>
      {feedback && <p className="feedback">{feedback}</p>}
      <p>Attempts: {attempts}</p>
      {previousGuesses.length > 0 && (
        <p>Previous guesses: {previousGuesses.join(', ')}</p>
      )}
      {isGameOver && (
        <button className="reset-button" onClick={resetGame}>
          Play Again
        </button>
      )}
    </div>
  );
}