import {StatusBar, StyleSheet} from 'react-native';

export default StyleSheet.create({
  header: {
    overflow: 'hidden',
    height: 50,
  },
  headerView: {
    elevation: 5,
    height: '95%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    shadowColor: '#171717',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  view: {
    marginHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleView: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  rightView: {
    justifyContent: 'center',
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
  },
});
