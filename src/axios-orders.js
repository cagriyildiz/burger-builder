import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-burger-app-ad6aa.firebaseio.com/'
});

export default instance;
