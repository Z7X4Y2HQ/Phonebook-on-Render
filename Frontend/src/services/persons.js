import axios from "axios";
const baseURL = "/api/persons/";

const getPersons = () => {
  return axios.get(baseURL).then((res) => res.data);
};

const create = (personObject) => {
  return axios.post(baseURL, personObject).then((res) => res.data);
};

const deletion = (id) => {
  return axios.delete(baseURL + id);
};

const editEntry = (id, changedEntryObject) => {
  return axios.put(baseURL + id, changedEntryObject);
};

export default { getPersons, create, deletion, editEntry };
