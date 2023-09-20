import {StatusBar, StyleSheet} from 'react-native';
import {Color} from '~/constants/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: Color.white,
    padding: 0,
    flex: 1,
  },
  tabItem: {
    width: 100,
    height: '100%',
    backgroundColor: Color.white,
    borderRadius: 2,
    borderColor: Color.primary,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorStyle: {
    backgroundColor: Color.white,
  },
  indicatorContainerStyle: {
    backgroundColor: Color.white,
  },
  tabTitle: {
    color: 'black',
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    right: 30,
    bottom: 30,
    backgroundColor: 'red',
  },
  floatingButtonImage: {
    position: 'absolute',
    marginRight: 16,
    marginBottom: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Color.primary,
    zIndex: 100,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default styles;
