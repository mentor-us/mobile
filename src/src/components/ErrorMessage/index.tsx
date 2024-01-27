import { StyleSheet, View, Text, ViewProps, TextProps } from "react-native";
import { Color } from "~/constants/Color";

const styles = StyleSheet.create({
  body: {
    alignItems: "center",
    backgroundColor: Color.white,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  content: {
    color: Color.black,
  },
});

interface ErrorMessageProps extends ViewProps {
  message: string;
  textProps?: TextProps;
}

function ErrorMessage({
  message,
  children,
  textProps,
  style,
  ...rest
}: ErrorMessageProps) {
  return (
    <View style={[styles.body, style]} {...rest}>
      <Text style={styles.content} {...textProps}>
        {children ? children : message}
      </Text>
    </View>
  );
}

export default ErrorMessage;
