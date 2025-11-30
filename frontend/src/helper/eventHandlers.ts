import { useAddElementToSpace, useDeleteElementFromSpace } from "../api/space";
import toast from "react-hot-toast";

export function useEventHandlers(socketRef: any) {
  const { mutateAsync: functionAddElementToSpace } = useAddElementToSpace();
  const { mutateAsync: functionDeleteElementFromSpace } =
    useDeleteElementFromSpace();

  const ElementPlaced = async (e: CustomEvent) => {
    try {
      const { spaceId, x, y, element }: any = e.detail;
      const { _id } = element;
      const data: any = await functionAddElementToSpace({
        spaceId,
        x,
        y,
        elementId: _id,
      });
      if (data?.status === 200) {
        const placementId = data.data.id;
        window.dispatchEvent(
          new CustomEvent("placeElementInPhaser", {
            detail: {
              _id: placementId,
              element: e.detail.element,
              x,
              y,
            },
          })
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Element Placement Failed!");
    }
  };

  const ElementDeleted = async (e: CustomEvent) => {
    try {
      const { spaceId, elementPlacementId }: any = e.detail;
      const data: any = await functionDeleteElementFromSpace({
        spaceId,
        elementPlacementId,
      });
      const deletedElementId = data?.data?.deletedElementId;
      if (deletedElementId) {
        console.log("Deleted Element ID:", deletedElementId);
        window.dispatchEvent(
          new CustomEvent("DeleteElementInPhaser", {
            detail: {
              deletedElementId: deletedElementId,
            },
          })
        );
      } else {
        console.warn("No deletedElementId in response:", data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Element Deletion Failed!");
    }
  };

  const PlayerMoved = async (e: CustomEvent) => {
    try {
      const { x, y, spaceId }: any = e.detail;
      if (!socketRef.current) {
        console.log("not connected to socket");
        return;
      }
      socketRef.current?.emit("message", {
        type: "move",
        payload: { x: x, y: y, spaceId: spaceId },
      });
    } catch (err) {
      console.error(err);
    }
  };
  return { ElementPlaced, ElementDeleted, PlayerMoved };
}
