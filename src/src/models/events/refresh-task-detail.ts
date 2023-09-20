import { TaskModel, TaskStatusModel, TaskStatusType } from "../task";

export interface RefreshTaskDetailEvent {
    taskId: string;
    newStatus: TaskStatusType;
    task: TaskModel;
    status: boolean; 
    message: string
};