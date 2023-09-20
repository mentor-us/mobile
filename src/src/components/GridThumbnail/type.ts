import { LayoutRectangle } from "react-native";

export interface IBaseGridThumbnail {
  mediaData: Social.MediaItem[];
  layoutFirst: Omit<LayoutRectangle, "x" | "y">;
}

export type ThumbnailPressFunction = (
  item: Social.MediaItem,
  index: number
) => void;
