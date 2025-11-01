import { useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Phaser from "phaser";

import { useSpaceDetails } from "../api/space";
import SpaceScene from "../phaser/phaser";
import type { PhaserGameConfig, User } from "../types";
import toast from "react-hot-toast";

export default function PhaserWrapper() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const queryClient = useQueryClient();
  const { spaceId } = useParams<{ spaceId: string }>();

  const {
    data: spaceDetails,
    isLoading: isSpaceLoading,
    error: spaceError,
  } = useSpaceDetails(spaceId!);

  const user = queryClient.getQueryData<User>(["user"]);

  const isLoading = isSpaceLoading;
  const hasRequiredData = spaceDetails && user && spaceId;

  const createPhaserGame = useCallback((config: PhaserGameConfig) => {
    const { spaceDetails, user, spaceId } = config;
    return new Phaser.Game({
      type: Phaser.AUTO,
      parent: "game-container",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: Math.max(window.innerWidth - 500, 800),
        height: Math.max(window.innerHeight, 600),
      },
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
          gravity: { x: 0, y: 0 },
        },
      },
      scene: new SpaceScene(
        spaceDetails,
        "https://dynamic-assets.gather.town/v2/sprite-profile/avatar-ty0CoZao8eIAgVnSKFg7.oQePaZCdEjy7bEWWLzb8.RjHZpJroqxJb85HeASYK.uelBgm8fS0qdpl7vVBoj.K6tbhYXBDUPkIw6ijSvq.RhTmC28lTQJ7MKeDlGwn.png?d=.",
        user,
        spaceId
      ),
      backgroundColor: "#000000",
      input: true,
    });
  }, []);

  const destroyGame = useCallback(() => {
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  }, []);

  const initializeGame = useCallback(() => {
    if (!hasRequiredData) return;
    destroyGame();
    try {
      gameRef.current = createPhaserGame({
        spaceDetails,
        user,
        spaceId,
      });
    } catch (error) {
      toast.error("Failed to initialize Phaser game:");
      console.error("Failed to initialize Phaser game:", error);
    }
  }, [
    hasRequiredData,
    spaceDetails,
    user,
    spaceId,
    createPhaserGame,
    destroyGame,
  ]);

  useEffect(() => {
    const handleResize = () => {
      if (gameRef.current?.scale) {
        gameRef.current.scale.resize(
          Math.max(window.innerWidth - 500, 800),
          Math.max(window.innerHeight, 600)
        );
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    initializeGame();
    return destroyGame;
  }, [initializeGame, destroyGame]);

  if (spaceError) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-semibold mb-2">Failed to load game</h2>
          <p className="text-gray-400">
            {spaceError?.message || "An error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!spaceId) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-semibold mb-2">Invalid Space</h2>
          <p className="text-gray-400">No space ID provided</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-400">Please log in to access this space</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading space...</p>
        </div>
      </div>
    );
  }

  if (!hasRequiredData) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-semibold mb-2">Unable to load space</h2>
          <p className="text-gray-400">
            Missing required data: {!spaceDetails && "space details"}{" "}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      <div
        id="game-container"
        className="w-full h-full"
        style={{ minWidth: "800px", minHeight: "600px" }}
      />
    </div>
  );
}
