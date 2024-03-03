import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { memo, useMemo } from "react";
import { useAppSelector } from "~/redux";
import GlobalStyles from "~/constants/GlobalStyles";
import { commonStyles, otherStyle, ownerStyle } from "./styles";
import TextFormatRenderer from "~/components/TextFormatRenderer";
import Helper from "~/utils/Helper";

interface TextMessageProps {
  message: any;
  isOwner: boolean;
  styles: any;
}

function TextMessage({ message, isOwner, styles }: TextMessageProps) {
  //   const styles = useMemo(() => {
  //     return isOwner ? ownerStyle : otherStyle;
  //   }, [isOwner]);

  return (
    <TouchableOpacity style={[commonStyles.container, styles.container]}>
      {!isOwner && (
        <View style={GlobalStyles.flexRow}>
          <Text style={otherStyle.senderName}>{message.sender.name}</Text>
        </View>
      )}
      <TextFormatRenderer
        text={message.content || ""}
        style={commonStyles.text}
      />
      <Text style={otherStyle.sentTime}>
        {Helper.getTime(message.createdDate)}
      </Text>
    </TouchableOpacity>
  );
}

export default TextMessage;
