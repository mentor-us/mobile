import { BASE_URL } from "@env";
import { FC } from "react";
import FastImage, { FastImageProps, Priority } from "react-native-fast-image";
import { useMobxStore } from "~/mobx/store";

interface CacheImageProps extends Omit<FastImageProps, "source"> {
  url: string;
  priority?: Priority;
}

const CacheImage: FC<CacheImageProps> = ({ ...props }) => {
  const { authStore } = useMobxStore();

  const headers: any = props.url.startsWith(BASE_URL)
    ? {
        Authorization: authStore.userToken
          ? `Bearer ${authStore.userToken}`
          : "",
      }
    : {};

  return (
    <FastImage
      {...props}
      defaultSource={props.defaultSource}
      source={{
        uri: props.url,
        headers: headers,
        priority: props.priority ?? FastImage.priority.normal,
      }}
      onProgress={e => console.log(e.nativeEvent.loaded / e.nativeEvent.total)}
      onError={() => {
        console.log("ON ERROR");
      }}
    />
  );
};

export default CacheImage;
