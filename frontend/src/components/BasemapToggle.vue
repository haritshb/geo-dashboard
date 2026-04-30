<template>
  <div class="basemap-toggle">
    <button
      v-for="b in basemaps"
      :key="b.value"
      :class="['btn', { active: current === b.value }]"
      @click="selectBaseMap(b.value)"
    >
      {{ b.label }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMap  } from "../composables/useMap";
const { setBaseMap } = useMap();

const basemaps = [
  { label: "Map", value: "osm" },
  { label: "Satellite", value: "satellite" },
  { label: "Light", value: "light" },
];

const current = ref("osm");

const selectBaseMap = (type) => {
  current.value = type;
  setBaseMap(type);
};
</script>

<style scoped>
.basemap-toggle {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 6px;
  z-index: 1000;
}

.btn {
  padding: 6px 10px;
  font-size: 12px;
  border: none;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  transition: 0.2s;
}

.btn:hover {
  background: #f0f0f0;
}

.btn.active {
  background: #2563eb;
  color: white;
}
</style>