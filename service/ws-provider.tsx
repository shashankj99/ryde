import { tokenStorage } from "@/store/storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "./config";
import { refreshTokens } from "./api-interceptor";

interface WSService {
  initialize: () => void;
  emit: (event: string, data: any) => void;
  on: (event: string, cb: (data: any) => void) => void;
  off: (event: string) => void;
  removeListener: (listenerName: string) => void;
  updateAccessToken: () => void;
  disconnect: () => void;
}

const WSContext = createContext<WSService | undefined>(undefined);

export const WSProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const socket = useRef<Socket>();

  useEffect(() => {
    const fetchToken = async () => {
      const token = await tokenStorage.getItem("access_token");
      setAccessToken(token);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      if (socket.current) {
        socket.current.disconnect();
      }

      socket.current = io(SOCKET_URL, {
        transports: ["websocket"],
        withCredentials: true,
        extraHeaders: {
          access_token: accessToken || "",
        },
      });

      socket.current.on("connect_error", async (err) => {
        if (err.message === "Authentication error") {
          await refreshTokens();
        }
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [accessToken]);

  const emit = (event: string, data: any = {}) => {
    socket.current?.emit(event, data);
  };

  const on = (event: string, cb: (data: any) => void) => {
    socket.current?.on(event, cb);
  };

  const off = (event: string) => {
    socket.current?.off(event);
  };

  const removeListener = (listenerName: string) => {
    socket.current?.removeListener(listenerName);
  };

  const disconnect = () => {
    if (socket.current) {
      socket.current.disconnect();
      socket.current = undefined;
    }
  };

  const updateAccessToken = async () => {
    const accessToken = await tokenStorage.getItem("access_token")!;
    setAccessToken(accessToken);
  };

  const socketService: WSService = {
    initialize: () => {},
    emit,
    on,
    off,
    removeListener,
    updateAccessToken,
    disconnect,
  };

  return (
    <WSContext.Provider value={socketService}>{children}</WSContext.Provider>
  );
};

export const useWS = (): WSService => {
  const socketService = useContext(WSContext);
  if (!socketService) {
    throw new Error("useWS must be used within a WSProvider");
  }
  return socketService;
};
