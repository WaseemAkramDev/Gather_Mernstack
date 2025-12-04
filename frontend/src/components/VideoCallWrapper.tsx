import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import VideoCallBar from "./VideoCallBar";

interface VideoCallWrapperProps {
  setPeerId: (id: string) => void;
  remotePeerIds: string[];
  usernameMap?: any;
}

interface PeerConnection {
  peerId: string;
  call: any;
  stream: MediaStream | null;
}

function VideoCallWrapper({
  setPeerId,
  remotePeerIds,
  usernameMap,
}: VideoCallWrapperProps) {
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);
  const userMediaStream = useRef<MediaStream | null>(null);
  const [peerConnections, setPeerConnections] = useState<
    Map<string, PeerConnection>
  >(new Map());
  const [mediaStream, setmediaStream] = useState<any>(null);

  const initializeUserMedia = async (
    isVideoOn: boolean,
    isAudioOn: boolean
  ): Promise<void | null> => {
    try {
      if (!isVideoOn && !isAudioOn) {
        if (userMediaStream.current) {
          userMediaStream.current.getTracks().forEach((track) => track.stop());
          userMediaStream.current = null;
        }
        setmediaStream(null);
        return;
      }
      if (userMediaStream.current) {
        const videoTrack = userMediaStream.current.getVideoTracks()[0];
        const audioTrack = userMediaStream.current.getAudioTracks()[0];
        const hasVideo = !!videoTrack;
        const hasAudio = !!audioTrack;
        if (hasVideo === isVideoOn && hasAudio === isAudioOn) {
          setmediaStream(userMediaStream.current);
          return;
        }
        userMediaStream.current.getTracks().forEach((track) => track.stop());
        userMediaStream.current = null;
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: isVideoOn,
        audio: isAudioOn,
      });
      userMediaStream.current = mediaStream;
      setmediaStream(mediaStream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      return null;
    }
  };

  const addPeerConnection = (
    peerId: string,
    call: any,
    stream: MediaStream | null = null
  ) => {
    setPeerConnections((prev) => {
      const newConnections = new Map(prev);
      newConnections.set(peerId, { peerId, call, stream });
      return newConnections;
    });
  };

  const updatePeerStream = (peerId: string, stream: MediaStream) => {
    setPeerConnections((prev) => {
      const newConnections = new Map(prev);
      const existing = newConnections.get(peerId);
      if (existing) {
        newConnections.set(peerId, { ...existing, stream });
      }
      return newConnections;
    });
  };

  const removePeerConnection = (peerId: string) => {
    setPeerConnections((prev) => {
      const newConnections = new Map(prev);
      const connection = newConnections.get(peerId);
      if (connection) {
        connection.call.close();
        newConnections.delete(peerId);
      }
      return newConnections;
    });
  };

  const call = async (remotePeerId: string): Promise<void> => {
    if (!peerInstance.current) return;
    try {
      peerInstance.current.connect(remotePeerId);
      const call = peerInstance.current.call(
        remotePeerId,
        userMediaStream.current || new MediaStream()
      );
      addPeerConnection(remotePeerId, call);
      call.on("stream", (remoteStream: MediaStream) => {
        updatePeerStream(remotePeerId, remoteStream);
      });
      call.on("close", () => {
        removePeerConnection(remotePeerId);
      });
      call.on("error", (error) => {
        console.error("Call error:", error);
        removePeerConnection(remotePeerId);
      });
    } catch (error) {
      console.error("Error making call:", error);
    }
  };

  useEffect(() => {
    const peer = new Peer();
    peer.on("open", (id: string) => {
      setPeerId(id);
    });
    peer.on("call", async (call: any) => {
      const remotePeerId = call.peer;
      const streamToAnswer = userMediaStream.current || new MediaStream();
      call.answer(streamToAnswer);
      addPeerConnection(remotePeerId, call);
      call.on("stream", (remoteStream: MediaStream) => {
        updatePeerStream(remotePeerId, remoteStream);
      });
      call.on("close", () => {
        removePeerConnection(remotePeerId);
      });
      call.on("error", (error: any) => {
        console.error("Call error:", error);
        removePeerConnection(remotePeerId);
      });
    });
    peer.on("error", (error) => {
      console.error("Peer error:", error);
    });
    peerInstance.current = peer;
    return () => {
      peerConnections.forEach((connection) => {
        connection.call.close();
      });
      if (userMediaStream.current) {
        userMediaStream.current.getTracks().forEach((track) => track.stop());
      }
      if (peerInstance.current) {
        peerInstance.current.destroy();
      }
    };
  }, [setPeerId]);

  useEffect(() => {
    const currentPeerIds = new Set(peerConnections.keys());
    const newPeerIds = new Set(remotePeerIds);
    currentPeerIds.forEach((peerId) => {
      if (!newPeerIds.has(peerId)) {
        removePeerConnection(peerId);
      }
    });
    remotePeerIds.forEach((peerId) => {
      if (!currentPeerIds.has(peerId)) {
        call(peerId);
      }
    });
  }, [remotePeerIds]);

  useEffect(() => {
    if (mediaStream && currentUserVideoRef.current) {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();
    }
  }, [mediaStream]);

  useEffect(() => {
    if (peerConnections.size === 0) {
      console.log("No connections to update");
      return;
    }
    const reconnectAllPeers = async () => {
      try {
        const peersToReconnect = Array.from(peerConnections.keys());
        const closePromises = peersToReconnect.map((peerId) => {
          const connection = peerConnections.get(peerId);
          if (connection?.call) {
            return new Promise<void>((resolve) => {
              connection.call.on("close", () => resolve());
              connection.call.close();
            });
          }
          return Promise.resolve();
        });
        setPeerConnections(new Map());
        await Promise.all(closePromises);
        console.log("All connections closed");
        await new Promise((resolve) => setTimeout(resolve, 300));
        for (let i = 0; i < peersToReconnect.length; i++) {
          const peerId = peersToReconnect[i];
          try {
            await call(peerId);
            if (i < peersToReconnect.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          } catch (error) {
            console.error(`Failed to reconnect to ${peerId}:`, error);
          }
        }
        console.log("Reconnection process completed");
      } catch (error) {
        console.error("Error during reconnection process:", error);
      }
    };
    const timeoutId = setTimeout(reconnectAllPeers, 100);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [mediaStream]);

  return (
    <VideoCallBar
      ref={currentUserVideoRef}
      peerConnections={peerConnections}
      initializeUserMedia={initializeUserMedia}
      usernameMap={usernameMap}
    />
  );
}

export default VideoCallWrapper;
