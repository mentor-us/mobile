import { BASE_URL } from "@env";
import { SecureStore } from "../local/SecureStore";

export const FileApi = {
  async getFile(key: string) {
    const searchParams = new URLSearchParams();
    searchParams.append("key", key);

    return fetch(`${BASE_URL}/api/files?${searchParams}`, {
      headers: {
        responseType: "arraybuffer",
        authorization: "Bearer " + (await SecureStore.getToken()),
      },
    });
  },
};
