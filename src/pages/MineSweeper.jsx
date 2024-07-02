import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Grid from "../components/Grid";

export default function MineSweeper() {
  const [gridFull, setGridFull] = useState(
    Array(40)
      .fill()
      .map(() => Array(20).fill("void"))
  );
  const [gridSize, setGridSize] = useState({ rows: 40, cols: 40 });

  return (
    <>
      <Navbar />
      <Grid
        gridFull={gridFull}
        rows={gridSize.rows}
        cols={gridSize.cols}
        selectBox={() => {}}
      />
    </>
  );
}
