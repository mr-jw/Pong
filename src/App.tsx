import { useState } from "react";
import { Menu } from "./Menu";
import "./App.css";

function Game() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerOneScore, setPlayerOneScore] = useState(120);
  const [playerTwoScore, setPlayerTwoScore] = useState(40);

  return (
    <div className="game-container">
      <div className="score-container">
        <p className="score">{playerOneScore}</p>

        <p className="score">{playerTwoScore}</p>
      </div>
      <div className="game-area">
        <div className="game-area-seperator"></div>
      </div>
    </div>
  );
}

function App() {
  const [hideMainMenu, setHideMainMenu] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [keyBindings, setKeyBindings] = useState<string[]>([
    "w",
    "a",
    "p",
    "l",
  ]);

  const changeKeyBinding = (index: number, binding: string) => {
    // pass current state of array into the function.
    setKeyBindings((current) => {
      const newBinding = [...current]; // make copy of array.

      // assign specified index the given binding.
      newBinding[index] = binding;

      // return new array.
      return newBinding;
    });
  };

  const keyBindingData = [
    {
      player: 1,
      text: "Up:",
      binding: keyBindings[0],
      changeKeyBinding: changeKeyBinding,
      index: 0,
    },
    {
      player: 1,
      text: "Down:",
      binding: keyBindings[1],
      changeKeyBinding: changeKeyBinding,
      index: 1,
    },
    {
      player: 2,
      text: "Up:",
      binding: keyBindings[2],
      changeKeyBinding: changeKeyBinding,
      index: 2,
    },
    {
      player: 2,
      text: "Down:",
      binding: keyBindings[3],
      changeKeyBinding: changeKeyBinding,
      index: 3,
    },
  ];

  const startGame = () => {
    setHideMainMenu(true);
    setGameStarted(true);
  };

  return (
    <div className="app-container">
      {!hideMainMenu && (
        <Menu keyBindingData={keyBindingData} startGame={startGame} />
      )}

      {gameStarted && <Game />}
    </div>
  );
}

export default App;
