export class LocalStorage {
  static isServer = () => typeof window === "undefined";

  static setItem = (key: string, value: string | boolean) => {
    const stringValue =
      typeof value === "boolean" ? JSON.stringify(value) : value;
    return !LocalStorage.isServer() && localStorage.setItem(key, stringValue);
  };

  static getItem = (key: string) => {
    return !LocalStorage.isServer() && localStorage.getItem(key);
  };

  static clear = () => {
    return !LocalStorage.isServer() && localStorage.clear();
  };
  static removeItem = (key: string) => {
    return !LocalStorage.isServer() && localStorage.removeItem(key);
  };
}
