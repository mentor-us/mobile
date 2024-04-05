import React, { memo, useState } from "react";
import equals from "react-fast-compare";
import { View, Text, TouchableOpacity } from "react-native";

import { StorageMediaAttachemt } from "~/models/media";
import Helper from "~/utils/Helper";
import styles from "./styles";
import FastImage from "react-native-fast-image";

interface Props {
  data: StorageMediaAttachemt;
  onSelect: (isAdd: boolean, media: StorageMediaAttachemt) => void;
  number: number;
  single: string | undefined;
}

const GalleryItem = ({ data, onSelect, number, single }: Props) => {
  const [selected, setSelected] = useState<boolean>(false);

  const onPress = () => {
    onSelect(!selected, data);
    setSelected(prev => !prev);
  };

  const renderPicked = () => {
    if (single) {
      return single == data.id ? (
        <View style={styles.selectedIcon} />
      ) : (
        <View style={styles.unselectedIcon} />
      );
    }

    return (
      <View style={selected ? styles.selectedIcon : styles.unselectedIcon} />
    );
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <FastImage
        source={{ uri: data.path }}
        fallback={true}
        style={styles.mediaContainer}>
        <View style={selected ? styles.selectedIcon : styles.unselectedIcon} />
        {renderPicked()}
        {data.duration ? (
          <View style={styles.durationContainer}>
            <Text style={styles.durationTxt}>
              {Helper.convertStringToDuration(data.duration)}
            </Text>
          </View>
        ) : null}
      </FastImage>
    </TouchableOpacity>
  );
};

export default memo(GalleryItem, equals);
