import api from './api';

export const fornecedorService = {
  listar: async (params = {}) => {
    const response = await api.get('/fornecedores', { params });
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/fornecedores/${id}`);
    return response.data;
  },

  criar: async (dados) => {
    const response = await api.post('/fornecedores', dados);
    return response.data;
  },

  desativar: async (id) => {
    await api.delete(`/fornecedores/${id}`);
  },
};
