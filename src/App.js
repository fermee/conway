import React from "react";
import Grid from "./Grid";
import "./App.css";

function App() {
  /*
  function ClearAll() {
    console.log("button clicked");
  }


      <button onClick={ClearAll}>clear</button>

  */

  return (
    <div className="App">
      <header className="playfield">
        <Grid rows="20" cells="50" cellStyle="blue"></Grid>
      </header>
    </div>
  );
}

export default App;
