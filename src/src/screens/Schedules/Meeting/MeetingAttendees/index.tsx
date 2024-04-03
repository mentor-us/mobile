import { FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ScreenProps } from "~/types/navigation";
import { GroupMemberModel } from "~/models/group";
import GroupMember from "~/components/GroupMember";
import styles from "./styles";
import SizedBox from "~/components/SizedBox";
import { useNavigation } from "@react-navigation/native";
import MeetingServices from "~/services/meeting";

const MeetingAttendees: ScreenProps<"meetingAttendees"> = ({ route }) => {
  const meetingId = route.params.meetingId;
  const groupId = route.params.groupId;
  const navigation = useNavigation();
  const [members, setMembers] = useState<GroupMemberModel[]>([]);

  // render item
  const renderItem = useCallback(
    ({ index, item }: { index: number; item: GroupMemberModel }) => {
      return (
        <GroupMember
          onPress={() => {
            navigation.navigate("otherProfile", {
              userId: item.id,
              groupId: groupId,
            });
          }}
          markable={false}
          member={item}
        />
      );
    },
    [],
  );

  // fecth api
  const fetchAttendees = async (meetingId: string) => {
    try {
      const data = await MeetingServices.getMeetingAttendees(meetingId);
      setMembers(data);
    } catch (error) {
      console.log("@SCREEN_GroupAttendees: ", error);
    }
  };

  // side effect
  useEffect(() => {
    fetchAttendees(meetingId);
  }, [meetingId]);

  return (
    <FlatList
      style={styles.container}
      data={members}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${index}-${item.id}`}
      ItemSeparatorComponent={() => <SizedBox height={8} />}
    />
  );
};

export default MeetingAttendees;
