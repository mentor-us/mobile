import {StyleSheet} from 'react-native';
import {Color} from '~/constants/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundChat,
  },
  sendBtn: {
    height: 45,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackground: {
    backgroundColor: Color.primary,
  },
});

export default styles;
