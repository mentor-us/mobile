import {StyleSheet} from 'react-native';
import FontSize from '~/constants/FontSize';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  button: {
    padding: 10,
    backgroundColor: '#00ff00',
    width: 100,
    marginLeft: 20,
    transform: [{scale: 1}],
  },
  square: {
    width: 100,
    height: 100,
    marginTop: 20,
    backgroundColor: '#f00',
    // transform: [{translateX: 100}]
  },
  headerCtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navTitleCtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: FontSize.medium,
    marginLeft: 16,
    color: '#fff',
  },
  // searchInputText: {
  //   borderRadius: 32,
  //   borderWidth: 0.5,
  //   borderColor: '#fff',
  //   lineHeight: FontSize.larger,
  //   fontSize: FontSize.large,
  //   height: 40,
  //   paddingHorizontal: 16,
  //   backgroundColor: '#fff',
  //   elevation: 2,
  //   flex: 1,
  //   marginRight: 8,
  // },
});

export default styles;
