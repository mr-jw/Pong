import { useEffect, useState } from "react";
import { Menu } from "./Menu";
import "./App.css";

function Player( {player, bindings}: {player: 1 | 2, bindings: string[]}) {
  const className = player === 1 ? 'playerOne' : 'playerTwo';

  const [yPos, setYPos] = useState(0);

  useEffect(() => {

    const handleMovement = (event: KeyboardEvent) => {
      const element = document.getElementsByClassName(className)[0] as HTMLElement | undefined;

      if (!element) return;

      if (event.key === bindings[0]) {
        setYPos((current) => current -15);
      }
      else if (event.key === bindings[1]) {
       setYPos((current) => current +15);
      }
    };

    window.addEventListener('keydown', handleMovement);

    return () => { 
      window.removeEventListener('keydown', handleMovement); 
    };
  }, [bindings, className]);

  return (
     <div className={className} style={{top: `${yPos}px`}}/>
  );
}

function Game({ playerOneBindings, playerTwoBindings }: { playerOneBindings: string[]; playerTwoBindings: string[] }) {
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
        <Player player={1} bindings={playerOneBindings}/>
        <div className="game-area-separator"></div>
        <Player player={2} bindings={playerTwoBindings}/>
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

  // retrieve key bindings from the data by first filtering and then mapping.
  const playerOneKeyBindings = keyBindingData
    .filter((bindings) => bindings.player === 1)
    .map((bindings) => bindings.binding);

  const playerTwoKeyBindings = keyBindingData
    .filter((bindings) => bindings.player === 2)
    .map((bindings) => bindings.binding);

  const startGame = () => {
    setHideMainMenu(true);
    setGameStarted(true);
  };

  // track escape key press during game.
  useEffect(() => {
    if (!gameStarted) return;

    const handleEscapePress = (event: KeyboardEvent) => {
      console.log(`Key pressed: ${event.key}`);
      if (event.key === "Escape") {
        setGameStarted(false);
        setHideMainMenu(false);
        // probably reset scores here too.
      }
    };

    window.addEventListener("keydown", handleEscapePress);

    return () => {
      window.removeEventListener("keydown", handleEscapePress);
    };
  }, [gameStarted]);

  return (
    <div className="app-container">
      {!hideMainMenu && (
        <Menu keyBindingData={keyBindingData} startGame={startGame} />
      )}

      {gameStarted && <Game playerOneBindings={playerOneKeyBindings} playerTwoBindings={playerTwoKeyBindings} />}
    </div>
  );
}

export default App;
