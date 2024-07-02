import React from "react";

function Box(props) {
  const { boxClass, id, row, col, selectBox } = props;

  const handleClick = () => {
    selectBox(row, col);
  };

  return <div className={boxClass} id={id} onClick={handleClick} />;
}

export default function Grid(props) {
  const { cols, gridFull, selectBox } = props;
  const width = cols * 20;

  const getBoxClass = (state) => {
    switch (state) {
      case "one":
        return "box one";
      case "two":
        return "box two";
      case "three":
        return "box three";
      case "four":
        return "box four";
      case "five":
        return "box five";
      case "six":
        return "box six";
      case "seven":
        return "box seven";
      case "eight":
        return "box eight";
      case "void":
        return "box void";
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
