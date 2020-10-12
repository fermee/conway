import React, { useRef, useEffect, useState, useCallback } from "react";

function Cell(props) {
  let color = props.theMatrix[props.rowid][props.cellid];
  // console.log(`ROW: ${props.rowid} COL:${props.cellid}: color ${color}`);
  if (props.pos[0] === props.rowid && props.cellid === props.pos[1]) {
    color = "green";
  }

  return (
    <div
      onClick={(x) => props.onCellClick(props.rowid, props.cellid)}
      className={color}
      id={props.id}
      key={props.id}
      rowid={props.rowid}
      cellid={props.cellid}
    >
      {props.children}
    </div>
  );
}

// Create a row of "cells" cells
function GridRow(props) {
  var cells = [];

  // create cells with  unique cells (id:row-col)
  for (let c = 0; c < props.cells; c++) {
    let id = props.row + "-" + c;
    let cellid = c;
    let index = [id, cellid];
    cells.push(index);
  }

  return (
    <div className="grid-row" id={props.row} key={props.row}>
      {cells.map((idx) => (
        <Cell
          id={idx[0]}
          key={idx[0]}
          rowid={props.row}
          cellid={idx[1]}
          onCellClick={props.onCellClick}
          theMatrix={props.theMatrix}
          pos={props.pos}
        >
          {idx[0]}
        </Cell>
      ))}
    </div>
  );
}

function InitMatrix(rows, cols, style) {
  // style is a CSS class, typically "red", "blue"

  let initMatrix = [];

  // create rows and start 'the matrix'
  for (let r = 0; r < rows; r++) {
    initMatrix.push([]);
    for (let c = 0; c < cols; c++) {
      // inital color=blue
      initMatrix[r].push(style);
    }
  }
  return initMatrix;
}

function ZeroInit(clmat, rows, cols) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      clmat[i][j] = "blue";
    }
  }
  return clmat;
}
// Create a grid of "#rows" rows... * #cells cells
export default function Grid(props) {
  // this is a callback for all the cells (triggered from onClick on a cell)...
  function onCellClicked(row, cell) {
    // create a clone (don't forget this or render won't work and you're changing original state)!
    let newMatrix = [...matrix];

    newMatrix[pos[0]][pos[1]] = "blue";
    let newpos = pos;

    // newpos=[row,cell] // does not fully work,
    // a render from another event resets the state to the previous position!
    newpos[0] = row;
    newpos[1] = cell;
    setPos(newpos);

    /*
    newMatrix[row][cell] === "red"
      ? (newMatrix[row][cell] = "blue")
      : (newMatrix[row][cell] = "red");
    */

    setMatrix(newMatrix);
  }

  const cbCellClicked = useCallback(
    (row, cell) => onCellClicked(row, cell),
    []
  );

  const Pressing = useKeyPress("h", ClearMatrix);
  const GoUp = useKeyPress("i", PosUp);
  const GoDown = useKeyPress("m", PosDown);
  const GoLeft = useKeyPress("j", PosLeft);
  const GoRight = useKeyPress("k", PosRight);

  function ClearMatrix() {
    console.log("state in ClearMatrix event handler:");
    let clmat = [...matrix];
    clmat = ZeroInit(clmat, matrix.length, matrix[0].length);

    setMatrix(clmat);
  }

  function useKeyPress(key, action) {
    useEffect(() => {
      function onKeyup(e) {
        if (e.key === key) action();
      }
      window.addEventListener("keyup", onKeyup);
      return () => window.removeEventListener("keyup", onKeyup); // remove listener before re-adding?
    }, []);
  }

  function PosUp() {
    let oldpos = pos;
    let newmatrix = [...matrix];

    newmatrix[oldpos[0]][oldpos[1]] = "red";
    oldpos[0] = oldpos[0] > 0 ? oldpos[0] - 1 : oldpos[0];
    setPos(oldpos);
    newmatrix[oldpos[0]][oldpos[1]] = "green";
    setMatrix(newmatrix);
  }

  function PosDown() {
    let oldpos = pos;
    let newmatrix = [...matrix];

    newmatrix[oldpos[0]][oldpos[1]] = "red";
    oldpos[0] = oldpos[0] < matrix.length - 1 ? oldpos[0] + 1 : oldpos[0];
    setPos(oldpos);
    newmatrix[oldpos[0]][oldpos[1]] = "green";
    setMatrix(newmatrix);
  }

  function PosLeft() {
    let oldpos = pos;
    let newmatrix = [...matrix];
    newmatrix[oldpos[0]][oldpos[1]] = "red";
    oldpos[1] = oldpos[1] > 0 ? oldpos[1] - 1 : oldpos[1];
    setPos(oldpos);
    newmatrix[oldpos[0]][oldpos[1]] = "green";
    setMatrix(newmatrix);
  }

  function PosRight() {
    let oldpos = pos;
    let newmatrix = [...matrix];

    newmatrix[oldpos[0]][oldpos[1]] = "red";
    oldpos[1] = oldpos[1] < 49 ? oldpos[1] + 1 : oldpos[1];
    setPos(oldpos);
    newmatrix[oldpos[0]][oldpos[1]] = "green";
    setMatrix(newmatrix);
  }

  function useTraceUpdate(props) {
    const prev = useRef(props);
    useEffect(() => {
      const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
        if (prev.current[k] !== v) {
          ps[k] = [prev.current[k], v];
        }
        return ps;
      }, {});
      if (Object.keys(changedProps).length > 0) {
        console.log("Changed props:", changedProps);
      }
      prev.current = props;
    });
  }

  let rows = [];

  // create rows and start 'the matrix'
  for (let r = 0; r < props.rows; r++) {
    rows.push(r);
  }

  const [matrix, setMatrix] = useState(
    InitMatrix(props.rows, props.cells, props.cellStyle)
  );

  const [pos, setPos] = useState([10, 10]);

  return (
    <div className="brick-grid" id={props.id} key={props.id}>
      {rows.map((i) => (
        <GridRow
          className="grid-row"
          id={i}
          key={i}
          row={i}
          onCellClick={cbCellClicked}
          cells={props.cells}
          theMatrix={matrix}
          pos={pos}
        ></GridRow>
      ))}
    </div>
  );
}
