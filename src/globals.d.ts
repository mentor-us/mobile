import {MentorUsRoutes} from "~/types/navigation";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MentorUsRoutes.AllRoute {}
  }

  /** Just for flatlist */
  interface RenderItemType<T> {
    item: T;
    index: number;
  }

  namespace Caching {
    interface ImageItem {
      size: {width: number; height: number};
      uri: string;
    }
  }

  type RatioImage = "2:1" | "1:1" | "2:3";

  namespace Social {
    interface MediaItem {
      url?: string;

      type: Extract<AttachmentType, "VIDEO" | "IMAGE">;
      isLoading?: boolean;

      /**Local asset */
      assetLocal?: ImageRequireSource;
    }

    type AttachmentType = "VIDEO" | "IMAGE" | "Event" | "LINK" | "FILE" | "GIF";

    /**Pair-key to format mention user
     * @param key User id
     * @param value User name
     */
    interface PairKeyMention {
      [key: string]: string;
    }
  }

  namespace File {
    type FileExtension =
      | "pdf"
      | "doc"
      | "docx"
      | "ppt"
      | "pptx"
      | "xls"
      | "xlsx"
      | "mp4"
      | "mov"
      | "png"
      | "jpg"
      | "jpeg"
      | "heic"
      | "webp";
  }
}

export namespace MeetingMobx {
  type ScreenType = "form" | "select_group" | "select_attendee";
  type DatePickerStatus = "from" | "to" | "date" | "hide";
}

export namespace TaskMobx {
  type ScreenType = "form" | "select_group" | "select_assignee";
  type DatePickerStatus = "time" | "date" | "hide";
}

export namespace ChannelMobx {
  type ScreenType = "form" | "select_assignee";
}
