import React, { useState, useEffect } from 'react';
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

export function EngineDiagram({ componentId, diagramUrl, highlightedParts, annotations }: DiagramProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (diagramUrl) {
      setImageError(false);
      setImageSrc(diagramUrl);
    }
  }, [diagramUrl]);

  return (
    <div className="engine-diagram">
      <div className="diagram-container">
        {diagramUrl && (
          <div className="diagram-url">
            <a href={diagramUrl} target="_blank" rel="noopener noreferrer">
              Open Diagram in New Tab
            </a>
          </div>
        )}
        {imageError ? (
          <div className="diagram-placeholder">
            <p>Could not load diagram</p>
            <p>Try searching with different terms</p>
          </div>
        ) : (
          imageSrc && (
            <img 
              src={imageSrc} 
              alt={`Diagram of ${componentId || 'automotive component'}`}
              onError={() => setImageError(true)}
              className="diagram-image"
            />
          )
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