import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  DeviceEventEmitter,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./styles";
import GlobalStyles from "~/constants/GlobalStyles";
import InfoItem from "./InfoItem";
import { InfoItemModel } from "./index.props";
import SizedBox from "~/components/SizedBox";
import { useNavigation } from "@react-navigation/native";
import { HeaderEditButton } from "~/components/Header";
import { ScreenProps } from "~/types/navigation";
import { MarkTitleIcon } from "~/assets/svgs";
import { StackNavigationOptions } from "@react-navigation/stack";
import {
  MeetingModel,
  MeetingRepeatedObject,
  MEETING_SAMPLE,
} from "~/models/meeting";
import MeetingServices from "~/services/meeting";
import EventEmitterNames from "~/constants/EventEmitterNames";
import { ActivityIndicator, Snackbar } from "react-native-paper";
import Timeline from "react-native-timeline-flatlist";
import { Color } from "~/constants/Color";

const MeetingDetail: ScreenProps<"meetingDetail"> = ({ route }) => {
  const navigation = useNavigation();
  const meetingId = route.params.meetingId;
  const [meetingData, setMeetingData] = useState<MeetingModel>(MEETING_SAMPLE);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const infoItems: InfoItemModel[] = useMemo(() => {
    return [
      {
        type: "description",
        text: meetingData.description || "",
      },
      { type: "meetingTime", text: meetingData.time.display },
      // {
      //   type: "repeated",
      //   text: MeetingRepeatedObject[meetingData.repeated].value,
      // },
      { type: "place", text: meetingData.place },
      { type: "organizer", text: meetingData.organizer.name },
      { type: "attendee", text: `${meetingData.totalAttendees} thành viên` },
    ] as InfoItemModel[];
  }, [meetingData]);

  const onEditPress = () => {
    navigation.navigate("createMeeting", {
      groupId: meetingData.group.id,
      meetingId: meetingData.id,
    });
  };

  const onDismissSnackBar = () => setSnackBar(false);

  const headerRight = () => {
    if (!meetingData.canEdit) {
      return <></>;
    }
    return <HeaderEditButton onPress={onEditPress} text={"Chỉnh sửa"} />;
  };

  // call api
  const fetchMeetingData = async (meetingId: string) => {
    try {
      const data = await MeetingServices.getMeetingDetail(meetingId);
      setMeetingData(data);
      setLoading(false);
    } catch (error) {
      console.log("@SCREEN_ERROR_MeetingDetail_: ", error);
    }
  };

  // side effect
  useEffect(() => {
    navigation.setOptions({
      headerRight,
    } as Partial<StackNavigationOptions>);
  }, [meetingData.id, meetingData.group.id]);

  useEffect(() => {
    if (loading) {
      fetchMeetingData(meetingId);
    }
  }, [meetingId, loading]);

  useEffect(() => {
    const subcribe = DeviceEventEmitter.addListener(
      EventEmitterNames.refreshMeetingDetail,
      ({ status, message }: { status: boolean; message: string }) => {
        setTimeout(() => {
          setMessage(message);
          setLoading(status);
          setSnackBar(true);
        }, 1250);
      },
    );

    return () => {
      subcribe.remove();
    };
  }, []);

  if (loading && !meetingData.id) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!meetingData.id) {
    return (
      <SafeAreaView style={GlobalStyles.fullFlexFocus}>
        <Text style={styles.error}>
          Lịch hẹn này không tồn tại hoặc đã bị xóa
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => setLoading(true)}
          />
        }
        style={GlobalStyles.fullFlex}
        bounces={false}>
        {/* Title */}
        <Text style={styles.groupName}>Nhóm: {meetingData.group.name}</Text>
        {/* Title */}
        <View style={styles.titleCtn}>
          <SizedBox width={2} />
          <MarkTitleIcon width={20} height={20} />
          <Text style={styles.title}>{meetingData.title}</Text>
        </View>
        {/* Infor */}
        <View style={styles.infoCtn}>
          <SizedBox height={8} />
          <Text style={styles.infoTitle}>Thông tin lịch hẹn</Text>
          {infoItems.map(item => {
            return (
              <InfoItem
                organizerId={meetingData.organizer.id}
                meetingId={meetingId}
                data={item}
                key={item.type}
                groupId={meetingData.group.id}
              />
            );
          })}
        </View>

        <View style={styles.infoHistory}>
          <Text style={styles.historyTitle}>Lịch sử cuộc hẹn</Text>
          <Timeline
            data={meetingData.histories}
            isUsingFlatlist={false}
            innerCircle={"dot"}
            separator
            timeContainerStyle={{ minWidth: 72, marginTop: -2 }}
            descriptionStyle={{ color: Color.text[3] }}
            titleStyle={{
              color: Color.black,
              fontWeight: "500",
            }}
            timeStyle={{
              textAlign: "center",
              color: Color.red,
            }}
          />
        </View>
      </ScrollView>
      <Snackbar
        visible={snackBar}
        onDismiss={onDismissSnackBar}
        duration={1500}>
        {message}
      </Snackbar>
    </SafeAreaView>
  );
};

export default MeetingDetail;
