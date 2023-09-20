import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, {useEffect, useState, useCallback} from "react";
import styles from "./styles";
import {GroupModel, GROUP_SAMPLE} from "~/models/group";
import GroupItem from "~/components/GroupItem";
import GroupService from "~/services/group";
import {ScreenProps} from "~/types/navigation";
import GlobalStyles from "~/constants/GlobalStyles";
import {useNavigation} from "@react-navigation/native";

const SelectGroup: ScreenProps<"selectGroup"> = ({route}) => {
  const navigation = useNavigation();
  const groupId: string = route.params.groupId;

  /* State */
  const [groups, setGroups] = useState<GroupModel[]>();

  /* UI state */
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGroups = async () => {
    try {
      const data = await GroupService.all();
      if (data) {
        setGroups(data.filter(group => group.id != groupId));
        setLoading(false);
      }
    } catch (error) {
      console.log("@SCREEN_MENTEE_ERROR: ", error);
    }
  };

  useEffect(() => {
    if (loading) {
      fetchGroups();
    }
  }, [loading]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => setLoading(true)}
          />
        }
        style={[GlobalStyles.fullFlex, {padding: 5}]}
        bounces={false}>
        {groups?.map(group => {
          const onPress = () => {
            navigation.navigate("importFaq", {
              fromGroupId: group.id,
              toGroupId: groupId,
            });
          };

          return (
            <View style={styles.itemCtn} key={group.id}>
              <GroupItem onPress={onPress} group={group} showMessage={false} />
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectGroup;
