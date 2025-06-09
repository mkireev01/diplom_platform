
import { makeAutoObservable, runInAction } from "mobx";
import { io } from "socket.io-client";
import { $host } from "../http";    

export default class ChatStore {
  userStore;
  socket = null;
  chats = [];
  messages = [];
  currentChatId = null;

  constructor(userStore) {
    this.userStore = userStore;
    makeAutoObservable(this);
    this.initSocket();
  }

  
  initSocket() {
    // подхватываем тот же API_URL, что и для axios
    const apiUrl = import.meta.env.VITE_API_URL;

    // сокеты ходят на тот же домен, где у вас socket.io-сервер
    this.socket = io(apiUrl, {
      transports: ["websocket", "polling"], // выберите нужные
      // если у вас custom path, добавьте path: "/socket.io"
    });

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket.id);
    });

    this.socket.on("new_message", (msg) => {
      if (msg.chatId === this.currentChatId) {
        runInAction(() => {
          this.messages.push(msg);
        });
      }
    });
  }


  async createOrGetChat(otherUserId) {
    const me = this.userStore.user;
    const isSeeker = me.role === "seeker";
    const payload = {
      seekerId:   isSeeker ? me.id : otherUserId,
      employerId: !isSeeker ? me.id : otherUserId,
    };
    const { data } = await $host.post("/api/chats", payload);
    runInAction(() => {
      this.currentChatId = data.id;
    });
    return data;
  }

 
  async loadChats() {
    const userId = this.userStore.user.id;
    const { data } = await $host.get(`/api/chats/${userId}`);
    runInAction(() => {
      this.chats = data;
    });
  }

 
  async openChatWith(otherUserId) {
    const chat = await this.createOrGetChat(otherUserId);

    runInAction(() => {
      this.currentChatId = chat.id;
    });
    this.socket.emit("join_chat", chat.id);

    const { data: messages } = await $host.get(
      `/api/chats/${chat.id}/messages`
    );
    runInAction(() => {
      this.messages = messages;
    });
  }

 
  sendMessage(content) {
    if (!this.currentChatId) {
      console.warn("ChatId не задан. Сначала откройте чат.");
      return;
    }
    const payload = {
      chatId:   this.currentChatId,
      senderId: this.userStore.user.id,
      content,
    };
    this.socket.emit("send_message", payload);
    runInAction(() => {
      this.messages.push({
        ...payload,
        id:        Date.now(),
        createdAt: new Date().toISOString(),
      });
    });
  }

  async loadMessages(chatId) {
    const { data: msgs } = await $host.get(`/api/chats/${chatId}/messages`);
    runInAction(() => {
      this.messages = msgs;
    });
  }
}
