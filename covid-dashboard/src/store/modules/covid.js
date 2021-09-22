import { HTTP } from '@/utilities/http-common';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  namespaced: true,
  state: {
    meta: {},
    states: [],
    counties: {},
    predictions: null,
    predictions_all_counties: [],
    map_data: {},
    resource_capacities: null,
    ui: {
      selectedCounties: [],
      forecastLength: 30,
      model_controls: {
        shelter_release_start_date: '',
        shelter_release_end_date: '',
        social_distancing: true,
        social_distancing_end_date: '2020-06-15',
        quarantine_percent: 0,
        quarantine_start_date: '2020-08-01'
      },
      selectedTableRows: [],
      selectedRegion: ''
    }
  },
  getters: {
    getStates(state) {
      return state.states;
    },
    getCounties(state) {
      return function (stateName) {
        return state.counties[stateName];
      }
    },
    getReported(state) {
      const confirmed = state.predictions.Confirmed.filter(entry => entry);
      const deceased = state.predictions.Deaths.filter(entry => entry);
      const positive = confirmed.map((entry, index) => entry - deceased[index]);
      return {
        confirmed,
        deceased,
        positive,
        time: state.predictions.real_time
      };
    },
    getForecastData(state) {
      return (name, sliceLength) => {
        if (name in state.predictions) {
            return {
                minimum: state.predictions[name].slice(0, sliceLength).map(entry => entry[0]),
                mean: state.predictions[name].slice(0, sliceLength).map(entry => entry[1]),
                maximum: state.predictions[name].slice(0, sliceLength).map(entry => entry[2])
              }
        } else {
            return {
                minimum: [],
                mean: [],
                maximum: []
            }
        }
        
      }
    },
    scaleForecastData(state) {
      return (name, sliceLength, scale) => {
        return {
          minimum: state.predictions[name].slice(0, sliceLength).map(entry => scale * entry[0]),
          mean: state.predictions[name].slice(0, sliceLength).map(entry => scale * entry[1]),
          maximum: state.predictions[name].slice(0, sliceLength).map(entry => scale * entry[2])
        }
      }
    },
    getStartDate(state) {
      // replacing hyphens with spaces to avoid negative number years when parsing the date string
      const startDate = state.predictions.start_date.replace(/-/g, ' ');
      return Date.parse(startDate);
    },
    getShelterDateString(state) {
      const region = state.meta.states.find(entry => entry.name === state.ui.selectedRegion);
      const shelterDateText = region.shelter_date.replace(/-/g, ' ');
      const shelterDate = new Date(shelterDateText);
      return shelterDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    },
    getMetadata(state) {
      return state.meta;
    },
    getPredictionsAllCounties(state) {
      return state.predictions_all_counties;
    },
    getMapData(state) {
      return state.map_data;
    },
    hasPredictions(state) {
      return state.predictions !== null;
    },
    getResourceCapacities(state) {
      return function (countyArray) {
        const selectedCounties = state.resource_capacities.filter(entry => countyArray.includes(entry.name));
        return selectedCounties.reduce((acc, entry) => {
          acc.name = acc.name.length ? `${acc.name}, ${entry.name}` : entry.name;
          if (typeof entry.hospital_bed_capacity !== 'undefined' && entry.hospital_bed_capacity !== null) {
            if (acc.hospital_bed_capacity !== null) {
              acc.hospital_bed_capacity += entry.hospital_bed_capacity;
            } else {
              acc.hospital_bed_capacity = entry.hospital_bed_capacity;
            }
          }
          if (typeof entry.icu_bed_capacity !== 'undefined' && entry.icu_bed_capacity !== null) {
            if (acc.icu_bed_capacity !== null) {
              acc.icu_bed_capacity += entry.icu_bed_capacity;
            } else {
              acc.icu_bed_capacity = entry.icu_bed_capacity;
            }
          }
          if (typeof entry.ventilator_capacity !== 'undefined' && entry.ventilator_capacity !== null) {
            if (acc.ventilator_capacity !== null) {
              acc.ventilator_capacity += entry.ventilator_capacity;
            } else {
              acc.ventilator_capacity = entry.ventilator_capacity;
            }
          }
          return acc;
        }, { name: '', hospital_bed_capacity: null, icu_bed_capacity: null, ventilator_capacity: null });
      };
    },
    generateEpidemicCSV(state) {
      let result = '';
      const firstRow = [
        'Location',
        `"${state.predictions.Locations}"`,
        state.predictions.State,
        state.predictions.Country
      ];
      result += `${firstRow.join(',')}\n`;
      const titleRow = [
        'Cumulative Confirmed Cases',
        'Active Infectious cases',
        'New Infectious Cases',
        'Active Infectious Asymptomatic Cases',
        'New Infectious Asymptomatic Cases',
        'New Infectious Symptomatic Cases',
        'Hospitalized Cases',
        'ICU Cases',
        'Ventilator Cases'
      ];
      result += `,${titleRow.join(',,,')}\n`;
      const headerRow = titleRow.reduce(acc => {
        acc.push('lwr95');
        acc.push('med');
        acc.push('upr95');
        return acc;
      }, []);
      result += `Date,${headerRow.join(',')}\n`;

      const dateRaw = state.predictions.start_date.replace(/-/g, ' ');
      const startDate = new Date(dateRaw);
      for (const [index, cumulative] of state.predictions.Cumulative.entries()) {
        const row = [];
        // Date
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + index);
        row.push(currentDate.toLocaleString('en-US', { timeZone: 'UTC' }).split(',').shift());
        // Cumulative Confirmed Cases
        row.push(Math.trunc(cumulative[0]));
        row.push(Math.trunc(cumulative[1]));
        row.push(Math.trunc(cumulative[2]));
        // Active Infectious cases
        row.push(Math.trunc(state.predictions.Epidemic[index][0]));
        row.push(Math.trunc(state.predictions.Epidemic[index][1]));
        row.push(Math.trunc(state.predictions.Epidemic[index][2]));
        // New Infectious Cases
        row.push(Math.trunc(state.predictions.new_infectious[index][0]));
        row.push(Math.trunc(state.predictions.new_infectious[index][1]));
        row.push(Math.trunc(state.predictions.new_infectious[index][2]));
        // Active Infectious Asymptomatic Cases
        row.push(Math.trunc(state.predictions.active_infectious_asymptomatic[index][0]));
        row.push(Math.trunc(state.predictions.active_infectious_asymptomatic[index][1]));
        row.push(Math.trunc(state.predictions.active_infectious_asymptomatic[index][2]));
        // New Infectious Asymptomatic Cases
        row.push(Math.trunc(state.predictions.new_infectious_asymptomatic[index][0]));
        row.push(Math.trunc(state.predictions.new_infectious_asymptomatic[index][1]));
        row.push(Math.trunc(state.predictions.new_infectious_asymptomatic[index][2]));
        // New Infectious Symptomatic Cases
        row.push(Math.trunc(state.predictions.daily_cases[index][0]));
        row.push(Math.trunc(state.predictions.daily_cases[index][1]));
        row.push(Math.trunc(state.predictions.daily_cases[index][2]));
        // Hospitalized Cases
        row.push(Math.trunc(state.predictions.Hospitalized[index][0]));
        row.push(Math.trunc(state.predictions.Hospitalized[index][1]));
        row.push(Math.trunc(state.predictions.Hospitalized[index][2]));
        // ICU Cases
        row.push(Math.trunc(state.predictions.ICU[index][0]));
        row.push(Math.trunc(state.predictions.ICU[index][1]));
        row.push(Math.trunc(state.predictions.ICU[index][2]));
        // Ventilator Cases
        row.push(Math.trunc(0.7 * state.predictions.ICU[index][0]));
        row.push(Math.trunc(0.7 * state.predictions.ICU[index][1]));
        row.push(Math.trunc(0.7 * state.predictions.ICU[index][2]));
        result += `${row.join(',')}\n`;
      }

      return result;
    },
    getHash(state) {
      return state.predictions ? state.predictions.hash : '';
    },
    getRegions(state) {
      return {
        default_region: state.meta.default_state,
        regions: state.meta.states.map(entry => entry.name)
      };
    },
    getSelectedRegion(state) {
      return state.ui.selectedRegion;
    }
  },
  mutations: {
    setStatesCounties(state, payload) {
      state.states = payload.states;
      const michiganExcludedCounties = [
        'Michigan Department of Corrections (MDOC)',
        'Federal Correctional Institution (FCI)'
      ]
      payload.counties.Michigan = payload.counties.Michigan.filter(entry => !michiganExcludedCounties.includes(entry))
      state.counties = payload.counties;
    },
    setPredictions(state, payload) {
      state.predictions = payload;
    },
    clearPredictions(state) {
      state.predictions = null;
    },
    setMetadata(state, payload) {
      state.meta = payload;
    },
    setPredictionsAllCounties(state, payload) {
      state.predictions_all_counties = payload;
    },
    setMapData(state, payload) {
      state.map_data = payload;
    },
    setResourceCapacities(state, payload) {
      state.resource_capacities = payload.results;
    },
    setSelectedCounties(state, payload) {
      state.ui.selectedCounties = payload;
    },
    setForecastLength(state, payload) {
      state.ui.forecastLength = payload;
    },
    setModelControls(state, payload) {
      state.ui.model_controls = payload;
    },
    setSelectedTableRows(state, payload) {
      state.ui.selectedTableRows = payload;
    },
    setSelectedRegion(state, region) {
      state.ui.selectedRegion = region;
    }
  },
  actions: {
    async fetchStatesCounties() {
      return HTTP.get('/covid/api/get_states_counties/').then(response => response.data);
    },
    async fetchPredictions(context, options) {
      const {
        country,
        state,
        counties,
        shelter_date,
        shelter_release_start_date,
        shelter_release_end_date,
        social_distancing,
        quarantine_percent,
        social_distancing_end_date,
        quarantine_start_date,
        lockdown_strength,
        social_distancing_strength
      } = options;

      const payload = {
        model_input: {
          sim_length: context.state.meta.model_defaults.sim_length.toString(),
          shelter_date: shelter_date,
          shelter_release_start_date,
          shelter_release_end_date,
          social_distancing: (social_distancing === 'true') ? true : false,
          quarantine_percent: parseInt(quarantine_percent),
          social_distancing_end_date,
          quarantine_start_date,
          country: country,
          state: state,
          nDraws: context.state.meta.model_defaults.nDraws.toString(),
          county: counties,
          lockdown_strength: parseFloat(lockdown_strength),
          social_distancing_strength: parseFloat(social_distancing_strength)
        }
      };
      // try and get prediction
      // if response has hash property wait a bit and call the prediction again
      let result = {};

      try {
        result = await HTTP.post('/covid/api/simulations/', payload).then(response => response.data.model_output ? response.data.model_output : {});
      } catch {
          let params = new URLSearchParams(payload.model_input);
        result = await HTTP.get('/model/api/v3/prediction/', { params }).then(response => response.data);
      }

      const PROVISIONING_PERIOD = 210; // time in seconds
      const timerStart = Date.now();
      while (!result.status || result.status !== 'complete') {
        // Update loading dialog progress bar
        if (!result.status) {
          // time elapsed since start in seconds
          const delta = (Date.now() - timerStart) / 1000;
          const provisionPercent = delta / PROVISIONING_PERIOD * 100;
          // Show provisioning progress bar
          context.commit('dialog/showProvisionProgressBar', null, { root: true });
          // Progress percent corresponds to time in seconds since start time divided by provisioning period
          context.commit('dialog/updateProvisionPercent', provisionPercent < 100 ? provisionPercent : 100, { root: true });
          // Set provisioning dialog text
          context.commit('dialog/updateLoadingDialogMessage', 'Provisioning server to update model with new parameters. This may take a few minutes', { root: true });
        } else {
          // Set provision percent to 100 if server is provisioned earlier than expected
          context.commit('dialog/updateProvisionPercent', 100, { root: true });
        }

        if (result.progress && result.progress > context.rootState.dialog.loadingDialogPercent) {
          context.commit('dialog/updateLoadingDialog', result.progress, { root: true });
          // Set loading dialog text
          context.commit('dialog/updateLoadingDialogMessage', 'Updating model. This may take a few minutes. This page will automatically refresh when the model has completed.', { root: true });
        }
        await sleep(10000);
        result = await HTTP.post('/covid/api/simulations/', payload).then(response => response.data.model_output ? response.data.model_output : {});
      }
      return result;
    },
    async fetchMetadata() {
      return HTTP.get('/meta/').then(response => response.data);
    },
    async fetchPredictionsAllCounties({ state, commit }) {
      const region = state.meta.states.find(entry => entry.name === state.ui.selectedRegion);
      const totalCounties = state.counties[region.name].length;
      let countiesProcessed = 0;
      const predictions = [];
      for (const county of state.counties[region.name]) {
        const params = new URLSearchParams({
          sim_length: state.meta.model_defaults.sim_length,
          shelter_date: region.shelter_date,
          shelter_release_start_date: region.shelter_release_start_date,
          shelter_release_end_date: region.shelter_release_end_date,
          social_distancing: region.social_distancing,
          quarantine_percent: region.quarantine_percent,
          social_distancing_end_date: region.social_distancing_end_date,
          quarantine_start_date: region.quarantine_start_date,
          country: region.country,
          state: region.name,
          nDraws: state.meta.model_defaults.nDraws,
          county: county,
          max_age: -1,
          lockdown_strength: 0.5,
          social_distancing_strength: 0.5
        });

        try {
            const result = await HTTP.get('/covid/api/simulations/status/', { params }).then(response => response.data);

            if(('status' in result && result['status'] !== 'complete') || !result) {
                continue;
            }

            predictions.push(result);
        } catch (error) {
            continue;
        }
        
        countiesProcessed++;
        commit('dialog/updateLoadingDialog', countiesProcessed / totalCounties * 100.0, { root: true });
      }
      return predictions;
    },
    async fetchMapData({ state }) {
      const region = state.meta.states.find(entry => entry.name === state.ui.selectedRegion);
      return await import(`@highcharts/map-collection/countries/us/us-${region.abbreviation.toLowerCase()}-all.geo.json`).then(response => response.default);
    },
    async fetchResourceCapacities() {
      return await HTTP.get('/covid/api/county_resources/').then(response => response.data);
    },
    async fetchPrecomputedPredictions(context, options) {
      const {
        country,
        state,
        counties,
        shelter_date,
        shelter_release_start_date,
        shelter_release_end_date,
        social_distancing,
        quarantine_percent,
        social_distancing_end_date,
        quarantine_start_date,
        lockdown_strength,
        social_distancing_strength
      } = options;
      const params = new URLSearchParams({
        sim_length: context.state.meta.model_defaults.sim_length,
        shelter_date: shelter_date,
        shelter_release_start_date,
        shelter_release_end_date,
        social_distancing,
        quarantine_percent,
        social_distancing_end_date,
        quarantine_start_date,
        country: country,
        state: state,
        nDraws: context.state.meta.model_defaults.nDraws,
        max_age: 10,
        lockdown_strength: lockdown_strength,
        social_distancing_strength: social_distancing_strength
      });
      for (const county of counties) {
        params.append('county', county);
      }
      let result = await HTTP.get('/covid/api/simulations/status/', { params }).then(response => response.data);
      while (result.status !== 'complete') {
        // Update loading dialog progress bar
        if (result.progress > context.rootState.dialog.loadingDialogPercent) {
          context.commit('dialog/updateLoadingDialog', result.progress, { root: true });
        }
        await sleep(10000);
        result = await HTTP.get('/covid/api/simulations/status/', { params }).then(response => response.data);
      }
      return result;
    },
    async fetchURLQuery(context, options) {
      const {
        country,
        state,
        counties,
        shelter_date,
        shelter_release_start_date,
        shelter_release_end_date,
        social_distancing,
        quarantine_percent,
        social_distancing_end_date,
        quarantine_start_date,
        lockdown_strength,
        social_distancing_strength
      } = options;
      const params = new URLSearchParams({
        sim_length: context.state.meta.model_defaults.sim_length,
        shelter_date: shelter_date,
        shelter_release_start_date,
        shelter_release_end_date,
        social_distancing,
        quarantine_percent,
        social_distancing_end_date,
        quarantine_start_date,
        country: country,
        state: state,
        nDraws: context.state.meta.model_defaults.nDraws,
        max_age: 10,
        lockdown_strength: lockdown_strength,
        social_distancing_strength: social_distancing_strength
      });
      for (const county of counties) {
        params.append('county', county);
      }

      let query = {};
      params.forEach((value, key) => {
          query[key] = String(params.getAll(key));
      });
      
      return query;
    }
  }
};
