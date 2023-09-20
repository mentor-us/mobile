import {FC, useMemo} from "react";
import {StyleSheet, View, ViewStyle} from "react-native";

import {screenWidth} from "~/constants";

import SizedBox from "../SizedBox";
import Skeleton from "../Skeleton";

import GlobalStyles from "~/constants/GlobalStyles";

interface Props {
  style?: ViewStyle;
  maxWidth?: number;
  numberOfImage?: number;
}

const SEPARATOR = 4;

export const GridImageSke: FC<Props> = ({
  maxWidth = screenWidth,
  numberOfImage = 4,
  ...props
}) => {
  let itemWidth = (maxWidth - SEPARATOR) / 2;

  const itemSKe = useMemo(() => {
    if (numberOfImage === 1) {
      itemWidth = maxWidth;
    }

    return <Skeleton borderRadius={0} height={itemWidth} width={itemWidth} />;
  }, []);

  if (numberOfImage <= 1) {
    return <View style={[styles.container, props.style]}>{itemSKe}</View>;
  }

  if (numberOfImage === 2) {
    return (
      <View style={[styles.container, props.style]}>
        <View style={styles.rowView}>
          <Skeleton
            borderRadius={0}
            height={itemWidth * 2 + SEPARATOR}
            width={itemWidth}
          />
          <SizedBox width={SEPARATOR} />
          <Skeleton
            borderRadius={0}
            height={itemWidth * 2 + SEPARATOR}
            width={itemWidth}
          />
        </View>
      </View>
    );
  }

  if (numberOfImage === 3) {
    return (
      <View style={[styles.container, GlobalStyles.row, props.style]}>
        <Skeleton
          borderRadius={0}
          height={itemWidth * 2 + SEPARATOR}
          width={itemWidth}
        />
        <SizedBox width={SEPARATOR} />
        <View>
          <Skeleton borderRadius={0} height={itemWidth} width={itemWidth} />
          <SizedBox height={SEPARATOR} />
          <Skeleton borderRadius={0} height={itemWidth} width={itemWidth} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.rowView}>
        {itemSKe}
        <SizedBox width={SEPARATOR} />
        {itemSKe}
      </View>

      <SizedBox height={SEPARATOR} />

      <View style={styles.rowView}>
        {itemSKe}
        <SizedBox width={SEPARATOR} />
        {itemSKe}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  rowView: {
    flexDirection: "row",
  },
});
