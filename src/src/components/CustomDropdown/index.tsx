import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {ChevronBottomIcon, ChevronLeft} from '~/assets/svgs';
import {Color} from '~/constants/Color';
import Feather from 'react-native-vector-icons/Feather';

const status = ['Mới', 'Đang thực hiện', 'Hoàn thành'];

const CustomDropdown = () => {
  const [clicked, setClicked] = useState(false);
  const [data, setData] = useState(status);
  const [selectedCountry, setSelectedCountry] = useState(status[0]);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => {
          setClicked(!clicked);
        }}>
        <View style={styles.titleBox}>
          <Text
            style={[styles.title, {textAlign: 'center', color: Color.white}]}>
            {selectedCountry == '' ? 'Select Country' : selectedCountry}
          </Text>
        </View>
        {clicked ? (
          <Feather name={'chevron-up'} size={24} style={styles.icon} />
        ) : (
          <Feather name={'chevron-down'} size={24} style={styles.icon} />
        )}
      </TouchableOpacity>
      {clicked ? (
        <View style={styles.box}>
          <FlatList
            data={data}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    setSelectedCountry(item);
                    setClicked(!clicked);
                  }}>
                  <Text style={styles.title}>{item}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

export default CustomDropdown;
