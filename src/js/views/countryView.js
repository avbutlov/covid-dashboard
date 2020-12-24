import { fomatNumber } from '../core/utils';
import View from './View';

class CountryView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.country');
    this._searchElement = document.querySelector('.search-country');
    this._currentCountryElement = document.querySelector('.current-country');
    this._data = {};
  }

  render(state) {
    this._data = state.searchCountryResult || state.allCountry;
    console.log(state);
    this._dataType = state.dataType;
    this._selectParam = state.selectParam;
    this._selectCountry = state.selectCountry;
    this._searchCountry = state.searchCountry;
    this._oneCountry = state.oneCountry;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', this._generateHTML());
    this._currentCountryElement.innerHTML = this._selectCountry ? ` - ${this._oneCountry.country}` : ' - Worldwide';
  }

  addHandlerSelectCountry(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const countryItem = e.target.closest('.country-item');
      if (!countryItem) return;

      let elem = countryItem.parentNode.firstChild;
      do {
        elem.classList.remove('active');
      } while (elem = elem.nextElementSibling)
      countryItem.classList.add('active');

      const country = countryItem.getAttribute('data-country');

      handler(country);
    });
  }

  addHandlerSearchCountry(handler) {
    this._searchElement.addEventListener('input', function (e) {
      const searchInput = e.target;
      if (!searchInput) return;

      const searchValue = searchInput.value;
      handler(searchValue);
    });

  }

  _generateCountryListHTML() {
    const countryList = this._data.map((el) => {
      return {
        isActive: el.countryInfo.iso3 === this._selectCountry,
        codeISO3: el.countryInfo.iso3,
        codeISO2: el.countryInfo.iso2,
        flag: el.countryInfo.flag,
        name: el.country,
        covidInfo: el[this._dataType][this._selectParam],
        covidInfoFormat: fomatNumber(el[this._dataType][this._selectParam]),
      }
    });

    countryList.sort((a, b) => b.covidInfo - a.covidInfo);

    return countryList.map((country) => {

      return `
        <tr class="country-item${country.isActive ? ' active' : ''}" data-country="${country.codeISO3}">
          <td>
            <img src='${country.flag}'> ${country.name} <span class="country-item__covid-info">${country.covidInfoFormat}
          </td>
        </tr>`;
    }).join('');
    
  }

  _generateHTML() {
    return `
    <div class="country-container">
      <table class="highlight table-country">
        ${this._generateCountryListHTML()}
      </table>
    </div>
    ${super._generateHTMLSelect(this._selectParam)}
    ${super._generateHTMLTab(this._dataType)}
    `;
  }
}

export default new CountryView();
