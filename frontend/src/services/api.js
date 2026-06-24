import axios from "axios";

// const API_URL = "http://localhost:3000/api";
const API_URL = "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const fetchGeoJSON = async (filters = {}) => {
  const params = {
    ...filters,
  };

  const res = await api.get(`${API_URL}/geo/geojson`, { params });
  return res.data;
};

export const getKabupaten = async () => {
  const res = await api.get("/geo/kabupaten");

  return res.data;
};

export const getKecamatan = async (kabupaten) => {
  const res = await api.get(`/geo/kecamatan?kabupaten=${kabupaten}`);

  return res.data;
};

export const getDesa = async (kecamatan) => {
  const res = await api.get(`/geo/desa?kecamatan=${kecamatan}`);

  return res.data;
};

export const getBoundary = async (params) => {
  const query = new URLSearchParams(params).toString();

  // const res = await fetch(`${API_URL}/geo/boundary?${query}`);
  const res = await api.get(`/geo/boundary?${query}`);

  return res.data;

  if (!res.ok) {
    const text = await res.text();
    console.error("Boundary API error:", text);
    throw new Error("Failed to fetch boundary");
  }

  return res.json();
};

export default api;
