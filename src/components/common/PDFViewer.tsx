import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PDFViewerProps {
  pdfUrl: string;
  title?: string;          // Generic title (e.g., "Question Paper", "Notes", etc.)
  mainHeading?: string;    // Main heading (e.g., subject name)
  subHeading?: string;     // Sub heading (e.g., year, semester, chapter name)
  onBack?: () => void;     // Optional back handler
  showBackButton?: boolean; // Control back button visibility
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  title = "PDF Viewer",
  mainHeading,
  subHeading,
  onBack,
  showBackButton = true,
}) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0], // Thumbnail tab
      defaultTabs[1], // Bookmark tab
    ]
  });

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col">
      <div className="flex-1 flex flex-col mx-4 md:mx-8 lg:mx-12 mb-6 p-4">
        <div className="p-6 border-b border-indigo-100 flex flex-col items-center gap-4 bg-white rounded-t-lg mt-2">
          <div className="w-full flex items-center justify-between gap-4">
            {showBackButton && onBack && (
              <button
                className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                onClick={onBack}
              >
                Back
              </button>
            )}
            <h2 className="text-2xl font-semibold text-indigo-900">{title}</h2>
            {showBackButton && onBack && <div className="w-[73px]" />}
          </div>

          {mainHeading && (
            <div className="flex justify-center items-center py-3 px-6 w-full">
              <span className="text-indigo-700 font-bold text-2xl md:text-3xl">
                {mainHeading}
              </span>
            </div>
          )}

          {subHeading && (
            <span className="text-indigo-600 font-medium text-xl">{subHeading}</span>
          )}
        </div>

        <div className="flex-1 bg-white rounded-b-lg">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div style={{ height: 'calc(200vh - 200px)' }}>
              <Viewer 
                fileUrl={decodeURIComponent(pdfUrl)} 
                plugins={[defaultLayoutPluginInstance]}
                defaultScale={1.0}
                theme={{
                  theme: 'auto',
                }}
                renderLoader={(percentages: number) => (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-indigo-600">
                      Loading... {Math.round(percentages)}%
                    </div>
                  </div>
                )}
              />
            </div>
          </Worker>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
