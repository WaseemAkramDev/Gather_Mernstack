import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
} from "lucide-react";
import VideoBox from "./VideoBox";
import { useNavigate } from "react-router-dom";

interface VideoCallBarProps {
  peerConnections: any;
  initializeUserMedia: any;
}

const VideoCallBar = React.forwardRef<HTMLVideoElement, VideoCallBarProps>(
  ({ peerConnections, initializeUserMedia }, currentUserVideoRef) => {
    const navigate = useNavigate();
    const [isMinimized, setIsMinimized] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [isAudioOn, setisAudioOn] = useState(false);

    const handleMuteToggle = () => {
      const newAudioState = !isAudioOn;
      initializeUserMedia(isVideoOn, newAudioState);
      setisAudioOn(newAudioState);
    };

    const handleVideoToggle = () => {
      const newVideoState = !isVideoOn;
      initializeUserMedia(newVideoState, isAudioOn);
      setIsVideoOn(newVideoState);
    };

    const totalParticipants = peerConnections.size + 1;

    const functionLeaveSpace = () => {
      navigate("/");
    };

    console.log(peerConnections);
    return (
      <div className="fixed top-0 left-0 right-0 z-50">
        <div
          className={`bg-gray-900 shadow-2xl transition-all duration-500 ease-in-out transform ${
            isMinimized
              ? "-translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <div className="p-4 pb-20">
            <div className={`flex gap-2 flex-wrap justify-start`}>
              <div className="w-[500px] relative bg-gray-800 rounded-lg overflow-hidden aspect-video shadow-lg border-2 transition-all duration-300 border-blue-500">
                {isVideoOn ? (
                  <video
                    ref={currentUserVideoRef}
                    muted
                    autoPlay
                    playsInline
                    className={`bg-gray-800 rounded-lg overflow-hidden aspect-video shadow-lg border-2 transition-all duration-300  border-blue-500`}
                  />
                ) : (
                  <div
                    className={`bg-gray-800 rounded-lg overflow-hidden aspect-video shadow-lg transition-all duration-300 flex items-center justify-center`}
                  >
                    <div className="text-white text-center">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span className="text-lg font-semibold">Y</span>
                      </div>
                      <p className="text-sm font-medium">You</p>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 flex gap-2">
                  <button
                    onClick={handleMuteToggle}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      !isAudioOn
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {!isAudioOn ? (
                      <MicOff size={16} className="text-white" />
                    ) : (
                      <Mic size={16} className="text-white" />
                    )}
                  </button>
                  <button
                    onClick={handleVideoToggle}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      !isVideoOn
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {!isVideoOn ? (
                      <VideoOff size={16} className="text-white" />
                    ) : (
                      <Video size={16} className="text-white" />
                    )}
                  </button>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    You
                  </span>
                </div>
              </div>
              {Array.from(peerConnections.values()).map((connection: any) => (
                <VideoBox key={connection.peerId} stream={connection.stream} />
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-95 backdrop-blur-sm border-t border-gray-700">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleMuteToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    !isAudioOn
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  }`}
                >
                  {!isAudioOn ? <MicOff size={20} /> : <Mic size={20} />}
                  <span className="hidden sm:inline">
                    {!isAudioOn ? "Unmute" : "Mute"}
                  </span>
                </button>
                <button
                  onClick={handleVideoToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    !isVideoOn
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  }`}
                >
                  {!isVideoOn ? <VideoOff size={20} /> : <Video size={20} />}
                  <span className="hidden sm:inline">
                    {!isVideoOn ? "Start Video" : "Stop Video"}
                  </span>
                </button>
              </div>
              <div className="flex justify-center items-center gap-2">
                <div className="text-white text-sm font-medium">
                  {totalParticipants} participant
                  {totalParticipants !== 1 ? "s" : ""}
                </div>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className={`z-60 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300`}
                >
                  {isMinimized ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronUp size={20} />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={functionLeaveSpace}
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200"
                >
                  <PhoneOff size={20} />
                  <span className="hidden sm:inline">Leave</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {isMinimized && (
          <div className="fixed top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              Call in progress • {totalParticipants} participants
            </span>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className={`z-60 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 ${
                isMinimized ? "translate-y-0" : "translate-y-2"
              }`}
            >
              {isMinimized ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronUp size={20} />
              )}
            </button>
            <button
              onClick={functionLeaveSpace}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200"
            >
              <PhoneOff size={20} />
              <span className="hidden sm:inline">Leave</span>
            </button>
          </div>
        )}
      </div>
    );
  }
);

VideoCallBar.displayName = "VideoCallBar";
export default VideoCallBar;
