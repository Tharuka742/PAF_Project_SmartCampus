import axios from "axios";

const API_BASE_URL = "/api/resources";

function roleHeaders(role) {
  return {
    headers: {
      "X-User-Role": role || "student",
    },
  };
}

export const getResources = async (filters = {}, role = "student") => {
  const params = {};

  if (filters.type?.trim()) {
    params.type = filters.type.trim();
  }

  if (filters.location?.trim()) {
    params.location = filters.location.trim();
  }

  if (filters.capacity !== undefined && filters.capacity !== null && filters.capacity !== "") {
    params.capacity = Number(filters.capacity);
  }

  if (filters.status?.trim()) {
    params.status = filters.status.trim();
  }

  const response = await axios.get(API_BASE_URL, {
    ...roleHeaders(role),
    params,
  });

  return response.data;
};

export const getResourceById = async (id, role = "student") => {
  const response = await axios.get(`${API_BASE_URL}/${id}`, roleHeaders(role));
  return response.data;
};

export const createResource = async (resourceData, role = "admin") => {
  const response = await axios.post(API_BASE_URL, resourceData, roleHeaders(role));
  return response.data;
};

export const updateResource = async (id, resourceData, role = "admin") => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, resourceData, roleHeaders(role));
  return response.data;
};

export const deleteResource = async (id, role = "admin") => {
  await axios.delete(`${API_BASE_URL}/${id}`, roleHeaders(role));
};
