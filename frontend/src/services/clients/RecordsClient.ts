import { Record } from "../../interfaces/Record";
import { Service } from "../Service";

const BASE = "records";

export class RecordsClient {
  static async getAllRecords(params: object = {}) {
    const { error, errorMessage, response } = await Service.get(
      `${import.meta.env.VITE_API_KEY}${BASE}`,
      params
    );

    return {
      error,
      errorMessage,
      response,
    };
  }

  static async addNewRecord(body: Record) {
    const { error, errorMessage, response } = await Service.post(
      `${import.meta.env.VITE_API_KEY}${BASE}`,
      body
    );

    return { error, errorMessage, response };
  }
  static async addBulkNewRecord(body: Record[]) {
    const { error, errorMessage, response } = await Service.post(
      `${import.meta.env.VITE_API_KEY}${BASE}/bulk`,
      body
    );

    return { error, errorMessage, response };
  }

  static async updateRecordById(id: string, body: Record) {
    const { error, errorMessage, response } = await Service.put(
      `${import.meta.env.VITE_API_KEY}${BASE}/${id}`,
      body
    );

    return { error, errorMessage, response };
  }

  static async deleteRecordById(id: string) {
    const { error, errorMessage, response } = await Service.delete(
      `${import.meta.env.VITE_API_KEY}${BASE}/${id}`
    );

    return { error, errorMessage, response };
  }
}
