import React, { useState, useEffect } from "react";

const initialXPos = 5;
const initialYPos = 5;

const useKeyPress = (key, action) => {
  useEffect(() => {
  function onKeyup(e) {
    if (e.key === key) action();
    }
    window.addEventListener("keyup", onKeyup);
    return () => window.removeEventListener("keyup", onKeyup);
    }, [key, action]); // important or the state won't update correctly!
  };

export default function Grid({rows,cols}) {

  const [Pos, setPos] = useState({x: initialXPos, y: initialYPos});
  const [matrix, setMatrix] = useState([]);

  // only do this when rows/cols change (i.e. only first time)
  useEffect(() => {
    const initMatrix = new Array(rows)
      .fill(0)
      .map((_, row) =>
        new Array(cols)
          .fill(0)
          .map((_, col) =>
            col === initialXPos && row === initialYPos ? "red" : "blue"
          )
      );
      setMatrix(initMatrix);
    }, [rows, cols]);


    function moveTo(newX, newY) {

      let newPos={x:newX, y:newY};

      if (newPos.x === Pos.x && newPos.y === Pos.y) return;
      console.log(`moving to: ${newPos.x}, ${newPos.y}`);
      // clear current pos
      let newRow = [...matrix[Pos.y]]; // copy  the row that changed...
      newRow[Pos.x] = "green";          // set the cell in the row  
      let newMatrix = [...matrix];     // replace the row in the matrix
      newMatrix[Pos.y] = newRow;

      // set new pos
      newRow = [...newMatrix[newPos.y]];
      newRow[newPos.x] = "red";
      newMatrix = [...newMatrix];
      newMatrix[newPos.y] = newRow;

      setPos(newPos);
      setMatrix(newMatrix);
    }
  
  const onClicked = (row,col) => {
    console.log(`onClicked: ${Pos.x},${Pos.y}`);
    moveTo(row, col);
  };

  useKeyPress("j", () => {
    if (Pos.x > 0) moveTo(Pos.x - 1, Pos.y);
  });

  useKeyPress("i", () => {
    if (Pos.y > 0) moveTo(Pos.x, Pos.y - 1);
  });

  useKeyPress("k", () => {
    if (Pos.x < cols - 1) moveTo(Pos.x + 1, Pos.y);
  });

  useKeyPress("m", () => {
    if (Pos.y < rows - 1) moveTo(Pos.x, Pos.y + 1);
  });

  const ClearAll = () => {
    const cleanMatrix = new Array(rows)
    .fill(0)
    .map((_, row) =>
      new Array(cols)
        .fill(0)
        .map((_, col) =>
          col === Pos.x && row === Pos.y ? "red" : "blue"
        )
    );
    setMatrix(cleanMatrix);
  }

  useKeyPress("c", () => {
    ClearAll();
  });

  return (
    <div className="grid">
      {matrix.map((row, rowidx) => (
        <div className="grid-row" key={rowidx}>
          {row.map((cell, colidx) => (
            <div
              key={rowidx + "-" + colidx}
              className={cell}
              onClick={(x) => onClicked(colidx, rowidx)}
            >
              {colidx},{rowidx}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
