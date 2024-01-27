import { View, Text } from "react-native";
import React, { useEffect } from "react";
import styles from "./styles";
import FastImage from "react-native-fast-image";
import { AnimationPerson } from "~/assets/images";
import { observer } from "mobx-react-lite";
import { useChatScreenState } from "~/context/chat";
import Skeleton from "~/components/Skeleton";
import { screenWidth } from "~/constants";
import SizedBox from "~/components/SizedBox";
import { ActivityIndicator } from "react-native-paper";

interface Props {
  type: "PUBLIC" | "PRIVATE" | "PRIVATE_MESSAGE" | undefined;
}

const ListFooter = ({ type }: Props) => {
  const state = useChatScreenState();

  if (state.initLoading) {
    return (
      <View style={styles.skeletonCtn}>
        <View style={{ flexDirection: "row" }}>
          <Skeleton height={50} width={50} />
          <SizedBox width={8} />
          <View>
            <Skeleton height={20} width={screenWidth * 0.5} />
            <SizedBox height={8} />
            <Skeleton height={50} width={screenWidth * 0.7} />
          </View>
        </View>
        <SizedBox height={28} />
        <View style={styles.skeletonRight}>
          <Skeleton height={50} width={50} />
          <SizedBox width={8} />
          <View style={{ alignItems: "flex-end" }}>
            <Skeleton height={20} width={screenWidth * 0.5} />
            <SizedBox height={8} />
            <Skeleton height={50} width={screenWidth * 0.7} />
          </View>
        </View>
      </View>
    );
  }

  if (!state.loadingMoreMessage || state.page < 1) {
    if (type === "PRIVATE_MESSAGE") {
      return <></>;
    }

    return (
      <View style={styles.container}>
        <FastImage style={styles.icon} source={AnimationPerson} />
        <View style={styles.titleCtn}>
          <Text style={styles.title}>
            Chào mừng bạn, hãy bắt đầu nhắn tin trao đổi và cùng học tập nhé!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.skeletonCtn}>
      <View style={{ flexDirection: "row" }}>
        <Skeleton height={50} width={50} />
        <SizedBox width={8} />
        <View>
          <Skeleton height={20} width={screenWidth * 0.5} />
          <SizedBox height={8} />
          <Skeleton height={50} width={screenWidth * 0.7} />
        </View>
      </View>
      <SizedBox height={28} />
      <View style={styles.skeletonRight}>
        <Skeleton height={50} width={50} />
        <SizedBox width={8} />
        <View style={{ alignItems: "flex-end" }}>
          <Skeleton height={20} width={screenWidth * 0.5} />
          <SizedBox height={8} />
          <Skeleton height={50} width={screenWidth * 0.7} />
        </View>
      </View>
    </View>
  );
};

export default observer(ListFooter);
