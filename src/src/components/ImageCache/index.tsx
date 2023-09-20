import {FC, useEffect, useState} from "react";
import {
  Animated,
  Image,
  ImageProps,
  ImageRequireSource,
  StyleSheet,
  View,
} from "react-native";

import ImageCacheHelper from "~/utils/ImageCache";
import Skeleton from "../Skeleton";
import GlobalStyles from "~/constants/GlobalStyles";

interface CacheItem {
  size: {width: number; height: number};
  uri: string | number;
}

interface Props extends Omit<ImageProps, "source" | "onLoad"> {
  url: string | ImageRequireSource;
  onLoadImage?: (data: Caching.ImageItem["size"]) => void;
  onLoadFail?: () => void;
  defaultAsset?: ImageRequireSource;
  useSkeleton?: boolean;
}

export const IMAGES_CACHED: {[key: string]: CacheItem} = {};

/**Just support for url network */
const ImageCache: FC<Props> = ({...props}) => {
  const [dataImage, setDataImage] = useState<Caching.ImageItem>();

  const loadImage = () => {
    if (typeof props.url === "string") {
      ImageCacheHelper.instance
        .loadImage(props.url)
        .then(value => {
          props.onLoadImage?.(value.size);
          setDataImage(value);
        })
        .catch(error => {
          console.log("error: ", error);
          props.onLoadFail?.();
        });
    }
  };

  useEffect(() => {
    setDataImage(undefined);
    loadImage();
  }, [props.url]);

  if (!dataImage && typeof props.url === "string") {
    return (
      <View style={[styles.skeletonView, props.style]}>
        {props.useSkeleton && <Skeleton style={GlobalStyles.fullFlex} />}
      </View>
    );
  }

  const source =
    typeof props.url === "number" ? props.url : {uri: dataImage?.uri};

  return (
    <Animated.Image
      defaultSource={props.defaultAsset}
      {...props}
      style={props.style}
      source={source}
    />
  );
};

export default ImageCache;

const styles = StyleSheet.create({
  skeletonView: {},
});
