import React, { memo, useCallback, useMemo } from "react";
import equals from "react-fast-compare";
import { View, Text, SafeAreaView, FlatList } from "react-native";

import { ShortMedia } from "~/models/media";
import styles from "./styles";
import GalleryItem from "./GalleryItem";
import SizedBox from "~/components/SizedBox";
import { BottomSheetModalRef } from "~/components/BottomSheetModal/index.props";

interface Props {
  data: ShortMedia[];
  loading: boolean;
  refresh: () => void;
}

const ImageGallery = ({ data, loading, refresh }: Props) => {
  const images = useMemo(() => {
    return data.map(item => {
      return { ...item, url: item.imageUrl } as Social.MediaItem;
    });
  }, [data]);

  const onChooseImage = (index: number) => {
    BottomSheetModalRef.current?.show("image_slider", {
      images: [images[index]] || [],
      index: 0,
    });
  };

  const _renderMediaItem = useCallback(
    ({ item, index }: RenderItemType<Social.MediaItem>) => {
      return <GalleryItem data={item} onPress={() => onChooseImage(index)} />;
    },
    [images],
  );

  const _ListEmptyComponent = () => {
    if (loading) {
      return <></>;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nhóm chưa có hình ảnh nào</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={images}
        renderItem={_renderMediaItem}
        numColumns={3}
        ItemSeparatorComponent={() => <SizedBox width={2} height={2} />}
        keyExtractor={item => `${item.url}`}
        refreshing={loading}
        onRefresh={refresh}
        ListEmptyComponent={_ListEmptyComponent}
      />
    </SafeAreaView>
  );
};

export default memo(ImageGallery, equals);
