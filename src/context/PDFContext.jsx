import { useContext, useRef, createContext } from "react";

const PDFContext = createContext();

export const PDFProvider = ({ children }) => {
  const componentRef = useRef();

  return (
    <PDFContext.Provider value={componentRef}>{children}</PDFContext.Provider>
  );
};

export const usePDF = () => useContext(PDFContext);
