import React, { useState } from 'react';
import { X, ExternalLink, Save, Database } from 'react-feather';
import axiosInstance from '../../utils/axiosConfig.js';
import { toast } from 'react-hot-toast';

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchResults: Array<{
    title: string;
    imageUrl: string;
    thumbnailUrl: string;
    source: string;
    link: string;
  }>;
  onSelectImage: (image: any) => void;
}

interface SavedImage {
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  source: string;
  link: string;
  timestamp?: string;
}

export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
  isOpen,
  onClose,
  searchResults,
  onSelectImage,
}) => {
  const [savingStates, setSavingStates] = useState<{ [key: number]: boolean }>({});
  const [showingSaved, setShowingSaved] = useState(false);
  const [savedImages, setSavedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSavedImages = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/images');
      setSavedImages(response.data);
      setShowingSaved(true);
    } catch (error) {
      console.error('Failed to fetch saved images:', error);
      toast.error('Failed to load saved images');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const saveImage = async (image: SavedImage, index: number) => {
    try {
      setSavingStates(prev => ({ ...prev, [index]: true }));
      
      const response = await axiosInstance.post('/images', {
        ...image,
        timestamp: new Date().toISOString()
      });
      
      toast.success('Image saved successfully');
      return response.data;
    } catch (error) {
      console.error('Failed to save image:', error);
      toast.error('Failed to save image');
      throw error;
    } finally {
      setSavingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[90vw] max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {showingSaved ? 'Saved Images' : 'Image Search Results'}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (showingSaved) {
                  setShowingSaved(false);
                } else {
                  fetchSavedImages();
                }
              }}
              className="text-blue-600 hover:text-blue-800 flex items-center px-3 py-1 rounded-md"
            >
              <Database size={14} className="mr-1" />
              {showingSaved ? 'Show Search Results' : 'Show Saved Images'}
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X />
            </button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-100px)]">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {(showingSaved ? savedImages : searchResults).map((result, index) => (
                <div 
                  key={index}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                    <img 
                      src={result.thumbnailUrl} 
                      alt={result.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== result.thumbnailUrl) {
                          target.src = result.thumbnailUrl;
                        }
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium mb-2 line-clamp-2">{result.title}</p>
                    <div className="flex justify-between items-center">
                      <a
                        href={result.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Select Image
                      </a>
                      <div className="flex justify-between items-center mt-2">
                        <a
                          href={result.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700 flex items-center text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={14} className="mr-1" />
                          Source
                        </a>
                        {!showingSaved && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveImage({
                                title: result.title,
                                imageUrl: result.imageUrl,
                                thumbnailUrl: result.thumbnailUrl,
                                source: result.source,
                                link: result.link
                              }, index);
                            }}
                            disabled={savingStates[index]}
                            className="text-green-600 hover:text-green-800 flex items-center text-sm ml-2 disabled:opacity-50"
                          >
                            <Save size={14} className="mr-1" />
                            {savingStates[index] ? 'Saving...' : 'Save'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};