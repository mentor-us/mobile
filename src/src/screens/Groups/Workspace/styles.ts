import {StyleSheet} from 'react-native';
import { Color } from '~/constants/Color';
import FontSize from '~/constants/FontSize';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
        paddingTop: 10
    },
    commonRoom: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    addChannel: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    iconBox: {  
        marginRight: 10
    },
    addChannelIcon: {  
        marginRight: 5
    },
    commonRoomText: {
        color: Color.black,
        fontWeight: "500",
        fontSize: FontSize.large
    },
    channelList: {
        width: "100%",
        paddingLeft: 40
    },
    channelName: {
        color: Color.text[0]
    },
    avatar: {
        width: 25,
        height: 25,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: Color.border,
        padding: 4,
    }
})

export default styles;