import { UserProfileModel } from "./user";

export interface ImageUploadData {
  big: string;
  thumbnail: string;
}

export interface VideoUploadData {
  url: string;
}

export interface FileUploadData {
  url: string;
}

export interface FileModel {
  filename: string;
  size?: number | null;
  url: string;
  uploadStatus: "Uploading" | "Success" | "Standby" | "Fail";
}

export interface MediaAttachment {
  id: string;
  filename: string;
  mime?: string;
  size?: number | null;
  path: string;
  uploadStatus: "Uploading" | "Success" | "Standby" | "Fail";
  isUploaded: boolean;
  isSelected: boolean;
  duration?: number | null;
  uploadData?: ImageUploadData | VideoUploadData;
}

export namespace UtilRequest {
  export interface UploadMedia {
    id: string;
    uri: string;
    type: "image" | "file" | "video";
    name?: string;
  }
}

export interface UploadAttachment {
  id: string;
  filename: string;
  mime?: string;
  size: number | null;
  path: string;
  duration?: number | null;
  origin: "storage" | "camera";
}

export interface StorageMediaAttachemt extends UploadAttachment {
  selectedIndex: number;
}

export interface UploadedAttachment {
  id: string;
  type: "image" | "video" | "file";
  data: ImageUploadedData | FileUploadedData;
}

export interface ImageUploadedData {
  big: string;
  thumbnail: string;
}

export interface FileUploadedData {
  name: string;
  url: string;
  size: number;
}

export interface LinkUploadedData {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}

export interface ImageAttachment {
  type: "IMAGE";
  image: ImageUploadedData[];
}

export interface GifAttachment {
  type: "GIF";
  gif: ImageUploadedData[];
}

export interface MediaImageAttachment {
  type: "MEDIA";
  media: MediaAttachment;
}

export interface FileAttachment {
  type: "FILE";
  file: FileUploadedData;
}

export interface LinkAttachment {
  type: "LINK";
  link: LinkUploadedData;
}

export interface ShortMedia {
  id: string;
  sender: UserProfileModel;
  imageUrl: string;
  file: FileModel;
  type: "IMAGE" | "FILE";
  createdDate: string;
  time: {
    time: string; //hh:mm
    date: string; // dd/mm/yyyy
    displayName: string;
  }
}

export interface ShortMediaList {
  images: ShortMedia[];
  files: ShortMedia[];
}
