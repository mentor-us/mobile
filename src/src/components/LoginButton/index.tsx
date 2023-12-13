import { TouchableOpacity, Text, StyleSheet } from "react-native";
import React, { memo, useCallback } from "react";
import { GoogleLogo, MicrosoftLogo } from "~/assets/svgs";
import { screenWidth } from "~/constants";
import { useMemo } from "react";
import { Color } from "~/constants/Color";

interface Props {
  onPress: () => void;
  type: "google" | "microsoft" | undefined;
}

const LoginButton = ({ onPress, type }: Props) => {
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
    switch (type) {
      case "google":
        return "Đăng nhập với Google";
      case "microsoft":
        return "Đăng nhập với Microsoft 365";
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
  loginButton: {
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    width: screenWidth * 0.7,
  },
  buttonText: {
    textAlign: "center",
    flex: 1,
    color: Color.text[0],
  },
});

export default memo(LoginButton);
