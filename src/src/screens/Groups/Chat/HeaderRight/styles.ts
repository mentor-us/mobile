import {StyleSheet} from 'react-native';
import {Color} from '~/constants/Color';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginRight: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: Color.secondary,
    marginHorizontal: 2,
    borderRadius: 24,
  },
});

export default styles;
