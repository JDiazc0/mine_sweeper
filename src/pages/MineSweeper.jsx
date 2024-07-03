import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Grid from "../components/Grid";

/** Function to deep clone an array */
const arrayClone = (arr) => {
  return arr.map((item) => (Array.isArray(item) ? arrayClone(item) : item));
};

export default function MineSweeper() {
  const [gridFull, setGridFull] = useState(
    Array(40)
      .fill()
      .map(() => Array(40).fill("off"))
  );
  const [mineMap, setMineMap] = useState(
    Array(40)
      .fill()
      .map(() => Array(40).fill(false))
  );
  const [gridSize, setGridSize] = useState({ rows: 40, cols: 40 });
  const [difficulty, setDifficulty] = useState("easy");
  const [isFlagMode, setIsFlagMode] = useState(false);

  useEffect(() => {
    createMineMap();
  }, [gridSize, difficulty]);

  /** Function to change the grid size */
  const handleGridSize = (event) => {
    const newSize = parseInt(event.target.value);
    setGridSize({ rows: newSize, cols: newSize });
    setGridFull(
      Array(newSize)
        .fill()
        .map(() => Array(newSize).fill("off"))
    );
  };

  /** Function to change difficult */
  const handleDiffuculty = (event) => {
    const newDiffuculty = event.target.value;
    setDifficulty(newDiffuculty);
  };

  /** Function to create mine map */
  const createMineMap = () => {
    let minePercentage;
    switch (difficulty) {
      case "medium":
        minePercentage = 0.25;
        break;
      case "hard":
        minePercentage = 0.5;
        break;
      case "easy":
      default:
        minePercentage = 0.1;
        break;
    }

    const totalCells = gridSize.rows * gridSize.cols;
    const mineCount = Math.floor(totalCells * minePercentage);
    let minesPlaced = 0;
    const newMineMap = Array(gridSize.rows)
      .fill()
      .map(() => Array(gridSize.cols).fill(false));

    while (minesPlaced < mineCount) {
      const row = Math.floor(Math.random() * gridSize.rows);
      const col = Math.floor(Math.random() * gridSize.cols);

      if (!newMineMap[row][col]) {
        newMineMap[row][col] = true;
        minesPlaced++;
      }
    }

    setMineMap(newMineMap);
  };

  /** Function to change flag to mine */
  const toggleFlagMode = () => {
    setIsFlagMode(!isFlagMode);
  };

  /** Function to select one box */
  const selectBox = (row, col) => {
    const newGridFull = arrayClone(gridFull);
    if (isFlagMode) {
      newGridFull[row][col] = newGridFull[row][col] === "flag" ? "off" : "flag";
    } else {
      if (mineMap[row][col]) {
        newGridFull[row][col] = "mine";
      } else {
        const adjacentMines = countAdjacentMines(mineMap, gridSize, row, col);
        newGridFull[row][col] = adjacentMines > 0 ? adjacentMines : "void";
      }
    }
    setGridFull(newGridFull);
  };

  /** Count mines adjacents */
  const countAdjacentMines = (mineMap, gridSize, x, y) => {
    let mineCount = 0;

    const directions = [
      [-1, 0],
      [-1, -1],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, 0],
      [1, -1],
      [1, 1],
    ];

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < gridSize.rows && ny >= 0 && ny < gridSize.cols) {
        if (mineMap[nx][ny]) {
          mineCount++;
        }
      }
    }

    return mineCount;
  };

  return (
    <>
      <Navbar
        mineFlag={toggleFlagMode}
        isFlag={isFlagMode}
        gridSize={handleGridSize}
        difficult={handleDiffuculty}
      />
      <Grid
        gridFull={gridFull}
        rows={gridSize.rows}
        cols={gridSize.cols}
        selectBox={selectBox}
      />
    </>
  );
}
