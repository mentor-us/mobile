import {StyleSheet} from 'react-native';
import FontSize from '~/constants/FontSize';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  avatar: {
    width: 50,
    height: 50,
  },
  infoCtn: {
    marginLeft: 12,
    flex: 1,
  },
  fullname: {
    fontSize: FontSize.larger,
  },
  description: {
    fontSize: FontSize.large,
  },
});

export default styles;
