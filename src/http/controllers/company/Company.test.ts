import axios from "axios";
import faker from "faker";
import { TestingEndpoint } from "../../../utils/TestingEndpoint";
import { randomBytes } from "crypto";

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
    await axios.post(`${TestingEndpoint}/company/register`, random_company());

    const { data } = await axios.get(`${TestingEndpoint}/company`);

    expect(data).not.toBeNull();
  });

  test("get company by id", async () => {
    const {
      data: { _id }
    } = await axios.post(
      `${TestingEndpoint}/company/register`,
      random_company()
    );

    const { data } = await axios.get(`${TestingEndpoint}/company/${_id}`);

    expect(data).not.toBeNull();
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
    const {
      data: { name }
    } = await axios.post(
      `${TestingEndpoint}/company/register`,
      random_company()
    );

    const {
      data: [best_result]
    } = await axios.get(`${TestingEndpoint}/company/search/${name}`);

    expect(best_result.name).toEqual(name);
  });

  test("update company", async () => {
    const {
      data: { _id, name: old_name }
    } = await axios.post(
      `${TestingEndpoint}/company/register`,
      random_company()
    );

    const payload: any = {
      name: faker.internet.userName()
    };

    const {
      data: { name }
    } = await axios.patch(`${TestingEndpoint}/company/${_id}`, payload);

    expect(old_name).not.toEqual(name);
  });

  test("fail to update company with invalid id", async () => {
    const payload: any = {
      name: faker.internet.userName()
    };

    try {
      await axios.patch(
        `${TestingEndpoint}/company/${faker.random.alphaNumeric()}`,
        payload
      );
    } catch (ex) {
      expect(ex).not.toBeNull();
    }
  });

  test.only("delete company", async () => {
    const {
      data: { _id }
    } = await axios.post(
      `${TestingEndpoint}/company/register`,
      random_company()
    );

    const { data } = await axios.delete(`${TestingEndpoint}/company/${_id}`);

    expect(data).not.toBeNull();
  });
});
