import { $host, $authHost } from './index';


export const createVacancy = async (companyId, data) => {
  const payload = { ...data, companyId };
  const response = await $authHost.post('/api/vacancy', payload);
  return response.data;
};


export const fetchVacancy = async () => {
  const { data } = await $host.get('api/vacancy');
  return data
};

export const deleteVacancy = async (vacancyId) => {
  const { data } = await $authHost.delete(`/api/vacancy/${vacancyId}`);
  return data; 
};

export const createApplication = async ({ vacancyId, resumeId, coverLetter }) => {
  const { data } = await $authHost.post('/api/applications', { vacancyId, resumeId, coverLetter });
  return data;
};
