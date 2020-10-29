import React  from "react";
import "./Header.css";


export default function Header({running, alive, generation, speed, onStartStop, onChange, onReset}) {

    return (
        <div className="header">
                <h1 className="title">Conway "Game of Life"</h1>
                <table className="headerTable">
                    <tr>
                        <td className="stats">Total cells alive: {alive}</td>
                        <td>              
                            <span className="stats">Speed (ms):</span><input value={speed} onChange = {onChange}></input>
                        </td>
                    </tr>
                    <tr>
                        <td className="stats">Generation: {generation}</td>
                        <td>
                            <button onClick={onStartStop}>{running?"stop":"run"}</button>
                            <button onClick={onReset}>reset</button>
                        </td>
                    </tr>
                </table>
        </div>
      );
}
