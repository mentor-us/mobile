import React, {memo, useCallback} from "react";
import equals from "react-fast-compare";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import Helper from "~/utils/Helper";
import {FileModel} from "~/models/media";

import styles from "./styles";

import {images} from "~/assets/images";
import {Color} from "~/constants/Color";
import {AttachmentIcon, DownloadIcon, NotiFailed} from "~/assets/svgs";
import ToolApi from "~/api/remote/ToolApi";

interface Props {
  file: FileModel;
  onRemove?: (attachmentID: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const {width} = Dimensions.get("window");
const ITEM_WIDTH = 0.7 * width;

const File = ({file, containerStyle, onRemove = () => {}}: Props) => {
  const renderIcon = (fileName: string) => {
    const ext = Helper.getFileExtention(fileName);

    switch (ext) {
      case "doc":
      case "docx":
        return (
          <Image
            style={{height: 35, width: 31}}
            resizeMode={"contain"}
            source={images.docx}
          />
        );
      case "ppt":
      case "pptx":
        return (
          <Image
            style={{height: 35, width: 31}}
            resizeMode={"contain"}
            source={images.ppt}
          />
        );
      case "xls":
      case "xlsx":
        return (
          <Image
            style={{height: 35, width: 31}}
            resizeMode={"contain"}
            source={images.excel}
          />
        );

      case "pdf":
        return (
          <Image
            style={{height: 35, width: 31}}
            resizeMode={"contain"}
            source={images.pdf}
          />
        );
      default:
        return <AttachmentIcon />;
    }
  };

  const download = useCallback(async () => {
    await ToolApi.downloadFile(file.url, file.filename);
  }, [file.url]);

  return (
    <View style={containerStyle}>
      <View style={[styles.fileItemContainer, {width: ITEM_WIDTH}]}>
        <View style={styles.rowCtn}>
          {renderIcon(file.filename)}

          <View style={styles.fileCtn}>
            <View style={styles.infoCtn}>
              <Text numberOfLines={1} style={styles.fileName}>
                {file.filename}
              </Text>
              <Text numberOfLines={1} style={styles.fileSize}>
                {Helper.formatFileSize(file.size)}
              </Text>
            </View>

            {file.uploadStatus === "Success" && (
              <TouchableOpacity style={styles.dowloadBtn} onPress={download}>
                <DownloadIcon />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {file.uploadStatus === "Uploading" && (
        <View style={styles.statusLayer}>
          <ActivityIndicator size={"small"} color={Color.primary} />
        </View>
      )}

      {file.uploadStatus === "Fail" && (
        <View style={styles.failedLayer}>
          {/* <ActivityIndicator size={"small"} color={Color.primary} /> */}
          <NotiFailed />
          <Text style={styles.failedText}>Gửi file thất bại</Text>
        </View>
      )}
    </View>
  );
};

export default memo(File, equals);
