import React, { useState, useCallback } from "react";

function Cell(props) {
  // color of cell depends on the className (so that's the state of "this" brick)
  //const [style, setStyle] = useState("blue");

  // now we have props.theMatrix..

  //console.log(`in Cell: ${props.rowid - 1} ${props.cellid - 1}`);

  let color = props.theMatrix[props.rowid][props.cellid];
  // console.log(`ROW: ${props.rowid} COL:${props.cellid}: color ${color}`);

  //  console.log(props.id + ":" + style);
  return (
    <div
      // onChildClick is defindd on the App level (as a start to lift up style to a matrix)
      // big question is this the right approach?
      onClick={(x) => props.onCellClick(props.rowid, props.cellid)}
      className={color}
      id={props.id}
      rowid={props.rowid}
      cellid={props.cellid}
    />
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
  // trying to 'lift up state! (and change single cell to matrix)'
  function onCellClicked(row, cell) {
    // create a clone!
    let newMatrix = matrix.map((x) => x);

    console.log(`callback BEFORE: ${newMatrix[row][cell]}`);

    if (newMatrix[row][cell][0] === "red") {
      // not quite sure why [0] is needed here...
      // i can see that n[x][y] is ["blue"], i'm guessing i am 1 level too deep
      newMatrix[row][cell] = ["blue"];
    } else {
      newMatrix[row][cell] = ["red"];
      if (row >= 1 && cell >= 1) {
        newMatrix[row - 1][cell - 1] = ["red"];
      }
    }

    console.log(`callback AFTER: ${newMatrix[row][cell]}`);

    setMatrix(newMatrix);
  }

  const cbCellClicked = useCallback(
    (row, cell) => onCellClicked(row, cell),
    []
  );

  let rows = [],
    r = 0;

  let initMatrix = [];

  // create rows and start 'the matrix'
  while (r < props.rows) {
    rows.push(r);
    initMatrix.push([]);
    let c = 0;
    while (c < props.cells) {
      // add cellsA
      //      console.log("process row" + r);
      initMatrix[r].push(["blue"]);
      c++;
    }
    r++;
  }

  const [matrix, setMatrix] = useState(initMatrix);

  return (
    <div className="brick-grid" id={props.id} key={props.id}>
      {rows.map((i) => (
        <GridRow
          className="grid-row"
          key={i}
          row={i}
          onCellClick={cbCellClicked}
          cells={props.cells}
          cellStyle={props.cellStyle}
          theMatrix={matrix}
        ></GridRow>
      ))}
    </div>
  );
}
