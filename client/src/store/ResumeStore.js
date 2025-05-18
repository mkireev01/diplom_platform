// src/store/ResumeStore.js
import { makeAutoObservable } from "mobx";

export default class ResumeStore {
  constructor() {
    this._resumes = [
      {
        id: 1,
        firstName: "Иван",
        lastName: "Иванов",
        nationality: "Беларусь",
        birthDate: "1995-06-15",
        skills: ["JavaScript", "React", "TypeScript"],
        experience: "3 года работы на позиции Frontend-разработчика.",
        fullText:
          "Имею опыт в разработке веб-приложений на React и TypeScript. Участвовал в создании крупных SPA, имею навыки работы с REST API, WebSocket, и CI/CD.",
      },
      {
        id: 2,
        firstName: "Ольга",
        lastName: "Петрова",
        nationality: "Россия",
        birthDate: "1990-12-02",
        skills: ["Node.js", "PostgreSQL", "Docker"],
        experience: "Более 5 лет как backend-разработчик.",
        fullText:
          "Разрабатывала REST API на Node.js, работала с PostgreSQL и MongoDB. Настраивала докеризацию и деплой на облачные платформы.",
      },
      {
        id: 3,
        firstName: "Алексей",
        lastName: "Сидоров",
        nationality: "Украина",
        birthDate: "1998-03-22",
        skills: ["Python", "Django", "Flask", "SQL"],
        experience: "2 года в разработке веб-приложений на Python.",
        fullText:
          "Создавал серверные приложения на Django и Flask, реализовывал системы аутентификации, админки и интеграции с внешними API.",
      },
    ];

    makeAutoObservable(this);
  }

  setResumes(resumes) {
    this._resumes = resumes;
  }

  get resumes() {
    return this._resumes;
  }
}
