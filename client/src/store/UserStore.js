import {makeAutoObservable} from "mobx"

export default class UserStore {
    constructor() {
        this._isAuth = true
         this._user = {
            id: 1,
            firstName: "Иван",
            lastName: "Иванов",
            email: "ivan.ivanov@example.com",
            role: "seeker"             // <-- здесь можно ставить 'employer' или 'seeker'
        };
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }
    
    setUser(user) {
        this._user = user
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }
}