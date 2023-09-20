import {useMemo} from "react";
import {Platform} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

/** Inset custom support for padding or margin */
export default function useCustomInset() {
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    if (Platform.OS === "android") {
      return {
        top: insets.top + 10,
        bottom: insets.bottom + 10,
        /**Insets get from safe area view */
        safeAreaInsets: insets,
      };
    }

    return {
      top: Math.max(insets.top, 16),
      bottom: Math.min(insets.bottom, 20),

      /**Insets get from safe area view */
      safeAreaInsets: insets,
    };
  }, [insets]);
}
