import { ShareContentCard } from "./components/ShareContentCard";
import { ServerSelectionCard } from "./components/ServerSelectionCard";
import { useState } from "react";
import { Server } from "./types";

function App() {
  const [targetServer, setTargetServer] = useState<Server | null>(null);

  const handleTargetServer = (server: Server | null) => {
    setTargetServer(server);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <ServerSelectionCard onTargetServer={handleTargetServer} />
        <ShareContentCard targetServer={targetServer} />
      </div>
    </div>
  );
}

export default App;
