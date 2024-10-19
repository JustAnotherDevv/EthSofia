// @ts-nocheck
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
  baseSepolia,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CMSEditor from "./pages/CmsEditors.tsx";
import WebsiteList from "./pages/WebsiteList.tsx";
import DynamicPage from "./pages/DynamicPage.tsx";
import Debug from "./pages/Debug.tsx";
import Sidebar from "./components/layout/Sidebar.tsx";

const config = getDefaultConfig({
  appName: "EthSofia",
  projectId: "4a0292001aa158221d86cfc3bd6ea4bb",
  chains: [
    // mainnet, polygon, optimism, arbitrum, base, sepolia
    baseSepolia,
  ],
  ssr: false,
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {/* <App /> */}
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
              <Router>
                <div>
                  <Routes>
                    <Route path="/editor" element={<CMSEditor />} />
                    <Route path="/" element={<WebsiteList />} />
                    <Route path="/debug" element={<Debug />} />
                    {/* <Route path="/dynamic/" element={<DynamicPage />} />
                     */}
                    <Route path="/:slug" element={<DynamicPage />} />
                  </Routes>
                </div>
              </Router>
            </main>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
