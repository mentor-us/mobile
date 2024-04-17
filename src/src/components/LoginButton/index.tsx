import { TouchableOpacity, Text, StyleSheet } from "react-native";
import React, { memo, useCallback } from "react";
import { AppleLogo, GoogleLogo, MicrosoftLogo } from "~/assets/svgs";
import { screenWidth } from "~/constants";
import { useMemo } from "react";
import { Color } from "~/constants/Color";

interface Props {
  onPress: () => void;
  type: "google" | "microsoft" | "apple" | undefined;
}

const LoginButton = ({ onPress, type }: Props) => {
  const renderLogo = useCallback(
    type => {
      switch (type) {
        case "google":
          return <GoogleLogo width={24} height={24} />;
        case "microsoft":
          return <MicrosoftLogo width={24} height={24} />;
        case "apple":
          return <AppleLogo width={24} height={24} />;
        default:
          return <></>;
      }
    },
    [type],
  );

  const buttonText: string = useMemo((): string => {
    switch (type) {
      case "google":
        return "Đăng nhập với Google";
      case "microsoft":
        return "Đăng nhập với Microsoft";
      case "apple":
        return "Đăng nhập với Apple";
      default:
        return "";
    }
  }, [type]);

  return (
    <TouchableOpacity style={styles.loginButton} onPress={onPress}>
      {renderLogo(type)}
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: Color.text[0],
    flex: 1,
    textAlign: "center",
  },
  loginButton: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 8,
    marginTop: 8,
    padding: 12,
    width: screenWidth * 0.7,
  },
});

export default memo(LoginButton);
