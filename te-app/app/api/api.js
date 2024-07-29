import { getCache, setCache } from '../../lib/cache';
import { Lock } from '../../lib/lock';
const axios = require('axios');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)); 
const lock = new Lock;

/**
 * Fetches data using the proxy. 
 *
 * @param {string} country - Country to gather information on.
 * @param {string} indicator - What indicator to gather information on about the country.
 * @returns {Array} The array containing the data about the country.
 */
export const fetchData = async (country, indicator) => {
  try {
    const response = await axios.get(`/api/proxy?country=${country}&indicator=${indicator}`);
    return response.data;
  } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch data from the external API');
  }
}

/**
 * Fetches data on the specified country and about all the indicators in the object defined. 
 *
 * @param {string} country - Country to gather information on.
 * @returns {object} Object containing the historical data on the country about all the indicators defined.
 */
export const fetchCountryData = async (country) => {
  const countryData = {
    "GDP": null, 
    "Population": null, 
    "Interest Rate": null, 
    "Inflation Rate": null, 
    "Current Account": null, 
    "Unemployment Rate": null, 
    "Balance of Trade": null, 
    "Government Debt": null
  };

  if (country === '') {
    return countryData;
  }

  // Checking if data is already in the cache
  const cacheKey = country;
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Create an array of promises to fetch data for each indicator
  const fetchDataForIndicators = async () => {
    // using lock so that we do not have multiple API calls at the same time.
    await lock.acquire();
    for (const [key] of Object.entries(countryData)) {
      try {
        const data = await fetchData(country.toLowerCase(), key.toLowerCase());
        const filteredData = data.filter(item => item.Category !== "" && item.Value !== 0.0 && item.Frequency !== null);
        countryData[key] = filteredData;

      } catch (error) {
        console.error(`Error fetching data for ${key}:`, error);
        countryData[key] = 'Error';
      }

      await sleep(250); // Delay to respect rate limits
    }
    lock.release();
  };
  await fetchDataForIndicators();
  setCache(cacheKey, countryData)

  return countryData;
}

/**
 * Fetches data for filling out the table in the home page. 
 *
 * @param {string} country - Country to gather information on.
 * @returns {object} The object containing only the last available information on the indicators. 
 */
export const getTableData = async (country) => {
  const data = await fetchCountryData(country);
  const countryData = {};
    
  // Iterate over each key-value pair in the original object and stores the last available value.
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.length > 0) {
      countryData[key] = value[value.length - 1].Value;
    } else if (Array.isArray(value) && value.length === 0) {
      countryData[key] = "Not available"
    }
    else {
      countryData[key] = undefined;
    }
  }
  return countryData;
}

/**
 * Fetches data for plotting the graphs.  
 *
 * @param {string} country1 - First country to gather information on.
 * @param {string} country2 - Second country to gather information on.
 * @param {string} indicator - Indicator that will be used to compare the countries.
 * @returns {Array} Array containing objects inside with the information to be plotted 
 *                  in the following format: [{ date: "YYYY-MM-DD", country1: `value`, country2: `value`}]
 */
export const getChartData = async (country1, country2, indicator) => {
  const country1Data = await fetchCountryData(country1);
  const country2Data = await fetchCountryData(country2);

  const country1IndicatorData = country1Data[indicator];
  const country2IndicatorData = country2Data[indicator];

  // Function to transform data to { date: "YYYY-MM-DD", value: X }
  const transformData = (data) => {
    if (data === null) {
      return {};
    }
    return data.map(item => {
      const date = new Date(item.DateTime);
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const formattedDate = date.toLocaleDateString('en-CA', options);

      return {
        date: formattedDate,
        value: item.Value
      }
    });
  };

  const transformedCountry1Data = transformData(country1IndicatorData);
  const transformedCountry2Data = transformData(country2IndicatorData);

  const chartData = [];

  // Helper function to add data to chartData
  const addData = (data, countryKey) => {
    if (Object.keys(data).length === 0) {
      return ;
    }

    data.forEach(({ date, value }) => {
      let existingEntry = chartData.find(entry => entry.date === date);
      if (existingEntry) {
          existingEntry[countryKey] = value;
      } else {
          chartData.push({ date, [countryKey]: value });
      }
    });
  };

  addData(transformedCountry1Data, 'country1');
  addData(transformedCountry2Data, 'country2');

  // Fill missing values with null to ensure both countries have entries for each year
  chartData.forEach(entry => {
    if (entry.country1 === undefined) entry.country1 = null;
    if (entry.country2 === undefined) entry.country2 = null;
  });

  return chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
}