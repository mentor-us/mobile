import React, { memo, useCallback } from "react";
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
import { images } from "~/assets/images";
import { Color } from "~/constants/Color";
import { AttachmentIcon, DownloadIcon } from "~/assets/svgs";
import ToolApi from "~/api/remote/ToolApi";
import { styles } from "./styles";
import { UserProfileModel } from "~/models/user";
import Toast from "react-native-root-toast";
import Permission from "~/utils/PermissionStrategies";
import LOG from "~/utils/Logger";

interface Props {
  file: FileModel;
  time: string;
  sender: UserProfileModel;
  onRemove?: (attachmentID: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const { width } = Dimensions.get("window");
const ITEM_WIDTH = 0.7 * width;

const FileItem = ({
  file,
  containerStyle,
  time,
  sender,
  onRemove = () => {},
}: Props) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const renderIcon = (fileName: string) => {
    const ext = Helper.getFileExtention(fileName);

    switch (ext) {
      case "doc":
      case "docx":
        return (
          <Image
            style={styles.icon}
            resizeMode={"contain"}
            source={images.docx}
          />
        );
      case "ppt":
      case "pptx":
        return (
          <Image
            style={styles.icon}
            resizeMode={"contain"}
            source={images.ppt}
          />
        );
      case "xls":
      case "xlsx":
        return (
          <Image
            style={styles.icon}
            resizeMode={"contain"}
            source={images.excel}
          />
        );

      case "pdf":
        return (
          <Image
            style={styles.icon}
            resizeMode={"contain"}
            source={images.pdf}
          />
        );
      default:
        return <AttachmentIcon width={50} height={50} />;
    }
  };

  const download = useCallback(async () => {
    setIsDownloading(true);
    // Get today's date to add the time suffix in filename
    try {
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
    // await Linking.openURL(
    //   "https://drive.google.com/uc?export=download&id=1gXFeRrveO9fRgnkSIDVWNNLlxkV0iuq_",
    // );
  }, [file.url]);

  return (
    <View style={containerStyle}>
      <View style={styles.fileItemContainer}>
        <View style={styles.rowCtn}>
          {renderIcon(file.filename)}

          <View style={styles.bottomBorder}>
            <View style={styles.infoCtn}>
              <Text numberOfLines={1} style={styles.fileName}>
                {file.filename}
              </Text>
              <Text numberOfLines={1} style={styles.sentTime}>
                {time}
              </Text>
              <Text numberOfLines={1} style={styles.fileSize}>
                {Helper.formatFileSize(file.size)}{" "}
                {sender ? " - " + sender.name : ""}
              </Text>
            </View>

            {file.uploadStatus === "Success" && (
              <TouchableOpacity style={styles.dowloadBtn} onPress={download}>
                {isDownloading ? (
                  <ActivityIndicator size={"small"} color={Color.primary} />
                ) : (
                  <DownloadIcon />
                )}
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
    </View>
  );
};

export default memo(FileItem, equals);
