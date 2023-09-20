import {StyleSheet} from 'react-native';
import {Color} from '~/constants/Color';
import FontSize from '~/constants/FontSize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  icon: {
    marginRight: 5,
    fontWeight: '700',
  },
  lineSeparator: {
    height: 1,
    backgroundColor: Color.lineSeparator,
  },
  questionInput:{
    width: "100%",
    color: Color.black, 
    fontWeight: '400',
    padding: 10,
    paddingTop: 20,
    borderWidth: 2,
    borderColor: '#E2E2EA',
    borderRadius: 5,
    backgroundColor: '#F7F7F7',
    textAlignVertical: 'top',
  },
  fieldContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textCtn: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  fieldName: {
    fontSize: FontSize.large,
    color: Color.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginBottom: 5,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    padding: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E2E2EA',
  },
  btn: {
    paddingHorizontal: 32,
    paddingVertical: 6,
    backgroundColor: '#006EDC',
    borderRadius: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 100,
  },
  textBtn: {
    fontSize: FontSize.large,
    color: Color.white,
    fontWeight: '400',
    padding: 1,
  },
});

export default styles;
