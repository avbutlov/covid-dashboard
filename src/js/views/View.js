export default class View {
  addHandlerChangeTab(handler) {
    this._parentElement.addEventListener('change', function (e) {
      const select = e.target.closest('.select-data-type');
      if (!select) return;
      handler(select.value);
    });
  }

  addHandlerSelectParams(handler) {
    this._parentElement.addEventListener('change', function (e) {
      const select = e.target.closest('.select-param');
      if (!select) return;
      handler(select.value);
    });
  }


  _generateHTMLSelect(selectParam) {
    return `
    <select class="select select-param">
      <option${selectParam === 'cases' ? ' selected' : ''} value='cases'>Cases</option$>
      <option${selectParam === 'deaths' ? ' selected' : ''} value='deaths'>Deaths</option$>
      <option${selectParam === 'recovered' ? ' selected' : ''} value='recovered'>Recovered</option$>
    </select>
    `;
  }

  _generateHTMLTab(dataType) {
    return `
    <select class="select select-data-type">
      <option${dataType === 'allData' ? ' selected' : ''} value='allData'>Data all</option$>
      <option${dataType === 'todayData' ? ' selected' : ''} value='todayData'>Data day</option$>
      <option${dataType === 'oneHundredThousandData' ? ' selected' : ''} value='oneHundredThousandData'>Data all per 100K</option$>
      <option${dataType === 'todayOneHundredThousandData' ? ' selected' : ''} value='todayOneHundredThousandData'>Data day per 100K</option$>
    </select>
    `;
  }


}
