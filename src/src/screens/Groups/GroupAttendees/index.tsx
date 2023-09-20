import {ActivityIndicator, FlatList, Text, View} from "react-native";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {ScreenProps} from "~/types/navigation";
import {GroupMemberModel} from "~/models/group";
import GroupService from "~/services/group";
import GroupMember from "~/components/GroupMember";
import styles from "./styles";
import SizedBox from "~/components/SizedBox";
import {useNavigation} from "@react-navigation/native";
import GroupApi from "~/api/remote/GroupApi";
import {Snackbar} from "react-native-paper";
import {useAppSelector} from "~/redux";
import { Color } from "~/constants/Color";

const GroupAttendees: ScreenProps<"groupAttendees"> = ({route}) => {
  const {groupId, role} = route.params;
  const navigation = useNavigation();
  const currentUser = useAppSelector(state => state.user.data);
  const [members, setMembers] = useState<GroupMemberModel[]>([]);
  const [myRole, setMyRole] = useState<string>("MENTEE");

  const [loading, setLoading] = useState<boolean>(true);
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const onDismissSnackBar = () => {
    setMessage("");
    setSnackBar(false);
  };

  const onMark = async (memberId: string, marked: boolean) => {
    try {
      const data = marked
        ? await GroupApi.unmarkMentee(memberId, groupId)
        : await GroupApi.markMentee(memberId, groupId);

      if (data) {
        setMembers(prev => {
          return prev
            .map(item => {
              if (item.id == memberId) {
                return {...item, marked: !item.marked};
              }
              return item;
            })
            .sort((a, b) => {
              if (b.role == "MENTOR" || a.role == "MENTOR") {
                return 0;
              }
              // const t1 = a.id == memberId ? 1 : 0;
              // const t2 = b.id == memberId ? 1 : 0;

              const k1 = a.marked ? 1 : 0;
              const k2 = b.marked ? 1 : 0;
              return k2 - k1;
            });
        });

        setMessage(
          !marked
            ? "Ghim thành viên thành công."
            : "Bỏ ghim thành viên thành công.",
        );
        setSnackBar(true);
      } else {
        setMessage(
          !marked
            ? "Không thể ghim thành viên."
            : "Không thể bỏ ghim thành viên.",
        );
        setSnackBar(true);
      }
    } catch (error) {
      setMessage("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
      setSnackBar(true);
    }
  };

  // render item
  const renderItem = useCallback(
    ({index, item}: {index: number; item: GroupMemberModel}) => {
      return (
        <GroupMember
          onPress={() => {
            navigation.navigate("otherProfile", {
              userId: item.id,
              groupId: groupId,
            });
          }}
          member={item}
          markable={item.role == "MENTEE" && role == "MENTOR"}
          onMark={onMark}
        />
      );
    },
    [myRole],
  );

  // fecth api
  const fetchMembers = async (groupId: string) => {
    try {
      const data = await GroupService.getMembers(groupId);
      setMembers(data);
      setLoading(false);
      const me = data.find(member => member.id == currentUser.id);
      if (me) {
        setMyRole(me.role);
      }
    } catch (error) {
      console.log("@SCREEN_GroupAttendees: ", error);
    }
  };

  // Side effect
  useEffect(() => {
    fetchMembers(groupId);
  }, [groupId]);

  //Child components
  const ListEmptyComponent = () => {
    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: Color.white,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <ActivityIndicator size={"large"} color={Color.primary} />
        </View>
      )
    }

    return (
      <View
          style={{
            flex: 1,
            backgroundColor: Color.white,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text style={{color: Color.black, fontWeight: "500"}}>Không có thành viên nào.</Text>
        </View>
    )
  }

  return (
    <>
      <FlatList
        style={styles.container}
        data={members}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}-${item.id}`}
        ItemSeparatorComponent={() => <SizedBox height={8} />}
        ListEmptyComponent={ListEmptyComponent}
      />
      <Snackbar
        visible={snackBar}
        onDismiss={onDismissSnackBar}
        duration={2000}>
        {message}
      </Snackbar>
    </>
  );
};

export default GroupAttendees;
