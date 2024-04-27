import axios from 'axios';

const client =  axios.create({
  baseURL: `https://api.labacam.org/`,
  headers: {'X-Api-Key': 'vOAevn90wlcOUK2IIZj1'},
  timeout: 60000*5
});

export default client
