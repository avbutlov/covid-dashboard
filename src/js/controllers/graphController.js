import * as model from '../models/model';
import Controller from './Controller';

class GraphController extends Controller {
  constructor() {
    super();
  }

  async showGraph() {
    await model.loadTimeline();
    super.graphView().render(model.state);
  }

  init() {
    this.showGraph();
    super.graphView().addHandlerChangeTab(this.setDataType);
    super.graphView().addHandlerSelectParams(this.setSelectParams);
  }
}

export default new GraphController();
