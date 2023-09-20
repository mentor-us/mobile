import {StyleSheet} from 'react-native';
import {Color} from '~/constants/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdown: {
    width: '45%',
    borderRadius: 30,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    textAlign: 'center',
    backgroundColor: Color.primary,
  },
  titleBox: {
    flex: 1,
  },
  title: {fontWeight: '600'},
  icon: {width: 20, height: 20, color: Color.white},
  box: {
    elevation: 5,
    marginTop: 20,
    alignSelf: 'flex-start',
    width: '40%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  item: {
    width: '85%',
    alignSelf: 'center',
    height: 50,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#8e8e8e',
  },
});

export default styles;
