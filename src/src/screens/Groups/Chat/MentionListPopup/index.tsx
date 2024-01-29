import { FlatList } from "react-native-gesture-handler";
import { GroupMemberModel } from "~/models/group";
import styles from "./styles";
import SizedBox from "~/components/SizedBox";
import { useGroupMembers } from "~/app/server/groups/queries";
import { Avatar, List } from "react-native-paper";
import { useMemo } from "react";
import { useCurrentUser } from "~/app/server/users/queries";
import { toLowerCaseNonAccentVietnamese } from "~/utils/NonAccentVietnamese";

interface MentionPopupProps
  extends Pick<React.ComponentProps<FlatList>, "style"> {
  onChoose: (member: GroupMemberModel) => void;
  searchName?: string;
  isShow: boolean;
  groupId: string;
  height: number;
}

function MentionListPopup({
  onChoose,
  groupId,
  style,
  height = 150,
  isShow = false,
  searchName,
}: MentionPopupProps) {
  const {
    data: members,
    isLoading,
    isError,
    isSuccess,
  } = useGroupMembers(groupId);
  const { data: myInfo } = useCurrentUser();

  const filteredMembers = useMemo(() => {
    if (searchName && members) {
      return members
        ?.filter(item =>
          toLowerCaseNonAccentVietnamese(item.name).match(
            new RegExp(
              ".*" + toLowerCaseNonAccentVietnamese(searchName) + ".*",
              "gi",
            ),
          ),
        )
        .filter(item => item.id != myInfo?.id);
    }

    return members?.filter(item => item.id != myInfo?.id) ?? [];
  }, [searchName, members]);

  const renderItem = ({ item }: { index: number; item: GroupMemberModel }) => {
    return (
      <List.Item
        onPress={() => onChoose(item)}
        title={item.name}
        style={style ?? styles.itemContainer}
        titleStyle={styles.displayName}
        titleEllipsizeMode="tail"
        left={props => (
          <Avatar.Image
            size={32}
            source={{
              uri: item.imageUrl,
            }}
            style={{
              ...props.style,
              marginRight: 4,
              marginLeft: 4,
            }}
          />
        )}
        rippleColor={"blue"}
        delayPressIn={400}
      />
    );
  };

  // Child components
  //   const Empty = () => {
  //     return (
  //       <View
  //         style={{
  //           flex: 1,
  //           backgroundColor: Color.white,
  //           flexDirection: "column",
  //           justifyContent: "center",
  //           alignItems: "center",
  //         }}>
  //         <Text style={{ color: Color.black, fontWeight: "500" }}>
  //           Không có thành viên nào.
  //         </Text>
  //       </View>
  //     );
  //   };

  if (isError || isLoading) {
    return <></>;
  }
  const hasData = isSuccess && filteredMembers.length > 0;

  return (
    isShow &&
    hasData && (
      <FlatList<GroupMemberModel>
        style={{
          ...styles.container,
          maxHeight: height,
        }}
        data={filteredMembers}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}-${item.id}`}
        ItemSeparatorComponent={() => <SizedBox height={0} />}
        ListEmptyComponent={<></>}
        ListHeaderComponent={() => <SizedBox height={6} />}
        ListFooterComponent={() => <SizedBox height={6} />}
      />
    )
  );
}

export default MentionListPopup;
