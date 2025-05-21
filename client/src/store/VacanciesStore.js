import { makeAutoObservable } from "mobx";

export default class VacancyStore {
  constructor() {
   this._vacancies = [];


    makeAutoObservable(this);
  }

  setVacancies(vacancies) {
    this._vacancies = vacancies;
  }

  get vacancies() {
    return this._vacancies;
  }

  addVacancy(vacancy) {
    const newId =
      this._vacancies.length > 0
        ? Math.max(...this._vacancies.map((v) => v.id)) + 1
        : 1;
    this._vacancies.push({ id: newId, ...vacancy });
  }


  updateVacancy(id, updatedFields) {
    const idx = this._vacancies.findIndex((v) => v.id === id);
    if (idx !== -1) {
      this._vacancies[idx] = { ...this._vacancies[idx], ...updatedFields };
    }
  }

 
  removeVacancy(id) {
    this._vacancies = this._vacancies.filter((v) => v.id !== id);
  }

  getVacancyById(id) {
    return this._vacancies.find((v) => v.id === id);
  }
}
