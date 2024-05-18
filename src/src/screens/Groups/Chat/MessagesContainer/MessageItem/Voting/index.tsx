import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useMemo } from "react";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { Choice, NEW_VOTE_SAMPLE, Vote } from "~/models/vote";
import { ColumnChartImage } from "~/assets/images";
import { LockRedIcon } from "~/assets/svgs";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import GroupApi from "~/api/remote/GroupApi";
import { useChatScreenState } from "~/context/chat";
import { BottomSheetModalRef } from "~/components/BottomSheetModal/index.props";
import { MessageModel } from "~/models/message";

interface VotingProps {
  data?: Vote;
  message: MessageModel;
}

const Voting = ({ data = NEW_VOTE_SAMPLE, message }: VotingProps) => {
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    navigation.navigate("votingDetail", { voteId: data.id });
  }, []);
  const state = useChatScreenState();

  const pinMessage = async data => {
    const isSuccess = state.addPinnedMessage(data);
    if (await isSuccess) {
      await GroupApi.pinMessage(state._groupDetail.id, data.id);
    }
  };

  const longPressGesture = Gesture.LongPress()
    .runOnJS(true)
    .onStart(e => {
      BottomSheetModalRef.current?.show("voting_detail", message, {
        pinMessage: pinMessage,
      });
    })
    .minDuration(200);
  const composed = Gesture.Simultaneous(longPressGesture);

  const voterNumber = data.choices
    .flatMap(choice => choice.voters)
    .flatMap(voter => (voter as any)?.id).length;

  const renderVoteItems = useMemo(
    () =>
      data.choices.map((item: Choice) => {
        let votePercent = "0%";
        if (voterNumber) {
          votePercent =
            ((item.voters.length / voterNumber) * 107).toFixed(2) + "%";
        }

        return (
          <View style={styles.optionItem} key={item.id}>
            <View
              style={[
                styles.percentView,
                {
                  width: votePercent,
                },
              ]}
            />
            <View style={styles.choiceCtn}>
              <Text numberOfLines={1} style={styles.choiceContent}>
                {item.name}
              </Text>
            </View>
            <View>
              <Text numberOfLines={1} style={styles.choiceNumber}>
                {item.voters.length}
              </Text>
            </View>
          </View>
        );
      }),
    [data.choices, voterNumber],
  );

  return (
    <GestureDetector gesture={composed}>
      <TouchableOpacity style={styles.root} onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={ColumnChartImage} style={styles.icon} />
            <Text numberOfLines={3} style={styles.votingTitle}>
              {data.question}
            </Text>
          </View>

          {data.status === "CLOSED" && (
            <View style={styles.hintCtn}>
              <LockRedIcon width={15} height={15} />
              <Text style={styles.lockHint}>Bình chọn đã kết thúc!</Text>
            </View>
          )}

          <View style={styles.lineSeparator} />

          {voterNumber === 0 ? (
            <Text style={styles.hint}>Chưa có người tham gia bình chọn!</Text>
          ) : (
            <Text style={styles.hint}>{voterNumber} người đã bình chọn.</Text>
          )}

          <View style={styles.optionItemList}>{renderVoteItems}</View>
          {data.status === "OPEN" ? (
            <TouchableOpacity style={styles.btn} onPress={onPress}>
              <Text numberOfLines={1} style={styles.textBtn}>
                BÌNH CHỌN
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.endBtn} onPress={onPress}>
              <Text numberOfLines={1} style={styles.endTextBtn}>
                XEM BÌNH CHỌN
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </GestureDetector>
  );
};

export default Voting;
