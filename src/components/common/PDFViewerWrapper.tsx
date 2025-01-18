import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import PDFViewer from "./PDFViewer";

const PDFViewerWrapper: React.FC = () => {
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
