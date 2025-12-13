import axios, { AxiosInstance } from 'axios';

type ServiceName = 'users' | 'workspaces' | 'documents' | 'tasks';

// Mapeo de ServiceName a la variable de entorno
const getBaseUrl = (service: ServiceName): string => {
  switch (service) {
    case 'users':
      return process.env.NEXT_PUBLIC_API_USERS_URL || '';
    case 'workspaces':
      return process.env.NEXT_PUBLIC_API_WORKSPACES_URL || '';
    case 'documents':
      return process.env.NEXT_PUBLIC_API_DOCUMENTS_URL || '';
    case 'tasks':
      return process.env.NEXT_PUBLIC_API_TASKS_URL || '';
    default:
      throw new Error(`Servicio desconocido: ${service}`);
  }
};

/**
 * Crea una instancia de Axios con la URL base y configuraciones estándar.
 * Incluye un interceptor para añadir el token JWT.
 */
export const createApiClient = (service: ServiceName): AxiosInstance => {
  const ApiClient = axios.create({
    baseURL: getBaseUrl(service),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/plain, */*",
    },
    withCredentials: true,
  });

//   ApiClient.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

  return ApiClient;
};