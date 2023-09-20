import {View, FlatList, Animated, SafeAreaView} from "react-native";
import React, {useCallback, useEffect, useRef, useState} from "react";
import ListHeader from "./ListHeader";
import styles from "./styles";
import {screenWidth} from "~/constants";
import {Color} from "~/constants/Color";
import {ActivityIndicator, Snackbar} from "react-native-paper";
import IMGBase64 from "~/components/IMGBase64";

interface Props {
  images: Social.MediaItem[];
  index?: number;
}

const ImageSliderShow = ({images = [], index = 0}: Props) => {
  const scrollX = new Animated.Value(0);
  const position = Animated.divide(scrollX, screenWidth);
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const sliderRef = useRef<FlatList>(null);

  const onDismissSnackBar = () => {
    setMessage("");
    setSnackBar(false);
  };

  const [downloading, setDownloading] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<Social.MediaItem>({
    url: "",
    type: "IMAGE",
  } as Social.MediaItem);

  const renderItem = ({item}: {item: Social.MediaItem}) => {
    return (
      <View style={styles.imageCtn}>
        <IMGBase64
          url={item.url || ""}
          useSkeleton
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  };

  const onViewableItemsChanged = useCallback(viewableItems => {
    const currentItem = viewableItems.viewableItems[0];
    if (!currentItem) {
      return;
    }
    setCurrentImage(currentItem.item);
  }, []);

  useEffect(() => {
    if (index) {
      sliderRef.current?.scrollToIndex({index, animated: true});
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ListHeader
        image={currentImage.url}
        setMessage={setMessage}
        setSnackBar={setSnackBar}
        setDownloading={setDownloading}
      />
      {downloading && (
        <View style={styles.loading}>
          <ActivityIndicator size={"large"} color={Color.primary} />
        </View>
      )}
      <FlatList
        ref={sliderRef}
        initialNumToRender={images.length}
        initialScrollIndex={0}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            sliderRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
        data={images}
        renderItem={renderItem}
        pagingEnabled
        scrollEnabled
        horizontal
        keyExtractor={item => `${item.url}`}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
      />
      <View style={styles.dotContainer}>
        {images.map((_, index) => {
          const color = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [Color.gray[2], Color.blue, Color.gray[2]],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={index}
              style={[styles.dot, {backgroundColor: color}]}
            />
          );
        })}
      </View>
      <Snackbar
        visible={snackBar}
        onDismiss={onDismissSnackBar}
        duration={2000}>
        {message}
      </Snackbar>
    </SafeAreaView>
  );
};

export default ImageSliderShow;
