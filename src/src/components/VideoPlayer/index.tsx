import { memo, useState } from "react";
import isEqual from "react-fast-compare";
import { ViewStyle, StyleSheet } from "react-native";
import { View, Text } from "react-native-animatable";
import Video, {
  ReactVideoProps,
  ReactVideoSource,
  VideoRef,
} from "react-native-video";
import { Color } from "~/constants/Color";
import { NotiFailed } from "~/assets/svgs";
import convertToProxyURL from "react-native-video-cache";
import { screenWidth } from "~/constants";
import { Skeleton } from "@rneui/themed";
import LinearGradient from "react-native-linear-gradient";

interface VideoPlayerProps {
  video: ReactVideoSource;
  videoProps?: ReactVideoProps & React.RefAttributes<VideoRef>;
  containerStyle?: ViewStyle;
  LoadingComponent?: React.FC;
  ErrorComponent?: React.FC;
}

const DefaultLoadingComponent = () => (
  <Skeleton
    LinearGradientComponent={LinearGradient}
    animation="wave"
    width={"100%"}
    height={"100%"}
  />
);

const DefaultErrorComponent = () => (
  <View style={styles.errorContainer}>
    <NotiFailed />
    <Text style={styles.whiteText}>Có lỗi xảy ra khi tải video</Text>
  </View>
);

const VideoPlayer = ({
  video,
  videoProps,
  containerStyle,
  LoadingComponent = DefaultLoadingComponent,
  ErrorComponent = DefaultErrorComponent,
}: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <View style={containerStyle}>
      <Video
        source={
          video?.uri
            ? { ...video, uri: convertToProxyURL(video.uri as string) }
            : video
        }
        controls={true}
        playInBackground={false}
        playWhenInactive={false}
        paused
        ignoreSilentSwitch={"ignore"}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => {
          setIsLoading(false);
        }}
        onError={({ error }) => {
          setIsLoading(false);
          setIsError(true);
          console.log(error);
        }}
        style={
          !isLoading && {
            width: screenWidth * 0.8,
            height: screenWidth * 0.5,
          }
        }
        {...videoProps}
      />
      {isLoading && <LoadingComponent />}
      {isError && <ErrorComponent />}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    alignItems: "center",
    backgroundColor: "#000a",
    borderRadius: 8,
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 0,
  },
  whiteText: { color: Color.white, fontWeight: "bold" },
});

export default memo(VideoPlayer, isEqual);
