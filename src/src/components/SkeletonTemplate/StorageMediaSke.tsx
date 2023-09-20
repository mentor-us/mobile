import React from "react";
import {StyleSheet, View} from "react-native";

import Skeleton from "../Skeleton";
import {screenWidth} from "~/constants";

const PROTOTYPE_ARRAY = [Array(3), Array(2), Array(1)];

export default function StorageMediaSke() {
  return (
    <View style={styles.container}>
      {PROTOTYPE_ARRAY.map((chunk, chunkIndex) => (
        <View key={chunkIndex} style={styles.row}>
          {[...chunk].map((_, index) => (
            <Skeleton
              key={index}
              borderRadius={0}
              height={screenWidth / 3}
              style={styles.ske}
              width={screenWidth / 3}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: "row",
    marginBottom: 1,
  },
  ske: {
    margin: 1,
  },
});
