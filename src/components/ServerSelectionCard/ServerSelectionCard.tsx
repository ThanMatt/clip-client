import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { RefreshCcw, Wifi, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const ServerSelectionCard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [servers, setServers] = useState([
    { id: "1", name: "Living Room PC", ip: "192.168.1.100", status: "online" },
    { id: "2", name: "Office Laptop", ip: "192.168.1.101", status: "online" },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              Available Servers
            </CardTitle>
            <CardDescription>
              Connect to CLIP servers on your network
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => console.log("Scanning")}
            disabled={isScanning}
          >
            <RefreshCcw
              className={cn("h-4 w-4", isScanning ? "animate-spin" : "")}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Discovered Servers */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wifi className="h-4 w-4" />
              <span>Discovered Servers</span>
            </div>

            <div className="space-y-2">
              {servers.map((server) => (
                <Button
                  key={server.id}
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                >
                  <div className="flex items-start gap-3">
                    <Server className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="text-left">
                      <div className="font-medium">{server.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {server.ip}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

ServerSelectionCard.displayName = "ServerSelectionCard";

export default ServerSelectionCard;
