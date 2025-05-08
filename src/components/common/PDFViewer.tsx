import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

/**
 * Props interface for the PDFViewer component
 * @interface PDFViewerProps
 * @property {string} pdfUrl - URL of the PDF file to display
 * @property {string} [title] - Generic title for the viewer (e.g., "Question Paper", "Notes")
 * @property {string} [mainHeading] - Primary heading (e.g., subject name)
 * @property {string} [subHeading] - Secondary heading (e.g., year, semester, chapter)
 * @property {() => void} [onBack] - Callback function for back button click
 * @property {boolean} [showBackButton] - Whether to show the back navigation button
 */
interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
  mainHeading?: string;
  subHeading?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

/**
 * PDFViewer Component
 * 
 * A comprehensive PDF viewer component with navigation, layout controls, and responsive design.
 * Uses @react-pdf-viewer/core and @react-pdf-viewer/default-layout for PDF rendering.
 * 
 * Features:
 * - Responsive layout with flexible width and height
 * - Navigation header with back button
 * - Hierarchical headings (title, main heading, sub heading)
 * - PDF thumbnail and bookmark tabs
 * - Loading progress indicator
 * - Auto theme detection
 * - Default zoom level setting
 * 
 * @component
 * @example
 * ```tsx
 * <PDFViewer
 *   pdfUrl="https://example.com/sample.pdf"
 *   title="Course Material"
 *   mainHeading="Computer Science"
 *   subHeading="Chapter 1: Introduction"
 *   showBackButton={true}
 *   onBack={() => navigate(-1)}
 * />
 * ```
 */
const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  title = "PDF Viewer",
  mainHeading,
  subHeading,
  onBack,
  showBackButton = true,
}) => {
  // Initialize the default layout plugin with thumbnail and bookmark tabs
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0], // Thumbnail tab
      defaultTabs[1], // Bookmark tab
    ]
  });

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col">
      {/* Main content container with responsive margins */}
      <div className="flex-1 flex flex-col mx-4 md:mx-8 lg:mx-12 mb-6 p-4">
        {/* Header section with navigation and titles */}
        <div className="p-6 border-b border-indigo-100 flex flex-col items-center gap-4 bg-white rounded-t-lg mt-2">
          {/* Navigation and title row */}
          <div className="w-full flex items-center justify-between gap-4">
            {showBackButton && onBack && (
              <button
                className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                onClick={onBack}
                aria-label="Go back"
              >
                Back
              </button>
            )}
            <h2 className="text-2xl font-semibold text-indigo-900">{title}</h2>
            {/* Spacer div for layout balance when back button is shown */}
            {showBackButton && onBack && <div className="w-[73px]" />}
          </div>

          {/* Main heading section */}
          {mainHeading && (
            <div className="flex justify-center items-center py-3 px-6 w-full">
              <span className="text-indigo-700 font-bold text-2xl md:text-3xl">
                {mainHeading}
              </span>
            </div>
          )}

          {/* Sub heading section */}
          {subHeading && (
            <span className="text-indigo-600 font-medium text-xl">{subHeading}</span>
          )}
        </div>

        {/* PDF viewer container */}
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
