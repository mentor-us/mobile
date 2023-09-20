import {SafeAreaView, FlatList, View} from "react-native";
import styles from "./styles";
import React, {useCallback} from "react";
import {useNavigation} from "@react-navigation/native";
import {GroupModel} from "~/models/group";
import GroupItem from "~/components/GroupItem";
import {useQueryGroupList} from "../queries";
import {Line} from "~/components/Separator";

export default function Mentors() {
  const navigation = useNavigation();
  const data = useQueryGroupList();

  const renderGroupMetorItem = useCallback(
    ({item, index}: {item: GroupModel; index: number}) => {
      return (
        <View style={{backgroundColor: "#fff", padding: 12}}>
          <GroupItem group={item} onPress={() => detailGroup(item.id)} />
        </View>
      );
    },
    [],
  );

  const detailGroup = (groupId: string) => {
    navigation.navigate("chat", {groupId: groupId});
  };

  const onEndReached = () => {
    if (data.hasNextPage) {
      data.fetchNextPage();
    }
  };

  const onRefresh = () => {
    data.refetch();
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={
          !data.data
            ? []
            : data.data?.pages.flat().filter(item => item.role == "MENTOR")
        }
        renderItem={renderGroupMetorItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        bounces={false}
        ItemSeparatorComponent={() => <Line />}
        refreshing={data.isFetching}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
      />
    </SafeAreaView>
  );
}
