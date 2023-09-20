import {MediaAttachment, StorageMediaAttachemt} from "~/models/media";
import axiosClient from "./AxiosClient";
import FormData from "form-data";
import {Alert, Platform} from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import Helper from "~/utils/Helper";
import {MAX_SIZE_IMG} from "~/constants";
import {CameraRoll} from "@react-native-camera-roll/camera-roll";

const ToolApi = {
  uploadMessageImages: async (
    messageId: string,
    images: StorageMediaAttachemt[],
    groupId: string,
    senderId: string,
  ): Promise<boolean> => {
    const URL = `api/messages/images`;

    try {
      const formData = new FormData();

      images.map(item => {
        formData.append("files", {
          name: item.filename,
          uri:
            Platform.OS === "ios"
              ? item.path.replace("file://", "")
              : item.path,
          type: "multipart/form-data",
        });
      });

      formData.append("id", messageId);
      formData.append("groupId", groupId);
      formData.append("senderId", senderId);

      await axiosClient.post(URL, formData, {
        timeout: 20000,
        headers: {
          accept: "application/json",
          "content-type": "multipart/form-data",
        },
      });
      // console.log("@API_ToolApi_uploadImages_RES:", res);
      return true;
    } catch (error) {
      console.log("@API_ToolApi_uploadImages_ERROR:", error);
      return false;
    }
  },

  uploadMessageFile: async (
    messageId: string,
    file: MediaAttachment,
    groupId: string,
    senderId: string,
  ) => {
    const URL = `api/messages/file`;

    try {
      const formData = new FormData();

      formData.append("file", {
        name: file.filename,
        uri:
          Platform.OS === "ios" ? file.path.replace("file://", "") : file.path,
        type: "multipart/form-data",
      });

      formData.append("id", messageId);
      formData.append("groupId", groupId);
      formData.append("senderId", senderId);

      const res = await axiosClient.post(URL, formData, {
        timeout: 20000,
        headers: {
          accept: "application/json",
          "content-type": "multipart/form-data",
        },
      });

      console.log("@API_ToolApi_uploadMessageFile_RES:", res);

      return res;
    } catch (error) {
      console.log("@API_ToolApi_uploadMessageFile_ERROR:", error);
      Alert.alert(
        "Thông báo",
        `Kích thước tập tin vượt quá ${Helper.formatFileSize(MAX_SIZE_IMG)}`,
      );
      return "";
    }
  },

  downloadFile: async (url: string, filename: string) => {
    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const {config, fs} = RNFetchBlob;
    const RootDir = fs.dirs.DownloadDir;
    const options = {
      fileCache: true,
      addAndroidDownloads: {
        path: RootDir + "/MentorUs/" + filename.trim(),
        description: "Đang tải về...",
        title: filename,
        notification: true,
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch("GET", url)
      .then(res => {
        // Alert after successful downloading
        console.log("res -> ", JSON.stringify(res));
        // alert("Tải về thành công.");
        Alert.alert("Thông báo", "Tải về thành công.");
      });
  },

  saveImage: async (url: string, filename: string) => {
    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    if (Platform.OS == "android") {
      const {config, fs} = RNFetchBlob;
      const PictureDir = fs.dirs.PictureDir;
      const path = PictureDir + "/MentorUs/" + filename;
      const options = {
        fileCache: true,
        path: path,
        addAndroidDownloads: {
          path: path,
          description: "Đang tải về...",
          title: filename,
          notification: true,
          useDownloadManager: true,
        },
      };
      const result = await config(options).fetch("GET", url);
      return result;
    } else {
      await CameraRoll.save(url);
    }
  },

  updateAvatar: async (image: StorageMediaAttachemt): Promise<string> => {
    const URL = `api/users/avatar`;

    try {
      const formData = new FormData();

      formData.append("file", {
        name: image.filename,
        uri:
          Platform.OS === "ios"
            ? image.path.replace("file://", "")
            : image.path,
        type: "multipart/form-data",
      });

      const res = await axiosClient.post(URL, formData, {
        timeout: 20000,
        headers: {
          accept: "application/json",
          "content-type": "multipart/form-data",
        },
      });
      console.log("@API_ToolApi_updateAvatar_RES:", res);
      if (res) {
        return res.data;
      }
      return "";
    } catch (error) {
      console.log("@API_ToolApi_updateAvatar_ERROR:", error);
      return "";
    }
  },

  updateWallpaper: async (image: StorageMediaAttachemt): Promise<string> => {
    const URL = `api/users/wallpaper`;

    try {
      const formData = new FormData();

      formData.append("file", {
        name: image.filename,
        uri:
          Platform.OS === "ios"
            ? image.path.replace("file://", "")
            : image.path,
        type: "multipart/form-data",
      });

      const res = await axiosClient.post(URL, formData, {
        timeout: 20000,
        headers: {
          accept: "application/json",
          "content-type": "multipart/form-data",
        },
      });
      if (res) {
        return res.data;
      }
      return "";
    } catch (error) {
      console.log("@API_ToolApi_updateWallpaper_ERROR:", error);
      return "";
    }
  },

  updateGroupAvatar: async (
    image: StorageMediaAttachemt,
    groupId: string,
  ): Promise<string> => {
    const URL = `api/groups/${groupId}/avatar`;

    try {
      const formData = new FormData();

      formData.append("file", {
        name: image.filename,
        uri:
          Platform.OS === "ios"
            ? image.path.replace("file://", "")
            : image.path,
        type: "multipart/form-data",
      });

      formData.append("groupId", groupId);

      const res = await axiosClient.post(URL, formData, {
        timeout: 20000,
        headers: {
          accept: "application/json",
          "content-type": "multipart/form-data",
        },
      });
      if (res) {
        return res.data;
      }
      return "";
    } catch (error) {
      console.log("@API_ToolApi_updateGroupAvatar_ERROR:", error);
      return "";
    }
  },
};

export default ToolApi;
