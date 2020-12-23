export function calcCircleRadius(cases) {
  let coefficient = 0;
  if (cases > 5000000) {
    coefficient = 12;
  } else if (cases > 1000000) {
    coefficient = 10;
  } else if (cases > 500000) {
    coefficient = 9;
  } else if (cases > 400000) {
    coefficient = 8;
  } else if (cases > 250000) {
    coefficient = 7;
  } else if (cases > 100000) {
    coefficient = 6;
  } else if (cases > 50000) {
    coefficient = 5;
  } else if (cases > 20000) {
    coefficient = 4;
  } else if (cases > 3000) {
    coefficient = 3;
  } else if (cases > 1000) {
    coefficient = 2;
  } else if (cases > 1) {
    coefficient = 1;
  }
  return coefficient * 2;
}

export function theOtherOne() {
  return 0;
}

export function updateSummaryData(Countries, populationData) {
  return Countries.map(summaryElem => {
    const country = populationData
      .find(populationElem => populationElem.alpha2Code === summaryElem.CountryCode);
    return { ...summaryElem, population: country.population };
  });
}

export function formatSummaryData(dataAll, dataCountries) {
  const data = {
    Message: '',
    Global: {
      NewConfirmed: dataAll.todayCases,
      TotalConfirmed: dataAll.cases,
      NewDeaths: dataAll.todayDeaths,
      TotalDeaths: dataAll.deaths,
      NewRecovered: dataAll.todayRecovered,
      TotalRecovered: dataAll.recovered,
    },
    Countries: dataCountries.map(elem => ({
      Country: elem.country,
      CountryCode: elem.countryInfo.iso2,
      Slug: elem.countryInfo.iso3,
      NewConfirmed: elem.todayCases,
      TotalConfirmed: elem.cases,
      NewDeaths: elem.todayDeaths,
      TotalDeaths: elem.deaths,
      NewRecovered: elem.todayRecovered,
      TotalRecovered: elem.recovered,
      population: elem.population,
      Date: new Date(elem.updated).toISOString(),
      Premium: {
      },
    })).filter(elem => elem.CountryCode !== null),
    Date: new Date(dataAll.updated).toISOString(),
  };
  return data;
}
