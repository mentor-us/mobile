import { useContext } from "react";
import { LoadingIndicator } from "react-native-expo-fancy-alerts";
import { AppContext } from "~/context/app";

const AppLoadingIndicator = () => {
  const { isLoading } = useContext(AppContext);
  return <LoadingIndicator visible={isLoading} />;
};

export default AppLoadingIndicator;
