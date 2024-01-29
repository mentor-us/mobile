import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ScreenProps } from "~/types/navigation";
import { StackNavigationOptions } from "@react-navigation/stack";
import { Color } from "~/constants/Color";
import { HeaderBackButton } from "~/components/Header";
import HeaderTitle from "./HeaderTitle";
import HeaderRight from "./HeaderRight";
import styles from "./styles";
import MessagesContainer from "./MessagesContainer";
import { observer } from "mobx-react-lite";
import { GROUP_SAMPLE, GroupModel } from "~/models/group";
import TextEditor from "./TextEditor";
import { useAppSelector } from "~/redux";
import PinnedMessages from "./PinnedMessages";
import { RichTextRef } from "./TextEditor/index.props";
import { useGetGroupDetail } from "~/app/server/groups/queries";
import ErrorMessage from "~/components/ErrorMessage";
import { useMobxStore } from "~/mobx/store";
import { useGetMessages } from "~/app/server/messages/queries";
import useIsReady from "~/hooks/useIsReady";

const Chat: ScreenProps<"chat"> = ({ route }) => {
  // Needed data
  const groupId: string = route.params.groupId;
  const type: any = route.params.type;
  const currentUserId = useAppSelector(state => state.user.data?.id);
  const { chatState } = useMobxStore();
  const isReady = useIsReady();

  const navigation = useNavigation();
  // const [isLoading, setIsLoading] = useState(
  //   () => !chatState._groupDetail || chatState._groupDetail.id !== groupId,
  // );
  // const [isError, setIsError] = useState(false);
  // const [groupDetail, setGroupDetail] = useState<GroupModel | null>(null);
  const {
    data: groupDetail,
    isLoading,
    isError,
    isSuccess,
  } = useGetGroupDetail(groupId);
  const {
    data: messages,
    isLoading: isLoadingMessages,
    isError: isErrorMessages,
    isSuccess: isSuccessMessages,
  } = useGetMessages(currentUserId, groupId, 0);

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

  // const fetchGroup = () => {
  //   setIsLoading(true);
  //   setIsError(false);
  //   GroupService.findById(groupId)
  //     .then(res => {
  //       initHeader(res);
  //       setGroupDetail(res);
  //     })
  //     .catch(() => {
  //       setIsError(true);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   if (chatState._groupDetail && chatState._groupDetail.id === groupId) {
  //     initHeader(chatState._groupDetail);
  //     // setGroupDetail(chatState._groupDetail);
  //     return;
  //   }

  //   // fetchGroup();
  // }, [groupId]);

  useEffect(() => {
    chatState.setEditing(false);
    chatState.setKeyboardVisible(false);
    chatState.setLoadingMoreMessage(false);
    chatState.setEnableRichToolbar(false);
    chatState.setSendable(false);
  }, []);

  useEffect(() => {
    if (groupDetail) {
      initHeader(groupDetail);

      if (!chatState._groupDetail || chatState._groupDetail?.id !== groupId) {
        chatState.setGroupDetail(groupDetail);

        // Loading 1 page message with react query
      }

      if (messages && messages.length > 0) {
        chatState.setInitLoading(false);
        chatState.setMessageList([...messages]);
        chatState.setPage(1);
      } else {
        chatState.setMessageList([]);
        chatState.setPage(0);
      }
    }
  }, [groupDetail, groupId, messages]);

  if (isLoading || !isReady) {
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

  if (!groupDetail) {
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
    <View style={styles.container}>
      <MessagesContainer groupType={groupDetail?.type} />
      <TextEditor />
      <PinnedMessages />
    </View>
  );
};

export default observer(Chat);
