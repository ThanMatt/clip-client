export interface Server {
  id: string;
  ip: string;
  port: number;
  deviceName: string;
  lastSeen: number;
}

export interface GetServersResponse {
  servers: Array<Server>;
}
