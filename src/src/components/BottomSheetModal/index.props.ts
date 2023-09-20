import {createRef} from "react";

export type ModalType =
  | "emoji_reaction"
  | "gallery"
  | "image_slider"
  | "user_reacted"
  | "choice_result"
  | "status_box"
  | "group_chat_threads";

export interface BottomSheetRef {
  hide: () => void;
  show: (key: ModalType, data?: any, action?: any) => void;
}

export const BottomSheetModalRef = createRef<BottomSheetRef>();
