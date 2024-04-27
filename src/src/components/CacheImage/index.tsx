import { FC } from "react";
import FastImage, { FastImageProps, Priority } from "react-native-fast-image";
import { DefaultUserAvatar } from "~/assets/images";

interface CacheImageProps extends Omit<FastImageProps, "source"> {
  url: string;
  priority?: Priority;
}

const CacheImage: FC<CacheImageProps> = ({ ...props }) => {
  return (
    <FastImage
      {...props}
      defaultSource={props.defaultSource || DefaultUserAvatar}
      source={{
        uri: props.url || "",
        priority: props.priority ?? FastImage.priority.normal,
      }}
    />
  );
};

export default CacheImage;
