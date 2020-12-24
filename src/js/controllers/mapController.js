import * as model from '../models/model';
import Controller from './Controller';

class MapController extends Controller {

    constructor() {
        super();
    }

    async showMap() {
        await model.loadAll();
          model.addCovidDataToCoordinates();
          super.mapView().render(model.state);
      }
  
  
  
      async setCountryOnMap(newCountry) {
          model.state.selectCountry = newCountry;
          await model.loadCountry();
          super.countryView().render(model.state);
          super.tableView().render(model.state);
          super.mapView().render(model.state);
      }
  
  
  
        init() {
          this.showMap();
          super.mapView().addHandlerChangeTab(this.setDataType);
          super.mapView().addHandlerSelectParams(this.setSelectParams);
          super.mapView().addHandlerSelectCountryOnMap(this.setCountryOnMap);  
      }
}

export default new MapController();
