import { useState } from "react";
import DayOne from "./days/day-1/DayOne.jsx";
import DayTwo from "./days/day-2/DayTwo.jsx";
import DayThree from "./days/day-3/DayThree.jsx";

function App() {
  const [day, setDay] = useState(3);
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">
          <span>JS</span>
          <small>REACT LAB</small>
        </div>
        <div className="day-marker">
          <span className="status-dot" /> DAILY KRA
        </div>
        <nav aria-label="Lesson days">
          <button
            className={day === 1 ? "nav-item active" : "nav-item"}
            onClick={() => setDay(1)}
          >
            <span>01</span> Core &amp; scope
          </button>
          <button
            className={day === 2 ? "nav-item active" : "nav-item"}
            onClick={() => setDay(2)}
          >
            <span>02</span> Product catalog
          </button>
                    <button
            className={day === 3 ? "nav-item active" : "nav-item"}
            onClick={() => setDay(3)}
          >
            <span>03</span> Market feed
          </button>
        </nav>
        <div className="sidebar-foot">
          <small>NEXT UP</small>
          <strong>
            {day === 1 ? "React state + props" : day === 2 ? "useEffect patterns" : "Array transformations"}
          </strong>
          <span>Keep the data flow moving.</span>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <span>DAILY KRA / {day === 1 ? "03—09—2026" : day === 2 ? "04—09—2026" : "05—09—2026"}</span>
          <span>
            <i /> Completed <b>{day === 1 ? "4.5h" : day === 2 ? "5.0h" : "3.5h"}</b>
          </span>
        </header>
        {day === 1 ? <DayOne /> : day === 2 ? <DayTwo /> : <DayThree />}
      </main>
    </div>
  );
}

export default App;
