import {View, Text, TouchableOpacity} from "react-native";
import React, {memo, useCallback, useEffect, useMemo, useState} from "react";
import {MeetingModel, MEETING_SAMPLE} from "~/models/meeting";
import {imcommingStyles, normalStyles} from "./styles";

import {useNavigation} from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import {AnimationAlarm} from "~/assets/images";

interface Props {
  data?: MeetingModel;
  isIncomming?: boolean;
}

const MeetingItem = ({data = MEETING_SAMPLE, isIncomming = false}: Props) => {
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    navigation.navigate("meetingDetail", {meetingId: data.id});
  }, [data.id]);

  const isHappenning = useMemo(() => {
    const currentTime = new Date().getTime();
    const start = new Date(data.timeStart).getTime();
    const end = new Date(data.timeEnd).getTime();
    return start <= currentTime && currentTime <= end;
  }, []);

  const styles = useMemo(() => {
    return isIncomming ? imcommingStyles : normalStyles;
  }, [isIncomming]);

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        {isHappenning && (
          <FastImage source={AnimationAlarm} style={styles.onGoingLogo} />
        )}
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{data.time.display}</Text>
        </View>
        <View style={styles.typeCtn}>
          <Text style={styles.type}>Lịch hẹn</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {data.title}
        </Text>
        <Text
          style={styles.host}>{`Người tổ chức: ${data.organizer.name}`}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(MeetingItem);
