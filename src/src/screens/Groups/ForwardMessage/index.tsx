import React from 'react'
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenProps } from '~/types/navigation'

const ForwardMessage: ScreenProps<"forwardMessage"> = ({route}) => {
    const message = route.params.message;
    
    return (
        <SafeAreaView>
            <Text>{message}</Text>
        </SafeAreaView>
    )
}
export default ForwardMessage;
