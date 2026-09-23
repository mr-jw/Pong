import { useEffect, useState } from "react";
import "./App.css";

type KeyBindingProps = {
  text: string;
  binding: string;
  index: number;
  changeKeyBinding: (index: number, binding: string) => void;
};

function KeyBinding({
  text,
  binding,
  index,
  changeKeyBinding,
}: KeyBindingProps) {
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
    <div className="key-binding">
      <p>{text}</p>
      <button className="menu-button" onClick={handleChange}>
        {isWaitingForKey ? 'Enter a key...' : binding}
      </button>
    </div>
  );
}

type MenuProps = {
  keyBindings: string[];
  changeKeyBinding: (index: number, binding: string) => void;
};

function Menu({ keyBindings, changeKeyBinding }: MenuProps) {
  const [menu, setMenu] = useState("main-menu");

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
            <KeyBinding
              text="Up:"
              binding={keyBindings[0]}
              changeKeyBinding={changeKeyBinding}
              index={0}
            />
            <KeyBinding
              text="Down:"
              binding={keyBindings[1]}
              changeKeyBinding={changeKeyBinding}
              index={1}
            />

            <p>Player 2:</p>

            <KeyBinding
              text="Up:"
              binding={keyBindings[2]}
              changeKeyBinding={changeKeyBinding}
              index={2}
            />
            <KeyBinding
              text="Down:"
              binding={keyBindings[3]}
              changeKeyBinding={changeKeyBinding}
              index={3}
            />

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

  return (
    <>
      <Menu keyBindings={keyBindings} changeKeyBinding={changeKeyBinding} />
    </>
  );
}

export default App;
