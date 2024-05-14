import { History } from "../../interfaces/History";
import { Service } from "../Service";
const BASE = "histories";

export class HistoriesClient {
  static async addNewHistory(body: History) {
    const { error, errorMessage, response } = await Service.post(
      `${import.meta.env.VITE_API_KEY}${BASE}`,
      body
    );

    return { error, errorMessage, response };
  }

  static async updateHistory(id: string, body: History) {
    const { error, errorMessage, response } = await Service.put(
      `${import.meta.env.VITE_API_KEY}${BASE}/${id}`,
      body
    );

    return { error, errorMessage, response };
  }
}
