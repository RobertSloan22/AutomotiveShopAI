import React, { useState } from 'react';
import './EngineDiagram.scss';

interface DiagramProps {
  componentId?: string;
  diagramUrl?: string;
  highlightedParts?: string[];
  annotations?: {
    x: number;
    y: number;
    text: string;
  }[];
}

interface DiagramProps {
  componentId?: string;
  diagramUrl?: string;
  highlightedParts?: string[];
  annotations?: {
    x: number;
    y: number;
    text: string;
  }[];
}

export function EngineDiagram({ componentId, diagramUrl, highlightedParts, annotations }: DiagramProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="engine-diagram">
      <div className="diagram-container">
        {imageError ? (
          <div className="diagram-placeholder">
            <p>Could not load diagram</p>
            <p>Try searching with different terms</p>
          </div>
        ) : (
          <img 
            src={diagramUrl} 
            alt={`Diagram of ${componentId || 'automotive component'}`}
            onError={() => setImageError(true)}
          />
        )}
        {annotations?.map((annotation, index) => (
          <div
            key={index}
            className="annotation"
            style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
          >
            <div className="annotation-text">{annotation.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 