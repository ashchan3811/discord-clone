import { Server as IOServer } from "socket.io";
import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types/socket-types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");

    const httpServer = res.socket.server;

    res.socket.server.io = new IOServer(httpServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    // res.socket.server.io = io;
  } else {
    console.log("socket.io already running");
  }

  res.end();
};

export default ioHandler;
