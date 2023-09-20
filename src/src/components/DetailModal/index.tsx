import {Modal, TouchableOpacity, View, Text} from 'react-native';
import styles from './styles';
import React from 'react';
import {Animated} from 'react-native';

interface Props {
  visible: boolean;
  children: any;
}

const DetailModal = ({visible, children}: Props) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    toggleModal();
  }, [visible]);

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <>
      <Modal transparent visible={showModal}>
        <View style={styles.background}>
          <Animated.View
            style={[styles.container, {transform: [{scale: scaleValue}]}]}>
            {children}
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export default DetailModal;
