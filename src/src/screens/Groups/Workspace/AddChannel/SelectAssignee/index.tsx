import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Checkbox } from "react-native-paper";
import { Color } from "~/constants/Color";
import { useAddChannelScreenState } from "~/context/channel";
import { CheckBoxType } from "~/models/commonTypes";
import { AssignedCheckList, Assignee } from "~/models/task";

const SelectAssignee = () => {
  const state = useAddChannelScreenState();

  const [assignees, setAssignees] = useState<AssignedCheckList>(
    state.assignees,
  );

  const pressCheckAll = useCallback(() => {
    setAssignees(prev => {
      const status: CheckBoxType =
        prev.checkedAll === "checked" ? "unchecked" : "checked";
      return {
        checkedAll: status,
        data: prev.data.map(item => {
          return { ...item, assigned: status } as Assignee;
        }),
        totalChecked: status === "checked" ? prev.data.length : 0,
      };
    });
  }, []);

  const pressItem = useCallback((index: number) => {
    setAssignees(prev => {
      const data = prev.data.map((item, _index) => {
        if (index === _index) {
          const assigned: CheckBoxType =
            item.assigned === "checked" ? "unchecked" : "checked";
          return {
            ...item,
            assigned: assigned,
          };
        }
        return item;
      });

      const totalChecked =
        data[index].assigned === "checked"
          ? prev.totalChecked + 1
          : prev.totalChecked - 1;

      const checkedAll: CheckBoxType =
        totalChecked === data.length ? "checked" : "unchecked";

      return {
        checkedAll,
        data,
        totalChecked,
      };
    });
  }, []);

  const renderHeader = useCallback(() => {
    if (state.assignees.data.length === 0) {
      return <></>;
    }
    return (
      <Checkbox.Item
        onPress={pressCheckAll}
        label="Tất cả"
        status={assignees.checkedAll}
        color={Color.primary}
        labelStyle={{ fontWeight: "bold" }}
      />
    );
  }, [assignees.checkedAll]);

  const renderItem = useCallback(
    ({ index, item }: { index: number; item: Assignee }) => {
      return (
        <Checkbox.Item
          onPress={() => pressItem(index)}
          label={item.name}
          status={item.assigned}
          color={Color.primary}
        />
      );
    },
    [],
  );

  // Side Effect
  useEffect(() => {
    if (state.actionDone === "submit_assingee") {
      const action = state.submitAssignees(assignees);
      if (!action) {
        state.setActionDone(undefined);
      }
    }
  }, [state.actionDone]);

  return (
    <FlatList
      data={assignees.data}
      ListHeaderComponent={renderHeader}
      renderItem={renderItem}
      keyExtractor={item => {
        return item.id;
      }}
    />
  );
};

export default observer(SelectAssignee);
