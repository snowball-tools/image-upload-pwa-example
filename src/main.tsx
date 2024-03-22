import React from "react";
import ReactDOM from "react-dom/client";
import { useRegisterSW } from "virtual:pwa-register/react";
import { StytchProvider } from "@stytch/react";
import { StytchUIClient } from "@stytch/vanilla-js";

import App from "./components/App.tsx";
import "./index.css";

const AppUpdater: React.FC = () => {
  const intervalMS = 1000 * 60 * 60 // 1 hour;

	useRegisterSW({
		onRegisteredSW(serviceWorkerUrl: string, serviceWorkerRegistration: ServiceWorkerRegistration | undefined) {
			if (!serviceWorkerRegistration) return;

			setInterval(() => {
				(async () => {
					if (serviceWorkerRegistration.installing ?? !navigator) return;
					if ("connection" in navigator && !navigator.onLine) return;

					try {
						const resp = await fetch(serviceWorkerUrl, {
							cache: "no-store",
							headers: {
								"cache-control": "no-cache",
							},
						});

						if (resp.status === 200) {
							await serviceWorkerRegistration.update();
						}
					} catch (error) {
						console.error("Error updating service worker:", error);
					}
				})(); // Execute the IIFE
			}, intervalMS);
		},
	});

  return null;
};

const stytchClient = new StytchUIClient("public-token-test-fb7aa946-fb42-46be-95ae-63505c0c5ff8");
const rootElement = document.getElementById("root");

rootElement
	? ReactDOM.createRoot(rootElement).render(
			<React.StrictMode>
				<StytchProvider stytch={stytchClient}>
					<App />
				</StytchProvider>
				<AppUpdater />
			</React.StrictMode>,
		)
	: console.log("Root element not found");
