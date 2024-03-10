import React, { memo } from "react";
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
import { FileModel } from "~/models/media";

import styles from "./styles";

import { images } from "~/assets/images";
import { Color } from "~/constants/Color";
import { AttachmentIcon, DownloadIcon, NotiFailed } from "~/assets/svgs";
import ToolApi from "~/api/remote/ToolApi";
import Permission from "~/utils/PermissionStrategies";
import LOG from "~/utils/Logger";
import Toast from "react-native-root-toast";

interface FileProps {
  file: FileModel;
  onRemove?: (attachmentID: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  isDownloadable: Boolean;
}

const { width } = Dimensions.get("window");
const ITEM_WIDTH = 0.7 * width;

const File = ({
  file,
  containerStyle,
  onRemove = () => {},
  isDownloadable,
}: FileProps) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const renderIcon = (fileName: string) => {
    const ext = Helper.getFileExtention(fileName);

    switch (ext) {
      case "doc":
      case "docx":
        return (
          <Image
            style={{ height: 35, width: 31 }}
            resizeMode={"contain"}
            source={images.docx}
          />
        );
      case "ppt":
      case "pptx":
        return (
          <Image
            style={{ height: 35, width: 31 }}
            resizeMode={"contain"}
            source={images.ppt}
          />
        );
      case "xls":
      case "xlsx":
        return (
          <Image
            style={{ height: 35, width: 31 }}
            resizeMode={"contain"}
            source={images.excel}
          />
        );

      case "pdf":
        return (
          <Image
            style={{ height: 35, width: 31 }}
            resizeMode={"contain"}
            source={images.pdf}
          />
        );
      default:
        return <AttachmentIcon />;
    }
  };

  const download = async () => {
    try {
      setIsDownloading(true);

      const isHasPermission = await Permission.handleWriteStoragePermission();
      if (isHasPermission) {
        Toast.show("Đang tải xuống", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        await ToolApi.downloadFile(file.url, file.filename).then(() => {
          Toast.show("Tải file thành công.", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        });
      } else {
        Toast.show("Bạn chưa cấp quyền truy cập bộ nhớ", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
    } catch (error) {
      LOG.error(File.name, error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View style={containerStyle}>
      <View style={[styles.fileItemContainer, { width: ITEM_WIDTH }]}>
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
          </View>
          {isDownloadable && file.uploadStatus === "Success" && (
            <TouchableOpacity
              style={styles.downloadBtn}
              disabled={isDownloading}
              onPress={download}>
              {isDownloading ? (
                <ActivityIndicator size={"small"} color={Color.primary} />
              ) : (
                <DownloadIcon />
              )}
            </TouchableOpacity>
          )}
        </View>

        {isDownloadable && file.uploadStatus === "Uploading" && (
          <View style={styles.statusLayer}>
            <ActivityIndicator size={"small"} color={Color.primary} />
          </View>
        )}

        {isDownloadable && file.uploadStatus === "Fail" && (
          <View style={styles.failedLayer}>
            <NotiFailed />
            <Text style={styles.failedText}>Gửi file thất bại</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(File, equals);
