import {useNavigation} from "@react-navigation/native";
import {useCallback} from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {StyleSheet} from "react-native";
import {DefaultUserAvatar} from "~/assets/images";
import {Color} from "~/constants/Color";
import {ShortProfileUserModel} from "~/models/user";
import Helper from "~/utils/Helper";

interface Props {
  voter: ShortProfileUserModel;
  close: () => void;
  groupId: string;
}

export const VoteItem = ({voter, close, groupId}: Props) => {
  const navigation = useNavigation();
  const onPress = () => {
    close();
    navigation.navigate("otherProfile", {userId: voter.id, groupId: groupId});
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.avatar}
            source={
              Helper.filterImageUrl(voter.imageUrl)
                ? {uri: voter.imageUrl}
                : DefaultUserAvatar
            }
          />
        </View>

        <View style={styles.body}>
          <Text style={styles.name}>{voter.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
  },
  header: {
    width: "20%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderWidth: 2,
    padding: 4,
  },
  body: {
    width: "80%",
    borderBottomColor: Color.border,
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
  name: {
    color: Color.black,
    textAlign: "left",
  },
});
