import axios from "axios";
import faker from "faker";

import { TestingEndpoint } from "../../../utils/TestingEndpoint";

export const random_employee = (): any => ({
  card_id: faker.random.alphaNumeric(5),
  first_name: faker.internet.userName(),
  last_name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  age: faker.random.number({ min: 18, max: 100 }),
  salary: faker.random.number({ min: 1000, max: 2000 }),
  occupation: faker.random.alphaNumeric(10)
});

describe("employee test suite", () => {
  test("register employee", async () => {
    const {
      data: { token }
    } = await axios.post(`${TestingEndpoint}/employee/register`, {
      ...random_employee()
    });

    expect(token).not.toBeNull();
  });

  test("fail to register employee without valid fields", async () => {
    try {
      await axios.post(`${TestingEndpoint}/employee/register`, {
        ...random_employee(),
        email: ""
      });
    } catch (ex) {
      expect(ex).not.toBeNull();
    }
  });

  test("login", async () => {
    const _emp = random_employee();

    await axios.post(`${TestingEndpoint}/employee/register`, _emp);

    const {
      data: { token }
    } = await axios.post(`${TestingEndpoint}/employee/login`, {
      email: _emp.email,
      password: _emp.password
    });

    expect(token).not.toBeNull();
  });

  test("fail to login with invalid credentials", async () => {
    try {
      await axios.post(`${TestingEndpoint}/employee/login`, {
        email: faker.internet.email(),
        password: faker.internet.password()
      });
    } catch (ex) {
      expect(ex).not.toBeNull();
    }
  });

  test("list all employees", async () => {
    const { data } = await axios.get(`${TestingEndpoint}/employee`);

    expect(data.length).toBeGreaterThan(0);
  });

  test("get employee by id", async () => {
    const {
      data: { employee }
    } = await axios.post(
      `${TestingEndpoint}/employee/register`,
      random_employee()
    );

    const {
      data: { _id }
    } = await axios.get(`${TestingEndpoint}/employee/${employee._id}`);

    expect(_id).toEqual(employee._id);
  });

  test("search employee by name", async () => {
    const { data: employee } = await axios.post(
      `${TestingEndpoint}/employee/register`,
      random_employee()
    );

    const {
      data: { first_name }
    } = await axios.get(
      `${TestingEndpoint}/employee/search/${employee.first_name}`
    );

    expect(first_name).toEqual(employee.first_name);
  });
});
