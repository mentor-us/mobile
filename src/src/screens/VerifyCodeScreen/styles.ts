import {StyleSheet} from 'react-native';
import {screenWidth} from '~/constants';
import {Color} from '~/constants/Color';
import FontSize from '~/constants/FontSize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputText: {
    borderColor: Color.primary,
    borderWidth: 2,
    borderRadius: 8,
    width: screenWidth / 2,
    fontSize: FontSize.huge,
  },

  submitButton: {
    backgroundColor: Color.other,
    marginTop: 32,
    width: screenWidth / 2,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
});

export default styles;
