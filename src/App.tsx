import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "@/router";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#f3f4f6",
            border: "1px solid #374151",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#1f2937" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#1f2937" },
          },
        }}
      />
    </>
  );
}

export default App;
