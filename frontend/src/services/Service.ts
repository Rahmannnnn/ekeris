import axios from "axios";

export class Service {
  static async get(url: string, params: object = {}, additionalHeader = {}) {
    try {
      const res = await axios.get(url, {
        params,
        headers: {
          "content-type": "application/json",
          ...additionalHeader,
        },
      });

      return {
        error: false,
        errorMessage: "",
        response: res.data,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const { response } = err;
        return {
          error: true,
          errorMessage: response?.data.error || "",
          response: "",
        };
      }

      if (err instanceof Error) {
        const { message } = err;
        return {
          error: true,
          errorMessage: message,
          response: "",
        };
      }

      return {
        error: true,
        errorMessage: "Error",
        response: "",
      };
    }
  }

  static async post(
    url: string,
    body: object = {},
    additionalHeader: object = {}
  ) {
    try {
      const res = await axios.post(url, body, {
        headers: {
          "content-type": "application/json",
          ...additionalHeader,
        },
      });

      return {
        error: false,
        errorMessage: "",
        response: res.data,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const { response } = err;
        return {
          error: true,
          errorMessage: response?.data.error || "",
          response: "",
        };
      }

      if (err instanceof Error) {
        const { message } = err;
        return {
          error: true,
          errorMessage: message,
          response: "",
        };
      }

      return {
        error: true,
        errorMessage: err,
        response: "",
      };
    }
  }

  static async delete(
    url: string,
    body: object = {},
    additionalHeader: object = {}
  ) {
    try {
      const res = await axios.delete(url, {
        data: body,
        headers: {
          ...additionalHeader,
        },
      });

      return {
        error: false,
        errorMessage: "",
        response: res.data,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const { response } = err;
        return {
          error: true,
          errorMessage: response?.data.error || "",
          response: "",
        };
      }

      if (err instanceof Error) {
        const { message } = err;
        return {
          error: true,
          errorMessage: message,
          response: "",
        };
      }

      return {
        error: true,
        errorMessage: "",
        response: "",
      };
    }
  }

  static async put(
    url: string,
    body: object = {},
    additionalHeader: object = {}
  ) {
    try {
      const res = await axios.put(url, body, {
        headers: {
          "content-type": "application/json",
          ...additionalHeader,
        },
      });

      return {
        error: false,
        errorMessage: "",
        response: res.data,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const { response } = err;
        return {
          error: true,
          errorMessage: response?.data.error || "",
          response: "",
        };
      }

      if (err instanceof Error) {
        const { message } = err;
        return {
          error: true,
          errorMessage: message,
          response: "",
        };
      }

      return {
        error: true,
        errorMessage: "",
        response: "",
      };
    }
  }

  static async patch(
    url: string,
    body: object = {},
    additionalHeader: object = {}
  ) {
    try {
      const res = await axios.patch(url, body, {
        headers: {
          "content-type": "application/json",
          ...additionalHeader,
        },
      });

      return {
        error: false,
        errorMessage: "",
        response: res.data,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const { response } = err;
        return {
          error: true,
          errorMessage: response?.data.error || "",
          response: "",
        };
      }

      if (err instanceof Error) {
        const { message } = err;
        return {
          error: true,
          errorMessage: message,
          response: "",
        };
      }

      return {
        error: true,
        errorMessage: "",
        response: "",
      };
    }
  }
}
