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
import { useAppSelector } from "~/redux";
import PinnedMessages from "./PinnedMessages";
import { useGetGroupDetail } from "~/app/server/groups/queries";
import ErrorMessage from "~/components/ErrorMessage";

const Chat: ScreenProps<"chat"> = ({ route }) => {
  // Needed data
  const groupId: string = route.params.groupId;
  const type: any = route.params.type;
  const currentUser = useAppSelector(state => state.user.data);
  const navigation = useNavigation();
  const {
    data: groupDetail,
    isLoading,
    isError,
    isSuccess,
  } = useGetGroupDetail(groupId);

  // State
  const [state] = useState(() => {
    return new ChatScreenState({ currentUser });
  });

  const initHeader = (data: GroupModel) => {
    if (!data || data === GROUP_SAMPLE) {
      return;
    }

    navigation.setOptions({
      headerTintColor: Color.white,
      headerStyle: styles.headerBackground,
      headerTitle: () => {
        const hint =
          data.type === "PRIVATE_MESSAGE"
            ? "Tin nhắn riêng"
            : `${data.totalMember} thành viên`;
        return <HeaderTitle name={data.name} hint={hint} />;
      },
      headerLeft: () => <HeaderBackButton canGoBack />,
      headerRight: () => <HeaderRight groupId={groupId} type={type} />,
    } as Partial<StackNavigationOptions>);
  };

  // SIDE EFFECT
  // useEffect(() => {
  //   console.log(groupId);
  //   fetchGroup();
  //   // setState(new ChatScreenState({ groupId, currentUser }));
  //   state.fetchNewGroup(groupId);
  // }, [groupId]);

  useEffect(() => {
    if (isSuccess && groupDetail) {
      initHeader(groupDetail);
      state.setInitLoading(true);
      state.setNewGroupDetail(groupDetail);
      state.setMessageList([]);
      state.fetchListMessage(groupDetail.id);
      state.setInitLoading(false);
    }
  }, [groupDetail, groupId]);

  if (isLoading || state.initLoading) {
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

  if (isError) {
    return (
      <ErrorMessage
        message="Đã có lỗi xảy ra! Vui lòng thử lại sau."
        style={{
          backgroundColor: Color.backgroundChat,
        }}
      />
    );
  }

  if (isSuccess && !groupDetail) {
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

  const Container = observer(() => {
    return (
      <View style={styles.container}>
        <MessagesContainer groupType={groupDetail?.type} />
        <TextEditor />
        <PinnedMessages />
      </View>
    );
  });

  return (
    <ChatScreenProvider
      state={state}
      key={`chat-screen-${route.params.groupId}`}>
      <Container />
    </ChatScreenProvider>
  );
};

export default observer(Chat);
