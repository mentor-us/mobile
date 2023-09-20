import React, {useCallback} from "react";
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  FlatList,
  SafeAreaView,
} from "react-native";
import styles from "./styles";
import {FilterModel, FilterType} from "./FilterModel";
import {UserTaskIcon, UserAssignIcon, UserAssignedIcon} from "~/assets/svgs";

interface Props {
  filters: FilterModel[];
  currentFilter: FilterType;
  choseFilter: (type: FilterType) => void;
}

const FilterBar = ({filters, currentFilter, choseFilter}: Props) => {
  const ItemRender = ({item}) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        currentFilter == item.type && styles.filterActive,
      ]}
      onPress={() => choseFilter(item.type)}>
      {item.type == "OWN_TASK" && <UserTaskIcon width={16} />}
      {item.type == "MY_ASSIGNED_TASK" && <UserAssignedIcon width={16} />}
      {item.type == "ASSIGNED_BY_ME" && <UserAssignIcon width={16} />}
      <Text
        style={[
          styles.buttonText,
          currentFilter == item.type && styles.activeButtonText,
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({item, index}) => {
    return <ItemRender item={item} />;
  };

  const visibleFilters = filters.filter(f => f.visible);

  return (
    <SafeAreaView style={styles.filterBar}>
      <FlatList
        data={visibleFilters}
        renderItem={renderItem}
        keyExtractor={item => item.type}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      />
    </SafeAreaView>
  );
};

export default FilterBar;
