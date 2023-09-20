import {View, Text, FlatList} from "react-native";
import React, {useEffect, useState, useCallback} from "react";
import styles from "./styles";
import {observer} from "mobx-react-lite";
import {useCreateTaskScreenState} from "~/context/task";
import {GroupModel, GROUP_SAMPLE} from "~/models/group";
import GroupItem from "~/components/GroupItem";
import GroupService from "~/services/group";

const SelectGroup = () => {
  const state = useCreateTaskScreenState();
  const [groups, setGroups] = useState<GroupModel[]>();
  const [chosenGroup, setChosenGroup] = useState<GroupModel>(GROUP_SAMPLE);
  const [loading, setLoading] = useState<boolean>(true);

  const renderItem = useCallback(({item}: {item: GroupModel}) => {
    const onPress = () => {
      setChosenGroup(item);
      state.setActionDone("submit_group");
    };

    return (
      <View style={[styles.itemCtn]}>
        <GroupItem onPress={onPress} group={item} showMessage={false}/>
      </View>
    );
  }, []);

  const EmptyListMessage = () => {
    if (loading) {
      return <></>;
    }
    return (
      <Text style={styles.textMess}>
        Bạn không có nhóm nào
      </Text>
    );
  };

  const fetchMentorGroups = async () => {
    try {
      const data = await GroupService.all();
      if (data) {
        setGroups(data);
      }
      setLoading(false);
    } catch (error) {
      console.log("@SCREEN_MENTEE_ERROR: ", error);
    }
  };

  useEffect(() => {
    if (loading) {
      fetchMentorGroups();
    }
  }, [loading]);

  useEffect(() => {
    if (state.actionDone === "submit_group") {
      state.submitGroup(chosenGroup.id);
    }
  }, [state.actionDone]);

  const refresh = useCallback(() => setLoading(true), []);

  return (
    <FlatList
      data={groups}
      renderItem={renderItem}
      keyExtractor={item => {
        return item.id;
      }}
      refreshing={loading}
      onRefresh={refresh}
      ListEmptyComponent={EmptyListMessage}
    />
  );
};

export default observer(SelectGroup);
