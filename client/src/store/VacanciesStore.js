// src/store/VacancyStore.js
import { makeAutoObservable } from "mobx";

export default class VacancyStore {
  constructor() {
    this._vacancies = [
      {
        id: 1,
        title: "Frontend Developer",
        description:
          "Ищем разработчика для работы с React, TypeScript, TailwindCSS.",
        salaryFrom: 80000,
        salaryTo: 120000,
      },
      {
        id: 2,
        title: "Backend Developer",
        description: "Node.js, Express, PostgreSQL, Docker.",
        salaryFrom: 90000,
        salaryTo: 130000,
      },
      {
        id: 3,
        title: "Fullstack Engineer",
        description: "React + Node.js + MongoDB, CI/CD.",
        salaryFrom: 100000,
        salaryTo: 150000,
      },
    ];

    makeAutoObservable(this);
  }

  // Сеттер для замены всего массива
  setVacancies(vacancies) {
    this._vacancies = vacancies;
  }

  // Геттер возвращает приватное поле без рекурсии
  get vacancies() {
    return this._vacancies;
  }

  // action: добавить вакансию
  addVacancy(vacancy) {
    const newId =
      this._vacancies.length > 0
        ? Math.max(...this._vacancies.map((v) => v.id)) + 1
        : 1;
    this._vacancies.push({ id: newId, ...vacancy });
  }

  // action: обновить вакансию по id
  updateVacancy(id, updatedFields) {
    const idx = this._vacancies.findIndex((v) => v.id === id);
    if (idx !== -1) {
      this._vacancies[idx] = { ...this._vacancies[idx], ...updatedFields };
    }
  }

  // action: удалить вакансию
  removeVacancy(id) {
    this._vacancies = this._vacancies.filter((v) => v.id !== id);
  }

  // computed: получить вакансию по id
  getVacancyById(id) {
    return this._vacancies.find((v) => v.id === id);
  }
}
