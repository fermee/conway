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
        <Grid rows="10" cells="20" cellStyle="blue"></Grid>
      </header>
    </div>
  );
}

export default App;
