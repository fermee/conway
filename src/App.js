import React, { useEffect, useCallback } from "react";
import Grid from "./Grid";
import "./App.css";

function ClearAll() {
  console.log("button clicked");
}

// this is a callback for all the cells (triggered from onClick on a cell)...
// trying to 'lift up state! (and change single cell to matrix)'
function onCellClicked(style, setStyle) {
  console.log("apps/cell callback:" + style);
  style === "red" ? setStyle("blue") : setStyle("red");
}

function useKeypress(key, action) {
  useEffect(() => {
    function onKeyup(e) {
      if (e.key === key) action();
    }
    window.addEventListener("keyup", onKeyup);
    return () => window.removeEventListener("keyup", onKeyup); // remove listener before re-adding?
  }, []);
}

function App() {
  const cbCellClicked = useCallback(
    // push it down (to get it back up???)
    (style, sets) => onCellClicked(style, sets),
    []
  );

  return (
    <div className="App">
      <button onClick={ClearAll}>clear</button>
      <header className="playfield">
        <Grid
          rows="15"
          cells="40"
          onCellClick={cbCellClicked}
          cellStyle="blue"
        ></Grid>
      </header>
    </div>
  );
}

export default App;
