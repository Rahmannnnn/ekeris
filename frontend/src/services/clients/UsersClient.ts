import { Service } from "../Service";

export class UsersClient {
  static async Login(body: object = {}) {
    const { error, errorMessage, response } = await Service.post(
      `${import.meta.env.VITE_API_KEY}/login`,
      body
    );

    return { error, errorMessage, response };
  }
}
