import { useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Phaser from "phaser";

import { useSpaceDetails } from "../api/space";
import SpaceScene from "../phaser/phaser";
import type { PhaserGameConfig, User } from "../types";
import toast from "react-hot-toast";
import { AlertCircle, Sparkles } from "lucide-react";

export default function PhaserWrapper() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const queryClient = useQueryClient();
  const { spaceId } = useParams<{ spaceId: string }>();

  const { data: spaceDetails, isLoading: isSpaceLoading } = useSpaceDetails(
    spaceId!
  );

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

  const handleResize = () => {
    if (gameRef.current?.scale) {
      gameRef.current.scale.resize(
        Math.max(window.innerWidth - 500, 800),
        Math.max(window.innerHeight, 600)
      );
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!hasRequiredData) return;
    initializeGame();
    return destroyGame;
  }, [hasRequiredData]);

  if (!spaceId) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-400/30">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Invalid Space</h2>
          <p className="text-slate-400 max-w-md">
            No space ID provided. Please check the URL and try again.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/30 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <Sparkles className="w-16 h-16 text-emerald-400 animate-spin relative z-10" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Loading space
            </h2>
            <p className="text-slate-400">Initializing your environment...</p>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
          <div className="w-48 h-1 bg-slate-700/50 rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full animate-pulse"
              style={{
                width: "60%",
                animation: "shimmer 2s infinite",
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasRequiredData) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400/20 to-rose-400/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-400/30">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Unable to load space
          </h2>
          <p className="text-slate-400 max-w-md">
            {!spaceDetails
              ? "Missing space details."
              : "An error occurred while loading the space."}
            <br />
            <span className="text-xs text-slate-500 mt-2 block">
              Please refresh the page or contact support if the problem
              persists.
            </span>
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
