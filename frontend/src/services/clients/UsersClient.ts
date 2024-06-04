import { Service } from "../Service";

interface oldProfile {
  username: string;
  name: string;
}

interface newProfile extends oldProfile {
  password: string;
}

interface passwordInterface {
  oldPassword: string;
  newPassword: string;
}
export class UsersClient {
  static async Login(body: object = {}) {
    const { error, errorMessage, response } = await Service.post(
      `${import.meta.env.VITE_API_KEY}/login`,
      body
    );

    return { error, errorMessage, response };
  }

  static async Register(body: object = {}) {
    const { error, errorMessage, response } = await Service.post(
      `${import.meta.env.VITE_API_KEY}/register`,
      body
    );

    return { error, errorMessage, response };
  }

  static async GetUser(username: string) {
    const { error, errorMessage, response } = await Service.get(
      `${import.meta.env.VITE_API_KEY}/users/${username}`
    );

    return { error, errorMessage, response };
  }

  static async UpdateProfile(username: string, body: newProfile) {
    const { error, errorMessage, response } = await Service.put(
      `${import.meta.env.VITE_API_KEY}/users/detail/${username}`,
      body
    );

    return { error, errorMessage, response };
  }

  static async UpdatePassword(username: string, body: passwordInterface) {
    const { error, errorMessage, response } = await Service.put(
      `${import.meta.env.VITE_API_KEY}/users/password/${username}`,
      body
    );

    return { error, errorMessage, response };
  }
}
