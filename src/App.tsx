import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Discovery from "./pages/Discovery";

// ✅ 1. Add these imports at the top
import AnimeTab from "./pages/DiscoveryTabs/AnimeHub";
import AnimeDetails from "./pages/DiscoveryTabs/AnimeDetails";

export default function App() {
  return (
    <BrowserRouter>
      {/* All your app routes go here */}
      <Routes>
        <Route path="/" element={<Discovery />} />

        {/* ✅ 2. Add these routes inside <Routes> */}
        <Route path="/discovery/anime" element={<AnimeTab />} />
        <Route path="/anime/:id" element={<AnimeDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
