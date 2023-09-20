import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {ScreenProps} from '~/types/navigation';
import {useAppDispatch} from '~/redux';
import styles from './styles';

const VerifyCodeScreen: ScreenProps<'verifyScreen'> = () => {
  const dispatcher = useAppDispatch();
  const [code, setCode] = useState<string>('');

  const onSubmitVerifyCode = () => {};

  return (
    <View style={styles.container}>
      <Text>Input your code here!</Text>
      <TextInput
        editable={true}
        keyboardType={'number-pad'}
        numberOfLines={1}
        onChangeText={text => {
          setCode(text);
        }}
        value={code}
        style={styles.inputText}
        textAlign={'center'}
      />
      <TouchableOpacity
        onPress={onSubmitVerifyCode}
        style={styles.submitButton}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerifyCodeScreen;
