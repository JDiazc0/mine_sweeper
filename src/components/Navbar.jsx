import React from "react";
import "../utils/styles/Navbar.css";

export default function Navbar(props) {
  const { restartButton, mineFlag, isFlag, gridSize, difficult } = props;

  const handleSelectGrid = (event) => {
    gridSize(event);
  };

  const handleDifficult = (event) => {
    difficult(event);
  };

  return (
    <>
      <header className="header">
        <nav className="nav">
          <h2 className="title">Minesweeper</h2>
          <ul className="nav-ul">
            <li className="nav-ul-li">
              <button className="btn" onClick={restartButton}>
                Restart
              </button>
            </li>
            <li className="nav-ul-li">
              <button className="btn" onClick={mineFlag}>
                {isFlag ? "Flag" : "Mine"}
              </button>
            </li>
            <li className="nav-ul-li">
              <select
                className="select"
                onChange={handleSelectGrid}
                defaultValue="40">
                <option value="40">40 * 40</option>
                <option value="50">50 * 50</option>
                <option value="60">60 * 60</option>
              </select>
            </li>
            <li className="nav-ul-li">
              <select
                className="select"
                onChange={handleDifficult}
                defaultValue="easy">
                <option value="easy"> Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
