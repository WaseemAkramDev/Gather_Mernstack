import { useCallback, useEffect, useRef, useState } from "react";
import CustomizeSidebar from "../components/CustomizeSidebar";
import PhaserWrapper from "../components/PhaserWrapper";
import { useEventHandlers } from "../helper/eventHandlers";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import VideoCallWrapper from "../components/VideoCallWrapper";

function Space() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIds, setRemotePeerIds] = useState<string[]>([]);
  const [usernameMap, setUsernameMap] = useState<any>({});
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const { spaceId } = useParams<{ spaceId: string }>();
  const token = queryClient.getQueryData<string>(["authToken"]);

  useEffect(() => {
    if (!token || !peerId) return;
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
      query: { token },
    });
    socketRef.current.on("connect", () => {
      console.log("connected with id:", socketRef.current?.id);
      socketRef.current?.emit("message", {
        type: "join",
        payload: { spaceId: spaceId, peerId: peerId },
      });
    });
    socketRef.current.on("message", (data) => {
      console.log(data);
      if (data.type == "call_init") {
        const { remotePeerId, username } = data;
        console.log("add to remote peer Ids");
        setUsernameMap((prev: any) => ({
          ...prev,
          [`${remotePeerId}`]: username,
        }));
        addRemotePeerId(remotePeerId);
        return;
      }
      if (data.type == "removePeerId") {
        const remotePeerId = data;
        setRemotePeerIds((prev) =>
          prev.filter((peerId) => peerId == remotePeerId)
        );
        return;
      }
      try {
        setTimeout(
          () => {
            const event = new CustomEvent(data.type, {
              detail: { payload: data.payload },
            });
            window.dispatchEvent(event);
          },
          data.type == "space-joined" ? 100 : 0
        );
      } catch (error) {
        console.error("Error handling message:", error);
      }
    });
    return () => {
      console.log("disconnnecting...");
      socketRef.current?.disconnect();
    };
  }, [token, peerId]);

  const { ElementPlaced, ElementDeleted, PlayerMoved } =
    useEventHandlers(socketRef);

  useEffect(() => {
    const handlers: Record<string, (e: CustomEvent) => Promise<void> | void> = {
      ElementPlaced: ElementPlaced,
      ElementDeleted: ElementDeleted,
      PlayerMoved: PlayerMoved,
    };
    Object.entries(handlers).forEach(([eventName, handler]) => {
      window.addEventListener(eventName, handler as EventListener);
    });
    return () => {
      Object.entries(handlers).forEach(([eventName, handler]) => {
        window.removeEventListener(eventName, handler as EventListener);
      });
    };
  }, []);

  const addRemotePeerId = useCallback((remotePeerId: string) => {
    setRemotePeerIds((prev) => {
      if (prev.includes(remotePeerId)) {
        return prev;
      }
      return [...prev, remotePeerId];
    });
  }, []);

  console.log(usernameMap);

  return (
    <div className="grid grid-cols-[1fr_500px] h-screen w-screen overflow-hidden">
      <div className="relative">
        <VideoCallWrapper
          setPeerId={setPeerId}
          remotePeerIds={remotePeerIds}
          usernameMap={usernameMap}
        />
        <PhaserWrapper />
      </div>
      <CustomizeSidebar />
    </div>
  );
}

export default Space;
