import api from './axios';

export const authApi = {
  signup: async (userData) => {
    const response = await api.post('/users/signup', userData);
    return response.data;
  },
  
  login: async ({ username, password }) => {
    // Backend expects OAuth2 form data
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/user/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
};
