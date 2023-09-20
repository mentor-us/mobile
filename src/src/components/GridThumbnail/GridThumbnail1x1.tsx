import React, {FC} from "react";
import {StyleProp, View, ViewStyle} from "react-native";

import {screenHeight, screenWidth} from "~/constants";

import GlobalStyles from "~/constants/GlobalStyles";

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

const GridThumbnail1x1: FC<Props> = ({
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
        resizeMode={"cover"}
        width={height}
        media={mediaData[0]}
        style={props.styleImage}
        onPress={
          !props.onPressItem
            ? undefined
            : () => props.onPressItem?.(mediaData[0], 0)
        }
      />
    );
  }

  if (mediaData.length === 2) {
    const itemWidth = (maxWidth - horizonSeparator) / 2;
    return (
      <View style={GlobalStyles.row}>
        <SingleThumbnail
          height={itemWidth}
          media={mediaData[0]}
          style={props.styleImage}
          onPress={
            !props.onPressItem
              ? undefined
              : () => props.onPressItem?.(mediaData[0], 0)
          }
        />
        <SizedBox width={horizonSeparator} />
        <SingleThumbnail
          height={itemWidth}
          media={mediaData[1]}
          style={props.styleImage}
          onPress={
            !props.onPressItem
              ? undefined
              : () => props.onPressItem?.(mediaData[1], 1)
          }
        />
      </View>
    );
  }

  if (mediaData.length === 3) {
    const itemWidth = maxWidth / 2 - horizonSeparator / 2;

    const heightItem = itemWidth - verticalSeparator / 2;

    return (
      <View style={GlobalStyles.row}>
        <SingleThumbnail
          height={itemWidth * 2}
          style={[GlobalStyles.fullFlex, props.styleImage]}
          media={mediaData[0]}
          onPress={
            !props.onPressItem
              ? undefined
              : () => props.onPressItem?.(mediaData[0], 0)
          }
        />
        <SizedBox width={horizonSeparator} />
        <View style={GlobalStyles.fullFlex}>
          <SingleThumbnail
            height={heightItem}
            media={mediaData[1]}
            style={[GlobalStyles.fullFlex, props.styleImage]}
            onPress={
              !props.onPressItem
                ? undefined
                : () => props.onPressItem?.(mediaData[1], 1)
            }
          />
          <SizedBox height={verticalSeparator} />
          <SingleThumbnail
            height={heightItem}
            media={mediaData[2]}
            onPress={
              !props.onPressItem
                ? undefined
                : () => props.onPressItem?.(mediaData[2], 2)
            }
            style={[GlobalStyles.fullFlex, props.styleImage]}
          />
        </View>
      </View>
    );
  }

  const itemWidth = maxWidth / 2 - horizonSeparator / 2;
  const isMultiLoading =
    mediaData.length > 4 && mediaData.some(item => item.isLoading);

  return (
    <View style={{width: maxWidth}}>
      <View style={GlobalStyles.row}>
        <SingleThumbnail
          height={itemWidth}
          width={itemWidth}
          media={mediaData[0]}
          onPress={
            !props.onPressItem
              ? undefined
              : () => props.onPressItem?.(mediaData[0], 0)
          }
          style={[GlobalStyles.fullFlex, props.styleImage]}
        />
        <SizedBox width={horizonSeparator} />
        <SingleThumbnail
          height={itemWidth}
          media={mediaData[1]}
          onPress={
            !props.onPressItem
              ? undefined
              : () => props.onPressItem?.(mediaData[1], 1)
          }
          style={[GlobalStyles.fullFlex, props.styleImage]}
        />
      </View>
      <SizedBox height={verticalSeparator} />
      <View style={GlobalStyles.row}>
        <SingleThumbnail
          height={itemWidth}
          media={mediaData[2]}
          onPress={
            !props.onPressItem
              ? undefined
              : () => props.onPressItem?.(mediaData[2], 2)
          }
          style={[GlobalStyles.fullFlex, props.styleImage]}
        />
        <SizedBox width={horizonSeparator} />
        <SingleThumbnail
          height={itemWidth}
          media={{
            ...mediaData[2],
            isLoading: isMultiLoading || mediaData[3].isLoading,
          }}
          onPress={
            !props.onPressItem
              ? undefined
              : () => props.onPressItem?.(mediaData[3], 3)
          }
          totalRemaining={mediaData.length - 4}
          style={[GlobalStyles.fullFlex, props.styleImage]}
        />
      </View>
    </View>
  );
};

export default GridThumbnail1x1;
