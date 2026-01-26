import axios from 'axios';
import { DYNNAMIX_URL } from './constants.config';

export const DYNNAMIX_API = axios.create({
  baseURL: `${DYNNAMIX_URL}/api/`,
  timeout: 30000, // 30s timeout (aumentado para conexiones lentas)
  withCredentials: true,
  paramsSerializer: {
    indexes: null, // Sin brackets para arrays
  },
  // Header para solicitar compresión (Accept-Encoding lo maneja el navegador automáticamente)
});
