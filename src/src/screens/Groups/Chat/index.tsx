import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ScreenProps } from "~/types/navigation";
import { StackNavigationOptions } from "@react-navigation/stack";
import { Color } from "~/constants/Color";
import { HeaderBackButton } from "~/components/Header";
import HeaderTitle from "./HeaderTitle";
import HeaderRight from "./HeaderRight";
import styles from "./styles";
import MessagesContainer from "./MessagesContainer";
import { ChatScreenState } from "~/mobx/chat";
import ChatScreenProvider from "~/context/chat";
import { observer } from "mobx-react-lite";
import { GROUP_SAMPLE, GroupModel } from "~/models/group";
import TextEditor from "./TextEditor";
import GroupService from "~/services/group";
import { useAppSelector } from "~/redux";
import PinnedMessages from "./PinnedMessages";

const Chat: ScreenProps<"chat"> = ({ route }) => {
  // Needed data
  const groupId: string = route.params.groupId;
  const type: any = route.params.type;
  const currentUser = useAppSelector(state => state.user.data);
  const navigation = useNavigation();

  // State
  const [loading, setLoading] = useState<boolean>(true);
  const [state, setState] = useState(() => {
    return new ChatScreenState({ groupId, currentUser });
  });

  // Action
  const fetchGroup = async () => {
    const data = await GroupService.findById(groupId);
    initHeader(data);
    setLoading(false);
  };

  const initHeader = (data: GroupModel) => {
    if (!data) {
      return;
    }

    if (data == GROUP_SAMPLE) {
      return;
    }

    navigation.setOptions({
      headerTintColor: Color.white,
      headerStyle: styles.headerBackground,
      headerTitle: () => {
        const hint =
          data.type == "PRIVATE_MESSAGE"
            ? "Tin nhắn riêng"
            : `${data.totalMember} thành viên`;
        return <HeaderTitle name={data.name} hint={hint} />;
      },
      headerLeft: () => <HeaderBackButton canGoBack />,
      headerRight: () => <HeaderRight groupId={groupId} type={type} />,
    } as Partial<StackNavigationOptions>);
  };

  // SIDE EFFECT
  useEffect(() => {
    fetchGroup();
    setState(new ChatScreenState({ groupId, currentUser }));
  }, [groupId]);

  if (!state._groupDetail) {
    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: Color.backgroundChat,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <ActivityIndicator size={"large"} color={Color.primary} />
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Color.backgroundChat,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text style={{ color: Color.black }}>
          Bạn không được quyền truy cập vào kênh.
        </Text>
      </View>
    );
  }

  return (
    <ChatScreenProvider
      state={state}
      key={`chat-screen-${route.params.groupId}`}>
      <Container />
    </ChatScreenProvider>
  );
};

const Container = observer(() => {
  return (
    <View style={styles.container}>
      <MessagesContainer />
      <TextEditor />
      <PinnedMessages />
    </View>
  );
});

export default observer(Chat);
