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
import { useGetMessages } from "~/app/server/messages/queries";
import { useMobxStore } from "~/mobx/store";

const Chat: ScreenProps<"chat"> = ({ route }) => {
  console.log("Chat screen", route);
  // Needed data
  const groupId: string = route.params.groupId;
  const type: any = route.params.type;
  const currentUser = useAppSelector(state => state.user.data);
  const { chatState } = useMobxStore();
  chatState.setCurrentUser(currentUser);

  const navigation = useNavigation();
  const {
    data: groupDetail,
    isLoading: isGroupDetailLoading,
    isError,
    isSuccess,
  } = useGetGroupDetail(groupId);
  const { data: messages, isLoading: isMessageLoading } = useGetMessages(
    currentUser.id,
    groupId,
    0,
  );

  // State
  // const [state] = useState(() => {
  //   return new ChatScreenState({ currentUser });
  // });

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

  // useEffect(() => {
  //   if (isSuccess && groupDetail) {
  //     initHeader(groupDetail);
  //     chatState.setNewGroupDetail(groupDetail);
  //     // // Loading 1 page message with react query
  //     if (messages && messages.length > 0) {
  //       chatState.setMessageList([...messages]);
  //       chatState.setPage(1);
  //     } else {
  //       chatState.setMessageList([]);
  //       chatState.setPage(-1);
  //     }
  //   }
  // }, [groupDetail, messages]);

  if (isGroupDetailLoading || isMessageLoading) {
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

  if (isSuccess) {
    initHeader(groupDetail);
    chatState.setNewGroupDetail(groupDetail);
    // Loading 1 page message with react query
    if (messages && messages.length > 0) {
      chatState.setMessageList([...messages]);
      chatState.setPage(1);
    } else {
      chatState.setMessageList([]);
      chatState.setPage(-1);
    }
  }

  return (
    // <ChatScreenProvider
    //   state={chatState}
    //   key={`chat-screen-${route.params.groupId}`}>
    <View style={styles.container}>
      <MessagesContainer groupType={groupDetail?.type} />
      <TextEditor />
      <PinnedMessages />
    </View>
    // </ChatScreenProvider>
  );
};

export default observer(Chat);
