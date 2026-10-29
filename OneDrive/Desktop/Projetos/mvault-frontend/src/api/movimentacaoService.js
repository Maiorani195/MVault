import api from './api';

export const movimentacaoService = {
  listar: async (params = {}) => {
    const response = await api.get('/movimentacoes', { params });
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/movimentacoes/${id}`);
    return response.data;
  },

  criar: async (dados) => {
    const response = await api.post('/movimentacoes', dados);
    return response.data;
  },
};
