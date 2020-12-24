import * as model from '../models/model';
import tableView from '../views/tableView';
import countryView from '../views/countryView';
import graphView from '../views/graphView';
import mapView from '../views/mapView';

export default class Controller {
  setDataType(newDataType) {
    model.state.dataType = newDataType;
    tableView.render(model.state);
    countryView.render(model.state);
    graphView.render(model.state);
    mapView.render(model.state);
  }

  setSelectParams(newParam) {
    model.state.selectParam = newParam;
    countryView.render(model.state);
    graphView.render(model.state);
    mapView.render(model.state);
  }

  tableView() {
    return tableView;
  }

  countryView() {
    return countryView;
  }

  graphView() {
    return graphView;
  }

  mapView() {
    return mapView;
  }
}
