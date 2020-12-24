import { fomatNumber } from '../core/utils';
import View from './View';

class TableView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.table');
    this._data = {};
  }

  render(state) {
    this._data = state[state.dataType];
    this._dataType = state.dataType;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', this._generateHTML());
  }

  _generateHTML() {
    return `
    <div class="data-tab">
      <div class="data-info data-info--cases">
        <div class="data-info__title">Cases</div>
        <div class="data-info__number">${fomatNumber(this._data.cases)}</div>
      </div>
      <div class="data-info data-info--deaths">
        <div class="data-info__title">Deaths</div>
        <div class="data-info__number">${fomatNumber(this._data.deaths)}</div>
      </div>
      <div class="data-info data-info--recovered">
        <div class="data-info__title">Recovered</div>
        <div class="data-info__number">${fomatNumber(this._data.recovered)}</div>
      </div>
    </div>
    ${super._generateHTMLTab(this._dataType)}
    `;
  }
}

export default new TableView();
