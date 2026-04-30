<template>
  <div class="chart-panel">
    <h3 class="title">Chart Area</h3>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="!hasData" class="empty">No data</div>

    <canvas v-show="hasData" ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import Chart from "chart.js/auto";
import { useMapFilterStore } from "../stores/mapFilter";
import { useMap } from "../composables/useMap";
const { lastGeoJSON } = useMap();

// 👉 adjust if your API path is different
import { fetchGeoJSON } from '../services/api'

const filterStore = useMapFilterStore();

const chartRef = ref(null);
let chartInstance = null;

const loading = ref(false);
const stats = ref({});

// OPTIONAL: if you want consistent colors with your layers
// you can also import from a shared file instead
const layerColors = {
  "Pertanian Lahan Kering Campur": "#a8ddb5",
  "Tambak": "#2b8cbe",
  "Belukar Rawa": "#7bccc4",
  "Tanah Terbuka": "#cccccc",
  "Hutan Mangrove Sekunder": "#006d2c",
  "Hutan Tanaman": "#238b45",
  "Hutan Rawa Primer": "#00441b",
  "Hutan Lahan Kering Sekunder": "#41ab5d",
  "Belukar": "#74c476",
  "Perkebunan": "#bae4b3",
  "Pemukiman": "#fb6a4a",
  "Sawah": "#c7e9c0",
  "Transmigrasi": "#feb24c",
  "Pertambangan": "#8c510a",
  "Bandara / Pelabuhan": "#08519c",
};

// =========================
// Helpers
// =========================
const hasData = computed(() => Object.keys(stats.value).length > 0);

const buildLegendStats = (features) => {
  const counts = {};

  features.forEach((f) => {
    const key = f.properties?.legenda || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
  });

  return counts;
};

// =========================
// Chart rendering
// =========================
const renderChart = () => {
  const labels = Object.keys(stats.value);
  const values = Object.values(stats.value);

  if (!labels.length) return;

  const colors = labels.map((l) => layerColors[l] || "#ccc");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartRef.value, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
};

// =========================
// Load data
// =========================
const loadChartData = async () => {
  const params = {
    kabupaten_id: filterStore.kabupaten_id,
    kecamatan_id: filterStore.kecamatan_id,
    desa_id: filterStore.desa_id,
  };

  if (filterStore.legenda.length > 0) {
    params.legenda = filterStore.legenda.join(",");
  }

  // console.log("CHART PARAMS:", params);

  const geojson = await fetchGeoJSON(params);

  // console.log("RAW GEOJSON:", geojson);
  // console.log("FEATURES:", geojson?.features?.length);

  if (!geojson || !geojson.features || geojson.features.length === 0) {
    console.warn("NO FEATURES FOR CHART");
    stats.value = {};
    return;
  }

  stats.value = buildLegendStats(geojson.features);

  // console.log("STATS:", stats.value);

  renderChart();
};

// =========================
// Reactive watch (MAIN DRIVER)
// =========================
watch(
  () => ({
    kabupaten_id: filterStore.kabupaten_id,
    kecamatan_id: filterStore.kecamatan_id,
    desa_id: filterStore.desa_id,
    legenda: filterStore.legenda,
  }),
  () => {
    loadChartData();
  },
  { deep: true, immediate: true }
);

watch(lastGeoJSON, (geojson) => {
  if (!geojson?.features?.length) {
    stats.value = {};
    return;
  }
  console.log("GeoJSON changed, updating chart stats...");
  stats.value = buildLegendStats(geojson.features);
  renderChart();
  // loadChartData();
});

// =========================
// Cleanup
// =========================
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
.chart-panel {
  padding: 12px;
  border-top: 1px solid #eee;
}

.title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.loading,
.empty {
  font-size: 12px;
  color: #888;
  text-align: center;
  margin-top: 10px;
}
</style>