import {View, Text, FlatList} from "react-native";
import React, {useEffect, useState, useCallback} from "react";
import styles from "./styles";
import {observer} from "mobx-react-lite";
import {useCreateMeetingScreenState} from "~/context/meeting";
import {GroupModel, GROUP_SAMPLE} from "~/models/group";
import GroupItem from "~/components/GroupItem";
import GroupService from "~/services/group";

const SelectGroup = () => {
  const state = useCreateMeetingScreenState();
  const [groups, setGroups] = useState<GroupModel[]>();
  const [chosenGroup, setChosenGroup] = useState<GroupModel>(GROUP_SAMPLE);

  const renderItem = useCallback(({item}: {item: GroupModel}) => {
    const onPress = () => {
      setChosenGroup(item);
      state.setActionDone("submit_group");
    };

    return (
      <View
        style={[
          styles.itemCtn,
          {
            backgroundColor:
              item.id == chosenGroup.id ? "#7575757d" : undefined,
          },
        ]}>
        <GroupItem onPress={onPress} group={item} showMessage={false}/>
      </View>
    );
  }, []);

  const getGroups = async () => {
    try {
      const data = await GroupService.all();
      if (data) {
        setGroups(data);
      }
    } catch (error) {
      console.log("@SCREEN_MENTEE_ERROR: ", error);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  useEffect(() => {
    if (state.actionDone === "submit_group") {
      state.submitGroup(chosenGroup.id);
    }
  }, [state.actionDone]);

  return (
    <FlatList
      data={groups}
      renderItem={renderItem}
      keyExtractor={item => {
        return item.id;
      }}
    />
  );
};

export default observer(SelectGroup);
