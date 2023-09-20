import {View, Text} from "react-native";
import React, {memo} from "react";
import EmoijsData, {TotalReaction} from "~/constants/Emoijs";
import {Image} from "react-native";
import styles from "./styles";
import GlobalStyles from "~/constants/GlobalStyles";
import SizedBox from "../SizedBox";
import isEqual from "react-fast-compare";

interface Props {
  reaction: TotalReaction;
}

const TotalEmojiReacted = ({reaction}: Props) => {
  if (reaction.data.length < 1 || reaction.total < 1) return <></>;

  return (
    <View style={GlobalStyles.flexRow}>
      {/* all user */}
      <View style={styles.container}>
        <SizedBox width={4} />
        <View style={styles.totalReactedCtn}>
          {reaction.data.map((item, index) => {
            if (index > 2 || item.total < 1) return <></>;
            return (
              <Image
                style={styles.emoji}
                source={EmoijsData[item.id].source}
                key={`${item.id} + ${reaction.total} + ${new Date()}`}
              />
            );
          })}
        </View>
        <Text style={styles.totalEmoji}>{reaction.total}</Text>
        <SizedBox width={4} />
      </View>
      <SizedBox width={8} />

      {/* user */}
      {reaction?.ownerReacted && reaction.ownerReacted.length > 0 && (
        <View style={styles.container}>
          <Image
            style={styles.emoji}
            source={EmoijsData[reaction.ownerReacted[0].id].source}
          />
        </View>
      )}
    </View>
  );
};

export default memo(TotalEmojiReacted, isEqual);
