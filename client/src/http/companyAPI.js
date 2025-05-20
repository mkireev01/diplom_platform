import { $host, $authHost } from './index';


export const createCompany= async (name, description) => {
  const { data } = await $authHost.post('api/company', {
   name,
   description
  });
  return data;
};

export const fetchCompany = async () => {
  const { data } = await $host.get('api/company');
  return data
};

export const fetchCompanyById = async (id) => {
    const { data } = await $host.get(`api/company/${id}`);
    return data;
  };
