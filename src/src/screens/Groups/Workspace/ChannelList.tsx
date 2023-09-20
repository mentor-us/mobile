import {useEffect, useState} from "react";
import {Animated, Text, TouchableOpacity, View} from "react-native";
import {Color} from "~/constants/Color";
import FontSize from "~/constants/FontSize";
import styles from "./styles";
import ChannelItem from "./ChannelItem";
import {AddNode, ParagraphIcon, UserNameIcon} from "~/assets/svgs";
import {GroupModel} from "~/models/group";
import {RoleType} from "~/models/commonTypes";

interface Props {
  channels?: GroupModel[];
  title: string;
  type: "CHANNEL" | "PRIVATE_MESSAGE";
  loading: boolean;
  addChannel?: () => void;
  role: RoleType;
}

const ChannelList = ({
  channels,
  title,
  type,
  loading,
  role,
  addChannel,
}: Props) => {
  //State
  const [selected, setSelected] = useState<string>("");

  // Action
  const chooseChannel = (channelId: string) => {
    if (type == "PRIVATE_MESSAGE") {
      return;
    }
    setSelected(channelId);
  };

  // Child component
  const EmptyListMessage = () => {
    if (loading) {
      return <></>;
    }

    const content =
      type == "CHANNEL" ? "Chưa có kênh nào" : "Chưa có cuộc trò chuyện nào";
    return (
      <View>
        <Text
          style={{
            padding: 10,
            fontSize: FontSize.large,
            fontWeight: "500",
            color: "#A5A5A5",
          }}>
          {content}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    chooseChannel("");
  }, [loading]);

  return (
    <Animated.View>
      <View style={styles.commonRoom}>
        <View style={styles.iconBox}>
          {type == "CHANNEL" ? (
            <ParagraphIcon width={20} height={20} />
          ) : (
            <UserNameIcon width={22} height={22} />
          )}
        </View>
        <Text style={styles.commonRoomText}>{title}</Text>
      </View>
      <View style={styles.channelList}>
        {type == "CHANNEL" && role == "MENTOR" && (
          <TouchableOpacity onPress={addChannel}>
            <View style={styles.commonRoom}>
              <View style={styles.addChannelIcon}>
                <AddNode width={19} height={19} />
              </View>
              <Text
                style={[
                  styles.channelName,
                  {
                    color: Color.red,
                    fontWeight: "500",
                    fontSize: FontSize.large,
                  },
                ]}>
                Tạo kênh mới
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {!channels || channels.length == 0 ? (
          <EmptyListMessage />
        ) : (
          channels?.map(channel => {
            if (!channel) {
              return <></>;
            }
            return (
              <ChannelItem
                channel={channel}
                key={channel.id}
                selected={selected}
                chooseChannel={chooseChannel}
                role={role}
              />
            );
          })
        )}
      </View>
    </Animated.View>
  );
};

export default ChannelList;
