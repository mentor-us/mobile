import { FC, memo, useEffect, useState } from "react";
import { Image, LayoutRectangle, StyleProp, ViewStyle } from "react-native";

import ImageCacheHelper from "~/utils/ImageCache";
import Helper from "~/utils/Helper";

import { GridImageSke } from "../SkeletonTemplate/GridImageSke";

import SingleThumbnail from "../SingleThumbnail";

import GridThumbnail1x1 from "./GridThumbnail1x1";
import GridThumbnail2x1 from "./GridThumbnail2x1";
import GridThumbnail2x3 from "./GridThumbnail2x3";
import { IBaseGridThumbnail, ThumbnailPressFunction } from "./type";

interface Props extends Omit<IBaseGridThumbnail, "layoutFirst" | "ratioFirst"> {
  onPressItem?: ThumbnailPressFunction;
  maxHeight?: number;
  minHeight?: number;
  maxWidth?: number;
  styleImage?: StyleProp<ViewStyle>;
  useSkeletonWhenLoad?: boolean;
}

const GridThumbnail: FC<Props> = ({
  mediaData,
  minHeight,
  maxHeight,
  maxWidth,
  ...props
}) => {
  const [layoutFirstImage, setLayoutImage] = useState<
    Omit<LayoutRectangle, "x" | "y"> | undefined
  >(
    mediaData[0]?.url
      ? ImageCacheHelper.instance.getItem(mediaData[0].url)?.size
      : undefined,
  );

  const [ratioFirstImage, setRatioFirstImage] = useState<
    RatioImage | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);

  const checkFirstImage = async () => {
    if (layoutFirstImage) {
      setRatioFirstImage(
        Helper.nearestNormalAspectRatio(
          layoutFirstImage.width,
          layoutFirstImage.height,
        ),
      );
    }
  };

  const gridImageTemplate = () => {
    if (!ratioFirstImage) {
      return <></>;
    }

    let _ratio = ratioFirstImage;

    const _ratioNum = _ratio.split(":");

    if (_ratioNum[0] > _ratioNum[1]) {
      _ratio = "2:1";
    }

    if (_ratioNum[0] < _ratioNum[1]) {
      _ratio = "2:3";
    }

    switch (_ratio) {
      case "1:1":
        return (
          <GridThumbnail1x1
            key={"ratio-1x1"}
            layoutFirst={layoutFirstImage!}
            maxHeight={maxHeight}
            maxWidth={maxWidth}
            mediaData={mediaData}
            minHeight={minHeight}
            styleImage={props.styleImage}
            onPressItem={props.onPressItem}
          />
        );
      case "2:1":
        return (
          <GridThumbnail2x1
            key={"ratio-2x1"}
            layoutFirst={layoutFirstImage!}
            maxHeight={maxHeight}
            maxWidth={maxWidth}
            mediaData={mediaData}
            minHeight={minHeight}
            styleImage={props.styleImage}
            onPressItem={props.onPressItem}
          />
        );
      case "2:3":
        return (
          <GridThumbnail2x3
            key={"ratio-2x3"}
            layoutFirst={layoutFirstImage!}
            maxHeight={maxHeight}
            maxWidth={maxWidth}
            mediaData={mediaData}
            minHeight={minHeight}
            styleImage={props.styleImage}
            onPressItem={props.onPressItem}
          />
        );
    }
  };

  useEffect(() => {
    checkFirstImage();
  }, [layoutFirstImage]);

  useEffect(() => {
    setIsLoading(true);
    if (mediaData?.[0]?.type === "IMAGE" && mediaData[0].url) {
      // ImageBase64Api.get(mediaData[0].url);
      // ImageCacheHelper.instance
      //   .loadImage(mediaData[0].url)
      //   .then(_data => {
      //     console.log("@DUKE: ??? __ DATA __", _data);

      //     setLayoutImage(_data.size);
      //   })
      //   .finally(() => {
      //     setIsLoading(false);
      //   });
      setLayoutImage({ height: 100, width: 100 });

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }

    if (mediaData?.[0]?.type === "IMAGE" && mediaData[0].assetLocal) {
      const dataSource = Image.resolveAssetSource(mediaData[0].assetLocal);
      setLayoutImage({ height: dataSource.height, width: dataSource.width });
    }
  }, [mediaData]);

  if (
    mediaData[0]?.type === "VIDEO" &&
    !layoutFirstImage &&
    mediaData[0]?.url
  ) {
    return (
      <SingleThumbnail
        media={mediaData[0]}
        onError={() => setIsLoading(false)}
        onLoadVideo={e => {
          setLayoutImage({
            height: e.naturalSize.height,
            width: e.naturalSize.width,
          });
          setIsLoading(false);
        }}
      />
    );
  }

  if (mediaData.length <= 0 || !layoutFirstImage) {
    return props.useSkeletonWhenLoad && isLoading ? (
      <GridImageSke
        maxWidth={layoutFirstImage?.width}
        numberOfImage={mediaData.length}
      />
    ) : (
      <></>
    );
  }

  return gridImageTemplate();
};

export default memo(GridThumbnail);
