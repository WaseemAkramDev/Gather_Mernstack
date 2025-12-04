import { useState, useCallback, useMemo } from "react";
import { useElements } from "../api/maps";
import { AlertCircle, Loader2, Search, Trash, X } from "lucide-react";

interface IElement {
  _id: string;
  name: string;
  imageUrl: string;
  visible: boolean;
  static: boolean;
}

const GRID_CONFIG = {
  columns: 3,
  itemHeight: "h-36",
  gap: "gap-3",
} as const;

const CustomizeSidebar = () => {
  const [selectedTool, setSelectedTool] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [carriedElement, setCarriedElement] = useState<IElement | null>(null);

  const { data: elements, isLoading, error, refetch } = useElements();

  const filteredElements = useMemo(() => {
    if (!elements) return [];
    const query = searchQuery.toLowerCase().trim();
    return elements.filter((element: IElement) => {
      return (
        element.name.toLowerCase().includes(query) &&
        element.visible &&
        !element.static
      );
    });
  }, [elements, searchQuery]);

  const functionRestoreMouse = () => {
    setCarriedElement(null);
    const restoreMouseEvent = new CustomEvent("restoreMouse");
    window.dispatchEvent(restoreMouseEvent);
    return;
  };

  const handleDeleteMode = () => {
    if (selectedTool == "undo") {
      setSelectedTool(null);
      const deleteEvent = new CustomEvent("exitDeleteMode");
      window.dispatchEvent(deleteEvent);
      return;
    }
    setSelectedTool("undo");
    functionRestoreMouse();
    const deleteEvent = new CustomEvent("inDeleteMode");
    window.dispatchEvent(deleteEvent);
  };

  const handleElementClick = useCallback(
    (element: IElement, event: React.MouseEvent) => {
      event.preventDefault();
      if (carriedElement?._id === element._id) {
        functionRestoreMouse();
        return;
      }
      if (selectedTool == "undo") {
        handleDeleteMode();
      }
      setCarriedElement(element);
      const pickupEvent = new CustomEvent("imagePickedUp", {
        detail: { elementData: element },
      });
      window.dispatchEvent(pickupEvent);
    },
    [carriedElement, selectedTool]
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    []
  );

  const isElementCarried = useCallback(
    (elementId: string) => {
      return carriedElement?._id === elementId;
    },
    [carriedElement]
  );

  const getElementCardClasses = useCallback(
    (element: IElement) => {
      const baseClasses =
        "group relative flex flex-col items-center justify-between p-3 rounded-xl transition-all duration-300 ease-out border";
      const hoverClasses = "hover:scale-105 hover:shadow-2xl";
      const defaultClasses =
        "bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/60 hover:border-slate-600/60";
      const carriedClasses = isElementCarried(element._id)
        ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-400/60 scale-105 shadow-xl shadow-emerald-500/25"
        : defaultClasses;
      const cursorClasses = carriedElement
        ? "cursor-crosshair"
        : "cursor-pointer";
      return `${baseClasses} ${hoverClasses} ${carriedClasses} ${cursorClasses} ${GRID_CONFIG.itemHeight}`;
    },
    [carriedElement, isElementCarried]
  );

  const renderElementCard = (element: IElement) => (
    <div
      key={element._id}
      className={getElementCardClasses(element)}
      onClick={(event) => handleElementClick(element, event)}
      role="button"
      tabIndex={0}
      aria-label={`Select ${element.name}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleElementClick(element, event as any);
        }
      }}
    >
      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden rounded-lg mb-2">
        <div className="relative">
          <img
            src={element.imageUrl}
            alt={element.name}
            className="max-w-full max-h-20 object-contain pointer-events-none rounded-md 
                       transition-all duration-300 group-hover:scale-110"
            crossOrigin="anonymous"
            draggable={false}
            loading="lazy"
          />
          {isElementCarried(element._id) && (
            <div>
              <div
                className="absolute -top-1 right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 
                            rounded-full border-2 border-white animate-pulse shadow-lg"
              ></div>
            </div>
          )}
        </div>
        {isElementCarried(element._id) && (
          <button
            className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-base text-white hover:text-white 
                          rounded-md transition-all duration-200 font-medium border border-transparent "
          >
            Click to cancel
          </button>
        )}
      </div>
      <div
        className="text-xs text-slate-200 text-center truncate w-full capitalize font-medium 
                      pointer-events-none transition-colors group-hover:text-white"
      >
        {element.name}
      </div>
      <div
        className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/5 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      ></div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex items-center justify-center p-12">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-400" size={32} />
          <div className="absolute inset-0 animate-ping">
            <Loader2 className="text-blue-400/30" size={32} />
          </div>
        </div>
        <p className="text-sm text-slate-300 font-medium">
          Loading elements...
        </p>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex items-center justify-center p-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-3 rounded-full bg-red-500/20 border border-red-500/30">
          <AlertCircle size={32} className="text-red-400" />
        </div>
        <div>
          <p className="text-sm text-slate-300 font-medium mb-2">
            Failed to load elements
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg 
                       hover:from-blue-700 hover:to-blue-800 transition-all duration-200 
                       shadow-lg hover:shadow-xl font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="col-span-3 flex flex-col items-center justify-center p-12 text-center">
      <div className="p-4 rounded-full bg-slate-700/50 border border-slate-600/50 mb-4">
        <Search size={32} className="text-slate-400" />
      </div>
      <p className="text-slate-300 font-medium mb-2">
        {searchQuery
          ? `No elements found for "${searchQuery}"`
          : "No elements available"}
      </p>
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Clear search
        </button>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-6 border-b border-slate-700/50 flex-shrink-0 bg-slate-800/30">
          <div className="relative flex items-center justify-start w-full gap-4">
            {" "}
            <div>
              {selectedTool == "undo" ? (
                <div
                  onClick={handleDeleteMode}
                  className="text-base font-semibold cursor-pointer hover:underline"
                >
                  Cancel
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center hover:text-red-500 cursor-pointer"
                  onClick={handleDeleteMode}
                >
                  <Trash
                    size={22}
                    className="group-hover:drop-shadow-lg group-hover:animate-pulse"
                    strokeWidth={1.5}
                  />
                  <div className="text-xs font-medium">Delete</div>
                </div>
              )}
            </div>
            <div
              className="w-full flex items-center bg-slate-800/70 rounded-xl px-4 py-3 
                            border border-slate-600/50 transition-all duration-200 
                            focus-within:border-blue-400/70 focus-within:shadow-lg focus-within:shadow-blue-500/20"
            >
              <Search size={20} className="text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Search elements..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
                aria-label="Search elements"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-3 p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-all duration-200"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Elements Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-transparent to-slate-900/30">
          {error ? (
            renderErrorState()
          ) : isLoading ? (
            renderLoadingState()
          ) : (
            <div className={`grid grid-cols-3 ${GRID_CONFIG.gap}`}>
              {filteredElements.length > 0
                ? filteredElements.map(renderElementCard)
                : renderEmptyState()}
            </div>
          )}
        </div>

        {carriedElement && (
          <div
            className="p-4 bg-slate-800/80 border-t border-slate-700/50 
                          flex items-center gap-3 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300">Carrying:</span>
                <span className="text-sm font-semibold text-white bg-slate-700/70 px-2 py-1 rounded-md border border-slate-600/50">
                  {carriedElement.name}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizeSidebar;
