export default function DerivationPanel({ history }) {
  return (
    <div className="panel">
      <h2>Step-by-step Derivation</h2>

      {history.slice(0, 10).map((step) => (
        <div key={step.iteration} className="derivation-card">
          <div>Iteration {step.iteration}</div>
          <div>Objective: {step.objective.toFixed(6)}</div>
          <div>Risk: {step.risk.toFixed(6)}</div>
          <div>Return: {step.expectedReturn.toFixed(6)}</div>

          <details>
            <summary>Details</summary>
            <pre>{JSON.stringify(step.weights, null, 2)}</pre>
          </details>
        </div>
      ))}
    </div>
  );
}