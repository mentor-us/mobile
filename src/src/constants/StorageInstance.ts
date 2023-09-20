import {EnhancedStore} from "@reduxjs/toolkit";
import {RootState} from "~/redux/store";

export default class StoreInstance {
  static store: undefined | EnhancedStore<RootState>;

  private constructor() {}

  static setStore(ownStore: EnhancedStore<RootState>) {
    this.store = ownStore;
  }
}
