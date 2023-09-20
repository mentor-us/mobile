export type FilterType = 
    | "NONE"
    | "OWN_TASK"
    | "MY_ASSIGNED_TASK"
    | "ASSIGNED_BY_ME";

export interface FilterModel {
    type: FilterType;
    name: String;
    visible: boolean;
}

export const INIT_FILTER_MODELS: FilterModel[] = [
    {type: "NONE", name: "NONE", visible: false} as FilterModel,
    {type: "OWN_TASK", name: "Công việc của tôi", visible: true} as FilterModel,
    {type: "MY_ASSIGNED_TASK", name: "Được giao", visible: true} as FilterModel,
    {type: "ASSIGNED_BY_ME", name: "Tôi đã giao", visible: true} as FilterModel,
];