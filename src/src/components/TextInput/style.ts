import {Platform, StyleSheet} from 'react-native';
import AppFont from '~/constants/AppFont';
import FontSize from '~/constants/FontSize';

export const HEIGHT_INPUT = 40;
export const HEIGHT_INPUT_VIEW = 56;
export const HEIGHT_INPUT_AREA = 100;

const styles = StyleSheet.create({
  areaViewWrapper: {
    height: HEIGHT_INPUT_AREA,
    paddingBottom: 10,
    paddingTop: 5,
  },
  count: {
    color: '#777',
    fontSize: FontSize.normal,
    lineHeight: FontSize.large,
  },
  error: {
    color: '#f00',
    fontSize: FontSize.small,
    lineHeight: FontSize.large,
  },

  inputStyle: {
    backgroundColor: 'transparent',
    color: '#888',
    flex: 1,
    fontSize: FontSize.large,
    height: '100%',
    // lineHeight: huge,
  },

  inputView: {flex: 1},

  label: {
    color: '#888',
    fontFamily: AppFont.medium,
    fontSize: FontSize.large,
    lineHeight: FontSize.huge,
  },
  placeHolderView: {
    alignSelf: 'center',
    left: Platform.OS === 'ios' ? 2 : 4,
    position: 'absolute',
    top: 5,
  },

  typingViewWrapper: {
    height: HEIGHT_INPUT,
  },

  viewLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  wrapper: {
    alignItems: 'center',
    borderColor: '#888',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});

export default styles;
