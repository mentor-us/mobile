import {ReactNode} from 'react';
import {
  ColorValue,
  TextInputProps as InputNativeProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

interface TextInputProps
  extends Omit<InputNativeProps, 'style' | 'placeholder'> {
  /**Style for view over text input */
  styleWrapper?: ViewStyle;

  /**Style text for input */
  textStyle?: TextStyle;

  /**Auto show close button prefix */
  showBtnClearText?: boolean;

  /**use area text input */
  areaText?: boolean;

  /**Label above input field */
  label?: string | ReactNode;

  prefix?: ReactNode;
  suffix?: ReactNode;

  backgroundColor?: ColorValue;
  borderRadius?: number;
  borderWidth?: number;

  error?: string;

  /**Support debouncing for on change text */
  debounceDuration?: number;

  /// Callbacks
  onBlur?: () => void;
  onFocus?: () => void;

  /**Just support when use close button default */
  onClearText?: () => void;

  /**Support when typeInput=`view` */
  onPressView?: () => void;

  placeholder?: string | ReactNode;
  initValue?: string;

  children?: ReactNode;
}

export interface TextInputMethod {
  focus: () => void;
  blur: () => void;
  getText: () => string;
  setText: (texT: string) => void;
}

export default TextInputProps;
