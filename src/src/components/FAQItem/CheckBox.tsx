import * as React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Color } from '~/constants/Color';

const CheckBox = ({ label, status, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Checkbox status={status} color={Color.blue} />
        {/* <Text style={{ fontWeight: 'bold' }}>{label}</Text> */}
      </View>
    </TouchableOpacity>
  );
}

export default CheckBox;