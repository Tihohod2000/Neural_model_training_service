import React, { useMemo } from "react";

const MAX_VISIBLE_NEURONS = 8;
const MAX_VISIBLE_LAYERS = 5;

function NetworkVisualization({ networkStructure, layers }) {
  const { viewBox, displayStructure, layerLabels } = useMemo(() => {
    const width = 600;
    const height = 300;
    const padding = 60;
    const layerSpacing = (width - padding * 2) / (MAX_VISIBLE_LAYERS - 1);
    const neuronSpacing = 25;

    let displayStructure = [...networkStructure];
    let layerLabels = [];

    if (networkStructure.length > MAX_VISIBLE_LAYERS) {
      const firstTwo = networkStructure.slice(0, 2);
      const lastTwo = networkStructure.slice(-2);
      displayStructure = [...firstTwo, -1, ...lastTwo];
      layerLabels = [
        networkStructure[0],
        networkStructure[1],
        '...',
        networkStructure[networkStructure.length - 2],
        networkStructure[networkStructure.length - 1]
      ];
    } else {
      layerLabels = networkStructure;
    }

    displayStructure = displayStructure.map(neurons => {
      if (neurons === -1) return 1;
      if (neurons > MAX_VISIBLE_NEURONS) {
        const visible = Math.floor(MAX_VISIBLE_NEURONS / 2);
        return visible * 2;
      }
      return neurons;
    });

    return {
      viewBox: `0 0 ${width} ${height}`,
      displayStructure,
      layerLabels,
    };
  }, [networkStructure]);

  const denseLayers = layers.filter(l => l.type === 'Dense');

  return (
    <div className="network-visualization">
      <svg viewBox={viewBox} className="network-svg" preserveAspectRatio="xMidYMid meet">
        {displayStructure.map((neurons, layerIndex) => {
          const isEllipsis = neurons === 1 && layerLabels[layerIndex] === '...';
          
          const layerHeight = isEllipsis ? 0 : (neurons - 1) * 25;
          const startY = (300 - layerHeight) / 2;
          const x = 60 + layerIndex * 120;

          const yPositions = isEllipsis 
            ? [150] 
            : Array.from({ length: neurons }, (_, i) => startY + i * 25);

          const connections = [];
          if (layerIndex > 0 && !isEllipsis) {
            const prevNeurons = displayStructure[layerIndex - 1];
            const isPrevEllipsis = prevNeurons === 1 && layerLabels[layerIndex - 1] === '...';
            
            if (!isPrevEllipsis) {
              const prevLayerHeight = (prevNeurons - 1) * 25;
              const prevStartY = (300 - prevLayerHeight) / 2;
              const prevX = 60 + (layerIndex - 1) * 120;
              const prevYPositions = Array.from({ length: prevNeurons }, (_, i) => prevStartY + i * 25);

              for (let prevIdx = 0; prevIdx < prevYPositions.length; prevIdx++) {
                for (let currIdx = 0; currIdx < yPositions.length; currIdx++) {
                  connections.push(
                    <line
                      key={`conn-${layerIndex}-${prevIdx}-${currIdx}`}
                      x1={prevX + 8}
                      y1={prevYPositions[prevIdx]}
                      x2={x - 8}
                      y2={yPositions[currIdx]}
                      className="connection"
                    />
                  );
                }
              }
            }
          }

          if (isEllipsis) {
            return (
              <g key={`layer-${layerIndex}`}>
                {connections}
                <text
                  x={x}
                  y={155}
                  className="ellipsis-label"
                  textAnchor="middle"
                >
                  ···
                </text>
              </g>
            );
          }

          const actualNeurons = typeof layerLabels[layerIndex] === 'number' 
            ? layerLabels[layerIndex] 
            : neurons;

          return (
            <g key={`layer-${layerIndex}`}>
              {connections}
              {yPositions.map((y, neuronIdx) => {
                const isInput = layerIndex === 0;
                const isOutput = layerIndex === displayStructure.length - 1;
                const isHidden = !isInput && !isOutput;

                const showMoreIndicator = actualNeurons > MAX_VISIBLE_NEURONS && 
                  (neuronIdx === Math.floor(neurons / 2) - 1 || neuronIdx === Math.floor(neurons / 2));

                if (showMoreIndicator && neuronIdx === Math.floor(neurons / 2)) {
                  return (
                    <g key={`neuron-${layerIndex}-${neuronIdx}`}>
                      <text
                        x={x}
                        y={y + 5}
                        className="more-indicator"
                        textAnchor="middle"
                      >
                        ···
                      </text>
                    </g>
                  );
                }

                return (
                  <g key={`neuron-${layerIndex}-${neuronIdx}`} className="neuron-group">
                    <circle
                      cx={x}
                      cy={y}
                      r="10"
                      className={`neuron ${isInput ? 'input-neuron' : isOutput ? 'output-neuron' : 'hidden-neuron'}`}
                    />
                    {isHidden && actualNeurons <= MAX_VISIBLE_NEURONS && (
                      <text
                        x={x}
                        y={y + 4}
                        className="neuron-label"
                        textAnchor="middle"
                      >
                        {denseLayers[layerIndex - 1]?.units || ''}
                      </text>
                    )}
                  </g>
                );
              })}
              <text
                x={x}
                y={280}
                className="layer-label"
                textAnchor="middle"
              >
                {layerIndex === 0 ? `Вход (${actualNeurons})` :
                 layerIndex === displayStructure.length - 1 ? `Выход (${actualNeurons})` :
                 `Слой ${layerIndex} (${actualNeurons})`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default NetworkVisualization;
