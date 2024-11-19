import React from 'react';

interface DiagramViewerProps {
  diagram: {
    url: string;
    title: string;
    thumbnail?: string;
    sourceUrl?: string;
    fileType: string;
  };
}

export const DiagramViewer: React.FC<DiagramViewerProps> = ({ diagram }) => {
  const isPDF = diagram.fileType.toLowerCase() === 'pdf';

  return (
    <div className="diagram-viewer">
      {isPDF ? (
        <iframe
          src={diagram.url}
          className="w-full h-[500px]"
          title={diagram.title}
        />
      ) : (
        <img
          src={diagram.url}
          alt={diagram.title}
          className="max-w-full h-auto"
          onError={(e) => {
            // Fallback to thumbnail if main image fails to load
            const img = e.target as HTMLImageElement;
            if (diagram.thumbnail && img.src !== diagram.thumbnail) {
              img.src = diagram.thumbnail;
            }
          }}
        />
      )}
      
      {diagram.sourceUrl && (
        <div className="mt-2 text-sm text-gray-500">
          <a 
            href={diagram.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-500"
          >
            Source: {diagram.title}
          </a>
        </div>
      )}
    </div>
  );
};
