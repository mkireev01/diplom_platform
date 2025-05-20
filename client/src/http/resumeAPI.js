import { $host, $authHost } from './index';


export const createResume = async (firstName, lastName, nationality, birthDate, skills, experience, fullText) => {
  const { data } = await $authHost.post('api/resume', {
    firstName,
    lastName,
    nationality,
    birthDate,
    skills,
    experience,
    fullText
  });
  return data;
};

export const fetchResume= async () => {
  const { data } = await $host.get('api/resume');
  return data
};