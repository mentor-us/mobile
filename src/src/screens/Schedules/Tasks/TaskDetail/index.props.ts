export interface InfoItemModel {
  type:
    | "title"
    | "deadline"
    | "description"
    | "assinger"
    | "status"
    | "assignee";
  text: string;
}
