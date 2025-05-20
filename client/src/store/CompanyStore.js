
import { makeAutoObservable } from "mobx";

export default class ResumeStore {
  constructor() {
    this._resumes = [];

    makeAutoObservable(this);
  }

  setResumes(resumes) {
    this._resumes = resumes;
  }

  get resumes() {
    return this._resumes;
  }
}
