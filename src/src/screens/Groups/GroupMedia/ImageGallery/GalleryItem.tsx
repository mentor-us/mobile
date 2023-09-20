import React, {memo} from "react";
import equals from "react-fast-compare";
import {TouchableOpacity} from "react-native";

import styles, {MEDIA_SIZE} from "./styles";
import SingleThumbnail from "~/components/SingleThumbnail";

interface Props {
  data: Social.MediaItem;
  onPress: () => void;
}

const GalleryItem = ({data, onPress}: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <SingleThumbnail
        media={data}
        width={MEDIA_SIZE}
        height={MEDIA_SIZE}
        style={styles.mediaContainer}
      />
    </TouchableOpacity>
  );
};

export default memo(GalleryItem, equals);
