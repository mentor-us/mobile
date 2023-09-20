export interface InfoItemModel {
  type:
    | "title"
    | "meetingTime"
    | "description"
    | "place"
    | "organizer"
    | "repeated"
    | "attendee";
  text: string;
  isNull?: boolean;
}
