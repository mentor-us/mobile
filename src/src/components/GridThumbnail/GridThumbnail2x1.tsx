import React, {FC} from "react";
import {StyleProp, View, ViewStyle} from "react-native";

import {screenHeight, screenWidth} from "~/constants";

import GlobalStyles from "~/constants/GlobalStyles";
import {mapComponents} from "~/utils/util-component";

import SingleThumbnail from "../SingleThumbnail";
import SizedBox from "../SizedBox";

import {IBaseGridThumbnail, ThumbnailPressFunction} from "./type";
import {
  horizonSeparator,
  maxHeight,
  minHeight,
  verticalSeparator,
} from "./util";

interface Props extends IBaseGridThumbnail {
  onPressItem?: ThumbnailPressFunction;
  minHeight?: number;
  maxHeight?: number;
  maxWidth?: number;
  styleImage?: StyleProp<ViewStyle>;
}

const GridThumbnail2x1: FC<Props> = ({
  mediaData,
  layoutFirst,
  maxWidth = screenWidth,

  ...props
}) => {
  const getHeight = (_widthItem: number, _maxHeight?: number) => {
    return Math.max(
      Math.min(
        (layoutFirst.height * _widthItem) / layoutFirst.width,
        props.maxHeight ?? _maxHeight ?? maxHeight,
      ),
      props.minHeight ?? minHeight,
    );
  };

  if (mediaData.length === 1) {
    const height = getHeight(maxWidth, screenHeight * 0.7);

    return (
      <SingleThumbnail
        height={height}
        width={maxWidth}
        style={props.styleImage}
        media={mediaData[0]}
        onPress={
          !props.onPressItem
            ? undefined
            : () => props.onPressItem?.(mediaData[0], 0)
        }
      />
    );
  }

  const remainingItems = mediaData.length >= 4 ? 3 : mediaData.length - 1;

  let heightItem =
    (maxWidth - horizonSeparator * (remainingItems - 1)) / remainingItems;

  //Case 2 image => get 50% MAX_HEIGHT
  if (remainingItems === 1) {
    heightItem = (maxHeight - verticalSeparator) / 2;
  }

  const height = getHeight(
    maxWidth,
    maxHeight - heightItem - verticalSeparator,
  );

  const isMultiLoading =
    mediaData.length > 4 && mediaData.some(item => item.isLoading);

  return (
    <View style={{width: maxWidth}}>
      <SingleThumbnail
        height={height}
        media={mediaData[0]}
        onPress={
          !props.onPressItem
            ? undefined
            : () => props.onPressItem?.(mediaData[0], 0)
        }
        style={[GlobalStyles.fullFlex, props.styleImage]}
      />
      <SizedBox height={verticalSeparator} />
      <View style={[GlobalStyles.fullFlex, GlobalStyles.row]}>
        {mapComponents(
          mediaData.slice(1, remainingItems + 1),
          (item, index) => (
            <SingleThumbnail
              key={index}
              height={heightItem}
              media={{
                ...item,
                isLoading:
                  (index < 3 && item.isLoading) ||
                  (index === 2 && isMultiLoading),
              }}
              onPress={
                !props.onPressItem
                  ? undefined
                  : () => props.onPressItem?.(item, index + 1)
              }
              totalRemaining={
                mediaData.length > 4 && index === 2
                  ? mediaData.length - 4
                  : undefined
              }
              style={[GlobalStyles.fullFlex, props.styleImage]}
            />
          ),
          index => (
            <SizedBox key={`separator-${index}`} width={horizonSeparator} />
          ),
        )}
      </View>
    </View>
  );
};

export default GridThumbnail2x1;
