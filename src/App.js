import React from "react";
import Grid from "./Grid";
import "./App.css";

function App() {

  return (
    <div className="App">
      <header className="playfield">
        <Grid rows={30} cols={80} cellStyle="blue"></Grid>
      </header>
    </div>
  );
}

export default App;
