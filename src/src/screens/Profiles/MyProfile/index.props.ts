export interface InfoItemModel {
  type: "fullname" | "phomenumber" | "email" | "year_born" | "personal_email";
  text: string;
  userId?: string;
}
