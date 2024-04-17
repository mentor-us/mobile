import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { DefaultGroupAvatar, DefaultGroupNotification } from "~/assets/images";
import SingleThumbnail from "~/components/SingleThumbnail";
import { StyleSheet } from "react-native";
import { screenWidth } from "~/constants";
import { Color } from "~/constants/Color";
import FontSize from "~/constants/FontSize";
import Avatar from "~/components/GroupMember/Avatar";
import CacheImage from "~/components/CacheImage";
import Helper from "~/utils/Helper";

interface Props {
  name: string;
  category: string;
  avatar: string | undefined;
}

const HeaderTitle = ({ name, category, avatar }: Props) => {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <CacheImage
            url={Helper.getImageUrl(avatar)}
            defaultSource={DefaultGroupAvatar}
            style={{ width: 45, height: 45 }}
          />
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.title} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.members}>{category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    borderColor: Color.white,
    overflow: "hidden",
    backgroundColor: Color.white,
    marginRight: 10,
  },
  title: {
    color: Color.white,
    fontSize: FontSize.larger,
    width: screenWidth * 0.6,
  },
  members: { color: Color.white, fontSize: FontSize.small },
});

export default HeaderTitle;
