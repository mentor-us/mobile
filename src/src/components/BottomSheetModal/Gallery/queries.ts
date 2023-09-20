import {CameraRoll} from "@react-native-camera-roll/camera-roll";
import {useInfiniteQuery} from "@tanstack/react-query";
import {StorageMediaAttachemt} from "~/models/media";
import Helper from "~/utils/Helper";

const PAGE_SIZE = 20;

export function useQueryGallery() {
  const data = useInfiniteQuery({
    queryKey: ["gallery"],
    queryFn: async (): Promise<StorageMediaAttachemt[]> => {
      try {
        const raw = await CameraRoll.getPhotos({
          first: PAGE_SIZE,
          assetType: "Photos",
          include: ["filename", "imageSize", "fileSize", "playableDuration"],
        });

        return Helper.formatMediaList(raw);
      } catch (error) {
        console.log("@ERROR - useQueryGallery: ", error);
        return [];
      }
    },
    getNextPageParam: (lastPage, allPage) => {
      return lastPage.length == PAGE_SIZE ? allPage.length : undefined;
    },
    enabled: true,
  });

  return data;
}
