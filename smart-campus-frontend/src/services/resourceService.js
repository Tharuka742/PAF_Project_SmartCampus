import axios from 'axios';

const API_BASE_URL = '/api/resources';

function roleHeaders(role) {
  return {
    headers: {
      'X-User-Role': role,
    },
  };
}

export const getAllResources = async (role) => {
  const response = await axios.get(API_BASE_URL, roleHeaders(role));
  return response.data;
};

export const searchResources = async (params, role) => {
  const response = await axios.get(`${API_BASE_URL}/search`, {
    ...roleHeaders(role),
    params,
  });
  return response.data;
};

export const createResource = async (resourceData, role) => {
  const response = await axios.post(API_BASE_URL, resourceData, roleHeaders(role));
  return response.data;
};

export const updateResource = async (id, resourceData, role) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, resourceData, roleHeaders(role));
  return response.data;
};

export const deleteResource = async (id, role) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`, roleHeaders(role));
  return response.data;
};
