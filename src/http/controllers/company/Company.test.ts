import axios from "axios";

import faker from "faker";

import { TestingEndpoint } from "../../../utils/TestingEndpoint";

import { randomBytes } from "crypto";
import { random_employee } from "../employee/Employee.test";

export const random_company = (): any => ({
  administrators: [],
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

  test("fail to register a company with invalid params", async () => {
    const invalid_payload = {
      name: "ab" /* too short */,
      area: faker.internet.userName()
    };

    try {
      await axios.post(`${TestingEndpoint}/company/register`, invalid_payload);
    } catch (ex) {
      expect(ex).not.toBeNull();
    }
  });

  test("list all companies", async () => {
    await axios.post(`${TestingEndpoint}/company/register`, random_company());

    const { data } = await axios.get(`${TestingEndpoint}/company`);

    expect(data.length).toBeGreaterThan(0);
  });

  test("get company by id", async () => {
    const { data: company } = await axios.post(
      `${TestingEndpoint}/company/register`,
      random_company()
    );
    const {
      data: { _id }
    } = await axios.get(`${TestingEndpoint}/company/${company._id}`);

    expect(_id).toEqual(company._id);
  });

  test("fail to get company with invalid id", async () => {
    const _id: string = randomBytes(10).toString();

    try {
      await axios.get(`${TestingEndpoint}/company/${_id}`);
    } catch (ex) {
      expect(ex).not.toBeNull();
    }
  });

  test("search company by name", async () => {
    const { data: company } = await axios.post(
      `${TestingEndpoint}/company/register`,
      random_company()
    );

    console.log("company", company);

    const {
      data: [best_result]
    } = await axios.get(`${TestingEndpoint}/company/search/${company.name}`);

    expect(best_result.name).toEqual(name);
  });

  test("add admin", async () => {
    const {
      data: { token, employee: server_owner }
    } = await axios.post(
      `${TestingEndpoint}/employee/register`,
      random_employee()
    );

    console.log("server_owne", server_owner);

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios.post(`${TestingEndpoint}/company/register`, random_company());

    const {
      data: { employee: admin }
    } = await axios.post(
      `${TestingEndpoint}/employee/register`,
      random_employee()
    );

    const { status } = await axios.patch(
      `${TestingEndpoint}/company/admin/add`,
      { admin: admin._id }
    );

    expect(status).toBe(200);
  });
});
