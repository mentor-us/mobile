import {
  forwardRef,
  memo,
  MutableRefObject,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  StyleProp,
  TextInput as TextInputNative,
  TouchableOpacity,
  View,
  ViewStyle,
  Text,
} from 'react-native';
import _ from 'lodash';

import SizedBox from '../SizedBox';

import TextInputProps, {TextInputMethod} from './index.props';
import styles from './style';
import {CloseRoundIcon} from '~/assets/svgs';

/**Hook for ref text input view */
export const useRefTextInput = () => {
  const refInput = useRef<TextInputMethod>();

  return refInput as MutableRefObject<TextInputMethod>;
};

/** @Custom Text input field
 *
 */
const TextInput = forwardRef<TextInputMethod, TextInputProps>(
  ({showBtnClearText = true, ...props}, ref) => {
    const refInput = useRef<TextInputNative>(null);

    const [textInput, setTextInput] = useState(props.value ?? '');

    const onFocus = () => {
      props.onFocus?.();
    };

    const onBlur = () => {
      props.onBlur?.();
    };

    const callBackChangeText = useCallback(
      _.debounce((text: string) => {
        props.onChangeText?.(text);
      }, props.debounceDuration ?? 0),
      [props.debounceDuration, props.onChangeText],
    );

    const onChangeText = (text: string) => {
      /**just update if value text not set */
      setTextInput(text);
      callBackChangeText(text);
    };

    const onClearText = () => {
      setTextInput('');
      refInput.current?.clear();
      props.onClearText?.();
    };

    const suffixComponent = useMemo(() => {
      if (!props.suffix && showBtnClearText && textInput && !props.areaText) {
        return (
          <TouchableOpacity onPress={onClearText}>
            <CloseRoundIcon />
          </TouchableOpacity>
        );
      }

      return props.suffix;
    }, [props.suffix, textInput, refInput, props.areaText]);

    const prefixComponent = useMemo(() => {
      return props.prefix;
    }, [props.prefix]);

    const getStyleContainer = () => {
      const _style: StyleProp<ViewStyle> = [styles.wrapper];
      const extraStyle: ViewStyle = {};

      _style.push(
        props.areaText ? styles.areaViewWrapper : styles.typingViewWrapper,
      );

      if (props.backgroundColor) {
        extraStyle.backgroundColor = props.backgroundColor;
      }

      if (props.borderRadius) {
        extraStyle.borderRadius = props.borderRadius;
      }

      if (props.borderWidth !== undefined) {
        extraStyle.borderWidth = props.borderWidth;
      }

      return [..._style, extraStyle, props.styleWrapper];
    };

    const placeHolderStyle = useMemo(() => {
      return [styles.inputStyle, props.textStyle];
    }, []);

    const renderPlaceHolder = useMemo(() => {
      if (textInput.length) {
        return;
      }

      if (typeof props.placeholder === 'string') {
        return <></>;
      }

      return (
        <View pointerEvents="none" style={styles.placeHolderView}>
          <Text style={placeHolderStyle}>{props.placeholder}</Text>
        </View>
      );
    }, [textInput, props.placeholder]);

    useImperativeHandle(ref, () => ({
      focus: () => refInput.current?.focus,
      blur: () => refInput.current?.blur(),
      getText: () => textInput,
      setText: (text: string) => {
        refInput.current?.setNativeProps({text});
        setTextInput(text);
      },
    }));

    return (
      <View>
        {/* Label input */}
        {(props.label || props.maxLength) && (
          <View style={styles.viewLabel}>
            <Text style={styles.label}>{props.label}</Text>

            {props.maxLength && (
              <Text style={styles.count}>
                {textInput.length}/{props.maxLength}
              </Text>
            )}
          </View>
        )}

        {Boolean(props.label || props.maxLength) && <SizedBox height={8} />}

        <View style={getStyleContainer()}>
          {/* Prefix component session */}
          {prefixComponent}
          {prefixComponent && <SizedBox width={10} />}
          <View style={styles.inputView}>
            {renderPlaceHolder}

            {/* Input */}
            <TextInputNative
              {...props}
              defaultValue={props.initValue}
              ref={refInput}
              multiline={props.multiline ?? props.areaText}
              style={[styles.inputStyle, props.textStyle]}
              onChangeText={onChangeText}
              textAlignVertical={'top'}
              onBlur={onBlur}
              onFocus={onFocus}
              value={undefined}
              placeholder={
                typeof props.placeholder === 'string'
                  ? props.placeholder
                  : undefined
              }>
              {props.children}
            </TextInputNative>
          </View>

          {/* suffix component session */}
          {suffixComponent && <SizedBox width={10} />}
          {suffixComponent}
        </View>

        {/* Show error text */}
        <>
          {Boolean(props.error) && <SizedBox height={4} />}
          {Boolean(props.error) && (
            <Text style={styles.error}>{props.error}</Text>
          )}
        </>
      </View>
    );
  },
);

export default memo(TextInput);
