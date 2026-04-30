<script setup>
import { onMounted, watch } from 'vue'
import { useMap } from '../composables/useMap'
import { useMapFilterStore } from "../stores/mapFilter";
import BasemapToggle from "./BasemapToggle.vue";
const filterStore = useMapFilterStore();

const { initMap, setFilters, setLayers, highlightBoundary, loadData } = useMap('map')

onMounted(() => {
  initMap()
})

watch(
  () => ({
    kabupaten_id: filterStore.kabupaten_id,
    kecamatan_id: filterStore.kecamatan_id,
    desa_id: filterStore.desa_id,
    legenda: filterStore.legenda,
  }),
  async () => {
    await loadData();
  },
  { deep: true, immediate: true }
);

// expose to parent
// 🔥 THIS is the fix
defineExpose({
  setFilters,
  setLayers,
  highlightBoundary,
  loadData
})
</script>

<template>
  <div id="map" class="map">
    <BasemapToggle />
   <!--  <div class="attribution">
      Data: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
    </div> -->
  </div>
</template>

<style>
.map {
  width: 100%;
  height: 100vh;
}
.ol-zoom {
  background: transparent;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.ol-zoom button {
  width: 36px;
  height: 36px;
  background: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.ol-zoom-in {
  border-bottom: 1px solid #ddd;
  border-radius: 8px 8px 0 0;
}

.ol-zoom-out {
  border-radius: 0 0 8px 8px;
}

.ol-attribution {
  top: auto;
  bottom: 10px;
  right: 10px;
} 
</style>