import React, { useState, useEffect } from "react";
import {useInterval} from './useInterval';

const initialXPos = 0;
const initialYPos = 0;

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
  const [runTimer, setRunTimer] = useState(false);
  const [direction, setDirection]= useState("right");

  useInterval(() => {
    if (runTimer===true)
    {
      let newPos = {...Pos};
      if (direction === "right" && Pos.x < matrix[0].length)
      {
        newPos.x+= 1; 
      }

      if (direction === "right" && newPos.x >= matrix[0].length)
      {
        newPos.y+=1;
        newPos.x=matrix[0].length-1;
        setDirection("left");
      }

      if (direction === "left" && Pos.x > 0)
      {
        newPos.x-=1; 
      }

      if (direction === "left" && Pos.x === 0 )
      {
        newPos.y+= 1; 
        setDirection("right");
      }

      // stay on screen!
      if (newPos.x < 0) newPos.x=0;
      if (newPos.x >= matrix[0].length) newPos.x=matrix[0].length-1;
      if (newPos.y < 0) newPos.y=0;
      if (newPos.y >= matrix.length) newPos.y = 0;

      absMove(newPos.x, newPos.y);
    }
  }, 10);

  useEffect(()=>{
    console.log('effect is run');
    ;
  });

  // only do this when rows/cols change (i.e. only first time)
  useEffect(() => {
    console.log(`init matrix ${rows} ${cols}`);

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
      setRunTimer(true);
    }, [rows, cols]);


    function checkMatrix()
    {
      let count=0;
      for (let i=0;i<matrix.length-1; i++)
      {
        for (let j=0;j<matrix[0].length-1;j++)
        {
            if (matrix[i][j]!=='blue')
              count++;
        }
      }
      if (count>1)
      {
        console.log(`***double red!*** ${Pos.x}${Pos.y}`);
      }
    }
    // relative move from current position
    function relMove(deltaX, deltaY)
    {

      setRunTimer(false);
      if (Pos === undefined) {
          console.log("Pos is undefined!");
          return;
      }

      console.log(`moving to: ${Pos.x+deltaX}, ${Pos.y+deltaY}`);

      let newPos={x:Pos.x+deltaX, y:Pos.y+deltaY};

      if (newPos.x === Pos.x && newPos.y === Pos.y) return;
      
      console.log(`real move to: ${newPos.x}, ${newPos.y} - clear ${Pos.x} ${Pos.y}`);
      // clear current pos

      try
      {
        if (Pos.y === newPos.y)
        {
          let newRow = [...matrix[Pos.y]]; // copy  the row that changed...
          newRow[Pos.x] = "blue";          // clear the old cell in the row  
          newRow[newPos.x] = "red";           // set the new cell in the row  
          let newMatrix = [...matrix];     // replace the row in the matrix
          newMatrix[Pos.y] = newRow;
            // both changes are in the same row
            setMatrix(newMatrix);
          }
        else
        {
          // not in the same row
          // remove from old row
          let oldRow = [...matrix[Pos.y]]; // copy  the row that changed...
          oldRow[Pos.x] = "blue";          // set the cell in the row  
          let newMatrix = [...matrix];     // replace the row in the matrix
          newMatrix[Pos.y] = oldRow;
         
          let newRow = [...matrix[newPos.y]]; // copy  the row that changed...
          newRow[newPos.x] = "red";          // set the cell in the row  
          newMatrix[newPos.y] = newRow;

          setMatrix(newMatrix);

        }

        setPos(newPos);
      }
      catch (error)
      {
        alert(`invalid position ${Pos.x} ${Pos.y}`);

      }
      checkMatrix();
      setRunTimer(true);

    }

    // Absolute move to given position
    function absMove(newX, newY) {

      setRunTimer(false);
      console.log(`moving to: ${newX}, ${newY}`);

      let newPos={x:newX, y:newY};

      if (Pos === undefined) {
          console.log("Pos is undefined!");
          return;
      }
      if (newPos.x === Pos.x && newPos.y === Pos.y) return;
      
      console.log(`real move to: ${newPos.x}, ${newPos.y} - clear ${Pos.x} ${Pos.y}`);
      // clear current pos

      try
      {
        if (Pos.y === newPos.y)
        {
          console.log("clear and set on same row!");
          let newRow = [...matrix[Pos.y]]; // copy  the row that changed...
          console.log(`Clear: ${Pos.x}${Pos.y} Set: ${newPos.x}${newPos.y}`);

          newRow[Pos.x] = "blue";          // clear the old cell in the row  
          newRow[newPos.x] = "red";           // set the new cell in the row  
          let newMatrix = [...matrix];     // replace the row in the matrix
          newMatrix[Pos.y] = newRow;
            // both changes are in the same row
          setMatrix(newMatrix);

        }
        else
        {
          // not in the same row
          // remove from old row
          let oldRow = [...matrix[Pos.y]]; // copy  the row that changed...
          oldRow[Pos.x] = "blue";          // set the cell in the row  
          let newMatrix = [...matrix];     // replace the row in the matrix
          newMatrix[Pos.y] = oldRow;
          
          let newRow = [...matrix[newPos.y]]; // copy  the row that changed...
          newRow[newPos.x] = "red";          // set the cell in the row  
          newMatrix[newPos.y] = newRow;
          setMatrix(newMatrix);
        }

        setPos(newPos);
      }
      catch (error)
      {
        alert(`invalid position ${Pos.x} ${Pos.y}`);

      }

      checkMatrix();
      setRunTimer(true);

    }
  
  const onClicked = (row,col) => {
    console.log(`onClicked: ${Pos.x},${Pos.y}`);
    absMove(row, col);
  };

  useKeyPress("j", () => {
    if (Pos.x > 0) relMove(-1, 0);
  });

  useKeyPress("i", () => {
    if (Pos.y > 0) relMove(0, -1);
  });

  useKeyPress("k", () => {
    if (Pos.x < cols - 1) relMove(+1, 0);
  });

  useKeyPress("m", () => {
    if (Pos.y < rows - 1) relMove(0, 1);
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

  useKeyPress("r", () => {
    absMove(0,0);
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
