import axios from "axios";
import { TestingEndpoint } from "../../../utils/TestingEndpoint";

export const random_register = (type: string): any => ({
  employee: "",
  timestamp: (Date.now() as unknown) as string,
  type
});

describe("register test suite", () => {
  test("create a register", async () => {});

  test("list all registers", async () => {
    const { data } = await axios.get(`${TestingEndpoint}/register`);

    expect(data.length).toBeGreaterThan(0);
  });
});
