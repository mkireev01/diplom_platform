
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
    this.socket = io("http://localhost:5000");
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
}
