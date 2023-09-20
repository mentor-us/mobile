import {View, Text} from "react-native";
import React, {useCallback} from "react";
import styles from "./styles";
import SizedBox from "~/components/SizedBox";
import Skeleton from "~/components/Skeleton";
import {screenWidth} from "~/constants";
import {FlatList} from "react-native-gesture-handler";

const ListGroupSkeleton = () => {
  const data = Array.from(Array(10).keys());

  const renderItem = useCallback(() => {
    return (
      <View style={styles.skeletonCtn}>
        <View style={{flexDirection: "row"}}>
          <Skeleton height={50} width={50} borderRadius={25} />
          <SizedBox width={8} />
          <View>
            <SizedBox height={2} />
            <Skeleton height={16} width={screenWidth * 0.5} />
            <SizedBox height={8} />
            <Skeleton height={24} width={screenWidth * 0.7} />
          </View>
        </View>
      </View>
    );
  }, []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    />
  );
};

export default ListGroupSkeleton;
