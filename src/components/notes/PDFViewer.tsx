import { useNavigate, useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PDFViewerProps {
  noteName?: string; // Optional prop for the note name
}

const PDFViewer: React.FC<PDFViewerProps> = ({ noteName }) => {
  const { pdfUrl, subject } = useParams<{ pdfUrl: string; subject: string }>();
  const navigate = useNavigate();

  const displaySubject = decodeURIComponent(subject || '') || "Default Subject";

  const defaultLayout = defaultLayoutPlugin();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-[75%] bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col items-center gap-6">
          <div className="w-full flex items-center justify-between gap-4">
            <button
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              onClick={() => navigate(-1)}
            >
              Back to Notes
            </button>
            <h2 className="text-xl font-semibold text-gray-700">PDF Viewer</h2>
          </div>

          {displaySubject && (
            <div className="flex justify-center items-center py-2 px-6 w-full">
              <span className="text-indigo-600 font-bold text-xl md:text-2xl">
                {displaySubject}
              </span>
            </div>
          )}

          {noteName && (
            <span className="text-gray-700 font-medium text-lg">{noteName}</span>
          )}
        </div>

        {/* Minimum height for at least one page to be visible */}
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <div className="h-[calc(250vh-200px)] sm:h-[calc(250vh-250px)] lg:h-[calc(250vh-300px)] border-t border-gray-200">
            {/* The height here dynamically adjusts based on screen size */}
            <Viewer fileUrl={decodeURIComponent(pdfUrl!)} plugins={[defaultLayout]} />
          </div>
        </Worker>
      </div>
    </div>
  );
};

export default PDFViewer;
