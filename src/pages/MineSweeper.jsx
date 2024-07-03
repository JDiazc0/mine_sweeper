import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Grid from "../components/Grid";

/** Function to deep clone an array */
const arrayClone = (arr) => {
  return arr.map((item) => (Array.isArray(item) ? arrayClone(item) : item));
};

/** directions neighbor */
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
  const [gameOver, setGameOver] = useState(false);

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
  const createMineMap = useCallback(() => {
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
  }, [difficulty, gridSize]);

  useEffect(() => {
    createMineMap();
  }, [gridSize, difficulty, createMineMap]);

  /** Function to restart game */
  const restartGame = () => {
    setGameOver(false);
    setGridFull(
      Array(gridSize.rows)
        .fill()
        .map(() => Array(gridSize.cols).fill("off"))
    );
    createMineMap();
  };

  /** Function to change flag to mine */
  const toggleFlagMode = () => {
    setIsFlagMode(!isFlagMode);
  };

  /** Function to open neighbors */
  const openNeighbors = (grid, row, col) => {
    for (const [dx, dy] of directions) {
      const nx = row + dx;
      const ny = col + dy;

      if (nx >= 0 && nx < gridSize.rows && ny >= 0 && ny < gridSize.cols) {
        if (grid[nx][ny] === "off") {
          if (mineMap[nx][ny]) {
            grid[nx][ny] = "mine";
            setGameOver(true);
          } else {
            const adjacentMines = countAdjacentMines(mineMap, gridSize, nx, ny);
            grid[nx][ny] = adjacentMines > 0 ? adjacentMines : "void";
            if (grid[nx][ny] === "void") {
              openNeighbors(grid, nx, ny);
            }
          }
        }
      }
    }
  };

  /**Function to count mines adjacent */
  const countAdjacentMines = (mineMap, gridSize, x, y) => {
    return countDirections(
      gridSize,
      directions,
      0,
      x,
      y,
      (nx, ny) => mineMap[nx][ny]
    );
  };

  /** Function to count flags aroubd box */
  const countFlagsAround = (row, col) => {
    return countDirections(
      gridSize,
      directions,
      0,
      row,
      col,
      (nx, ny) => gridFull[nx][ny] === "flag"
    );
  };

  /** Auxiliar function to count directions */
  const countDirections = (gridSize, directions, counter, x, y, condition) => {
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < gridSize.rows && ny >= 0 && ny < gridSize.cols) {
        if (condition(nx, ny)) {
          counter++;
        }
      }
    }

    return counter;
  };

  /** Function to select one box */
  const selectBox = (row, col) => {
    if (gameOver) return;

    const newGridFull = arrayClone(gridFull);

    if (
      isFlagMode &&
      (newGridFull[row][col] === "off" || newGridFull[row][col] === "flag")
    ) {
      newGridFull[row][col] = newGridFull[row][col] === "flag" ? "off" : "flag";
    } else {
      if (mineMap[row][col]) {
        newGridFull[row][col] = "mine";
        setGameOver(true);
      } else {
        const adjacentMines = countAdjacentMines(mineMap, gridSize, row, col);
        if (
          typeof newGridFull[row][col] === "number" &&
          countFlagsAround(row, col) === newGridFull[row][col]
        ) {
          openNeighbors(newGridFull, row, col);
        } else {
          newGridFull[row][col] = adjacentMines > 0 ? adjacentMines : "void";
          if (newGridFull[row][col] === "void") {
            openNeighbors(newGridFull, row, col);
          }
        }
      }
    }
    setGridFull(newGridFull);
  };

  return (
    <>
      <Navbar
        mineFlag={toggleFlagMode}
        isFlag={isFlagMode}
        restartButton={restartGame}
        isLose={gameOver}
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
