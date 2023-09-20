import {Alert, FlatList, SafeAreaView} from "react-native";
import React, {memo, useCallback, useEffect, useMemo, useState} from "react";
import equals from "react-fast-compare";
import {CameraRoll} from "@react-native-camera-roll/camera-roll";
import styles from "./styles";
import {StorageMediaAttachemt} from "~/models/media";
import GalleryItem from "./GalleryItem";
import Helper from "~/utils/Helper";
import SizedBox from "~/components/SizedBox";
import ListHeader from "./ListHeader";
import _ from "lodash";
import {BottomSheetModalRef} from "../index.props";
import {MAX_SIZE_IMG} from "~/constants";

interface Props {
  isMulti: boolean;
  action: {
    run: (
      selectedMedia: StorageMediaAttachemt | StorageMediaAttachemt[],
    ) => void;
    cancel?: () => void;
  };
}

const Gallery = ({isMulti, action}: Props) => {
  const [mediaList, setMediaList] = useState<StorageMediaAttachemt[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<StorageMediaAttachemt[]>(
    [],
  );
  const [count, setCount] = useState<number>(0);
  const [current, setCurrent] = useState<StorageMediaAttachemt | undefined>(
    undefined,
  );

  const enableSubmit: boolean = useMemo(() => {
    return selectedMedia.length > 0 ? true : false;
  }, [selectedMedia.length]);

  const fetchMediaList = async () => {
    try {
      const rawStorageMediaList = await CameraRoll.getPhotos({
        first: 150,
        assetType: "Photos",
        include: ["filename", "imageSize", "fileSize", "playableDuration"],
      });

      const formatData = Helper.formatMediaList(rawStorageMediaList);
      setMediaList(formatData);
    } catch (error) {}
  };

  const onSelectMedia = useCallback(
    (isAdd: boolean, media: StorageMediaAttachemt) => {
      setCount(prev => (isAdd ? prev + 1 : prev - 1));
      setCurrent(media);
    },
    [],
  );

  const renderStorageMedia = useCallback(
    ({item, index}: RenderItemType<StorageMediaAttachemt>) => {
      return (
        <GalleryItem
          number={index}
          data={item}
          onSelect={onSelectMedia}
          single={isMulti ? undefined : current?.id}
        />
      );
    },
    [isMulti, current],
  );

  const onSubmit = async () => {
    if (selectedMedia.length < 1) return;
    const totolSize = selectedMedia.reduce((total, current) => {
      return current.size ? current.size + total : total;
    }, 0);

    if (totolSize > MAX_SIZE_IMG) {
      Alert.alert(
        "Cảnh báo",
        `Kích thước ảnh vượt quá ${Helper.formatFileSize(MAX_SIZE_IMG)}`,
      );
      return;
    }
    BottomSheetModalRef.current?.hide();

    isMulti ? action.run(selectedMedia) : action.run(selectedMedia[0]);
  };

  const onCancel = () => {
    if (action.cancel) {
      action.cancel();
    }
  };

  const headerList = useCallback(() => {
    return (
      <ListHeader
        enableSubmit={enableSubmit}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );
  }, [selectedMedia]);

  useEffect(() => {
    if (!current) {
      return;
    }

    if (!isMulti) {
      setSelectedMedia([current]);
      return;
    }

    const index = selectedMedia.findIndex(item => item.id === current.id);
    if (index > -1) {
      setSelectedMedia(prev => {
        return _.remove(
          prev,
          (item: StorageMediaAttachemt) => item.id !== current.id,
        );
      });
    } else {
      setSelectedMedia(prev => [...prev, current]);
    }
  }, [count]);

  useEffect(() => {
    fetchMediaList();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={mediaList}
        ListHeaderComponent={headerList}
        renderItem={renderStorageMedia}
        numColumns={3}
        stickyHeaderIndices={[0]}
        ItemSeparatorComponent={() => <SizedBox width={2} height={2} />}
        keyExtractor={item => `${item.id}`}
      />
    </SafeAreaView>
  );
};

export default memo(Gallery, equals);
