import {StyleProp, TextInputProps, View, ViewStyle} from "react-native";
import React, {forwardRef, memo, useImperativeHandle, useRef} from "react";

import {TextField} from "rn-material-ui-textfield";

import {Control, FieldValues, useController} from "react-hook-form";
import isEqual from "react-fast-compare";

interface Props extends TextInputProps {
  control: Control<FieldValues, any>;
  name: string;
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  errorText?: string;
  disabled?: boolean;
}

const TextInputForm = (
  {
    name,
    control,
    label,
    keyboardType,
    onFocus,
    defaultValue,
    containerStyle,
    errorText,
    disabled,
  }: Props,
  ref,
) => {
  const {field} = useController({control, defaultValue, name});
  const fieldRef = useRef<any>();

  useImperativeHandle(ref, () => {
    return {
      setText: (text: string) => {
        field.onChange(text);
      },
      getText: () => {
        return field.value;
      },
    };
  });

  return (
    <View style={[{flexDirection: "row"}, containerStyle]}>
      <TextField
        label={label}
        keyboardType={keyboardType}
        ref={fieldRef}
        value={field.value}
        onChangeText={field.onChange}
        onFocus={onFocus}
        containerStyle={{width: "100%"}}
        error={errorText}
        disabled={disabled}
      />
    </View>
  );
};

export default memo(forwardRef(TextInputForm), isEqual);
