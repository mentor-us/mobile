import { Image, Text, TouchableOpacity, View } from "react-native";
import { Hashtag, LockIcon, MarkIcon } from "~/assets/svgs";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { DefaultUserAvatar } from "~/assets/images";
import { GroupModel } from "~/models/group";
import { FAB } from "react-native-paper";
import { Color } from "~/constants/Color";
import { RoleType } from "~/models/commonTypes";
import CacheImage from "~/components/CacheImage";
import Helper from "~/utils/Helper";

interface Props {
  channel?: GroupModel;
  selected: string;
  chooseChannel: (string) => void;
  role: RoleType;
}

const ChannelItem = ({ channel, selected, chooseChannel, role }: Props) => {
  // Needed data
  const navigation = useNavigation();

  // Action
  const openChannel = () => {
    chooseChannel("");
    navigation.navigate("chat", {
      groupId: channel.id,
      parentId: channel.parentId || "",
      type: "channel",
    });
  };

  const updateChannel = () =>
    navigation.navigate("addChannel", {
      groupId: channel.parentId || "",
      channelId: channel.id,
    });

  // Child component
  const ChannelIcon = ({ channel }) => {
    if (channel.type === "PUBLIC") {
      return <Hashtag width={20} height={20} />;
    } else if (channel.type === "PRIVATE") {
      return <LockIcon width={18} height={18} />;
    }

    return (
      <CacheImage
        defaultSource={DefaultUserAvatar}
        url={Helper.getImageUrl(channel.imageUrl)}
        style={styles.avatar}
      />
    );
  };

  if (!channel) {
    return <></>;
  }

  return (
    <TouchableOpacity
      onPress={selected === channel.id ? () => chooseChannel("") : openChannel}
      onLongPress={() => chooseChannel(channel.id)}>
      <View
        style={[
          styles.commonRoom,
          selected === channel.id && { backgroundColor: Color.backgroundChat },
        ]}>
        <View style={styles.iconBox}>
          <ChannelIcon channel={channel} />
        </View>
        <View style={{ width: "80%" }}>
          <Text style={styles.channelName}>{channel.name}</Text>
        </View>
        {channel && channel.marked && (
          <TouchableOpacity style={{ padding: 8 }} onPress={() => {}}>
            <MarkIcon marked={channel.marked} />
          </TouchableOpacity>
        )}

        {role === RoleType.MENTOR && selected === channel.id && (
          <FAB
            icon="square-edit-outline"
            style={{
              backgroundColor: Color.backgroundChat,
              position: "absolute",
              right: 2,
              borderColor: "#fff",
              elevation: 0,
              shadowOpacity: 0,
              padding: 0,
              margin: 0,
            }}
            small
            onPress={updateChannel}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ChannelItem;
