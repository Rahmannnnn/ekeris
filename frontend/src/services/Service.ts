import axios, { AxiosError } from "axios";

class Service {
  async get(url: string, params = {}, additionalHeader?: object) {
    try {
      const res = await axios.get(url, {
        params,
        headers: {
          "content-type": "application/json",
          ...additionalHeader,
        },
      });

      const { data } = res;
      const { status, message } = data;

      switch (res.status) {
        case 400:
        case 401:
        case 409:
        case 500:
          throw new Error(`${status}: ${message}`);
      }

      return data;
    } catch (error) {
      const { response } = error as AxiosError;
      throw response?.data;
    }
  }

  async post(url: string, body: object = {}, additionalHeader?: object) {
    try {
      const res = await axios.post(url, body, {
        headers: {
          "content-type": "application/json",
          ...additionalHeader,
        },
      });

      const { data } = res;
      const { status, message } = data;

      switch (res.status) {
        case 400:
        case 401:
        case 409:
        case 500:
          throw new Error(`${status}: ${message}`);
      }

      return data;
    } catch (error) {
      const { response } = error as AxiosError;
      throw response?.data;
    }
  }
}

export const service = new Service();
