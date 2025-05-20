import { $host, $authHost } from './index';


export const createVacancy = async (title, description, fullDescription, salaryFrom, salaryTo) => {
  const { data } = await $authHost.post('api/vacancy', {
    title,
    description,
    fullDescription,
    salaryFrom,
    salaryTo
  });
  return data;
};

export const fetchVacancy = async () => {
  const { data } = await $host.get('api/vacancy');
  return data
};


