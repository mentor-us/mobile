import { FC, useEffect, useState } from "react";
import {
  Animated,
  Image,
  ImageProps,
  ImageRequireSource,
  StyleSheet,
  View,
} from "react-native";

import Skeleton from "../Skeleton";
import GlobalStyles from "~/constants/GlobalStyles";
import ImageBase64Api from "~/api/local/ImageBase64Api";
import { images } from "~/assets/images";

interface Props extends Omit<ImageProps, "source" | "onLoad"> {
  url: string | ImageRequireSource;
  onLoadImage?: (data: Caching.ImageItem["size"]) => void;
  onLoadFail?: () => void;
  defaultAsset?: ImageRequireSource;
  useSkeleton?: boolean;
}

/**Just support for url network */
const IMGBase64: FC<Props> = ({ ...props }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [base64URL, setBase64URL] = useState<string | undefined>();

  const loadImage = async () => {
    if (props.url.toString().startsWith("file://")) {
      setBase64URL(props.url.toString());
      setLoading(false);
      return;
    }

    if (typeof props.url === "string") {
      try {
        const value = await ImageBase64Api.get(props.url);
        setBase64URL(value);
        setLoading(false);
      } catch (error) {
        console.log("@DUKE: IMGBase64: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    loadImage();
  }, [props.url]);

  if (loading && typeof props.url === "string") {
    return (
      <View style={[styles.skeletonView, props.style]}>
        {props.useSkeleton && <Skeleton style={GlobalStyles.fullFlex} />}
      </View>
    );
  }

  return (
    <Image
      defaultSource={props.defaultAsset}
      {...props}
      style={props.style}
      source={
        base64URL
          ? {
              uri: base64URL,
            }
          : images.blankIcon
      }
    />
  );
};

export default IMGBase64;

const styles = StyleSheet.create({
  skeletonView: {},
});
