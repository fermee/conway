import React, { useRef, useEffect, useState, useCallback } from "react";

function Cell(props) {
  let color = props.theMatrix[props.rowid][props.cellid];
  // console.log(`ROW: ${props.rowid} COL:${props.cellid}: color ${color}`);

  console.log(`Cell: ${props.xpos} ${props.ypos}`);

  if (props.ypos === props.rowid && props.cellid === props.xpos) {
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
          xpos={props.xpos}
          ypos={props.ypos}
        >
          {idx[0]}
        </Cell>
      ))}
    </div>
  );
}




// Create a grid of "#rows" rows... * #cells cells
export default function Grid(props) {
  // this is a callback for all the cells (triggered from onClick on a cell)...
  function onCellClicked(row, cell) {
    // create a clone (don't forget this or render won't work and you're changing original state)!
    let newMatrix = [...matrix];
    console.log(`onCellClick: ${row} ${cell}`);
    newMatrix[row][cell] = "red";
    
    // a render from another event resets the state to the previous position!
    setXPos(cell);
    setYPos(row);

    /*
    newMatrix[row][cell] === "red"
      ? (newMatrix[row][cell] = "blue")
      : (newMatrix[row][cell] = "red");
    */

    setMatrix(newMatrix);
  }

  function Move() {
    console.log("Move It!");

    let direction = Math.floor(Math.random() * 4);
    switch (direction) {
      case 0:
        PosUp();
        break;
      case 1:
        PosDown();
        break;
      case 2:
        PosLeft();
        break;
      case 3:
        PosRight();
        break;
      default:
        break;
    }
  }

  /*
  useEffect(() => {
    const interval = setInterval(() => {
      Move();
    }, 50);
    return () => clearInterval(interval);
  }, []);
*/

  const cbCellClicked = useCallback(
    (row, cell) => onCellClicked(row, cell),
    []
  );

  const Pressing = useKeyPress("h", ClearMatrix);
  const GoUp = useKeyPress("i", PosUp);
  const GoDown = useKeyPress("m", PosDown);
  const GoLeft = useKeyPress("j", PosLeft);
  const GoRight = useKeyPress("k", PosRight);

  // the field...
  const initMatrix = InitMatrix(props.rows, props.cells, "blue") ;

  function InitMatrix(rows, cols, style) {

    // create rows and start 'the matrix'
    for (let r = 0; r < rows; r++) {
      initMatrix.push([]);
      for (let c = 0; c < cols; c++) {
        // inital color=blue
        initMatrix[r].push(style);
      }
    }
  }
  

  function ClearMatrix() {
    console.log("state in ClearMatrix event handler:");
    setMatrix(initMatrix);
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
    let newmatrix = [...matrix];

    newmatrix[xpos][ypos] = "red";
    setMatrix(newmatrix);
    ypos > 0 ? setYPos(ypos - 1) : setYPos(ypos);
  }

  function PosDown() {
    let newmatrix = [...matrix];

    newmatrix[ypos][xpos] = "red";
    setMatrix(newmatrix);
    ypos < matrix.length - 1 ? setYPos(ypos + 1) : setYPos(ypos);
  }

  function PosLeft() {
    let newmatrix = [...matrix];

    newmatrix[ypos][xpos] = "red";
    setMatrix(newmatrix);
    xpos > 0 ? setXPos(xpos - 1) : setXPos(xpos);
  }

  function PosRight() {
    let newmatrix = [...matrix];
    newmatrix[ypos][xpos] = "red";
    setMatrix(newmatrix);
    xpos < 49 ? setXPos(xpos + 1) : setXPos(xpos);
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

  // initial state
  const [matrix, setMatrix] = useState(initMatrix);
  
  const [xpos, setXPos] = useState(5);
  const [ypos, setYPos] = useState(5);

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
          xpos={xpos}
          ypos={ypos}
        ></GridRow>
      ))}
    </div>
  );
}
