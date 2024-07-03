import React from "react";
import "../utils/styles/Grid.css";

function Box(props) {
  const { boxClass, id, row, col, selectBox, value } = props;

  const handleClick = () => {
    selectBox(row, col);
  };

  return (
    <div className={boxClass} id={id} onClick={handleClick}>
      {value !== "off" &&
      value !== "void" &&
      value !== "mine" &&
      value !== "flag"
        ? value
        : ""}
    </div>
  );
}

export default function Grid(props) {
  const { cols, gridFull, selectBox } = props;
  const width = cols * 20;

  const getBoxClass = (state) => {
    if (typeof state === "number") {
      return `box number-${state}`;
    }
    switch (state) {
      case "void":
        return "box void";
      case "mine":
        return "box mine";
      case "flag":
        return "box flag";
      case "off":
      default:
        return "box off";
    }
  };

  const rowsArr = gridFull.map((rowArr, rowIdx) =>
    rowArr.map((item, colIdx) => (
      <Box
        boxClass={getBoxClass(gridFull[rowIdx][colIdx])}
        key={`${rowIdx}_${colIdx}`}
        id={`${rowIdx}_${colIdx}`}
        row={rowIdx}
        col={colIdx}
        selectBox={selectBox}
        value={gridFull[rowIdx][colIdx]}
      />
    ))
  );

  return (
    <>
      <div className="super">
        <div className="grid" style={{ width }}>
          {rowsArr}
        </div>
      </div>
    </>
  );
}
