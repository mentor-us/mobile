import { StyleSheet, View, Text } from "react-native";
import { commonStyles, otherStyle } from "./styles";
import SizedBox from "~/components/SizedBox";
import Helper from "~/utils/Helper";
import { screenWidth } from "~/constants";
import GlobalStyles from "~/constants/GlobalStyles";
import { MessageModel } from "~/models/message";
import GridThumbnail from "~/components/GridThumbnail";
import { Color } from "~/constants/Color";
import { memo } from "react";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,

    borderColor: "#ccc",
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderWidth: 0.5,

    maxWidth: screenWidth * 0.8,
    minWidth: screenWidth * 0.75,

    overflow: "hidden",
    paddingBottom: 0,
    paddingTop: 4,
  },
});

interface ImageMessageProps {
  isOwner: boolean;
  message: MessageModel;
}

function ImageMessage({ isOwner, message }: ImageMessageProps) {
  return (
    <View style={[commonStyles.container, styles.container]}>
      {!isOwner && (
        <View style={GlobalStyles.flexRow}>
          <Text style={otherStyle.senderName}>{message.sender.name}</Text>
        </View>
      )}
      <SizedBox height={4} />
      <View>
        <GridThumbnail
          useSkeletonWhenLoad
          maxWidth={screenWidth * 0.7}
          mediaData={message.images || []}
        />
      </View>

      <SizedBox height={4} />
      <Text style={otherStyle.sentTime}>
        {Helper.getTime(message.createdDate)}
      </Text>
    </View>
  );
}

export default memo(ImageMessage);
