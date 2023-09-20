import {StyleSheet} from 'react-native';
import { screenHeight, screenWidth } from '~/constants';
import { Color } from '~/constants/Color';
import FontSize from '~/constants/FontSize';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "absolute",
        bottom: -(screenHeight / 2),
        width: screenWidth,
        height: screenHeight / 2,
        backgroundColor: Color.white,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    panel: {
        width: screenWidth,
        justifyContent: "space-between",
        backgroundColor: Color.white,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: screenHeight/2
    },
    panelHead: {
      borderBottomColor: Color.border,
      borderBottomWidth: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 10,
    },
    bar: {
        width: 30,
        height: 5,
        backgroundColor: Color.border,
        borderRadius: 3,
        marginBottom: 5
    },
    title: {
        color: Color.black,
        fontWeight: "600",
        fontSize: FontSize.medium
    },
    panelBody: {
        flex: 1,
    }
})

export default styles;