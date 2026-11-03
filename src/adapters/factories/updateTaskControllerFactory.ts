import { Controller } from "../interfaces";
import { LogErrorMongoRepository, TaskMongoRepository } from "../../dataSources";
import { DbUpdateTask } from "../../dataSources/db/dbUpdateTask";
import { RequiredFieldsValidation } from "../validations/requiredFieldsValidation";
import { LogErrorControllerDecorator } from "../decorators/logErrorControllerDecorator";
import { UpdateTaskController } from "../controllers/task/updateTasks";

export const updateTaskControllerFactory = (): Controller => {
  const taskMongoRepository = new TaskMongoRepository();
  const dbUpdateTask = new DbUpdateTask(taskMongoRepository);
  const taskController = new UpdateTaskController(
    dbUpdateTask,
    new RequiredFieldsValidation("id")
  );
  const logMongoRepository = new LogErrorMongoRepository();
  return new LogErrorControllerDecorator(taskController, logMongoRepository);
};