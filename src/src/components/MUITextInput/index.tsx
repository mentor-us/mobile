import { StyleProp, TextInputProps, View, ViewStyle } from "react-native";
import React, { memo } from "react";

import { TextField } from "rn-material-ui-textfield";

interface Props extends TextInputProps {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  errorText?: string;
  disable?: boolean;
  editable?: boolean;
}

const MUITextInput = ({
  label,
  keyboardType,
  onFocus,
  defaultValue,
  containerStyle,
  onChangeText,
  value,
  multiline,
  errorText,
  disable = false,
  editable = true,
}: Props) => {
  return (
    <View style={[{ flexDirection: "row" }, containerStyle]}>
      <TextField
        label={label}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        value={value}
        onFocus={onFocus}
        containerStyle={{ width: "100%" }}
        defaultValue={defaultValue}
        multiline={multiline}
        error={errorText}
        disable={disable}
        editable={editable}
      />
    </View>
  );
};

export default memo(MUITextInput);
