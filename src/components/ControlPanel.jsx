export default function ControlPanel({
  budget,
  setBudget,
  lambda,
  setLambda,
  maxWeight,
  setMaxWeight,
  stepSize,
  setStepSize,
  maxIterations,
  setMaxIterations,
  algorithm,
  setAlgorithm,
  featureMode,
  setFeatureMode,
}) {
  return (
    <div className="panel control-panel">
      <h2>Controls</h2>

      <label className="control-group">
        <span>Budget</span>
        <input
          type="number"
          min="100"
          step="100"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
      </label>

      <label className="control-group">
        <span>Risk Aversion λ</span>
        <input
          type="number"
          min="0.01"
          step="0.05"
          value={lambda}
          onChange={(e) => setLambda(Number(e.target.value))}
        />
      </label>

      <label className="control-group">
        <span>Max Weight Per Stock</span>
        <input
          type="number"
          min="0.05"
          max="1"
          step="0.05"
          value={maxWeight}
          onChange={(e) => setMaxWeight(Number(e.target.value))}
        />
      </label>

      <label className="control-group">
        <span>Step Size</span>
        <input
          type="number"
          min="0.001"
          step="0.01"
          value={stepSize}
          onChange={(e) => setStepSize(Number(e.target.value))}
        />
      </label>

      <label className="control-group">
        <span>Max Iterations</span>
        <input
          type="number"
          min="1"
          step="1"
          value={maxIterations}
          onChange={(e) => setMaxIterations(Number(e.target.value))}
        />
      </label>

      <label className="control-group">
        <span>Algorithm</span>
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
          <option value="pgd">Projected Gradient Descent</option>
          <option value="greedy">Greedy</option>
          <option value="grid">Grid Search</option>
        </select>
      </label>

      <label className="control-group">
        <span>Feature Mode</span>
        <select value={featureMode} onChange={(e) => setFeatureMode(e.target.value)}>
          <option value="returns">Returns Only</option>
          <option value="hybrid">Hybrid</option>
          <option value="fundamental-heavy">Fundamental Heavy</option>
        </select>
      </label>
    </div>
  );
}