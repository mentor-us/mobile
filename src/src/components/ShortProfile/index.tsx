import {View, Text, Image} from 'react-native';
import React from 'react';
import {DefaultAvatar} from '~/assets/images';
import styles from './styles';
import {MoreIcon} from '~/assets/svgs/_raw';

interface Props {
  fullname?: string;
  description?: string;
}

const ShortProfile = ({
  fullname = 'Lâm Quang Vũ',
  description = 'Phó trưởng khoa công nghệ thông tin',
}: Props) => {
  return (
    <View style={styles.container}>
      <Image source={DefaultAvatar} style={styles.avatar} />
      <View style={styles.infoCtn}>
        <Text style={styles.fullname}>{fullname}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <MoreIcon width={18} height={18} />
    </View>
  );
};

export default ShortProfile;
