import { MAP_API_URL } from '../config';
import countryView from '../views/countryView';
class MapView {
  constructor() {
    this._parentElement = document.querySelector(".map");
    this._data = {};
  }

  render(state) {
    this._provinces = state.provinces;
    this._selectCountry = state.selectCountry;
    this._stats = state.stats;
    this._parentElement.innerHTML = "";
    this._countryInfo = state.countryInfo;
    this.map = L.map("map").setView([0, 0], 3);
    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      this._generateHTML()
    );
  }


  addHandlerSelectCountryOnMap(handler) {
    countryView._parentElement.addEventListener('click', function (e) {
      const selectedItem = e.target.closest('.country-item');
      const lat = selectedItem.getAttribute('data-lat');
      const long = selectedItem.getAttribute('data-long');
      handler(lat, long);
    })
      
  }

  viewSelectedCountry(newLat, newLong) {
    this.map.setView([newLat, newLong])
  }

  _generateHTML() {
    L.tileLayer(MAP_API_URL, {noWrap: false, minZoom: 3}).addTo(this.map);
     this._provinces.map((el) => {
      const {coordinates: {latitude, longitude}} = el;
      L.marker([latitude, longitude]).addTo(this.map);
    })
  }
}

export default new MapView();
