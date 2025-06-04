import { $host, $authHost } from './index';


// chatAPI.js
export const createChat = async ({ seekerId, employerId }) => {
    const { data } = await $authHost.post('/api/chats', { seekerId, employerId });
    return { chatId: data.id };
  };
  

// chatAPI.js
export const sendMessage = async ({ chatId, senderId, content }) => {
    // точно попадаем в messageRouter по пути /api/chats/:chatId/messages
    const { data } = await $authHost.post(
      `/api/chats/${chatId}/messages`,
      { senderId, content }
    );
    return data;
  };

export const deleteChat = async (id) => {
  const {data} = await $authHost.delete(`/api/chats/${id}`)

  return data
}
  