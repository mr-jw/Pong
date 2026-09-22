import { useState } from "react";
import "./App.css";

function App() {
  const [playerOneUpKey, setPlayerOneUpKey] = useState("w");
  const [playerOneDownKey, setPlayerOneDownKey] = useState("s");

  const [playerTwoUpKey, setPlayerTwoUpKey] = useState("p");
  const [playerTwoDownKey, setPlayerTwoDownKey] = useState("l");

  const [menu, setMenu] = useState("main-menu");

  const moveToConfiguration = () => {
    setMenu("config-menu");
    console.log(menu);
  };

  const moveToAbout = () => {
    setMenu("about");
  }

  return (
    <>
      <div className="main-menu">
        <p className="title">Pong</p>

        {menu === "main-menu" && (
          <div className="menu-buttons">
            <button className="menu-button">Play</button>
            <button className="menu-button" onClick={moveToConfiguration}>
              Configuration
            </button>
            <button className="menu-button" onClick={moveToAbout}>About</button>
          </div>
        )}

        {menu === "config-menu" && (
          <div className="menu-buttons">
            <p>Player 1:</p>
            <div className="key-binding">
              <p>Assigned Key: {playerOneUpKey}</p>
              <button className="menu-button">Change</button>
            </div>
            
             <div className="key-binding">
              <p>Assigned Key: {playerOneDownKey}</p>
              <button className="menu-button">Change</button>
            </div>
           
            <p>Player 2:</p>
           
            <div className="key-binding">
              <p>Assigned Key: {playerTwoUpKey}</p>
              <button className="menu-button">Change</button>
            </div>

             <div className="key-binding">
              <p>Assigned Key: {playerTwoDownKey}</p>
              <button className="menu-button">Change</button>
            </div>

            <button className="menu-button" onClick={() => setMenu("main-menu")}>Back</button>
          </div>

          
        )}

        {menu === 'about' && (
          <>
            <p>...</p>
            <button className="menu-button" onClick={() => setMenu("main-menu")}>Back</button>
          </>
          )}
      </div>
    </>
  );
}

export default App;
