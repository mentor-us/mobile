import { AxiosError, AxiosResponse } from "axios";
import AxiosClient from "./AxiosClient";
import { Notification } from "~/models/notification";

export default class NotificationApi {
  static async all(page = 0, pageSize = 25): Promise<Notification[]> {
    const URL = `api/notifications?page=${page}&pageSize=${pageSize}`;

    let notifications = [];
    try {
      notifications = await AxiosClient.get(URL);
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
    }

    return notifications;
  }

  static async findById(id: string) {
    const URL = `api/notifications/${id}`;

    let notification: Notification;
    try {
      const response: AxiosResponse = await AxiosClient.get<Notification>(URL);
      notification = response.data;
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      return null;
    }

    return notification;
  }

  static async updateToken(userId: string, token: string) {
    const URL = `/api/notifications/subscribe`;
    try {
      const response = await AxiosClient.post(URL, { userId, token });
    } catch (error) {
      console.log("@DUKE_ NotificationApi_ updateToken: ", error);
    }
  }
}
