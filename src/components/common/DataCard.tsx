import React from 'react';
import { Download } from 'lucide-react';

  interface DataCardProps {
    title: string;
    subtitle?: string;
    description?: string;
    metadata?: {
      label: string;
      value: string;
    }[];
    onDownload?: () => void;
    onClick?: () => void; // Add this line
    icon?: React.ReactNode;
    tags?: string[];
  }
  

  const DataCard: React.FC<DataCardProps> = ({
    title,
    subtitle,
    description,
    metadata,
    onDownload,
    onClick, // Destructure the new prop
    icon,
    tags,
  }) => {
    return (
      <div
        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={onClick} // Attach the onClick handler here
      >
        <div className="p-6">
          <div className="flex items-center">
            {icon && (
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-indigo-100 rounded-md flex items-center justify-center">
                  {icon}
                </div>
              </div>
            )}
            <div className={`${icon ? 'ml-4' : ''}`}>
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
  
          {description && (
            <p className="mt-3 text-sm text-gray-600">{description}</p>
          )}
  
          {metadata && metadata.length > 0 && (
            <div className="mt-4 space-y-2">
              {metadata.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm text-gray-500"
                >
                  <span className="font-medium mr-2">{item.label}:</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          )}
  
          {tags && tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
  
          {onDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent the button click from triggering the card click
                onDownload();
              }}
              className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </button>
          )}
        </div>
      </div>
    );
  };
  

export default DataCard;