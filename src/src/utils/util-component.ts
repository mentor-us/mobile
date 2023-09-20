import React from "react";
import {PointProp} from "react-native";

import Helper from "./Helper";

import {
  BlankFile,
  DocsFile,
  JpegFile,
  JpgFile,
  Mp4,
  PdfFile,
  PngFile,
  PptFile,
  XlsFile,
} from "~/assets/svgs";

export function mapComponents<T>(
  data: Array<T>,
  mapItem: (item: T, index: number) => React.ReactNode,
  separatorItem?: (index: number) => React.ReactNode,
): Array<React.ReactNode> {
  const components: Array<React.ReactNode> = [];
  for (let index = 0; index < data.length; index++) {
    if (separatorItem && index > 0) {
      components.push(separatorItem(index));
    }
    components.push(mapItem(data[index], index));
  }
  return components;
}

export const mapProfileSelfUser = ({user}) => user.profile;

interface StaffCardStyle {
  localeKey: string;
  color: string;
  textColor: string;
}

export const getCoordinateByDegrees = (
  degrees: number,
  pointI: PointProp,
  r: number,
): PointProp => {
  const degrees_to_radians = (_degrees: number) => {
    const pi = Math.PI;
    return -_degrees * (pi / 180);
  };

  const x = pointI.x - r * Math.sin(degrees_to_radians(degrees));
  const y = pointI.y - r * Math.cos(degrees_to_radians(degrees));

  return {
    x,
    y,
  };
};

export const getIconFile = (fileName: string) => {
  switch (Helper.getExtensionFile(fileName)) {
    case "xls":
    case "xlsx":
      return XlsFile();

    case "pdf":
      return PdfFile();

    case "doc":
    case "docx":
      return DocsFile();

    case "ppt":
    case "pptx":
      return PptFile();

    case "png":
      return PngFile();

    case "jpg":
      return JpgFile();

    case "jpeg":
      return JpegFile();

    case "mov":
    case "mp4":
      return Mp4({width: 32});

    default:
      return BlankFile({width: 32});
  }
};
