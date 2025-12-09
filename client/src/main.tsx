(globalThis as any).global = globalThis;

if (!globalThis.process) {
  globalThis.process = { env: {} } as any;
}

import "buffer";
import "process";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
