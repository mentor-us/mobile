import { FC, useRef } from "react";
import {
  ImageResizeMode,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Text,
} from "react-native";
import Video, { OnLoadData } from "react-native-video";
import convertToProxyURL from "react-native-video-cache";

import Helper from "~/utils/Helper";
import GlobalStyles from "~/constants/GlobalStyles";

import FontSize from "~/constants/FontSize";

import { Color } from "~/constants/Color";
import { ActivityIndicator } from "react-native-paper";
import IMGBase64 from "../IMGBase64";
import CacheImage from "../CacheImage";
import FastImage, { FastImageProps } from "react-native-fast-image";

interface Props {
  media: Social.MediaItem;

  width?: number | string;
  height?: number;

  style?: StyleProp<ViewStyle>;
  onPress?: VoidFunction;

  onLoadVideo?: (data: OnLoadData) => void;
  onError?: () => void;

  totalRemaining?: number;
  resizeMode?: ImageResizeMode | FastImageProps["resizeMode"];
}

const Thumbnail: FC<Props> = ({ ...props }) => {
  const remainingComponent = () => {
    return (
      <View style={[GlobalStyles.absoluteFullFit, styles.viewTotalRemaining]}>
        <Text style={styles.txtTotalRemaining}>+{props.totalRemaining}</Text>
      </View>
    );
  };

  const loadingView = () => {
    return (
      <View style={[GlobalStyles.absoluteFullFit, styles.viewTotalRemaining]}>
        <ActivityIndicator size={"large"} color={Color.primary} />
      </View>
    );
  };

  return (
    <Pressable
      disabled={!props.onPress}
      style={[styles.imageView, props.style]}
      onPress={props.onPress}>
      {/* <IMGBase64
        useSkeleton
        resizeMode={props.resizeMode ?? "cover"}
        style={{height: props.height, width: props.width}}
        url={(props.media.url || props.media.assetLocal) ?? ""}
      /> */}

      <CacheImage
        resizeMode={props.resizeMode ?? FastImage.resizeMode.cover}
        style={{ height: props.height, width: props.width }}
        url={Helper.getImageUrl(props.media.url)}
        defaultSource={props.media.assetLocal}
      />
      {Boolean(props.totalRemaining) && remainingComponent()}
      {Boolean(props.media.isLoading) && loadingView()}
    </Pressable>
  );
};

export default Thumbnail;

const styles = StyleSheet.create({
  imageView: {
    flex: 1,
    justifyContent: "center",
  },
  txtTotalRemaining: {
    color: Color.white,
    fontSize: FontSize.bigger,
    fontWeight: "500",
  },
  videoCover: {
    alignItems: "center",
    bottom: 0,
    flex: 1,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  videoView: {
    alignContent: "center",
    backgroundColor: Color.black,
  },
  viewIconPlay: {
    Color: Helper.hexColorWithOpacity(Color.black, 0.4),
    borderRadius: 100,
  },
  viewTotalRemaining: {
    alignItems: "center",
    backgroundColor: Helper.hexColorWithOpacity(Color.black, 0.3),
    justifyContent: "center",
  },
});
