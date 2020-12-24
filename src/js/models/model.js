import { API_URL, COUNT_PEOPLE } from '../config';
import countriesCoordinates from '../borderCoordinates';

export const state = {
  allData: {},
  globalData: {},
  todayData: {},
  oneHundredThousandData: {},
  todayOneHundredThousandData: {},
  dataType: 'allData',
  selectParam: 'cases',
  selectCountry: '',
  searchCountry: '',
  searchCountryResult: null,
  allCountry: [],
  oneCountry: {},
  provinces: [],
  countriesCoordinates: countriesCoordinates,
  timeline: [],
  countriesCoordinates: countriesCoordinates
};

export const loadAll = async function () {
  try {
    const res = await fetch(`${API_URL}/all`);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    const countPeople = state.selectCountry ? state.oneCountry.population : COUNT_PEOPLE;

    state.allData = {
      cases: data.cases,
      deaths: data.deaths,
      recovered: data.recovered,
    };



    state.todayData = {
      cases: data.todayCases,
      deaths: data.todayDeaths,
      recovered: data.todayRecovered,
    };

    state.oneHundredThousandData = {
      cases: Math.round(data.cases * 100000 / countPeople),
      deaths: Math.round(data.deaths * 100000 / countPeople),
      recovered: Math.round(data.recovered * 100000 / countPeople),
    };

    state.todayOneHundredThousandData = {
      cases: Math.round(data.todayCases * 100000 / countPeople),
      deaths: Math.round(data.todayDeaths * 100000 / countPeople),
      recovered: Math.round(data.todayRecovered * 100000 / countPeople),
    };

    state.globalData = {
      allData: {
        cases: data.cases,
        deaths: data.deaths,
        recovered: data.recovered,
      },
      todayData: {
        cases: data.todayCases,
        deaths: data.todayDeaths,
        recovered: data.todayRecovered,
      },
      oneHundredThousandData: {
        cases: Math.round(data.cases * 100000 / COUNT_PEOPLE),
        deaths: Math.round(data.deaths * 100000 / COUNT_PEOPLE),
        recovered: Math.round(data.recovered * 100000 / COUNT_PEOPLE),
      },
      todayOneHundredThousandData: {
        cases: Math.round(data.todayCases * 100000 / COUNT_PEOPLE),
        deaths: Math.round(data.todayDeaths * 100000 / COUNT_PEOPLE),
        recovered: Math.round(data.todayRecovered * 100000 / COUNT_PEOPLE),
      }
    }

  } catch (err) {
    console.error(err);
  }
};

export const loadCountryAll = async function () {
  try {
    const res = await fetch(`${API_URL}/countries?sort=cases`);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    data.forEach((el) => {
      const countPeople = el.population ? el.population : COUNT_PEOPLE;

      state.allCountry.push({
        country: el.country,
        countryInfo: el.countryInfo,
        allData: {
          cases: el.cases,
          deaths: el.deaths,
          recovered: el.recovered,
        },
        todayData: {
          cases: el.todayCases,
          deaths: el.todayDeaths,
          recovered: el.todayRecovered,
        },
        oneHundredThousandData: {
          cases: Math.round(el.cases * 100000 / countPeople),
          deaths: Math.round(el.deaths * 100000 / countPeople),
          recovered: Math.round(el.recovered * 100000 / countPeople),
        },
        todayOneHundredThousandData: {
          cases: Math.round(el.todayCases * 100000 / countPeople),
          deaths: Math.round(el.todayDeaths * 100000 / countPeople),
          recovered: Math.round(el.todayRecovered * 100000 / countPeople),
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
};

export const loadCountry = async function () {
  try {
    const res = await fetch(`${API_URL}/countries/${state.selectCountry}`);
    const data = await res.json();
    ;
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    if (state.selectCountry) state.oneCountry = data;
    const countPeople = state.selectCountry ? state.oneCountry.population : COUNT_PEOPLE;

    state.allData = {
      cases: data.cases,
      deaths: data.deaths,
      recovered: data.recovered,
    };

    state.todayData = {
      cases: data.todayCases,
      deaths: data.todayDeaths,
      recovered: data.todayRecovered,
    };

    state.oneHundredThousandData = {
      cases: Math.round(data.cases * 100000 / countPeople),
      deaths: Math.round(data.deaths * 100000 / countPeople),
      recovered: Math.round(data.recovered * 100000 / countPeople),
    };

    state.todayOneHundredThousandData = {
      cases: Math.round(data.todayCases * 100000 / countPeople),
      deaths: Math.round(data.todayDeaths * 100000 / countPeople),
      recovered: Math.round(data.todayRecovered * 100000 / countPeople),
    };

  } catch (err) {
    console.error(err);
  }
};


export const addCovidDataToCoordinates = async function () {
  try {
    state.allCountry.forEach((ind) => {
      state.countriesCoordinates.forEach((el) => {
        if (ind.countryInfo.iso3 === el.id) {
          el.todayData = ind.todayData;
          el.todayOneHundredThousandData = ind.todayOneHundredThousandData;
          el.oneHundredThousandData = ind.oneHundredThousandData;
          el.allData = ind.allData;
        }
      })
    })
    state.countriesCoordinates = state.countriesCoordinates.filter(el => el.allData);
  } catch (err) {
    console.log(err);
  }
}

export const searchCountry = async function (searchCountry = '') {
  try {
    const regExpCountry = new RegExp(searchCountry, 'i');
    state.searchCountryResult = state.allCountry.filter(el => regExpCountry.test(el.country));
    state.searchCountryResult
  } catch (err) {
    console.error(err);
  }
};

export const loadTimeline = async function () {
  let res = '';

  if (state.selectCountry) {
    res = await fetch(`${API_URL}/historical/${state.selectCountry}?lastdays=366`);
  } else {
    res = await fetch(`${API_URL}/historical/all?lastdays=366`);
  }
  const data = await res.json();

  if (!res.ok) throw new Error(`${data.message} (${res.status})`);

  const allData = !state.selectCountry ? data : data.timeline;
  state.timeline['allData'] = allData;

  let numPred = 0;
  const countPeople = state.selectCountry ? state.oneCountry.population : COUNT_PEOPLE;

  let todayDataCases = {};
  let oneHundredThousandDataCases = {};
  let todayOneHundredThousandDataCases = {};
  for (const [date, num] of Object.entries(allData.cases)) {
    const daily = (num - numPred) < 0 ? 0 : num - numPred;
    todayDataCases[date] = daily;
    oneHundredThousandDataCases[date] = Math.round(num * 100000 / countPeople);
    todayOneHundredThousandDataCases[date] = Math.round(daily * 100000 / countPeople);
    numPred = num;
  }

  let todayDataDeaths = {};
  let oneHundredThousandDataDeaths = {};
  let todayOneHundredThousandDataDeaths = {};
  for (const [date, num] of Object.entries(allData.deaths)) {
    const daily = (num - numPred) < 0 ? 0 : num - numPred;
    todayDataDeaths[date] = daily;
    oneHundredThousandDataDeaths[date] = Math.round(num * 100000 / countPeople);
    todayOneHundredThousandDataDeaths[date] = Math.round(daily * 100000 / countPeople);
    numPred = num;
  }

  let todayDataRecovered = {};
  let oneHundredThousandDataRecovered = {};
  let todayOneHundredThousandDataRecovered = {};
  for (const [date, num] of Object.entries(allData.recovered)) {
    const daily = (num - numPred) < 0 ? 0 : num - numPred;
    todayDataRecovered[date] = daily;
    oneHundredThousandDataRecovered[date] = Math.round(num * 100000 / countPeople);
    todayOneHundredThousandDataRecovered[date] = Math.round(daily * 100000 / countPeople);
    numPred = num;
  }

  state.timeline['todayData'] = {
    cases: todayDataCases,
    deaths: todayDataDeaths,
    recovered: todayDataRecovered,
  };

  state.timeline['oneHundredThousandData'] = {
    cases: oneHundredThousandDataCases,
    deaths: oneHundredThousandDataDeaths,
    recovered: oneHundredThousandDataRecovered,
  };

  state.timeline['todayOneHundredThousandData'] = {
    cases: todayOneHundredThousandDataCases,
    deaths: todayOneHundredThousandDataRecovered,
    recovered: todayOneHundredThousandDataRecovered,
  };
};

