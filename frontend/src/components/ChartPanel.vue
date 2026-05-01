<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>

    <div v-if="isEmpty" class="overlay">
      No data available
    </div>
  </div>
</template>

<<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";

import { useMapFilterStore } from "../stores/mapFilter";
const filterStore = useMapFilterStore();

const chartRef = ref(null);
let chartInstance = null;
const isEmpty = ref(false);

// ✅ Create chart ONCE
onMounted(() => {
  chartInstance = new Chart(chartRef.value, {
    type: "pie",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
        },
      ],
    },
    options: {
      responsive: true,
      animation: {
        duration: 500,
        easing: "easeOutQuart",
      },
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
});

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

function updateChart(features) {
  isEmpty.value = false;

  const stats = buildLegendStats(features);

  const labels = Object.keys(stats);
  const values = Object.values(stats);

  chartInstance.data.labels = labels;
  chartInstance.data.datasets[0] = {
    data: values,
    backgroundColor: labels.map(l => layerColors[l] || "#ccc")
  };

  chartInstance.update();
}

watch(
  () => filterStore.lastGeoJSON,
  (geojson) => {
    if (!geojson) return;

    const features = geojson.features || [];

    if (!features.length) {
      updateEmpty();
      return;
    }

    updateChart(features);
  },
  { immediate: true }
);

function updateEmpty() {
  isEmpty.value = true;

  chartInstance.data.labels = ["No Data"];
  chartInstance.data.datasets[0].data = [1];

  chartInstance.update();
}
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

.chart-container {
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(2px);
}
</style>