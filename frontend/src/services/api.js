import axios from "axios";

const API_URL = "http://localhost:3000/api";
/*
export const fetchGeoJSON = async (bbox, filters = {}) => {
  const params = {
    bbox: bbox.join(","),
    ...filters,
  };

  const res = await axios.get(`${API_URL}/geojson`, { params });
  return res.data;
};
*/
export const fetchGeoJSON = async (filters = {}) => {
  const params = {
    ...filters,
  };

  const res = await axios.get(`${API_URL}/geojson`, { params });
  return res.data;
};

export const getKabupaten = () =>
  fetch(`${API_URL}/kabupaten`).then((res) => res.json());

export const getKecamatan = (kabupaten) =>
  fetch(`${API_URL}/kecamatan?kabupaten=${kabupaten}`).then((res) =>
    res.json(),
  );

export const getDesa = (kecamatan) =>
  fetch(`${API_URL}/desa?kecamatan=${kecamatan}`).then((res) => res.json());

export const getBoundary = async (params) => {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${API_URL}/boundary?${query}`);

  if (!res.ok) {
    const text = await res.text();
    console.error("Boundary API error:", text);
    throw new Error("Failed to fetch boundary");
  }

  return res.json();
};
