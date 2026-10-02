import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Menu } from "./Menu";
import "./App.css";

type BallProps = {
  gameAreaRef: React.RefObject<HTMLDivElement | null>;
  playerOneRef: React.RefObject<HTMLDivElement | null>;
  playerTwoRef: React.RefObject<HTMLDivElement | null>;
};

function Ball({ gameAreaRef, playerOneRef, playerTwoRef }: BallProps) {
  const ballRef = useRef<HTMLDivElement>(null);

  const [paused, setPaused] = useState(false);

  const positionX = useRef(100);
  const positionY = useRef(100);

  const velocityX = useRef(3);
  const velocityY = useRef(2);

  const [renderX, setRenderX] = useState(100);
  const [renderY, setRenderY] = useState(100);

  const checkWallCollisions = () => {
    const areaHeight = gameAreaRef.current?.getBoundingClientRect().height;
    const ballHeight = ballRef.current?.getBoundingClientRect().height;

    if (areaHeight === undefined || ballHeight === undefined) {
      return;
    }

    if (positionY.current <= 0) {
      positionY.current = 0;
      velocityY.current *= -1;
    }

    if (positionY.current + ballHeight >= areaHeight) {
      positionY.current = areaHeight - ballHeight;
      velocityY.current *= -1;
    }
  };

  const checkPlayerCollisions = () => {
    const playerOneRect = playerOneRef.current?.getBoundingClientRect();
    const playerTwoRect = playerTwoRef.current?.getBoundingClientRect();
    const ballRect = ballRef.current?.getBoundingClientRect();

    if (
      playerOneRect === undefined ||
      playerTwoRect === undefined ||
      ballRect === undefined
    ) {
      return;
    }

    // AABB collision variables.
    const playerOneCollision =
      ballRect.right >= playerOneRect.left &&
      ballRect.left <= playerOneRect.right &&
      ballRect.bottom >= playerOneRect.top &&
      ballRect.top <= playerOneRect.bottom;

    const playerTwoCollision =
      ballRect.right >= playerTwoRect.left &&
      ballRect.left <= playerTwoRect.right &&
      ballRect.bottom >= playerTwoRect.top &&
      ballRect.top <= playerTwoRect.bottom;

    if (playerOneCollision) {
      positionX.current += 10;
      velocityX.current *= -1;
    }

    if (playerTwoCollision) {
      positionX.current -= 10;
      velocityX.current *= -1;
    }
  };

  const updateBallPosition = () => {
    positionX.current += velocityX.current;
    positionY.current += velocityY.current;
  };

  useEffect(() => {
    if (paused) return;

    let animationFrame: number;

    const move = () => {
      updateBallPosition();

      checkWallCollisions();

      checkPlayerCollisions();

      // Update the positions rendered by React.
      setRenderX(positionX.current);
      setRenderY(positionY.current);

      animationFrame = requestAnimationFrame(move);
    };

    animationFrame = requestAnimationFrame(move);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [paused]);

  return (
    <div
      className="ball"
      ref={ballRef}
      style={{ top: `${renderY}px`, left: `${renderX}px` }}
    ></div>
  );
}

type PlayerProps = {
  player: 1 | 2;
  bindings: string[];
  playerRef: React.RefObject<HTMLDivElement | null>;
  gameAreaRef: React.RefObject<HTMLDivElement | null>;
};

function Player({ player, bindings, playerRef, gameAreaRef }: PlayerProps) {
  const className = player === 1 ? "playerOne" : "playerTwo";

  const [renderY, setRenderY] = useState(100);

  useEffect(() => {
    if (!gameAreaRef) return;

    // keep track of key presses.
    let upKeyPressed = false;
    let downKeyPressed = false;
    let animationFrame: number;

    const areaHeight = gameAreaRef.current?.getBoundingClientRect().height;
    const playerHeight = playerRef.current?.getBoundingClientRect().height;

    if (!areaHeight || !playerHeight) return;

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
        setRenderY((current) => (current > 0 ? current - 3 : current));
      }

      if (downKeyPressed) {
        setRenderY((current) =>
          current < areaHeight - playerHeight ? current + 3 : current,
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
  }, [bindings]);

  return (
    <div
      className={className}
      ref={playerRef}
      style={{ top: `${renderY}px` }}
    />
  );
}

function Game({
  playerOneBindings,
  playerTwoBindings,
}: {
  playerOneBindings: string[];
  playerTwoBindings: string[];
}) {
  const [playerOneScore, setPlayerOneScore] = useState(120);
  const [playerTwoScore, setPlayerTwoScore] = useState(40);

  const playerOneRef = useRef<HTMLDivElement>(null);
  const playerTwoRef = useRef<HTMLDivElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  return (
    <div className="game-container">
      <div className="score-container">
        <p className="score">{playerOneScore}</p>

        <p className="score">{playerTwoScore}</p>
      </div>
      <div ref={gameAreaRef} className="game-area">
        <Player
          player={1}
          bindings={playerOneBindings}
          playerRef={playerOneRef}
          gameAreaRef={gameAreaRef}
        />
        <div className="game-area-separator"></div>
        <Ball
          gameAreaRef={gameAreaRef}
          playerOneRef={playerOneRef}
          playerTwoRef={playerTwoRef}
        />
        <Player
          player={2}
          bindings={playerTwoBindings}
          playerRef={playerTwoRef}
          gameAreaRef={gameAreaRef}
        />
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
