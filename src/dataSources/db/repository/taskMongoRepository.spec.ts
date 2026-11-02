import {test, describe, expect, beforeAll, afterAll} from "@jest/globals";
import { MongoManager } from "../../config/mongoManager";
import { TaskMongoRepository } from "./taskMongoRepository";

const makeSut = (): TaskMongoRepository => {
  return new TaskMongoRepository();
};

describe("TaskMongoRepository", () => {
  const client = MongoManager.getInstance();
  beforeAll(async () => {
    await client.connect(process.env.MONGO_URL as string);
  });
  afterAll(async () => {
    await client.disconnect();
  });


  test("Deve retornar a tarefa em caso de sucesso", async () => {
    const sut = makeSut();
    await sut.add({
      title: "any_title",
      description: "any_description",
      date: "any_date"
    });

    const tasks = await sut.list();

    expect(tasks[0].id).toBeTruthy();
    expect(tasks[0].title).toBe("any_title");
    expect(tasks[0].description).toBe("any_description");
    expect(tasks[0].date).toBe("any_date"); 
    expect(tasks.length).toBe(1);
  });

});