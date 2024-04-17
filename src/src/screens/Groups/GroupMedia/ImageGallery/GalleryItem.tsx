import React, { memo } from "react";
import equals from "react-fast-compare";
import { TouchableOpacity } from "react-native";

import styles, { MEDIA_SIZE } from "./styles";
import SingleThumbnail from "~/components/SingleThumbnail";
import CacheImage from "~/components/CacheImage";
import Helper from "~/utils/Helper";

interface Props {
  data: Social.MediaItem;
  onPress: () => void;
}

const GalleryItem = ({ data, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <CacheImage
        style={{
          ...styles.mediaContainer,
          width: MEDIA_SIZE,
          height: MEDIA_SIZE,
        }}
        url={Helper.getImageUrl(data.url)}
        defaultSource={data.assetLocal}
      />
    </TouchableOpacity>
  );
};

export default memo(GalleryItem, equals);
