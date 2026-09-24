import {useState, useEffect} from "react";

type KeyBindingElementProps = {
  player: number;
  text: string;
  binding: string;
  index: number;
  changeKeyBinding: (index: number, binding: string) => void;
};

function KeyBindingElement({
  text,
  binding,
  index,
  changeKeyBinding,
}: KeyBindingElementProps) {
  // is waiting for key?..
  const [isWaitingForKey, setIsWaitingForKey] = useState(false);

  const handleChange = () => {
    setIsWaitingForKey(true);
  };

  useEffect(() => {
    if (!isWaitingForKey) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      changeKeyBinding(index, event.key);
      setIsWaitingForKey(false);
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isWaitingForKey]);

  return (
    <div className="key-binding-container">
      <p>{text}</p>
      <button className="menu-button" onClick={handleChange}>
        {isWaitingForKey ? "Enter a key..." : binding}
      </button>
    </div>
  );
}

type KeyBindingData = {
  player: number;
  text: string;
  binding: string;
  changeKeyBinding: (index: number, binding: string) => void;
  index: number;
};

type MenuProps = {
  keyBindingData: KeyBindingData[];
  startGame: () => void;
};

function Menu({ keyBindingData, startGame }: MenuProps) {
  const [menu, setMenu] = useState("main-menu");

  // Component arrays for each of the players...
  const playerOneComponents = keyBindingData.filter(
    (component) => component.player === 1,
  );
  const playerTwoComponents = keyBindingData.filter(
    (component) => component?.player === 2,
  );

  // navigation functions...
  const moveToConfiguration = () => {
    setMenu("config-menu");
  };

  const moveToAbout = () => {
    setMenu("about");
  };

  return (
    <>
      <div className="main-menu">
        <p className="title">Pong</p>

        {menu === "main-menu" && (
          <div className="main-menu-buttons">
            <button className="menu-button" onClick={startGame}>Play</button>
            <button className="menu-button" onClick={moveToConfiguration}>
              Configuration
            </button>
            <button className="menu-button" onClick={moveToAbout}>
              About
            </button>
          </div>
        )}

        {menu === "config-menu" && (
          <div className="config-menu">
            <p>Player 1:</p>

            {/* render player one key binding elements */}
            {playerOneComponents.map((data) => (
              <KeyBindingElement
                key={data.index}
                player={data.player}
                text={data.text}
                binding={data.binding}
                index={data.index}
                changeKeyBinding={data.changeKeyBinding}
              />
            ))}

            <p>Player 2:</p>

            {/* render player two key binding elements */}
            {playerTwoComponents.map((data) => (
              <KeyBindingElement
                key={data.index}
                player={data.player}
                text={data.text}
                binding={data.binding}
                index={data.index}
                changeKeyBinding={data.changeKeyBinding}
              />
            ))}

            <button
              className="menu-button config-back"
              onClick={() => setMenu("main-menu")}
            >
              Back
            </button>
          </div>
        )}

        {menu === "about" && (
          <>
            <p>...</p>
            <button
              className="menu-button"
              onClick={() => setMenu("main-menu")}
            >
              Back
            </button>
          </>
        )}
      </div>
    </>
  );
}

export { Menu };