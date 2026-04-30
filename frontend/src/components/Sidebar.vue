<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import axios from 'axios'
import { getKabupaten, getKecamatan, getDesa, getBoundary } from '../services/api'
import { useMapFilterStore } from "../stores/mapFilter";
import ChartPanel from "./ChartPanel.vue";

const filterStore = useMapFilterStore();

const emit = defineEmits(['filter-change', 'layer-change'])

// 🎯 Emit filter
const emitFilters = () => {
  emit('filter-change', {
    kabupaten_id: selectedKabupaten.value,
    kecamatan_id: selectedKecamatan.value,
    desa_id: selectedDesa.value
  })
}

const kabupatenList = ref([])
const kecamatanList = ref([])
const desaList = ref([])

// const selectedKabupaten = ref(null)
// const selectedKecamatan = ref(null)
// const selectedDesa = ref(null)

// 🔽 Spatial filters
const kabupaten = ref([])
const kecamatan = ref([])
const desa = ref([])

// const selectedKabupaten = ref('')
const selectedKabupaten = computed({
  get: () => filterStore.kabupaten_id,
  set: (val) => filterStore.setKabupaten(val),
});
const selectedKecamatan = computed({
  get: () => filterStore.kecamatan_id,
  set: (val) => filterStore.setKecamatan(val),
});

const selectedDesa = computed({
  get: () => filterStore.desa_id,
  set: (val) => filterStore.setDesa(val),
});

// 🎛 Layer control
const layers = ref([
  { name: 'Pertanian Lahan Kering Campur', value: 'Pertanian Lahan Kering Campur', color: '#a8ddb5', checked: true },
  { name: 'Tambak', value: 'Tambak', color: '#2b8cbe', checked: true },
  { name: 'Belukar Rawa', value: 'Belukar Rawa', color: '#7bccc4', checked: true },
  { name: 'Tanah Terbuka', value: 'Tanah Terbuka', color: '#cccccc', checked: true },
  { name: 'Hutan Mangrove Sekunder', value: 'Hutan Mangrove Sekunder', color: '#006d2c', checked: true },
  { name: 'Hutan Tanaman', value: 'Hutan Tanaman', color: '#238b45', checked: true },
  { name: 'Hutan Rawa Primer', value: 'Hutan Rawa Primer', color: '#00441b', checked: true },
  { name: 'Hutan Lahan Kering Sekunder', value: 'Hutan Lahan Kering Sekunder', color: '#41ab5d', checked: true },
  { name: 'Belukar', value: 'Belukar', color: '#74c476', checked: true },
  { name: 'Perkebunan', value: 'Perkebunan', color: '#bae4b3', checked: true },
  { name: 'Pemukiman', value: 'Pemukiman', color: '#fb6a4a', checked: true },
  { name: 'Sawah', value: 'Sawah', color: '#c7e9c0', checked: true },
  { name: 'Transmigrasi', value: 'Transmigrasi', color: '#feb24c', checked: true },
  { name: 'Pertambangan', value: 'Pertambangan', color: '#8c510a', checked: true },
  { name: 'Bandara / Pelabuhan', value: 'Bandara / Pelabuhan', color: '#08519c', checked: true }
])

// 📡 Load kabupaten
// const loadKabupaten = async () => {
//   const res = await axios.get('/api/kabupaten')
//   kabupaten.value = res.data
// }
// loadKabupaten()

onMounted(async () => {
  kabupatenList.value = await getKabupaten()
})

// 🔁 Watch filters
watch(selectedKabupaten, async (val) => {
  if (!val) return

  const res = await getKecamatan(val)
  // kecamatanList.value = await res.json()
  kecamatanList.value = res
  
  // selectedKecamatan.value = res.length ? res[0].name : ''
  // selectedKecamatan.value = null
  desaList.value = []
})

watch(selectedKecamatan, async (val) => {
  if (!val) return

  const res = await getDesa(val)
  desaList.value = await res

  // selectedDesa.value = null
})

// watch(selectedDesa, emitFilters)
/*
watch([selectedKabupaten, selectedKecamatan, selectedDesa], () => {
  emit('filter-change', {
    kabupaten: selectedKabupaten.value,
    kecamatan: selectedKecamatan.value,
    desa: selectedDesa.value
  })
})

watch([selectedKabupaten, selectedKecamatan, selectedDesa], async () => {
  const geojson = await getBoundary({
    kabupaten: selectedKabupaten.value,
    kecamatan: selectedKecamatan.value,
    desa: selectedDesa.value
  })

  emit('highlight-boundary', geojson)
})
*/
watch(
  [selectedKabupaten, selectedKecamatan, selectedDesa],
  async () => {
    try {
      const payload = {
        kabupaten: selectedKabupaten.value,
        kecamatan: selectedKecamatan.value,
        desa: selectedDesa.value,
      };

      emit("filter-change", payload);

      if (!payload.kabupaten && !payload.kecamatan && !payload.desa) return;

      console.log("CALLING getBoundary", payload);

      const geojson = await getBoundary(payload);

      console.log("BOUNDARY RESULT", geojson);

      emit("highlight-boundary", geojson);
    } catch (err) {
      console.error("getBoundary failed:", err);
    }
  },
  // { immediate: true }
);

const selectAll = ref(true)

const toggleAll = () => {
  const newValue = selectAll.value;

  // 1. update UI state
  layers.value = layers.value.map(l => ({
    ...l,
    checked: newValue
  }));

  // 2. sync to Pinia (ONLY checked values)
  filterStore.legenda = newValue
    ? layers.value.map(l => l.value)
    : [];
};

// 🎛 Emit layer selection
/*
watch(layers, () => {
  const allChecked = layers.value.every(l => l.checked)
  selectAll.value = allChecked

  const active = selectAll.value
    ? layers.value.map(l => l.value)
    : layers.value.filter(l => l.checked).map(l => l.value)

  console.log('EMIT LAYERS:', active) // 🔥 DEBUG

  emit('layer-change', active)
}, { deep: true, immediate: true })
*/
const activeLayers = computed(() =>
  layers.value.filter(l => l.checked).map(l => l.value)
)

watch(activeLayers, (val) => {
  // console.log('EMIT LAYERS:', val)
  emit('layer-change', val)
}, { immediate: true })

watch(layers, () => {
  selectAll.value = layers.value.every(l => l.checked)
}, { deep: true })

const legendaComputed = computed(() =>
  layers.value
    .filter(l => l.checked)
    .map(l => l.value)
);
watch(
  legendaComputed,
  (val) => {
    filterStore.legenda = val;
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="sidebar">

    <!-- 🔍 Spatial Filter -->
    <div class="card">
      <h4>Spatial Filter</h4>

      <select v-model="selectedKabupaten">
      <!-- <select v-model="filterStore.kabupaten_id" @change="filterStore.setKabupaten(filterStore.kabupaten_id)"> -->
        <option value="">Pilih Kabupaten</option>
        <option v-for="k in kabupatenList" :key="k.id" :value="k.id">
          {{ k.name }}
        </option>
      </select>

      <select v-model="selectedKecamatan">
      <!-- <select v-model="filterStore.kecamatan_id" @change="filterStore.setKecamatan(filterStore.kecamatan_id)"> -->
        <option v-if="kecamatanList.length === 0" value="">
          Pilih Kecamatan
        </option>
        <option v-for="k in kecamatanList" :key="k.id" :value="k.id">
          {{ k.name }}
        </option>
      </select>

      <select v-model="selectedDesa">
      <!-- <select v-model="filterStore.desa_id" @change="filterStore.setDesa(filterStore.desa_id)"> -->
        <option v-if="desaList.length === 0" value="">
          Pilih Desa
        </option>
        <option v-for="d in desaList" :key="d.id" :value="d.id">
          {{ d.name }}
        </option>
      </select>
    </div>

    <!-- 📊 Chart Area -->
    <ChartPanel />

    <!-- 🎛 Layer Control -->
    <div class="card">
  <h4>Layer Control</h4>

  <!-- Select All -->
  <label class="layer-item">
    <input type="checkbox" v-model="selectAll" @change="toggleAll" />
    <strong>Select All</strong>
  </label>

  <!-- Layer list -->
  <div class="layer-list">
    <label v-for="l in layers" :key="l.value" class="layer-item">
      <input type="checkbox" v-model="l.checked" />
      <span class="color-box" :style="{background:l.color}"></span>
      {{ l.name }}
    </label>
  </div>
</div>

  </div>
</template>

<style>
.sidebar {
  width: 320px;
  padding: 12px;
  background: #f5f5f5;
  overflow-y: auto;
}

.card {
  background: white;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

select {
  width: 100%;
  margin-bottom: 8px;
  padding: 6px;
}

.legend {
  margin-top: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-bottom: 4px;
}

.legend-item span {
  width: 12px;
  height: 12px;
  margin-right: 6px;
  display: inline-block;
}

.layer-list {
  max-height: 250px;
  overflow-y: auto;
  margin-top: 8px;
}

.layer-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-bottom: 6px;
  gap: 6px;
}

.color-box {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
</style>