import { useState } from "react";

export default function DayOne() {
  const [example, setExample] = useState("declaration");
  const [hoisted, setHoisted] = useState(false);
  const [traced, setTraced] = useState(false);
  const examples = {
    declaration: [
      "function greet() {",
      '  return "hello";',
      "}",
      "Available before its line runs. The declaration is stored during creation.",
    ],
    expression: [
      "const greet = function() {",
      '  return "hello";',
      "};",
      "The binding exists, but its function value arrives when execution reaches the line.",
    ],
    arrow: [
      "const greet = () => {",
      '  return "hello";',
      "};",
      "An arrow is an expression and keeps the lexical this from its surrounding scope.",
    ],
  };
  const current = examples[example];
  return (
    <>
      <section className="lesson-hero">
        <div>
          <p className="eyebrow">DAY 01 / JAVASCRIPT CORE</p>
          <h1>
            See what JavaScript
            <br />
            <em>knows, and when.</em>
          </h1>
          <p className="lead">
            A visual field guide to execution context, hoisting, and the lexical
            rules behind every function.
          </p>
        </div>
        <div className="context-stack">
          <small>CALL STACK</small>
          <div>
            GLOBAL <b>window</b>
          </div>
          <div>
            FUNCTION <b>local scope</b>
          </div>
          <strong>creation phase → memory first</strong>
        </div>
      </section>
      <section className="lesson-section">
        <div>
          <p className="eyebrow">MODULE 02</p>
          <h2>
            One word changes
            <br />
            <em>the whole story.</em>
          </h2>
        </div>
        <div>
          <div className="tabs">
            {Object.keys(examples).map((key) => (
              <button
                className={example === key ? "selected" : ""}
                onClick={() => setExample(key)}
                key={key}
              >
                {key}
              </button>
            ))}
          </div>
          <pre className="code-block">{current.slice(0, 3).join("\n")}</pre>
          <p className="engine-note">ENGINE NOTE — {current[3]}</p>
        </div>
      </section>
      <section className="lesson-section">
        <div>
          <p className="eyebrow">MODULE 03 / 04</p>
          <h2>
            Memory work,
            <br />
            <em>then execution.</em>
          </h2>
        </div>
        <div className="hoist-lab">
          <button onClick={() => setHoisted(true)}>
            Run creation phase <span>▶</span>
          </button>
          <div className={hoisted ? "memory-slot filled" : "memory-slot"}>
            <span>launch</span>
            <b>{hoisted ? "undefined" : "?"}</b>
          </div>
          <p>
            {hoisted
              ? "var launch is hoisted and initialized as undefined. let total remains in the temporal dead zone."
              : "Press run to model the creation phase."}
          </p>
        </div>
      </section>
      <section className="scope-section">
        <div>
          <p className="eyebrow">MODULE 04</p>
          <h2>
            Names travel
            <br />
            <em>through the chain.</em>
          </h2>
        </div>
        <div className="scope-map">
          <div className="scope-node">
            01 / OUTER<strong>const lesson = "scope"</strong>
          </div>
          <span>↓ looks outward</span>
          <div className="scope-node lime">
            02 / INNER<strong>function study() {"{ }"}</strong>
            <button onClick={() => setTraced(true)}>Trace →</button>
          </div>
          <p>
            {traced
              ? "Resolved in OUTER → lesson is found one lexical level out."
              : "Click Trace to resolve lesson."}
          </p>
        </div>
      </section>
    </>
  );
}
