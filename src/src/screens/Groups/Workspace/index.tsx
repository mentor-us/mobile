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
import {ScreenProps} from "~/types/navigation";
import {useAppSelector} from "~/redux";
import {useCallback, useEffect, useState} from "react";
import {GroupModel} from "~/models/group";
import {Color} from "~/constants/Color";
import {GroupIcon} from "~/assets/svgs";
import SizedBox from "~/components/SizedBox";
import {Line} from "~/components/Separator";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationOptions} from "@react-navigation/stack";
import HeaderTitle from "./HeaderTitle";
import HeaderRight from "./HeaderRight";
import ChannelList from "./ChannelList";
import GroupApi from "~/api/remote/GroupApi";
import {ActivityIndicator, Snackbar} from "react-native-paper";
import EventEmitterNames from "~/constants/EventEmitterNames";
import {HeaderBackButton} from "~/components/Header";

const Workspace: ScreenProps<"workspace"> = ({route}) => {
  // Needed data
  const groupId = route.params.groupId;
  const currentUser = useAppSelector(state => state.user.data);
  const navigation = useNavigation();

  // State
  const [loading, setLoading] = useState<boolean>(true);
  const [workspace, setWorkspace] = useState<GroupModel>();
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // Action
  const onRefresh = useCallback(() => setLoading(true), []);
  const addChannel = () =>
    navigation.navigate("addChannel", {groupId: groupId});
  const onDismissSnackBar = () => {
    setMessage("");
    setSnackBar(false);
  };
  const openNotifications = useCallback(() => {
    navigation.navigate("notificationList");
  }, []);
  const fetchWorkspace = async () => {
    const data: GroupModel = await GroupApi.getWorkspace(groupId);
    if (!data) {
      setLoading(false);
      setMessage("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
      setSnackBar(true);
      return;
    }
    setWorkspace(data);
    initHeader();
    setLoading(false);
  };

  const initHeader = () => {
    if (!workspace) {
      return;
    }
    navigation.setOptions({
      headerTintColor: Color.white,
      headerTitle: () => (
        <HeaderTitle name={workspace.name} category={workspace.groupCategory} avatar={workspace.imageUrl} />
      ),
      headerLeft: () => <HeaderBackButton canGoBack />,
      headerRight: () => <HeaderRight groupId={groupId} />,
    } as Partial<StackNavigationOptions>);
  };

  // Side effect
  useEffect(() => {
    if (loading) {
      fetchWorkspace();
    }
  }, [loading]);

  useEffect(() => {
    initHeader();
  }, [workspace]);

  useEffect(() => {
    const refreshWorkspace = DeviceEventEmitter.addListener(
      EventEmitterNames.refreshWorkspace,
      ({status, message}: {status: boolean; message: string}) => {
        setTimeout(() => {
          setMessage(message);
          setSnackBar(status);
          setLoading(status);
        }, 1000);
      },
    );

    return () => {
      refreshWorkspace.remove();
    };
  }, []);

  if (!workspace) {
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
      );
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
        <Text style={{color: Color.black}}>
          Lỗi truy cập nhóm. Vui lòng thử lại sau!
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={loading}
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
          onPress={() => navigation.navigate("chat", {groupId: groupId})}>
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
          loading={loading}
          role={workspace?.role || "MENTEE"}
          channels={workspace?.channels}
        />

        <SizedBox height={10} />
        <Line height={1} />
        <SizedBox height={10} />

        <ChannelList
          type={"PRIVATE_MESSAGE"}
          title={"Tin nhắn riêng"}
          loading={loading}
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
  );
};

export default Workspace;
