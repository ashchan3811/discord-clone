import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { NextApiResponse } from "next";
import type { Server as IOServer } from "socket.io";

export type NextApiResponseServerIo = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io: IOServer;
    };
  };
};
