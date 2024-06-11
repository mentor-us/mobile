import {
  View,
  Text,
  ScrollView,
  Image,
  SafeAreaView,
  DeviceEventEmitter,
} from "react-native";
import React from "react";
import { useState, useEffect, useMemo } from "react";
import { DefaultUserAvatar, DefaultWallPaperGroup } from "~/assets/images";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { ScreenProps } from "~/types/navigation";
import { StackNavigationOptions } from "@react-navigation/stack";
import SizedBox from "~/components/SizedBox";
import InfoItem from "./InfoItem";
import { USER_PROFILE_SAMPLE } from "~/models/user";
import { InfoItemModel } from "./index.props";
import UserService from "~/services/user";
import Helper from "~/utils/Helper";
import { FAB, Snackbar } from "react-native-paper";
import GroupApi from "~/api/remote/GroupApi";
import { useAppSelector } from "~/redux";
import { Color } from "~/constants/Color";
import EventEmitterNames from "~/constants/EventEmitterNames";
import { useChatScreenState } from "~/context/chat";
import { RoleType } from "~/models/commonTypes";

const OtherProfile: ScreenProps<"otherProfile"> = ({ route }) => {
  const { userId, groupId } = route.params;
  const navigation = useNavigation();
  const currentUser = useAppSelector(state => state.user.data);
  const chatState = useChatScreenState();
  const isMentor = chatState?._groupDetail?.role === RoleType.MENTOR || false;
  const [profileData, setProfileData] = useState(USER_PROFILE_SAMPLE);
  const infoItems: InfoItemModel[] = useMemo(() => {
    return [
      { type: "fullname", text: profileData.name },
      { type: "email", text: profileData.email },
      { type: "personalEmail", text: profileData.personalEmail },
      { type: "year_born", text: Helper.formatDate(profileData.birthDate) },
      { type: "phomenumber", text: profileData.phone },
    ] as InfoItemModel[];
  }, [profileData]);

  // UI state
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const onDismissSnackBar = () => {
    setMessage("");
    setSnackBar(false);
  };

  // Action
  const openChat = async () => {
    if (!currentUser.id) {
      setMessage("Không thể nhắn tin cho người này!");
      setSnackBar(true);
      return;
    }

    if (!profileData.id) {
      setMessage("Không thể nhắn tin cho người này!");
      setSnackBar(true);
      return;
    }

    const data = {
      channelName: "",
      description: "",
      groupId: groupId,
      creatorId: currentUser.id,
      type: "PRIVATE_MESSAGE",
      userIds: [currentUser.id, profileData.id],
    };
    const newChannel = await GroupApi.addChannel(data);
    if (!newChannel) {
      setMessage("Không thể nhắn tin cho người này!");
      setSnackBar(true);
      return;
    }
    navigation.navigate("chat", { groupId: newChannel.id });

    DeviceEventEmitter.emit(EventEmitterNames.refreshWorkspace, {
      status: true,
      message: "Đã cập nhật kênh",
    });
  };

  const createNote = async () => {
    const canNoteCreateNoteMessage = "Không thể tạo ghi chú cho người này!";
    if (!currentUser.id || !profileData.id) {
      setMessage(canNoteCreateNoteMessage);
      setSnackBar(true);
      return;
    }
  };

  const fetchProfileData = async () => {
    try {
      const data = await UserService.findById(userId);
      navigation.setOptions({ title: data.name } as StackNavigationOptions);
      setProfileData(data);
    } catch (error) {
      console.log("@SCREEN_ERROR: ", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.avatar_coverphoto_ctn}>
          {/* Wallpaper */}
          <View style={styles.coverphoto_ctn}>
            <Image style={styles.coverphoto} source={DefaultWallPaperGroup} />
          </View>
          {/* Avatar */}
          <View style={styles.avatar_ctn}>
            <Image
              style={styles.avatar}
              source={
                profileData.imageUrl
                  ? { uri: profileData.imageUrl }
                  : DefaultUserAvatar
              }
            />
          </View>
        </View>

        {/* Infor */}
        <View style={styles.infoCtn}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoText}>Thông tin</Text>
          </View>
          <SizedBox height={8} />
          {infoItems.map(item => {
            return <InfoItem data={item} key={item.type} />;
          })}
        </View>
      </ScrollView>

      {currentUser.id !== userId && (
        <FAB
          icon="message-reply-text-outline"
          style={{
            backgroundColor: Color.backgroundChat,
            position: "absolute",
            bottom: 2,
            right: 2,
            elevation: 0,
            shadowOpacity: 0,
            marginRight: 16,
            marginBottom: 16,
            zIndex: 100,
          }}
          color={Color.black}
          small
          label={"Nhắn tin"}
          onPress={openChat}
          uppercase={false}
        />
      )}

      {currentUser.id !== userId && isMentor && (
        <FAB
          icon="message-reply-text-outline"
          style={{
            backgroundColor: Color.backgroundChat,
            position: "absolute",
            bottom: 2,
            right: 140,
            elevation: 0,
            shadowOpacity: 0,
            marginRight: 16,
            marginBottom: 16,
            zIndex: 100,
          }}
          color={Color.black}
          small
          label={"Tạo ghi chú"}
          onPress={openChat}
          uppercase={false}
        />
      )}

      <Snackbar
        visible={snackBar}
        onDismiss={onDismissSnackBar}
        duration={1500}>
        {message}
      </Snackbar>
    </SafeAreaView>
  );
};

export default OtherProfile;
