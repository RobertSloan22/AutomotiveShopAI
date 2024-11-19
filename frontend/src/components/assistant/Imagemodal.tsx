interface SearchResult {
    title: string;
    link: string;
    source: string;
    thumbnail: string;
  }
  
  interface ImageSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    searchResults: SearchResult[];
    onSelectImage: (image: SearchResult) => void;
  }
  
  export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
    isOpen,
    onClose,
    searchResults,
    onSelectImage
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[80vw] max-w-4xl max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Search Results</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(80vh-100px)]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {searchResults.map((result, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-2 cursor-pointer hover:border-blue-500"
                  onClick={() => onSelectImage(result)}
                >
                  <img 
                    src={result.link} 
                    alt={result.title}
                    className="w-full h-48 object-contain mb-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = result.thumbnail;
                    }}
                  />
                  <p className="text-sm truncate">{result.title}</p>
                  <p className="text-xs text-gray-500 truncate">Source: {result.source}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };


