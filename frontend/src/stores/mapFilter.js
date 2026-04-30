import { defineStore } from "pinia";

export const useMapFilterStore = defineStore("mapFilter", {
  state: () => ({
    kabupaten_id: "",
    kecamatan_id: "",
    desa_id: "",
    legenda: [],
  }),

  actions: {
    setKabupaten(id) {
      this.kabupaten_id = id;
      this.kecamatan_id = null;
      this.desa_id = null;
    },

    setKecamatan(id) {
      this.kecamatan_id = id;
      this.desa_id = null;
    },

    setDesa(id) {
      this.desa_id = id;
    },

    setLegenda(val) {
      this.legenda = val;
    },
  },
});
