import { observer } from "mobx-react-lite";
import AddChannelScreenProvider, { useAddChannelScreenState } from "~/context/channel";
import Form from "./Form";
import SelectAssingee from "./SelectAssignee";
import { ScreenProps } from "~/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { UserProfileModel } from "~/models/user";
import { useAppSelector } from "~/redux";
import { useCallback, useEffect, useState } from "react";
import { useUpdateQueryGroupList } from "~/screens/Home/queries";
import { HeaderCloseButton, HeaderLeft, HeaderSubmitButton } from "~/components/Header";
import { StackNavigationOptions } from "@react-navigation/stack";
import GlobalStyles from "~/constants/GlobalStyles";
import { DeviceEventEmitter, View } from "react-native";
import { AddChannelScreenState } from "~/mobx/channel";
import { Color } from "~/constants/Color";
import EventEmitterNames from "~/constants/EventEmitterNames";

const Container = observer(() => {
    const state = useAddChannelScreenState();
    return (
      <>
        {state.screenType === "form" && <Form />}
        {state.screenType === "select_assignee" && <SelectAssingee />}
      </>
    );
  });
  
  const AddChannel: ScreenProps<"addChannel"> = ({route}) => {

    // Needed data
    const groupId = route.params.groupId;
    const navigation = useNavigation();
    const currentUser: UserProfileModel = useAppSelector(
      state => state.user.data,
    );
    const queryAction = useUpdateQueryGroupList();
    const [state] = useState(() => {
      return new AddChannelScreenState({
        groupId: route.params.groupId,
        currentUser: currentUser,
        channelId: route.params.channelId,
      });
    });
  
    // Action
    const onRightPress = useCallback(() => {
      state.submit();
      if (state.screenType === "form") {
  
        if (Boolean(state.channelId)) {
          DeviceEventEmitter.emit(EventEmitterNames.refreshWorkspace, {
            status: true,
            message: "Đã cập nhật kênh.",
          });
        } else {
          DeviceEventEmitter.emit(EventEmitterNames.refreshWorkspace, {
            status: true,
            message: "Tạo kênh mới thành công",
          });
        }
        state.getCanGoBack() && navigation.goBack();
      };
  
      // Update last message in homepage
      const newMessage = `Nhóm có kênh mới "${state.name}"`;
      queryAction.updateGroupNewMessage(
        groupId,
        newMessage,
        false,
      );
    }, []);
  
    const onLeftPress = useCallback(() => {
      state.setScreenType("form");
    }, []);
  
    const headerRight = useCallback(() => {
      return <HeaderSubmitButton onPress={onRightPress} />;
    }, []);
  
    const headerLeft = useCallback(() => {
      return state.screenType == "select_assignee" ? (
        <HeaderLeft onPress={onLeftPress} />
      ) : (
        <HeaderCloseButton canGoBack />
      );
    }, [state.screenType]);
  
    // Side Effect
    useEffect(() => {
      const title = state.getScreenTitle();
      navigation.setOptions({
        headerRight,
        headerLeft,
        title: title,
      } as StackNavigationOptions);
    }, [state.screenType]);
  
    return (
      <AddChannelScreenProvider
        state={state}
        key={`add-channel-${route.params.groupId}`}>
        <View style={[GlobalStyles.fullFlex, {backgroundColor: Color.white}]}>
          <Container />
        </View>
      </AddChannelScreenProvider>
    );
  };
  
  export default observer(AddChannel);