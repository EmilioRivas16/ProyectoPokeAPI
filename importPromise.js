import axios from "axios";

export const waitingTimeAsync = async (showResolve = true) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => showResolve ? resolve("") : reject("Hubo un error"),3000);
  });
  return promise;
};

export const reqAPI = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
});