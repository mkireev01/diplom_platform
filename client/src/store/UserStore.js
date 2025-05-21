import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { fetchCompany } from '../http/companyAPI';

export default class UserStore {
  _user = {};
  _isAuth = false;
  _company = null;

  constructor() {
    this._user = JSON.parse(localStorage.getItem("user")) || {};
    this._isAuth = JSON.parse(localStorage.getItem("isAuth")) || false;
    this._company = JSON.parse(localStorage.getItem("company")) || null;
    makeAutoObservable(this);
  }

  setUser(user) {
    this._user = user;
    localStorage.setItem("user", JSON.stringify(user));
  }

  setIsAuth(isAuth) {
    this._isAuth = isAuth;
    localStorage.setItem("isAuth", JSON.stringify(isAuth));
  }

  setCompany(company) {
    this._company = company;
    localStorage.setItem("company", JSON.stringify(company));
  }

 // в UserStore
async loadMyCompany() {
  try {
    const data = await fetchCompany();   // вероятно: [{…}, {…}, …]
    // находим объект, где company.userId === this._user.id
    const mine = Array.isArray(data)
      ? data.find(c => c.userId === this._user.id)
      : data;
    runInAction(() => {
      this.setCompany(mine || null);
    });
  } catch (error) {
    console.error('Ошибка загрузки компании:', error);
  }
}


  get user() {
    return this._user;
  }

  get isAuth() {
    return this._isAuth;
  }

  get company() {
    return this._company;
  }

  get companyId() {
    return this._company?.id;
  }
}
