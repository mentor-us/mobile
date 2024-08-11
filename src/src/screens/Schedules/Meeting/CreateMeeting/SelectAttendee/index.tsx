import { FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useCreateMeetingScreenState } from "~/context/meeting";
import { Checkbox } from "react-native-paper";
import { CheckBoxType } from "~/models/commonTypes";
import { Color } from "~/constants/Color";
import { Attendee, AttendeeCheckList } from "~/models/meeting";

const SelectAttendee = () => {
  const state = useCreateMeetingScreenState();

  const [attendees, setAttendees] = useState<AttendeeCheckList>(
    state.attendees,
  );

  const pressCheckAll = useCallback(() => {
    setAttendees(prev => {
      const status: CheckBoxType =
        prev.checkedAll === "checked" ? "unchecked" : "checked";
      return {
        checkedAll: status,
        data: prev.data.map(item => {
          return { ...item, status: status } as Attendee;
        }),
        totalChecked: status === "checked" ? prev.data.length : 0,
      };
    });
  }, []);

  const pressItem = useCallback((index: number) => {
    setAttendees(prev => {
      const data = prev.data.map((item, _index) => {
        if (index === _index) {
          const status: CheckBoxType =
            item.status === "checked" ? "unchecked" : "checked";
          return {
            ...item,
            status: status,
          };
        }
        return item;
      });

      const totalChecked =
        data[index].status === "checked"
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
    if (state.attendees.data.length === 0) {
      return <></>;
    }
    return (
      <Checkbox.Item
        onPress={pressCheckAll}
        label="Tất cả"
        status={attendees.checkedAll}
        color={Color.primary}
        labelStyle={{ fontWeight: "bold" }}
      />
    );
  }, [attendees.checkedAll]);

  const renderItem = useCallback(
    ({ index, item }: { index: number; item: Attendee }) => {
      return (
        <Checkbox.Item
          onPress={() => pressItem(index)}
          label={item.name}
          status={item.status}
          color={Color.primary}
        />
      );
    },
    [],
  );

  // Side Effect
  useEffect(() => {
    if (state.actionDone === "submit_attendeee") {
      state.submitAttendee(attendees);
    }
  }, [state.actionDone]);

  return (
    <FlatList
      data={attendees.data}
      ListHeaderComponent={renderHeader}
      renderItem={renderItem}
      keyExtractor={item => {
        return item.id;
      }}
    />
  );
};

export default observer(SelectAttendee);
