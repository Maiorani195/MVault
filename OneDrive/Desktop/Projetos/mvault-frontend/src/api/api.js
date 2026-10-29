import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento amigável de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error.response?.data;
    const message = errorData?.mensagem || errorData?.erro || 'Erro ao processar requisição no servidor.';
    return Promise.reject({
      status: error.response?.status,
      message,
      validacoes: errorData?.validacoes || {},
      original: error,
    });
  }
);

export default api;
