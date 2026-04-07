export default function DerivationPanel({ history }) {
  return (
    <div className="panel">
      <h2>PGD Step-by-step Derivation</h2>

      {history.slice(0, 10).map((step) => (
        <div key={step.iteration} className="derivation-card">
          <div>
            <strong>Iteration:</strong> {step.iteration}
          </div>
          <div>
            <strong>Objective:</strong> {step.objective.toFixed(6)}
          </div>
          <div>
            <strong>Risk:</strong> {step.risk.toFixed(6)}
          </div>
          <div>
            <strong>Return:</strong> {step.expectedReturn.toFixed(6)}
          </div>

          <details>
            <summary>Show vector details</summary>

            <div style={{ marginTop: "10px" }}>
              <strong>Previous weights</strong>
              <pre>{JSON.stringify(step.previousWeights, null, 2)}</pre>
            </div>

            <div>
              <strong>Gradient</strong>
              <pre>{JSON.stringify(step.gradient, null, 2)}</pre>
            </div>

            <div>
              <strong>Raw step</strong>
              <pre>{JSON.stringify(step.rawStep, null, 2)}</pre>
            </div>

            <div>
              <strong>Projected weights</strong>
              <pre>{JSON.stringify(step.weights, null, 2)}</pre>
            </div>
          </details>
        </div>
      ))}
    </div>
  );
}