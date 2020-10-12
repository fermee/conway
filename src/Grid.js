import React, { useState, setState } from "react";

function Cell(props) {
  // color of cell depends on the className (so that's the state of "this" brick)
  const [style, setStyle] = useState("blue");

  //  console.log(props.id + ":" + style);
  return (
    <div
      // onChildClick is defindd on the App level (as a start to lift up style to a matrix)
      // big question is this the right approach?
      onClick={(x) => props.onCellClick(style, setStyle)}
      className={style}
      id={props.id}
      key={props.key}
    />
  );
}

// Create a row of "cells" cells
function GridRow(props) {
  var cells = [],
    c = 0;

  // create cells with  unique cells (id:row-col)
  while (++c <= props.cells) {
    let id = props.row + "-" + c;
    cells.push(id);
  }

  cells.map((id) => id);

  return (
    <div className="grid-row" id={props.row} key={props.row}>
      {cells.map((xy) => (
        <Cell id={xy} key={xy} onCellClick={props.onCellClick}>
          {xy}
        </Cell>
      ))}
    </div>
  );
}

// Create a grid of "#rows" rows... * #cells cells
export default function Grid(props) {
  let rows = [],
    r = 0,
    len = props.rows;

  let initMatrix = [];

  // create rows and start 'the matrix'
  while (++r <= len) {
    rows.push(r);
    initMatrix.push([]);
    while (++c <= props.cells) {
      // add cellsA
      console.log("process row" + r);
      initMatrix[r].push([blue]);
    }
  }

  [matrix, setMatrix] = useState([initMatrix]);

  return (
    <div className="brick-grid" id={props.id} key={props.id}>
      {rows.map((i) => (
        <GridRow
          className="grid-row"
          key={i}
          row={i}
          onCellClick={props.onCellClick}
          cells={props.cells}
          cellStyle={props.cellStyle}
        ></GridRow>
      ))}
    </div>
  );
}
