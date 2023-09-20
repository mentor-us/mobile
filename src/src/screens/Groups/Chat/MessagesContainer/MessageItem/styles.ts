import {StyleSheet} from 'react-native';
import {screenWidth} from '~/constants';
import {Color} from '~/constants/Color';

export const commonStyles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    maxWidth: screenWidth * 0.8,
    marginVertical: 4,
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  ownerContainer: {},
  otherContainer: {},
  text: {
    color: Color.messageChat,
    // backgroundColor: Color.backgrondChat,
  },
});

export const ownerStyle = StyleSheet.create({
  root: {
    flexDirection: 'row-reverse',
  },
  container: {
    borderTopRightRadius: 0,
    borderColor: Color.borderActive,
  },
});

export const otherStyle = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },
  container: {
    borderTopLeftRadius: 0,
    borderColor: '#ccc',
  },
});
