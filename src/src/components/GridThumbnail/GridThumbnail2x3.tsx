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

const GridThumbnail2x3: FC<Props> = ({
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
    const height = getHeight((maxWidth - horizonSeparator) / 2);

    return (
      <View style={GlobalStyles.row}>
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
        <SizedBox width={horizonSeparator} />
        <SingleThumbnail
          height={height}
          media={mediaData[1]}
          onPress={
            !props.onPressItem
              ? undefined
              : () => props.onPressItem?.(mediaData[1], 1)
          }
          style={[GlobalStyles.fullFlex, props.styleImage]}
        />
      </View>
    );
  }

  if (mediaData.length === 3) {
    const widthFist = (maxWidth - horizonSeparator) / 2;
    const heightItemRemaining = widthFist;
    const heightFirst = heightItemRemaining * 2 + verticalSeparator;

    return (
      <View style={GlobalStyles.row}>
        <SingleThumbnail
          media={mediaData[0]}
          height={heightFirst}
          onPress={
            !props.onPressItem
              ? undefined
              : () => props.onPressItem?.(mediaData[0], 0)
          }
          style={[GlobalStyles.fullFlex, props.styleImage]}
        />
        <SizedBox width={horizonSeparator} />
        <View style={{width: widthFist}}>
          <SingleThumbnail
            height={heightItemRemaining}
            media={mediaData[1]}
            onPress={
              !props.onPressItem
                ? undefined
                : () => props.onPressItem?.(mediaData[1], 1)
            }
            style={GlobalStyles.fullFlex}
          />
          <SizedBox height={verticalSeparator} />
          <SingleThumbnail
            height={heightItemRemaining}
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

  const heightItemRemaining = maxWidth * 0.32;
  const heightFirst = heightItemRemaining * 3 + verticalSeparator * 2;

  /**Lớn hơn 4 ảnh và có ảnh vẫn đang loading */
  const moreMultiLoading =
    mediaData.length > 4 && mediaData.some(item => item.isLoading);

  return (
    <View style={GlobalStyles.row}>
      <SingleThumbnail
        height={heightFirst}
        media={mediaData[0]}
        onPress={
          !props.onPressItem
            ? undefined
            : () => props.onPressItem?.(mediaData[0], 0)
        }
        style={[GlobalStyles.fullFlex, props.styleImage]}
      />
      <SizedBox width={horizonSeparator} />
      <View style={{width: heightItemRemaining}}>
        {mapComponents(
          mediaData.slice(1, 4),
          (item, index) => (
            <SingleThumbnail
              key={index}
              height={heightItemRemaining}
              media={{
                ...item,
                isLoading:
                  (item.isLoading && index < 2) ||
                  (moreMultiLoading && index === 2),
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
            <SizedBox key={`separator-${index}`} height={verticalSeparator} />
          ),
        )}
      </View>
    </View>
  );
};

export default GridThumbnail2x3;
