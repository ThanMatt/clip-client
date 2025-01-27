import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { RefreshCcw, Wifi, Server as ServerIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GetServersResponse, Server } from "@/types";
import { Subtle } from "../ui/typography";
import axiosInstance from "@/config/axios";

type ServerSelectionCardProps = {
  onTargetServer: (server: Server | null) => void;
};

const ServerSelectionCard = ({ onTargetServer }: ServerSelectionCardProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [servers, setServers] = useState<Server[] | null>(null);
  const [dots, setDots] = useState("");
  const [errors, setErrors] = useState<string | null>(null);

  const [selectedServer, setSelectedServer] = useState<Server | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleSelectServer = (server: Server) => {
    if (server.id === selectedServer?.id && selectedServer) {
      onTargetServer(null);
      setSelectedServer(null);
    } else {
      setSelectedServer(server);
      onTargetServer(server);
    }
  };

  const getServers = async () => {
    const response = await axiosInstance.get<GetServersResponse>("/servers");
    return response.data;
  };

  const handleGetServers = async () => {
    setIsScanning(true);
    const data = await getServers();

    setIsScanning(false);
    setServers(data.servers);
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setIsScanning(true);

        const data = await getServers();
        if (mounted) {
          setServers(data.servers);
          setErrors(null);
        }
      } catch (err) {
        if (mounted) {
          setErrors("Failed to fetch data");
          console.error("Polling error:", err);
        }
      } finally {
        if (mounted) {
          setIsScanning(false);
        }
      }
    };

    const pollInterval = setInterval(() => {
      fetchData();
    }, 5000); // :: Poll every 5 seconds

    fetchData();

    return () => {
      mounted = false;
      clearInterval(pollInterval);
    };
  }, []);

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
            onClick={handleGetServers}
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
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wifi className="h-4 w-4" />
              <span>Discovered Servers</span>
            </div>

            <div className="space-y-2">
              {servers && servers.length ? (
                servers.map((server) => (
                  <Button
                    key={server.id}
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-auto py-3",
                      selectedServer?.id === server.id
                        ? "border-primary bg-primary-foreground"
                        : ""
                    )}
                    onClick={() => handleSelectServer(server)}
                  >
                    <div className="flex items-start gap-3">
                      <ServerIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="text-left">
                        <div className="font-medium">{server.deviceName}</div>
                        <div className="text-sm text-muted-foreground">
                          {server.ip}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))
              ) : (
                <div>
                  <Subtle>Finding servers{dots}</Subtle>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

ServerSelectionCard.displayName = "ServerSelectionCard";

export default ServerSelectionCard;
