import { hoursToMilliseconds } from "./numberUtils";

export const setLocalStorage = (key: string, data: object) => {
  const currentTimestamp = new Date().getTime();

  localStorage.setItem(
    key,
    JSON.stringify({
      data,
      expired: currentTimestamp + hoursToMilliseconds(6),
    })
  );
};

export const getLocalStorage = (key: string) => {
  const res =
    localStorage.getItem(key) || JSON.stringify({ data: {}, expired: 0 });
  const currentTimestamp = new Date().getTime();
  const { data, expired } = JSON.parse(res);

  if (!Object.keys(data).length || currentTimestamp > expired) {
    deleteLocalStorage(key);
    return {};
  }

  return data;
};

export const deleteLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
