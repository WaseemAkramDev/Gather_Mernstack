import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMaps } from "../api/maps";
import { useCreateSpace } from "../api/space";

function CreateSpacePage() {
  const navigate = useNavigate();
  const { data: mapData, isLoading } = useMaps();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [spaceName, setSpaceName] = useState("");
  const [isCreating, setisCreating] = useState(false);

  const createSpaceMutation = useCreateSpace();

  const handleCreate = async () => {
    if (!selectedTemplate || !spaceName) return;
    try {
      setisCreating(true);
      await createSpaceMutation.mutateAsync({
        name: spaceName,
        dimensions: selectedTemplate.dimensions,
        thumbnail: selectedTemplate.thumbnail,
        mapId: selectedTemplate._id,
      });
      navigate("/app");
    } catch (error) {
      console.error("Failed to create space:", error);
    } finally {
      setisCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/30 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-16 h-16">
            <Sparkles className="w-16 h-16 text-emerald-400 absolute animate-spin" />
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-lg font-semibold text-white">Loading spaces</p>
            <div className="flex space-x-1">
              <span
                className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></span>
              <span
                className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          </div>
          <div className="w-48 h-1 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full animate-pulse"
              style={{
                width: "60%",
                animation: "shimmer 2s infinite",
              }}
            ></div>
          </div>
        </div>
        <style>{`
          @keyframes shimmer {
            0%, 100% { width: 30%; opacity: 0.6; }
            50% { width: 70%; opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/30 px-6 py-10 flex flex-col items-center">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-white mb-6 hover:scale-120 transition-transform cursor-pointer fixed left-20 top-20"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>{" "}
      <div className="flex flex-col justify-center items-center fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center space-x-2">
          <Sparkles className="w-7 h-7 text-emerald-400" />
          <span>Create Space</span>
        </h1>
        <div className="w-full max-w-3xl bg-slate-800/50 rounded-2xl shadow-lg backdrop-blur-md p-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            {mapData?.map((map) => {
              const isDisabled = map.name.toLowerCase() !== "courtyard";
              return (
                <div
                  key={map._id}
                  onClick={() => !isDisabled && setSelectedTemplate(map)}
                  className={`rounded-xl border p-6 text-center transition-all duration-200 ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer transform hover:scale-105"
                  } ${
                    selectedTemplate?._id === map._id
                      ? "border-emerald-400 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 shadow-lg shadow-emerald-500/10"
                      : "border-slate-600/40 text-slate-300 hover:text-white hover:bg-slate-700/40"
                  }`}
                >
                  <img
                    src={map.thumbnail}
                    alt=""
                    className={isDisabled ? "grayscale" : ""}
                  />
                  <p className="text-lg font-semibold capitalize mt-2">
                    {map.name}
                  </p>
                  {isDisabled && (
                    <span className="text-xs text-slate-500 mt-1 block">
                      Coming Soon
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="mb-8">
            <label className="block text-slate-300 mb-2 text-sm font-medium">
              Space Name
            </label>
            <input
              type="text"
              placeholder="Enter your space name..."
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={!selectedTemplate || !spaceName || isCreating}
            className="relative w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
            <Sparkles className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10">Create Space</span>{" "}
            {isCreating && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSpacePage;
