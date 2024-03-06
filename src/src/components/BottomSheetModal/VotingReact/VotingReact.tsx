import {useMemo} from "react";
import {BottomSheetModalRef} from "../index.props";
import {  Choice, NEW_VOTE_SAMPLE, Vote } from "~/models/vote";
import { TouchableOpacity, View, Text,Image } from "react-native";
import styles from "./style";
import { ColumnChartImage } from "~/assets/images";
import { LockRedIcon, PinMessageIcon } from "~/assets/svgs";
import { commonStyles } from "../EmojiReaction/styles";
import { useChatScreenState } from "~/context/chat";
import GroupApi from "~/api/remote/GroupApi";
import { MessageModel } from "~/models/message";

interface VotingProps {
    data?: MessageModel;
  }
  
  const VotingReact = ({ data = NEW_VOTE_SAMPLE }: VotingProps) => {
    const { vote } = data;
    const voterNumber = vote?.choices
    .flatMap(choice => choice.voters)
    .filter((value, index, array) => array.indexOf(value) === index).length;

  const renderVoteItems = useMemo(
    () =>
      vote?.choices.map((item: Choice) => {
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
    [vote?.choices, voterNumber],
  );

  const state = useChatScreenState();

  const onPinMessage = async () => {
    const pinMessage = async () => {
      const isSuccess = await state.addPinnedMessage(data);

      if (isSuccess) {
        await GroupApi.pinMessage(state._groupDetail.id, data.id);
      }
    };

    await pinMessage();
    BottomSheetModalRef.current?.hide();
  };

  return (
    <View style={styles.root}>
        <View style={[styles.container, {
        }]}>
          <View style={styles.header}>
            <Image source={ColumnChartImage} style={styles.icon} />
            <Text numberOfLines={3} style={styles.votingTitle}>
              {vote?.question}
            </Text>
          </View>

          {vote?.status === "CLOSED" && (
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
        </View>
        <View>
              <TouchableOpacity
                style={commonStyles.actionButton}
                testID="pin-icon"
                onPress={onPinMessage}>
                <PinMessageIcon width={24} height={24} />
              </TouchableOpacity>
        </View>
      </View>
  );

  
};

export default VotingReact;
