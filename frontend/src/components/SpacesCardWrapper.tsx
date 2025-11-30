import { Search, Filter, SortDesc, Sparkles } from "lucide-react";
import { useState } from "react";
import { SpacePageTabs } from "../types";
import { useSpace } from "../api/space";
import { useNavigate } from "react-router-dom";

interface SpacesCardWrapperProps {
  selectedToggle: SpacePageTabs;
  setselectedToggle: (tab: SpacePageTabs) => void;
}

function SpacesCardWrapper({
  selectedToggle,
  setselectedToggle,
}: SpacesCardWrapperProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: spaces, isLoading } = useSpace();

  if (isLoading) {
    return (
      <div className="px-8 py-8 bg-gradient-to-br from-slate-900/30 to-emerald-900/10 min-h-[calc(100vh-122px)] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-8">
          {/* Animated Icon with Glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <Sparkles className="w-12 h-12 text-emerald-400 animate-spin relative z-10" />
          </div>

          {/* Loading Text */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              Loading your spaces
            </h3>
            <p className="text-slate-400 text-sm">Please wait a moment...</p>
          </div>

          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 bg-gradient-to-br from-slate-900/30 to-emerald-900/10 min-h-[calc(100vh-122px)]">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-3">
          <button
            className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform  ${
              selectedToggle === SpacePageTabs.LASTVISITED
                ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-400/30 shadow-lg shadow-emerald-500/10"
                : "text-slate-300   border border-slate-600/30 opacity-70"
            }`}
            // onClick={() => setselectedToggle(SpacePageTabs.LASTVISITED)}
          >
            <span>Last Visited</span>
            {selectedToggle === SpacePageTabs.LASTVISITED && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"></div>
            )}
          </button>

          <button
            className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
              selectedToggle === SpacePageTabs.CREATEDSPACES
                ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-400/30 shadow-lg shadow-emerald-500/10"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-600/30"
            }`}
            onClick={() => setselectedToggle(SpacePageTabs.CREATEDSPACES)}
          >
            <span>Created Spaces</span>
            {selectedToggle === SpacePageTabs.CREATEDSPACES && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"></div>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search spaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800/70 border border-slate-600/50 rounded-xl pl-12 pr-6 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 focus:bg-slate-800 w-80 font-medium transition-all duration-200 backdrop-blur-sm"
              />
              {searchQuery && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          <button className="flex items-center space-x-2 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-slate-300 hover:text-white rounded-xl transition-all duration-200 transform hover:scale-105 backdrop-blur-sm">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filter</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-slate-300 hover:text-white rounded-xl transition-all duration-200 transform hover:scale-105 backdrop-blur-sm">
            <SortDesc className="w-4 h-4" />
            <span className="font-medium">Sort</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {spaces?.map((space) => (
          <div
            key={space.id}
            className={`cursor-pointer rounded-xl border p-6 text-center transition-all duration-200 transform hover:scale-105 border-slate-600/40 text-slate-300 hover:text-white hover:bg-slate-700/40`}
            onClick={() => navigate(`/space/${space.id}`)}
          >
            <img src={space.thumbnail} alt="" />
            <p className="text-lg font-semibold capitalize mt-2 text-left">
              {space.name}
            </p>
          </div>
        ))}

        {spaces?.length == 0 && (
          <div className="col-span-full flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-400/30">
                <Search className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                {selectedToggle === SpacePageTabs.LASTVISITED
                  ? "No recent visits"
                  : "No created spaces"}
              </h3>
              <p className="text-slate-400 max-w-md">
                {selectedToggle === SpacePageTabs.LASTVISITED
                  ? "Spaces you visit will appear here for quick access"
                  : "Start creating amazing spaces and they'll show up here"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpacesCardWrapper;
