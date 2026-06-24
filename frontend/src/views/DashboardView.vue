<script setup>
import { ref, onMounted } from 'vue'
import UserMenu from "../components/UserMenu.vue";
import Sidebar from '../components/Sidebar.vue';
import MapView from '../components/MapView.vue';

const mapRef = ref(null)
const pendingLayers = ref([])

const onFilterChange = (filters) => {
  mapRef.value.setFilters(filters)
}

const onLayerChange = (layers) => {
  pendingLayers.value = layers

  if (mapRef.value) {
    mapRef.value.setLayers(layers)
  }
}

onMounted(() => {
  if (mapRef.value && pendingLayers.value.length) {
    mapRef.value.setLayers(pendingLayers.value)
  }
})

const onHighlight = (geojson) => {
  mapRef.value?.highlightBoundary(geojson)
}
</script>

<template>
    <div class="dashboard">
        <header class="topbar">
            <h2>Geo Dashboard</h2>

            <UserMenu />
        </header>
        <div class="layout">
            <Sidebar
            @filter-change="onFilterChange"
            @layer-change="onLayerChange"
            @highlight-boundary="onHighlight"
            />

            <div class="map-container">
            <MapView ref="mapRef" />
            </div>
        </div>
    </div>
</template>

<style>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.map-container {
  flex: 1;
  position: relative;
}

.topbar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 20px;

  background: white;
  border-bottom: 1px solid #ddd;
}

.layout {
  display: flex;
  height: calc(100vh - 60px);
}
</style>