import { useState } from "react";
import "./App.css";

type KeyBindingProps = {
  text: string;
  binding: string;
  onClick?: (value: string) => void;
};

function KeyBinding({ text, binding, onClick }: KeyBindingProps) {
  return (
    <div className="key-binding">
      <p>{text}</p>
      <p className="selected-key">{binding}</p>
      <button className="menu-button" onClick={() => onClick}>
        Change
      </button>
    </div>
  );
}

type MenuProps = {
  keyBindings: string[];
  setKeyBindings?: void;
};

function Menu({ keyBindings }: MenuProps) {
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
            <KeyBinding text="Up:" binding={keyBindings[0]} />
            <KeyBinding text="Down:" binding={keyBindings[1]} />

            <p>Player 2:</p>

            <KeyBinding text="Up:" binding={keyBindings[2]} />
            <KeyBinding text="Down:" binding={keyBindings[3]} />

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

  return (
    <>
      <Menu keyBindings={keyBindings} />
    </>
  );
}

export default App;
