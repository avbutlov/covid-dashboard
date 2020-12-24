import * as model from '../models/model';
import Controller from './Controller';

class TableController extends Controller {
  constructor() {
    super();
  }

  async showTableData() {
    await model.loadAll();
    super.tableView().render(model.state);
  }

  init() {
    this.showTableData();
    super.tableView().addHandlerChangeTab(this.setDataType);
  }
}

export default new TableController();