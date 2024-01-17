import {
  DeviceEventEmitter,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";
import { ScreenProps } from "~/types/navigation";
import { useAppSelector } from "~/redux";
import { useEffect, useState } from "react";
import { Color } from "~/constants/Color";
import { GroupIcon } from "~/assets/svgs";
import SizedBox from "~/components/SizedBox";
import { Line } from "~/components/Separator";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationOptions } from "@react-navigation/stack";
import HeaderTitle from "./HeaderTitle";
import HeaderRight from "./HeaderRight";
import ChannelList from "./ChannelList";
import { ActivityIndicator, Snackbar } from "react-native-paper";
import EventEmitterNames from "~/constants/EventEmitterNames";
import { HeaderBackButton } from "~/components/Header";
import { useGetWorkSpace } from "~/app/server/groups/queries";
import ErrorMessage from "~/components/ErrorMessage";

const Workspace: ScreenProps<"workspace"> = ({ route }) => {
  // Needed data
  const groupId = route.params.groupId;
  const currentUser = useAppSelector(state => state.user.data);
  const navigation = useNavigation();
  const {
    data: workspace,
    isLoading,
    isError,
    isSuccess,
    isRefetching,
    refetch: workspaceRefetch,
  } = useGetWorkSpace(groupId);

  // State
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // Action
  const addChannel = () =>
    navigation.navigate("addChannel", { groupId: groupId });
  const onDismissSnackBar = () => {
    setMessage("");
    setSnackBar(false);
  };

  const initHeader = () => {
    if (isError || !workspace) {
      return;
    }

    navigation.setOptions({
      headerTintColor: Color.white,
      headerTitle: () => (
        <HeaderTitle
          name={workspace.name}
          category={workspace.groupCategory}
          avatar={workspace.imageUrl}
        />
      ),
      headerLeft: () => <HeaderBackButton canGoBack />,
      headerRight: () => <HeaderRight groupId={groupId} />,
    } as Partial<StackNavigationOptions>);
  };

  // Side effect
  useEffect(() => {
    initHeader();
  }, [workspace]);

  useEffect(() => {
    const refreshWorkspace = DeviceEventEmitter.addListener(
      EventEmitterNames.refreshWorkspace,
      ({ status, message }: { status: boolean; message: string }) => {
        setTimeout(() => {
          workspaceRefetch().then(() => {
            setMessage(message);
            setSnackBar(status);
          });
        }, 1000);
      },
    );

    return () => {
      refreshWorkspace.remove();
    };
  }, []);

  if (isLoading) {
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
    );
  }

  if (isError || !workspace) {
    return <ErrorMessage message="Lỗi truy cập nhóm. Vui lòng thử lại sau!" />;
  }

  return (
    isSuccess && (
      <SafeAreaView style={styles.container}>
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              onRefresh={workspaceRefetch}
              refreshing={isRefetching}
              colors={[Color.primary]}
              tintColor={Color.primary}
            />
          }>
          {/* <TouchableOpacity onPress={openNotifications}>
          <View style={styles.commonRoom}>
            <View style={styles.iconBox}>
              <NotiIcon width={21} height={21} />
            </View>
            <Text style={styles.commonRoomText}>Thông báo chung</Text>
          </View>
        </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() => navigation.navigate("chat", { groupId: groupId })}>
            <View style={styles.commonRoom}>
              <View style={styles.iconBox}>
                <GroupIcon width={22} height={22} />
              </View>
              <Text style={styles.commonRoomText}>Cuộc trò chuyện chung</Text>
            </View>
          </TouchableOpacity>

          <SizedBox height={10} />
          <Line height={1} />
          <SizedBox height={10} />

          <ChannelList
            type={"CHANNEL"}
            title={"Kênh"}
            addChannel={addChannel}
            loading={isLoading}
            role={workspace?.role || "MENTEE"}
            channels={workspace?.channels}
          />

          <SizedBox height={10} />
          <Line height={1} />
          <SizedBox height={10} />

          <ChannelList
            type={"PRIVATE_MESSAGE"}
            title={"Tin nhắn riêng"}
            loading={isLoading}
            role={workspace?.role || "MENTEE"}
            channels={workspace?.privates}
          />
        </ScrollView>

        <Snackbar
          visible={snackBar}
          onDismiss={onDismissSnackBar}
          duration={2000}>
          {message}
        </Snackbar>
      </SafeAreaView>
    )
  );
};

export default Workspace;
