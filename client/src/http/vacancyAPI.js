import { $host, $authHost } from './index';


export const createVacancy = async (companyId, data) => {
  // склеиваем данные вакансии и поле companyId
  const payload = { ...data, companyId };
  const response = await $authHost.post('/api/vacancy', payload);
  return response.data;
};


export const fetchVacancy = async () => {
  const { data } = await $host.get('api/vacancy');
  return data
};

export const fetchVacanciesByCompany = async (companyId) => {
  const { data } = await $authHost.get(`/api/company/${companyId}`);
  return data;
};

