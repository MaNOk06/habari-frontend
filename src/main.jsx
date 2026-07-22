import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { StoreProvider } from "./lib/store.jsx";
import { AuthProvider } from "./lib/auth.jsx";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter><AuthProvider><StoreProvider><App /></StoreProvider></AuthProvider></BrowserRouter>
  </React.StrictMode>
);
