import {View, Text, TouchableOpacity, Image} from "react-native";
import React from "react";
import {StyleSheet} from "react-native";
import {Color} from "~/constants/Color";
import {DefaultUserAvatar} from "~/assets/images";
import FontSize from "~/constants/FontSize";
import {useNavigation} from "@react-navigation/native";
import {VoteDetail} from "~/models/vote";
import Helper from "~/utils/Helper";

interface Props {
  item: VoteDetail;
}

const Voting = ({item}: Props) => {

  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("votingDetail", {voteId: item.id});
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Creator */}
      <View style={styles.creatorCtn}>
        <Image
          source={
            item.creator.imageUrl
              ? {uri: item.creator.imageUrl}
              : DefaultUserAvatar
          }
          style={styles.avatar}
        />
        <View style={styles.creatorInfoCtn}>
          <Text style={styles.creatorName}>{item.creator.name}</Text>
          <Text style={styles.timeDesc}>
            {Helper.getTime(item.createdDate)}
          </Text>
        </View>
      </View>
      {/* Content voting */}
      <Text numberOfLines={1} style={styles.votingTitle}>
        {item.question}
      </Text>
      <View style={styles.optionItemList}>
        {item.choices.map(choice => {
          return (
            <View style={styles.optionItem} key={choice.id}>
              <View style={styles.choiceCtn}>
                <Text numberOfLines={1} style={styles.choiceContent}>
                  {choice.name}
                </Text>
              </View>
              <Text numberOfLines={1} style={styles.choiceNumber}>{choice.voters.length}</Text>
            </View>
          );
        })}
      </View>
      {item.status == "OPEN" ? (
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
    </TouchableOpacity>
  );
};

export default Voting;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    padding: 16,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  optionItemList: {
    marginTop: 16,
  },
  optionItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Color.backgroundGray,
    marginBottom: 5,
    padding: 10,
    paddingRight: 3,
    borderRadius: 5,
  },
  choiceCtn: {
    width: "90%"
  },
  choiceContent: {
    color: "#000",
  },
  choiceNumber: {
    width: "10%",
    textAlign: "center",
    color: Color.green,
    fontWeight: "600",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  creatorCtn: {
    flexDirection: "row",
    marginBottom: 8,
  },
  creatorName: {
    color: Color.primary,
    fontSize: FontSize.large,
    fontWeight: "bold",
  },
  timeDesc: {
    color: Color.text[5],
    fontSize: FontSize.normal,
  },
  creatorInfoCtn: {
    paddingHorizontal: 8,
  },
  votingTitle: {
    color: Color.text[0],
    fontSize: FontSize.larger,
    fontWeight: "bold",
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Color.primary,
    borderRadius: 20,
    marginTop: 12,
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: Color.white
  },
  textBtn: {
    fontSize: FontSize.large,
    color: Color.white
  },
  endBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Color.backgroundGray,
    borderRadius: 20,
    marginTop: 12,
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: Color.white
  },
  endTextBtn: {
    fontSize: FontSize.large,
    color: Color.text[0]
  },
});
