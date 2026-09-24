import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import "./App.css";

type KeyBindingElementProps = {
  player: number;
  text: string;
  binding: string;
  index: number;
  changeKeyBinding: (index: number, binding: string) => void;
};

function KeyBindingElement({
  player,
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
};

function Menu({ keyBindingData }: MenuProps) {
  const [menu, setMenu] = useState("main-menu");

  const playerOneComponents = keyBindingData.filter(
    (component) => component.player === 1,
  );
  const playerTwoComponents = keyBindingData.filter(
    (component) => component?.player === 2,
  );

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
            <button className="menu-button">Play</button>
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

function App() {
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

  return (
    <>
      <Menu keyBindingData={keyBindingData} />
    </>
  );
}

export default App;
