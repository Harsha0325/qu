import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import store from "./Redux/store/store";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Provider store={store}>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
      </Provider>
    </AuthProvider>
  </BrowserRouter>
);
