import { observer } from "mobx-react-lite";
import LoginScreen from "./LoginScreen";

export interface LoginRouteParamsProps extends Readonly<object> {
  token?: string;
  emailVerified?: boolean;
  error?: string;
  refreshToken?: string;
}

export default observer(LoginScreen);
