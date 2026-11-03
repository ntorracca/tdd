import { UpdateTaskModel } from "../updateTasks";

export interface UpdateTaskRepository {
  update(taskData: UpdateTaskModel): Promise<Error | void>;
}