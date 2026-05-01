import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Cluster from "ol/source/Cluster";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import XYZ from "ol/source/XYZ";
import { defaults as defaultControls } from "ol/control";

import { LEGEND_COLORS } from "../config/legend";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import { fromLonLat } from "ol/proj";
import Stroke from "ol/style/Stroke";
import { fetchGeoJSON } from "../services/api";
import { useMapFilterStore } from "../stores/mapFilter";
import { ref } from "vue";

let osmLayer, satelliteLayer, lightLayer;
const highlightSource = new VectorSource();

const highlightLayer = new VectorLayer({
  source: highlightSource,
  style: new Style({
    stroke: new Stroke({
      color: "#ff0000",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(255,0,0,0.1)",
    }),
  }),
});

export function useMap(targetId) {
  let map, vectorSource, clusterSource, vectorLayer;
  let currentFilters = {};
  let activeLayers = [];
  const lastGeoJSON = ref(null);

  const filterStore = useMapFilterStore();

  const styleFunction = (feature) => {
    const features = feature.get("features");

    // Cluster
    if (features.length > 1) {
      return new Style({
        image: new CircleStyle({
          radius: 12,
          fill: new Fill({ color: "#3399CC" }),
        }),
        text: new Text({
          text: features.length.toString(),
          fill: new Fill({ color: "#fff" }),
        }),
      });
    }

    // 🎯 SINGLE FEATURE
    const props = features[0].getProperties();
    const legenda = props.legenda_key;

    const color = LEGEND_COLORS[legenda] || "#999";

    return new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({ color }),
      }),
    });
  };

  const highlightBoundary = (geojson) => {
    highlightSource.clear();

    const features = new GeoJSON().readFeatures(geojson, {
      featureProjection: "EPSG:3857",
    });

    highlightSource.addFeatures(features);

    // 🔥 zoom to boundary
    if (features.length) {
      map.getView().fit(highlightSource.getExtent(), {
        padding: [40, 40, 40, 40],
        duration: 500,
      });
    }
  };

  // 🚀 Init Map
  const initMap = () => {
    vectorSource = new VectorSource();

    clusterSource = new Cluster({
      distance: 40,
      source: vectorSource,
    });

    vectorLayer = new VectorLayer({
      source: clusterSource,
      style: styleFunction,
    });

    // 🌍 OSM
    osmLayer = new TileLayer({
      source: new OSM(),
      visible: true, // default
    });

    // 🛰️ Satellite (Esri)
    satelliteLayer = new TileLayer({
      source: new XYZ({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      }),
      visible: false,
    });

    // 🗺️ Light (Carto)
    lightLayer = new TileLayer({
      source: new XYZ({
        url: "https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      }),
      visible: false,
    });

    map = new Map({
      controls: defaultControls({
        attribution: false,
        zoom: true,
        rotate: false,
      }).extend([]),
      target: targetId,
      layers: [
        osmLayer,
        satelliteLayer,
        lightLayer,
        vectorLayer,
        highlightLayer,
      ],
      view: new View({
        center: fromLonLat([114.0, -0.5]),
        zoom: 7,
      }),
    });

    map.on("moveend", loadData);
  };

  const setFilters = (filters) => {
    currentFilters = filters;
    loadData();
  };

  const setLayers = (layers) => {
    activeLayers = layers;
    loadData();
  };

  // 📡 Load GeoJSON from API
  const loadData = async () => {
    const geojson = await fetchGeoJSON({
      kabupaten_id: filterStore.kabupaten_id,
      kecamatan_id: filterStore.kecamatan_id,
      desa_id: filterStore.desa_id,
      legenda: filterStore.legenda.join(","),
    });

    lastGeoJSON.value = geojson;

    // Update store with latest GeoJSON for charts
    filterStore.setGeoJSON(geojson);
    if (!geojson?.features) return;

    vectorSource.clear();
    vectorSource.addFeatures(
      new GeoJSON().readFeatures(geojson, {
        featureProjection: "EPSG:3857",
      }),
    );

    return geojson;
  };

  const setBaseMap = (type) => {
    osmLayer.setVisible(type === "osm");
    satelliteLayer.setVisible(type === "satellite");
    lightLayer.setVisible(type === "light");
  };

  return {
    initMap,
    setFilters,
    setLayers,
    highlightBoundary,
    loadData,
    lastGeoJSON,
    setBaseMap,
  };
}
