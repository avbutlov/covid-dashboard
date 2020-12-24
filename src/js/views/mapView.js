import { MAP_API_URL } from "../config";
import { fomatNumber } from '../core/utils';
import View from "./View";
import L from 'leaflet';

class MapView extends View {
  constructor() {
    super();
    this._data = {};
    this._parentElement = document.querySelector(".map-card");
    this._HTMLConatainer = document.querySelector(".map-info");
    this._controlPanel = document.querySelector('.control-panel');
    this._map = L.map("map", { worldCopyJump: true }).setView([0, 0], 2);
    this._layerGroup = L.layerGroup().addTo(this._map);
    this._selectedLayer = L.layerGroup().addTo(this._map);
    this.tileLayer = L.tileLayer(MAP_API_URL, {
      noWrap: false,
    }).addTo(this._map);
  }

  render(state) {
    this._selectCountry = state.selectCountry;
    this._globalData = state.globalData;
    this._allCountry = state.allCountry;
    this._dataType = state.dataType;
    this._selectParam = state.selectParam;
    this._HTMLConatainer.innerHTML = "";
    this._controlPanel.innerHTML = "";
    this._selectedLayer.clearLayers();
    this._layerGroup.clearLayers();
    this._countriesCoordinates = state.countriesCoordinates;
    this._generateMapLayers();
    this._HTMLConatainer.insertAdjacentHTML("afterbegin", this._generateHTML());
    this._controlPanel.insertAdjacentHTML('afterbegin', this._generateControls());
  }

  addHandlerSelectCountryOnMap(handler) {
    this._parentElement.addEventListener("click", (e) => {
      if (!e.target.classList.contains("leaflet-interactive")) return;
      handler(this.currentLayer.feature.id);
    });
  }

  _generateMapLayers() {
    const selectedCountryGeoJSON = this._countriesCoordinates.find(
      (el) => el.id === this._selectCountry
    );

    function getColorForLayers(param) {
      return param > 15
        ? "#800026"
        : param > 10
          ? "#BD0026"
          : param > 8
            ? "#E31A1C"
            : param > 4
              ? "#FC4E2A"
              : param > 1
                ? "#FD8D3C"
                : param > 0.3
                  ? "#FEB24C"
                  : param > 0.1
                    ? "#FED976"
                    : "#FFEDA0";
    }

    const setGlobalStyle = (feature) => {
      return {
        fillColor: getColorForLayers(
          (feature[this._dataType][this._selectParam] /
            this._globalData[this._dataType][this._selectParam]) *
          100
        ),
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    };

    function setSelectedStyle() {
      return {
        weight: 5,
        color: "black",
        dashArray: "",
        fillOpacity: 0.7,
      };
    }

    let geojson = L.geoJson(this._countriesCoordinates, {
      style: setGlobalStyle,
    }).addTo(this._layerGroup);

    L.geoJson(selectedCountryGeoJSON, {
      style: {
        fillColor: "",
        weight: 5,
        color: "#000",
        dashArray: "",
        fillOpacity: 0,
      },
    }).addTo(this._selectedLayer);

    const highlightFeature = (e) => {
      const layer = e.target;
      layer.setStyle(setSelectedStyle());
      layer.bringToFront();
      this._selectedLayer.eachLayer(function (selectedCountryLayer) {
        selectedCountryLayer.bringToFront();
      });
    };

    const openPopupInfo = (e) => {
      const layer = e.target;
      let parameterCases = this._allCountry.find(countryName => countryName.countryInfo.iso3 === layer.feature.id);
      layer.bindPopup(`${layer.feature.properties.name}, ${fomatNumber(parameterCases[this._dataType][this._selectParam])} ${this._selectParam}`).openPopup();
    };

    const closePopupInfo = (e) => {
      const layer = e.target;
      layer.closePopup();
    };

    function resetHighlight(e) {
      geojson.resetStyle(e.target);
    }

    const getLayerOnClick = (e) => {
      this.currentLayer = e.target;
    };

    const onEachFeature = (feature, layer) => {
      layer.addEventListener("mouseover", highlightFeature);
      layer.addEventListener("mouseout", resetHighlight);
      layer.addEventListener("mouseover", openPopupInfo);
      layer.addEventListener("mouseout", closePopupInfo);
      layer.addEventListener("click", getLayerOnClick);
    };

    geojson = L.geoJson(this._countriesCoordinates, {
      style: setGlobalStyle,
      onEachFeature: onEachFeature,
    }).addTo(this._layerGroup);

    this._selectedLayer.eachLayer((e) => {
      if (this._selectCountry) {
        e.bringToFront();
        this._map.fitBounds(e.getBounds(), { maxZoom: 3 });
      }
    });

    this.geojson = geojson;
  }

  _generateHTML() {
    const colorsForLayers = [
      "#800026",
      "#BD0026",
      "#E31A1C",
      "#FC4E2A",
      "#FD8D3C",
      "#FEB24C",
      "#FED976",
      "#FFEDA0",
    ];
    const paramBorders = [15, 10, 8, 4, 1, 0.3, 0.1, 0];
    return `
      <div class="legend">
        <div class="legend-info">
        <div class="legend-chosen">Chosen<br> parameter</div>
        <div class="legend-system">Global %</div>
        </div> 
      ${colorsForLayers
        .map((color, ind) => {
          return `
        <div class="legend-item">
        <div class="legend-color" data-color=${ind} style="background-color: ${color}"></div>
        <div class="legend-data-info">
        <span>${this._selectParam}</span>
        <span>&gt;</span>
        <span>${paramBorders[ind]}</span>
        </div>
        </div>
        `;
        })
        .join("")}
      </div>
      `;
  }

  _generateControls() {
    return `
  ${super._generateHTMLSelect(this._selectParam)}
  ${super._generateHTMLTab(this._dataType)}
  `;
  }

}

export default new MapView();
