import axios from 'axios';

const googleDriveApi = axios.create({
  baseURL: 'https://www.googleapis.com/drive/v3',
});

googleDriveApi.interceptors.request.use(config => {
  config.params = config.params || {};
  config.params.key = import.meta.env.VITE_GOOGLE_API_KEY;
  return config;
});

export default googleDriveApi;
