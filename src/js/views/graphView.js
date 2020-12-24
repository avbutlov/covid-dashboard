import { fomatNumber, convertNumber } from '../core/utils';
import Chart from 'chart.js';
import View from './View';

class GraphView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.graph');
    this._canvasElement = document.querySelector('.graph-chart').getContext('2d');
    this._data = {};
  }

  _getFormatDate(date) {
    let day = new Date(date).getDate();
    let month = new Date(date).getMonth();
    const year = new Date(date).getFullYear();

    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;

    return `${day}.${month}.${year}`;
  }

  render(state) {
    this._dataType = state.dataType;
    this._selectParam = state.selectParam;
    if (this.chart) this.chart.destroy();

    const countElements = Object.keys(state.timeline[this._dataType][this._selectParam]).length;

    let colorBar;
    if (this._selectParam === 'cases') colorBar = '#e53e3e';
    if (this._selectParam === 'deaths') colorBar = '#718096';
    if (this._selectParam === 'recovered') colorBar = '#38a169';

    const chartConfig = {
      type: 'bar',
      data: {
        labels: [...Object.keys(state.timeline[this._dataType][this._selectParam])],
        datasets: [{
          data: [...Object.values(state.timeline[this._dataType][this._selectParam])],
          borderWidth: 1,
          backgroundColor: [...Array(countElements).fill(0).map(e => colorBar)],
        }],
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'month',
              stepSize: 2
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: function (value, index, values) {
                return convertNumber(value);
              }
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              return `${this._selectParam}: ${fomatNumber(tooltipItem.yLabel)}`;
            }
          }
        }
      }
    };

    this.chart = new Chart(this._canvasElement, chartConfig);

    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', this._generateHTML());
  }

  _generateHTML() {
    return `
    ${super._generateHTMLSelect(this._selectParam)}
    ${super._generateHTMLTab(this._dataType)}
    `;
  }
}

export default new GraphView();
