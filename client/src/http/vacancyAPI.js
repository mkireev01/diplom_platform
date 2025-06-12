import { $host, $authHost } from './index';


export const createVacancy = async (companyId, data) => {
  const payload = { ...data, companyId };
  const response = await $authHost.post('/api/vacancy', payload);
  return response.data;
};


export const fetchVacancy = async () => {
  try {
    const { data } = await $host.get('/api/vacancy');

    // Если пришёл сразу массив — возвращаем его
    if (Array.isArray(data)) {
      return data;
    }

    // Если это объект с полем vacancies
    if (data && Array.isArray(data.vacancies)) {
      return data.vacancies;
    }

    // Во всех остальных случаях — пустой массив
    return [];
  } catch (error) {
    console.error("fetchVacancy error:", error);
    return [];
  }
};


export const deleteVacancy = async (vacancyId) => {
  const { data } = await $authHost.delete(`/api/vacancy/${vacancyId}`);
  return data; 
};

export const createApplication = async ({ vacancyId, resumeId, coverLetter }) => {
  const { data } = await $authHost.post('/api/applications', { vacancyId, resumeId, coverLetter });
  return data;
};

export const fetchOneVacancy = async (id) => {
  const { data } = await $authHost.get(`/api/vacancy/${id}`);
  return data;
};

export const updateVacancy = async (vacancyId, vacancyData) => {
  const {data} = await $authHost.put(`/api/vacancy/${vacancyId}`, vacancyData)
  return data
}