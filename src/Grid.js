import React, { useCallback, useState, useEffect } from "react";
import {useInterval} from './useInterval';
import "./Grid.css";
import Header from './Header';

const glider=[[0,1],[1,0],[2,0],[2,1],[2,3]];

export default function Grid({rows,cols}) {

  const [matrix, setMatrix] = useState([]);
  const [runTimer, setRunTimer] = useState(false);
  const [totalAlive, setTotalAlive]=useState(0);
  const [speed, setSpeed] = useState(500); // 500 ms - comes from input
  const [generation, setGeneration] = useState(0);

  useInterval(() => {
    if (runTimer===true)
    {
      // copy existing matrix
      let updMatrix= new Array(rows)
      .fill(0)
      .map((_, row) =>
        new Array(cols)
          .fill(0)
          .map((_, col) =>
             matrix[row][col]
          )
      );

      // Count our neighbors for each cell
      let allAlive=0;
      for (let r=0; r<matrix.length; r++)
      {
        for (let c=0; c<matrix[0].length; c++)
        {
          let alive=0;
          if (matrix[r][c]==='red')
          {
            allAlive++;
          }

          // 'count my neighbors'
          for (let nr=r-1;nr<=r+1;nr++)
          {
            for (let nc=c-1;nc<=c+1;nc++)
            {
              // nnr and nnc cater for border-situations 
              // - we connect opposite borders to have a 'unbounded' field, it's more interesting
              let nnr=nr;
              let nnc=nc;

              if (nnr<0) nnr=matrix.length-1;
              if (nnr>=matrix.length) nnr=0;

              if (nnc<0) nnc=matrix[0].length-1;
              if (nnc>=matrix[0].length) nnc=0;


              // red but not 'myself'
              if (matrix[nnr][nnc]==='red' && (nnr!==r || nnc !== c))
              {     
                  alive++;
              }

            }
          }

          // the rule B3/S23 live or die...
          if (alive <2 || alive >3) 
          {
              updMatrix[r][c]='blue';   // ie.e not S23
          }
          if (alive===3) 
          {
            updMatrix[r][c]='red'; // always alive B3 or S3
          }
        }
      }
      setMatrix(updMatrix);
      setTotalAlive(allAlive);
      setGeneration(generation+1);
    }
  }, speed);


  const newMatrix= useCallback (()=>{
   
    const initMatrix = new Array(rows)
      .fill(0)
      .map((_, row) =>
        new Array(cols)
          .fill(0)
          .map((_, col) =>
             Math.random()>0.80 ? "red" : "blue"
          )
      );

      return initMatrix;
  },[rows,cols]) ;
  
  
  // only do this when rows/cols change (i.e. only first time)
  useEffect(() => {
    console.log(`init matrix ${rows} ${cols}`);
      setMatrix(newMatrix());
    }, [rows, cols, newMatrix]);

  const onChange = event => setSpeed(event.target.value);
  const onReset = () => {setMatrix(newMatrix()) ; setGeneration(0)};
  const onStartStop = ()=>{
      setRunTimer(!runTimer); 
    };


  return (
    <div className="grid">
      <Header running={runTimer} alive={totalAlive} speed={speed} generation={generation} onChange={onChange} onReset={onReset} onStartStop={onStartStop}></Header>
      <br></br>
      {matrix.map((row, rowidx) => (
        <div className="grid-row" key={rowidx}>
          {row.map((cell, colidx) => (
            <div
              key={rowidx + "-" + colidx}
              className={cell}
            >
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
