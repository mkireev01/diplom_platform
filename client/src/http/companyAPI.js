import { $host, $authHost } from './index';


export const createCompany= async (name, description, telephoneNumber) => {
  const { data } = await $authHost.post('api/company', {
   name,
   description,
   telephoneNumber
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

export const deleteCompany = async (companyId) => {
  const {data} = await $authHost.delete(`api/company/${companyId}`)

  return data
}
