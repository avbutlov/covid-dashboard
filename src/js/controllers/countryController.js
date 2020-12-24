import * as model from '../models/model';
import Controller from './Controller';

class CountryController extends Controller {
  constructor() {
    super();
  }

  async showCountryData() {
    await model.loadCountryAll();
    super.countryView().render(model.state);
  }

  async setCountry(newCountry) {
    model.state.selectCountry = newCountry;
    await model.loadCountry();
    await model.loadTimeline();
    super.tableView().render(model.state);
    super.graphView().render(model.state);
    super.countryView().render(model.state);
    super.mapView().render(model.state);
  }

  async searchCountry(searchValue) {
    model.state.searchCountry = searchValue;
    await model.searchCountry(searchValue);
    super.countryView().render(model.state);
  }

  init() {
    this.showCountryData();
    super.countryView().addHandlerChangeTab(this.setDataType);
    super.countryView().addHandlerSelectParams(this.setSelectParams);
    super.countryView().addHandlerSelectCountry(this.setCountry);
    super.countryView().addHandlerSearchCountry(this.searchCountry);
  }
}

export default new CountryController();