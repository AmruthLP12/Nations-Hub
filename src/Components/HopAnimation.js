import React from "react";

// Helper to get a pseudo-position for a country in the list (for animation)
function getCountryIndex(cca3, countries) {
  return countries.findIndex((c) => c.cca3 === cca3);
}

function HopAnimation({ from, to, countries }) {
  if (!from || !to) return null;
  // For demo: use index as x/y (not real map, but visually distinct)
  const fromIdx = getCountryIndex(from, countries);
  const toIdx = getCountryIndex(to, countries);
  if (fromIdx === -1 || toIdx === -1) return null;
  // Calculate positions in a horizontal line (could be improved with real map coords)
  const width = 320;
  const height = 40;
  const x1 = 40 + (width - 80) * (fromIdx / (countries.length - 1));
  const x2 = 40 + (width - 80) * (toIdx / (countries.length - 1));
  const y = height / 2;

  return (
    <div style={{ width: width, height: height, margin: '0 auto', marginBottom: 16 }}>
      <svg width={width} height={height}>
        <line x1={x1} y1={y} x2={x2} y2={y} stroke="#fdd835" strokeWidth={4} strokeDasharray="8 6" />
        <circle cx={x1} cy={y} r={8} fill="#4caf50" />
        <circle cx={x2} cy={y} r={8} fill="#e53935" />
        {/* Animated dot */}
        <circle>
          <animate
            attributeName="cx"
            from={x1}
            to={x2}
            dur="0.7s"
            fill="freeze"
          />
          <animate
            attributeName="cy"
            from={y}
            to={y}
            dur="0.7s"
            fill="freeze"
          />
          <animate
            attributeName="r"
            from={8}
            to={8}
            dur="0.7s"
            fill="freeze"
          />
        </circle>
      </svg>
    </div>
  );
}

export default HopAnimation;
