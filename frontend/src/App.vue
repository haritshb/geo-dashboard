<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import MapView from './components/MapView.vue'

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

<!-- <template>
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
</template> -->

<template>
  <router-view />
</template>

<style>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 320px;
  background: #ffffff;
  border-right: 1px solid #ddd;
  padding: 16px;
  overflow-y: auto;
}

/* Map container */
.map-container {
  flex: 1;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}
</style>