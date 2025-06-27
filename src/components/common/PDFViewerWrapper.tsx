import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import PDFViewer from "./PDFViewer";

/**
 * PDFViewerWrapper Component
 * 
 * A wrapper component that handles routing parameters and navigation for the PDF viewer.
 * It extracts URL parameters and state, then passes them to the PDFViewer component.
 * 
 * URL Parameters:
 * @param {string} pdfUrl - The encoded URL of the PDF file to display
 * @param {string} subject - The encoded subject name or identifier
 * 
 * Location State:
 * @param {string} noteName - Optional note name passed through navigation state
 * 
 * Features:
 * - Automatically decodes URL parameters
 * - Handles navigation with browser back functionality
 * - Preserves routing state and parameters
 * - Provides a clean interface to the PDFViewer component
 */
const PDFViewerWrapper: React.FC = () => {
  // Extract routing parameters and state
  const { pdfUrl, subject } = useParams<{ pdfUrl: string; subject: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const noteName = location.state?.noteName;

  return (
    <PDFViewer
      pdfUrl={decodeURIComponent(pdfUrl || "")}
      title="Study Material"
      mainHeading={decodeURIComponent(subject || "")}
      subHeading={noteName}
      onBack={() => navigate(-1)}
      showBackButton={true}
    />
  );
};

export default PDFViewerWrapper;
