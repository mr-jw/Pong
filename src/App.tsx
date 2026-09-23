import { useState } from "react";
import "./App.css";

type MenuProps = {
  keyBindings: string[];
  setKeyBindings?: void;
};

function Menu( {keyBindings}: MenuProps) {
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
            <div className="key-binding">
              <p>Up: <span className="key">{keyBindings[0]}</span></p>
              <button className="menu-button">Change</button>
            </div>

            <div className="key-binding">
              <p>Down: <span className="key">{keyBindings[1]}</span></p>
              <button className="menu-button">Change</button>
            </div>

            <p>Player 2:</p>

            <div className="key-binding">
              <p>Up: <span className="key">{keyBindings[2]}</span></p>
              <button className="menu-button">Change</button>
            </div>

            <div className="key-binding">
              <p>Down: <span className="key">{keyBindings[3]}</span></p>
              <button className="menu-button">Change</button>
            </div>

            <button
              className="menu-button"
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
    'w', 'a', 'p', 'l'
  ]);

  return (
    <>
      <Menu keyBindings={keyBindings} />
    </>
  );
}

export default App;
