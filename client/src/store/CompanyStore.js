
import { makeAutoObservable } from "mobx";

export default class CompanyStore {
  constructor() {
    this._company = [];

    makeAutoObservable(this);
  }

  setCompany(company) {
    this._company = company;
  }

  get companies() {
    return this._company;
  }
}
