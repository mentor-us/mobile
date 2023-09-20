import {StyleSheet} from 'react-native';
import { Color } from '~/constants/Color';

export default StyleSheet.create({
  wrapper: {
    margin: 0,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  container: {
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  header: {
    fontWeight: "700"
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 60,
    marginRight: 20 / 2,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000"
  },
  content: {
    fontSize: 14,
    color: "black"
  },
  time: {
    fontSize: 12,
    color: Color.text[3]
  },
  arrow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});
