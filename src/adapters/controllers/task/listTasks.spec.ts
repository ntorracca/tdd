import { expect, jest } from "@jest/globals";
import test, { describe } from "node:test";
import { noContent, ok, serverError } from "../../presentations/api/httpResponses/httpResponses";
import { ListTasksController } from "./listTasks";
import { Task } from "../../../entities/task";
import { ListTasks } from "../../../usecases/listTasks";

interface SutTypes {
  sut: ListTasksController;
  listTaskStub: ListTasks;
}

const makeListTasks = (): ListTasks => {
  class ListTasksStub implements ListTasks {
    async list(): Promise<Task[]> {
      return Promise.resolve(makeFakeRequest());
    } 
  }
  return new ListTasksStub();
};

const makeSut = (): SutTypes => {
  const lisTaskStub = makeListTasks();
  const sut = new ListTasksController(lisTaskStub);
  return { sut, listTaskStub: lisTaskStub };
};

const makeFakeRequest = (): Task[] => {
  return [
    {
      id: "any_id",
      title: "any_title",
      description: "any_description",
      date: "30/06/2024",
    },
    {
      id: "other_id",
      title: "other_title",
      description: "other_description",
      date: "31/07/2024",
    }    
  ];
};

describe("ListTasks Controller", () => {
  test("Deve retornar 204 se alista estiver vazia", async () => {
    const { sut, listTaskStub } = makeSut();
    jest.spyOn(listTaskStub, "list").mockReturnValueOnce(Promise.resolve([]));
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(noContent());
  });
  test("Deve retornar 200 com uma lista de tarefas", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(makeFakeRequest()));
  });

  test("Deve verificar se a funcionalidade que lista tarefas é chamada corretamente", async () => {
    const { sut, listTaskStub } = makeSut();
    const listSpy = jest.spyOn(listTaskStub, "list");
    const httpResponse = await sut.handle({});
    expect(listSpy).toHaveBeenCalled();
  });

  test("Deve retornar 500 se acontecer algum erro", async () => {
    const { listTaskStub, sut } = makeSut();
    jest
      .spyOn(listTaskStub, "list")
      .mockReturnValueOnce(Promise.reject(new Error()));
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});

