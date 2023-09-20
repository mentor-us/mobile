import {View, Text} from "react-native";
import React, {useState} from "react";
import styles from "./styles";
import {ScreenProps} from "~/types/navigation";
import {Button} from "react-native-paper";
import RemoteAuthApi from "~/api/remote/RemoteAuthApi";
import {useAppSelector} from "~/redux";

const Test: ScreenProps<"testScreen"> = () => {
  const {token, refreshToken} = useAppSelector(state => state.auth);
  const onTest = async () => {
    const data = await RemoteAuthApi.refreshToken(token, refreshToken);
  };

  return (
    <View style={styles.container}>
      <Button mode={"contained"} onPress={onTest}>
        <Text>Test</Text>
      </Button>
    </View>
  );
};

export default Test;
