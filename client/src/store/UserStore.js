import { makeAutoObservable } from "mobx";

export default class UserStore {
  constructor() {
    this._user = JSON.parse(localStorage.getItem("user")) || {};
    this._isAuth = JSON.parse(localStorage.getItem("isAuth")) || false;
    makeAutoObservable(this);
  }

  setUser(user) {
    this._user = user;
    localStorage.setItem("user", JSON.stringify(user)); // Сохраняем в localStorage
  }

  setIsAuth(isAuth) {
    this._isAuth = isAuth;
    localStorage.setItem("isAuth", JSON.stringify(isAuth)); // Сохраняем в localStorage
  }

  get user() {
    return this._user;
  }

  get isAuth() {
    return this._isAuth;
  }

  logout() {
    this.setUser({});
    this.setIsAuth(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuth");
  }
}
