import api from './api';

export const produtoService = {
  listar: async (params = {}) => {
    const response = await api.get('/produtos', { params });
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  },

  criar: async (dados) => {
    const response = await api.post('/produtos', dados);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.put(`/produtos/${id}`, dados);
    return response.data;
  },

  excluir: async (id) => {
    await api.delete(`/produtos/${id}`);
  },
};
