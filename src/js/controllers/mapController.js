import * as model from '../models/model';
import mapView from '../views/mapView';
import tableView from '../views/tableView';
import countryView from '../views/countryView';

class MapController {
  async showMap() {
    await model.loadProvinces();
    mapView.createMap();
    mapView.render(model.state);
  }

  setCountryOnMap(newLat, newLong) {
    mapView.viewSelectedCountry(newLat, newLong);
    mapView.addCountryMarkerOnSelect(newLat, newLong);
  }

  init() {
    this.showMap();
    mapView.addHandlerSelectCountryOnMap(this.setCountryOnMap);
  }
}

export default new MapController();
