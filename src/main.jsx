import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";

import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserProvider>
    <App />
    <ToastContainer position="top-right" autoClose={3000} />
  </UserProvider>
);


