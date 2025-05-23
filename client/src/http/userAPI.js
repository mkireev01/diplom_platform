import { $host, $authHost } from './index';

/**
 * Хелпер для разбора JWT-токена и возврата его payload (включая role).
 */
function parseJwt(token) {
  if (!token) return null;
  const [, payloadBase64] = token.split('.');
  const base64           = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload      = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

export const registration = async (firstName, lastName, email, password, role) => {
  const { data } = await $host.post('api/user/registration', {
    firstName,
    lastName,
    email,
    password,
    role,
  });
  // сохраняем токен
  localStorage.setItem('token', data.token);
  return parseJwt(data.token);
};

export const login = async (email, password) => {
  const { data } = await $host.post('api/user/login', { email, password });
  localStorage.setItem('token', data.token);
  return parseJwt(data.token);
};

export const check = async () => {
  // $authHost автоматически подставит заголовок Authorization из localStorage
  const { data } = await $authHost.get('api/user/auth');
  // допустим, сервер присылает новый token
  if (data.token) {
    localStorage.setItem('token', data.token);
    return parseJwt(data.token);
  }
  // или присылает сразу payload
  return data;
};

export const fetchUsers = async () => {
  const {data} = await $authHost.get('api/user')
  return data
}

export const fetchUserById = async (id) => {
  const { data } = await $host.get(`api/user/${id}`);
  return data;
};

export const deleteUser = async (userId) => {
  const {data} = await $authHost.delete(`api/user/${userId}`)

  return data;
}