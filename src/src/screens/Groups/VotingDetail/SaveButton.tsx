import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './styles';

interface Props {
  onSave: any;
}

const SaveButton = ({onSave}: Props) => {
  return (
    <TouchableOpacity style={styles.okeBtn} onPress={onSave}>
      <Text style={styles.okeText}>OK</Text>
    </TouchableOpacity>
  );
};

export default SaveButton;
