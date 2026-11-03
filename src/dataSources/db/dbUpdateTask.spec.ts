import { DbUpdateTask } from "./dbUpdateTask";
import { describe, expect, test, jest } from "@jest/globals";
import { UpdateTask, UpdateTaskModel } from "../../usecases/updateTasks";

interface UpdateTaskRepository {
  update(taskData: any): Promise<void | Error>;
}

const makeUpdateTaskRepository = (): UpdateTaskRepository => {
  class UpdateTaskRepositoryStub implements UpdateTaskRepository {
    async update(taskData: any): Promise<void | Error> {
      return Promise.resolve();
    }
  }
  return new UpdateTaskRepositoryStub();
};

interface SutTypes {
  sut: UpdateTask;
  updateTaskRepositoryStub: UpdateTaskRepository;
}

const makeSut = (): SutTypes => {
  const updateTaskRepositoryStub = makeUpdateTaskRepository();
  const sut = new DbUpdateTask(updateTaskRepositoryStub);
  return {
    sut,
    updateTaskRepositoryStub,
  };
};
const makeFakeUpdateTaskData = (): UpdateTaskModel => ({
  id: "valid_id",
  title: "new_title",
  description: "new_description",
  date: "new_date",
});

describe("DbUpdateTask", () => {
  test("Deve chamar UpdateTaskRepository com os valores corretos", async () => {
    const { sut, updateTaskRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateTaskRepositoryStub, "update");
    await sut.update(makeFakeUpdateTaskData());
    expect(updateSpy).toHaveBeenCalledWith({
      id: "valid_id",
      title: "new_title",
      description: "new_description",
      date: "new_date",
    });
  });

  test("Deve lançar exceção se UpdateTaskRepository lançar exceção", async () => {
    const { sut, updateTaskRepositoryStub } = makeSut();
    jest
      .spyOn(updateTaskRepositoryStub, "update")
      .mockRejectedValueOnce(new Error());
    const promise = sut.update(makeFakeUpdateTaskData());
    await expect(promise).rejects.toThrow();
  });

});