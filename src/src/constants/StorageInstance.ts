import { EnhancedStore } from "@reduxjs/toolkit";
import { RootState } from "~/redux/store";

/**
 * @file StorageInstance.ts
 * @class StoreInstance
 * @deprecated - This class is deprecated. I can't find any use of it. What is it for?
 */
export default class StoreInstance {
  static store: undefined | EnhancedStore<RootState>;

  private constructor() {}

  static setStore(ownStore: EnhancedStore<RootState>) {
    this.store = ownStore;
  }
}
