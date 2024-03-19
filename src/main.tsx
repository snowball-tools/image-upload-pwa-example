import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import { useRegisterSW } from "virtual:pwa-register/react";
import { StytchProvider } from '@stytch/react';
import { StytchUIClient } from '@stytch/vanilla-js';

import "./index.css";

const AppUpdater = () => {
  const intervalMS = 1000 * 60 * 60 // 1 hour;

  useRegisterSW({
    onRegisteredSW(swUrl, r) {
      r &&
        setInterval(async () => {
          if (!(!r.installing && navigator)) return;
          if ("connection" in navigator && !navigator.onLine) return;

          const resp = await fetch(swUrl, {
            cache: "no-store",
            headers: {
              cache: "no-store",
              "cache-control": "no-cache",
            },
          });

          if (resp?.status === 200) await r.update();
        }, intervalMS);
    },
  });

  return null;
};

const stytchClient = new StytchUIClient("public-token-test-fb7aa946-fb42-46be-95ae-63505c0c5ff8");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StytchProvider stytch={stytchClient}>
      <App />
    </StytchProvider>
    <AppUpdater />
  </React.StrictMode>,
);
