import axios from "axios";
import faker from "faker";

import { TestingEndpoint } from "../../../utils/TestingEndpoint";
import { random_company } from "../company/Company.test";

export const random_employee = (): any => ({
  first_name: faker.internet.userName(),
  last_name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  age: faker.random.number({ min: 18, max: 100 }),
  salary: faker.random.number({ min: 1000, max: 2000 }),
  occupation: faker.random.alphaNumeric(10),
  employer: faker.random.alphaNumeric(10)
});

describe("employee test suite", () => {
  test("register employee", async () => {
    const {
      data: { name }
    } = await axios.post(
      `${TestingEndpoint}/company/register`,
      random_company()
    );

    const {
      data: { token }
    } = await axios.post(`${TestingEndpoint}/employee/register`, {
      ...random_employee(),
      employer: name
    });

    expect(token).not.toBeNull();
  });

  test("fail to register employee without valid employer", async () => {
    try {
      await axios.post(`${TestingEndpoint}/employee/register`, {
        ...random_employee(),
        employer: name
      });
    } catch (ex) {
      expect(ex).not.toBeNull();
    }
  });

  test("login", async () => {
    const {
      data: { name }
    } = await axios.post(
      `${TestingEndpoint}/company/register`,
      random_company()
    );

    const employee: any = {
      ...random_employee(),
      employer: name
    };

    await axios.post(`${TestingEndpoint}/employee/register`, employee);

    const {
      data: { token }
    } = await axios.post(`${TestingEndpoint}/employee/login`, {
      email: employee.email,
      password: employee.password
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
    const {
      data: { name }
    } = await axios.post(
      `${TestingEndpoint}/company/register`,
      random_company()
    );

    await axios.post(`${TestingEndpoint}/employee/register`, {
      ...random_employee(),
      employer: name
    });

    const { data } = await axios.get(`${TestingEndpoint}/employee`);

    expect(data.length).toBeGreaterThan(0);
  });

  test("get employee by id", async () => {
    const {
      data: { name }
    } = await axios.post(
      `${TestingEndpoint}/company/register`,
      random_company()
    );

    const {
      data: { _id }
    } = await axios.post(`${TestingEndpoint}/employee/register`, {
      ...random_employee(),
      employer: name
    });

    const { data } = await axios.get(`${TestingEndpoint}/employee/${_id}`);

    expect(data).not.toBeNull();
  });

  test("search employee by name", async () => {
    const {
      data: { name: company_name }
    } = await axios.post(
      `${TestingEndpoint}/company/register`,
      random_company()
    );

    const {
      data: { first_name }
    } = await axios.post(`${TestingEndpoint}/employee/register`, {
      ...random_employee(),
      employer: company_name
    });

    const { data } = await axios.get(
      `${TestingEndpoint}/employee/search/${first_name}`
    );

    expect(data).not.toBeNull();
  });
});
