import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";
import { PDFProvider } from "./context/PDFContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PDFProvider>
      <App />
    </PDFProvider>
    <ToastContainer
      theme="dark"
      position="top-right"
      autoClose={3000}
      closeOnClick
      pauseOnHover
    />
  </StrictMode>
);
