import {View, Text, TouchableOpacity, Image} from "react-native";
import React, {useCallback} from "react";
import styles from "./styles";
import EmojisData, {EmoijType} from "~/constants/Emoijs";
import {CloseRoundIcon} from "~/assets/svgs";
import GlobalStyles from "~/constants/GlobalStyles";
import SizedBox from "../SizedBox";

interface Props {
  onChooseEmoji: (emoji: EmoijType) => void;
  onRemoveEmoji: () => void;
  removable?: boolean;
}

const EmojisPane = ({
  onChooseEmoji,
  onRemoveEmoji,
  removable = false,
}: Props) => {
  const renderEmoji = useCallback((emoji: EmoijType) => {
    return (
      <TouchableOpacity
        key={emoji}
        style={styles.emojiCtn}
        onPress={() => onChooseEmoji(emoji)}>
        <Image style={styles.emoji} source={EmojisData[emoji].source} />
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={GlobalStyles.flexRow}>
      <View style={styles.container}>
        {Object.keys(EmojisData).map(item => {
          return renderEmoji(item as EmoijType);
        })}
      </View>

      {removable && (
        <>
          <SizedBox width={8} />
          <TouchableOpacity onPress={onRemoveEmoji}>
            <CloseRoundIcon width={36} height={36} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default EmojisPane;
