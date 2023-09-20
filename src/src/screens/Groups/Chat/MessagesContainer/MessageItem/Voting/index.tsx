import {View, Text, TouchableOpacity, Image} from "react-native";
import React, {useCallback} from "react";
import styles from "./styles";
import {useNavigation} from "@react-navigation/native";
import {NEW_VOTE_SAMPLE, Vote} from "~/models/vote";
import {ColumnChartImage} from "~/assets/images";
import {LockRedIcon} from "~/assets/svgs";
interface Props {
  data?: Vote;
}

const Voting = ({data = NEW_VOTE_SAMPLE}: Props) => {
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    navigation.navigate("votingDetail", {voteId: data.id});
  }, []);

  const voterNumber = data.choices
    .flatMap(choice => choice.voters)
    .filter((value, index, array) => array.indexOf(value) === index).length;

  return (
    <TouchableOpacity style={styles.root} onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={ColumnChartImage} style={styles.icon} />
          <Text numberOfLines={3} style={styles.votingTitle}>
            {data.question}
          </Text>
        </View>

        {data.status == "CLOSED" && (
          <View style={styles.hintCtn}>
            <LockRedIcon width={15} height={15} />
            <Text style={styles.lockHint}>Bình chọn đã kết thúc!</Text>
          </View>
        )}

        <View style={styles.lineSeparator} />

        {voterNumber == 0 ? (
          <Text style={styles.hint}>Chưa có người tham gia bình chọn!</Text>
        ) : (
          <Text style={styles.hint}>{voterNumber} người đã bình chọn.</Text>
        )}

        <View style={styles.optionItemList}>
          {data.choices.map(item => {
            return (
              <View style={styles.optionItem} key={item.id}>
                <View style={styles.choiceCtn}>
                  <Text numberOfLines={1} style={styles.choiceContent}>
                    {item.name}
                  </Text>
                </View>
                <Text numberOfLines={1} style={styles.choiceNumber}>
                  {item.voters.length}
                </Text>
              </View>
            );
          })}
        </View>
        {data.status == "OPEN" ? (
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
  );
};

export default Voting;
