import React from "react";
import { createRoot } from "react-dom/client";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { BrowserRouter } from "react-router-dom";
import { StateContextProvider } from "./context";
import App from "./App";
import "./index.css";

const chainId = ChainId.Goerli;

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
	<ThirdwebProvider
		desiredChainId={chainId}
		sdkOptions={{
			gasless: {
				biconomy: {
					apiKey: import.meta.env.VITE_BICONOMY_KEY,
					apiId: import.meta.env.VITE_BICONOMY_ID,
				},
			},
		}}
	>
		<BrowserRouter>
			<StateContextProvider>
				<App />
			</StateContextProvider>
		</BrowserRouter>
	</ThirdwebProvider>
);
