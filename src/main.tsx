import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import route from "./Routes/routes";
import { AuthProvider } from "./Context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast"; // Importando o componente Toaster de react-hot-toast para notificações

import "./index.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      reverseOrder={
        false
      } /* Componente Toaster para exibir notificações na parte superior direita */
    />
    <AuthProvider>
      <RouterProvider router={route} />
    </AuthProvider>
  </React.StrictMode>
);
