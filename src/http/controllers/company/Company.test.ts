import axios from "axios";
import faker from "faker";
import { TestingEndpoint } from "../../../utils/TestingEndpoint";

const random_company = (): any => ({
  name: faker.internet.userName(),
  area: faker.internet.userName()
});

describe("company test suite", () => {
  test("register a company", async () => {
    const { data } = await axios.post(
      `${TestingEndpoint}/company/register`,
      random_company()
    );
    expect(data._id).not.toBeNull();
  });
});
