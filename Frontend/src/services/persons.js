import axios from "axios";
const baseURL = "/api/persons/";

const getPersons = () => {
  return axios.get(baseURL).then((res) => res.data);
};

const create = (personObject) => {
  return axios.post(baseURL, personObject).then((res) => res.data);
};

export default { getPersons, create };
