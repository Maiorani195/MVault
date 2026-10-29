import api from './api';

export const categoriaService = {
  listar: async (params = {}) => {
    const response = await api.get('/categorias', { params });
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  },

  criar: async (dados) => {
    const response = await api.post('/categorias', dados);
    return response.data;
  },
};
