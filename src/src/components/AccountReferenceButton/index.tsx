import { TouchableOpacity, StyleSheet, Text, Linking } from "react-native";
import React, { memo } from "react";
import { GoogleLogo, MicrosoftLogo } from "~/assets/svgs";
import LOG from "~/utils/Logger";
import { LayoutDimensions } from "~/constants/GlobalStyles";
import { Color } from "~/constants/Color";

type ProviderType = "google" | "microsoft" | undefined;

interface Props {
  callbackUrl: string;
  provider: ProviderType;
}

const AccountReferenceButton = ({ callbackUrl, provider }: Props) => {
  const renderLogo = () => {
    switch (provider) {
      case "google":
        return <GoogleLogo width={24} height={24} />;
      case "microsoft":
        return <MicrosoftLogo width={24} height={24} />;
      default:
        return <></>;
    }
  };

  const onBtnPress = async () => {
    const formatLink = callbackUrl.replace(/\s/g, "");
    try {
      await Linking.openURL(formatLink);
    } catch {
      LOG.error(AccountReferenceButton.name, "Cannot open url: " + formatLink);
    }
  };

  return (
    <TouchableOpacity style={styles.refButton} onPress={onBtnPress}>
      {renderLogo()}
      <Text style={{ marginLeft: 16, color: Color.text[0] }}>Lien ket</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  refButton: {
    alignItems: "center",
    borderRadius: LayoutDimensions.Small,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: LayoutDimensions.XMedium,
    flex: 1,
    marginHorizontal: 8,
  },
});

export default memo(AccountReferenceButton);
