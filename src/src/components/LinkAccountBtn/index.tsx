import {TouchableOpacity, Text, StyleSheet} from "react-native";
import React, {memo, useCallback} from "react";
import {GoogleLogo, MicrosoftLogo} from "~/assets/svgs";
import {screenWidth} from "~/constants";
import {useMemo} from "react";
import {Color} from "~/constants/Color";
import { View } from "react-native-animatable";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { color } from "react-native-reanimated";

interface Props {
  onPress: () => void;
  type: "google" | "microsoft" | undefined;
  email?: string
}

const LinkAccountBtn = ({onPress, type,email=""}: Props) => {
  const renderLogo = useCallback(
    type => {
      switch (type) {
        case "google":
          return <GoogleLogo width={24} height={24} />;
        case "microsoft":
          return <MicrosoftLogo width={24} height={24} />;
        default:
          return <></>;
      }
    },
    [type],
  );

  const buttonText: string = useMemo((): string => {
    if(email){
      return "Đã liên kết";
    }
    return "Liên kết";
  }, [email]);

  return (
    <TouchableWithoutFeedback style={styles.LinkAccountBtn}>
      <View style={[{borderWidth: 1,borderRadius: 5,padding: 5}]}>{renderLogo(type)}</View>
      <Text style={[styles.textEmal]}>{email  || "none"}</Text>
      <TouchableOpacity  disabled={email!=""} onPress={onPress}>
        <View style={[{justifyContent: 'center'} ]}>
          <Text style={[styles.buttonText,!email&& { color: Color.blue}]}>{buttonText}</Text>
        </View>
      </TouchableOpacity>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  LinkAccountBtn: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    // borderWidth: 1,
    borderRadius: 10,
    width: screenWidth,
  },
  textEmal:{
    marginLeft: 5,
    textAlign: "center",
    flex: 3,
  },
  buttonText: {
    textAlign: "right",
    flex: 1,
    color: Color.text[0],
  },
});

export default memo(LinkAccountBtn);
