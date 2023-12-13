import { action, makeAutoObservable } from "mobx";

class AuthStore {
  isLoading = true;
  isSignout = false;
  userToken: string | null = null;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  restoreToken(token: string | null) {
    this.isLoading = false;
    this.userToken = token;
  }

  @action
  signIn(token: string) {
    this.isSignout = false;
    this.userToken = token;
  }

  @action
  signOut() {
    this.isSignout = true;
    this.userToken = null;
  }

  @action
  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  @action
  setError(error: string | null = null) {
    this.isLoading = false;
    this.error = error;
  }
}

export default AuthStore;
