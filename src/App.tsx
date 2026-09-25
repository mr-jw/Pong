import { useEffect, useState } from "react";
import { Menu } from "./Menu";
import "./App.css";

function Player({ player, bindings }: { player: 1 | 2; bindings: string[] }) {
  const className = player === 1 ? "playerOne" : "playerTwo";

  const [yPos, setYPos] = useState(0);

  useEffect(() => {
    console.log(yPos);
  }, [yPos]);

  useEffect(() => {
    // keep track of key presses.
    let upKeyPressed = false;
    let downKeyPressed = false;

    let animationFrame: number;

    const areaElement = document.querySelector(".game-area");
    const areaHeight = areaElement
      ? window.getComputedStyle(areaElement).getPropertyValue("height")
      : "0px";

    const playerElement = document.querySelector(`.${className}`);
    const playerHeight = playerElement
      ? window.getComputedStyle(playerElement).getPropertyValue("height")
      : "0px";

    // track keep pressing / releasing.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === bindings[0]) {
        upKeyPressed = true;
      }

      if (event.key === bindings[1]) {
        downKeyPressed = true;
      }
    };

    const handleKeyRelease = (event: KeyboardEvent) => {
      if (event.key === bindings[0]) {
        upKeyPressed = false;
      }

      if (event.key === bindings[1]) {
        downKeyPressed = false;
      }
    };

    const movePlayer = () => {
      if (upKeyPressed) {
        setYPos((current) => (current > 0 ? current - 3 : current));
      }

      if (downKeyPressed) {
        setYPos((current) =>
          current < parseFloat(areaHeight) - parseFloat(playerHeight)
            ? current + 3
            : current,
        );
      }

      animationFrame = requestAnimationFrame(movePlayer);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyRelease);

    animationFrame = requestAnimationFrame(movePlayer);

    return () => {
      // cleanup.
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyRelease);
      cancelAnimationFrame(animationFrame);
    };
  }, [bindings, className]);

  return <div className={className} style={{ top: `${yPos}px` }} />;
}

function Game({
  playerOneBindings,
  playerTwoBindings,
}: {
  playerOneBindings: string[];
  playerTwoBindings: string[];
}) {
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
        <Player player={1} bindings={playerOneBindings} />
        <div className="game-area-separator"></div>
        <Player player={2} bindings={playerTwoBindings} />
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

      {gameStarted && (
        <Game
          playerOneBindings={playerOneKeyBindings}
          playerTwoBindings={playerTwoKeyBindings}
        />
      )}
    </div>
  );
}

export default App;
