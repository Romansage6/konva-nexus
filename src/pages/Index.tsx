// ADD (imports):
import AnimeTab from "./discovery/AnimeTab";
import AnimeDetails from "./anime/AnimeDetails";

// ADD (within your <Routes>):
<Route path="/discovery/anime" element={<AnimeTab />} />
<Route path="/anime/:id" element={<AnimeDetails />} />
