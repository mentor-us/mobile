import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {},
  formField: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  fieldLabel: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  fieldLabelText: {
    color: '#000',
    fontWeight: '500',
  },
  fieldImg: {
    marginRight: 10,
  },
  fieldContent: {
    width: '70%',
    paddingBottom: 20,
    borderBottomEndRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#bdb8b8de"
  },
  fieldContentShadow: {
    
  },
  fieldContentText: {
    color: "black"
  },
  btnGroup: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-around"
  },
  btn: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    width: "40%"
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
});
