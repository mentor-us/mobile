import {FC, useRef} from "react";
import {
  ImageResizeMode,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Text,
} from "react-native";
import Video, {OnLoadData} from "react-native-video";
import convertToProxyURL from "react-native-video-cache";

import Helper from "~/utils/Helper";
import GlobalStyles from "~/constants/GlobalStyles";

import FontSize from "~/constants/FontSize";

import ImageCache from "../ImageCache";

import {Color} from "~/constants/Color";
import {ActivityIndicator} from "react-native-paper";
import {PlayVideoIcon} from "~/assets/svgs";
import IMGBase64 from "../IMGBase64";

interface Props {
  media: Social.MediaItem;

  width?: number | string;
  height?: number;

  style?: StyleProp<ViewStyle>;
  onPress?: VoidFunction;

  onLoadVideo?: (data: OnLoadData) => void;
  onError?: () => void;

  totalRemaining?: number;
  resizeMode?: ImageResizeMode;
}

const SingleThumbnail: FC<Props> = ({...props}) => {
  const videoRef = useRef<Video | null>(null);

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

  if (props.media.type === "VIDEO" && props.media.url) {
    return (
      <Pressable
        style={[
          styles.videoView,
          props.style,
          {
            height: props.height,
            width: props.width,
          },
        ]}
        onPress={props.onPress}>
        <Video
          ref={videoRef}
          disableFocus
          paused
          resizeMode="contain"
          style={GlobalStyles.fullFlex}
          source={{
            uri: Helper.detectUrl(props.media.url)
              ? convertToProxyURL(props.media.url)
              : props.media.url,
          }}
          onError={props.onError}
          onLoad={response => {
            videoRef.current?.seek(1);
            props.onLoadVideo?.(response);
          }}
        />

        {!props.totalRemaining && (
          <View style={styles.videoCover}>
            <View style={styles.viewIconPlay}>
              <PlayVideoIcon />
            </View>
          </View>
        )}
        {Boolean(props.totalRemaining) && remainingComponent()}
        {Boolean(props.media.isLoading) && loadingView()}
      </Pressable>
    );
  }

  return (
    <Pressable
      disabled={!props.onPress}
      style={[styles.imageView, props.style]}
      onPress={props.onPress}>
      <IMGBase64
        useSkeleton
        resizeMode={props.resizeMode ?? "cover"}
        style={{height: props.height, width: props.width}}
        url={(props.media.url || props.media.assetLocal) ?? ""}
      />
      {Boolean(props.totalRemaining) && remainingComponent()}
      {Boolean(props.media.isLoading) && loadingView()}
    </Pressable>
  );
};

export default SingleThumbnail;

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
