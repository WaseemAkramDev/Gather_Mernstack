import { useEffect, useRef } from "react";

interface VideoBoxProps {
  stream?: MediaStream | null;
}

function VideoBox({ stream }: VideoBoxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  const hasVideo = !!stream?.getVideoTracks().length;
  const hasAudio = !!stream?.getAudioTracks().length;
  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video shadow-lg border-2 border-gray-700 transition-all duration-300 hover:scale-105 w-[500px]">
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
          <div className="text-white text-center">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-2 mx-auto">
              <span className="text-lg font-semibold">U</span>
            </div>
            <p className="text-sm font-medium">User</p>
            {hasAudio && (
              <p className="text-xs text-green-400 mt-1">Audio only</p>
            )}
          </div>
          {hasAudio && (
            <div className="absolute bottom-3 right-3">
              <div className="flex items-center space-x-1">
                <div className="w-1 h-2 bg-green-400 rounded animate-pulse"></div>
                <div
                  className="w-1 h-4 bg-green-400 rounded animate-pulse"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1 h-3 bg-green-400 rounded animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-1 h-5 bg-green-400 rounded animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                ></div>
              </div>
            </div>
          )}
          {hasAudio && !hasVideo && (
            <audio ref={videoRef} autoPlay className="hidden" />
          )}
        </div>
      )}
    </div>
  );
}

export default VideoBox;
