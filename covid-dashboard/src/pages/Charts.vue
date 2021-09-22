<template>
  <div class="h-100">
    <b-alert
            v-model="error.show"
            :variant="error.variant"
            fade
            dismissible
    >
      <template v-if="error.variant === 'info'">
        <h4 class="alert-heading">Please Sign In</h4>
        <p>Forecast data for the selected counties and model parameters does not exist. Please <b-button :to="{ name: 'login', query: { next: $route.path } }" size="sm" variant="secondary">Sign In</b-button> to generate a new forecast with the selected counties and model parameters.</p>
      </template>
      <template v-else>
        <h4 class="alert-heading">Error</h4>
        <p>{{ error.message }}</p>
      </template>
    </b-alert>
    <div class="d-flex justify-content-between">
      <h3>Epidemic Tracking and Planning</h3>
      <span v-if="!loading && !error.show" class="mx-2"><b-button @click="generateCSV" size="sm" variant="primary">Download Data</b-button></span>
    </div>

    <b-container fluid class="px-0">
      <b-form-row v-if="!loading && !error.show">
        <b-col cols="9" class="py-1">
          <b-card no-body class="border-0" v-if="hasPredictions">
          <b-tabs card>
            <b-tab title="Cumulative Cases" active>
              <ScatterSplineChart
                      title="Cumulative Confirmed Cases"
                      :counties="selectedCounties"
                      :reported="getReported"
                      :forecast="getForecastData('Cumulative', forecastDays)"
                      :key="`cumulative_${getHash}_${forecastLength}`"
                      :start-date="getStartDate"
                      help-text="Cumulative confirmed cases refers to the running total confirmed case count. This does not include undetected cases."
              >
                <template v-slot:help-content>
                  <p class="text-secondary tw-text-xs my-1">
                    <b>Cumulative confirmed cases</b> refers to the running total confirmed case count. This does not include undetected cases.
                  </p>
                </template>
              </ScatterSplineChart>
              <b-card-footer>
                <p class="text-secondary tw-text-xs">
                  Counties in {{ selectedRegion }} are assumed to have started lockdown/stay-at-home orders on {{ getShelterDateString }}.
                  Near-term predictions (up to 2 weeks ahead) are the most accurate. Beyond this, there is more uncertainty in the forecasts.
                  Please see the methodology described on <b-link href="https://covid.crc.nd.edu/methodology.html">https://covid.crc.nd.edu/methodology.html</b-link> for a full description of the COVID-19 SEIR model structure and underlying parameter assumptions.
                </p>
                <p class="text-secondary tw-text-xs">
                  Confirmed cases are given as reported in the COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University.
                </p>
              </b-card-footer>

              <SplineChart
                      v-if="getForecastData('new_confirmed', forecastDays).mean.length"
                      title="New Confirmed Cases"
                      :counties="selectedCounties"
                      :forecast="getForecastData('new_confirmed', forecastDays)"
                      :key="`new_confirmed_${getHash}_${forecastLength}`"
                      :start-date="getStartDate"
                      help-text="New Confirmed Cases refers to the total number of individual who have been confirmed to be."
              >
                <template v-slot:help-content>
                  <p class="text-secondary tw-text-xs my-1">
                    <b>New Confirmed Cases</b>  refers to the total number of individual who have been confirmed to be.
                  </p>
                </template>
              </SplineChart>

            </b-tab>
            <b-tab title="Daily Infectious Cases">
              <SplineChart
                      title="Active Infectious Cases"
                      :counties="selectedCounties"
                      :forecast="getForecastData('Epidemic', forecastDays)"
                      :key="`epidemic_${getHash}_${forecastLength}`"
                      :start-date="getStartDate"
                      help-text="Active infectious cases refers to the total number of individuals who are capable of transmitting the virus on a given day. This includes asymptomatic and symptomatic individuals."
              >
                <template v-slot:help-content>
                  <p class="text-secondary tw-text-xs my-1">
                    <b>Active infectious cases</b> refers to the total number of individuals who are capable of transmitting the virus on a given day. This includes asymptomatic and symptomatic individuals.
                  </p>
                </template>
              </SplineChart>
              <SplineChart
                      title="New Infectious Cases"
                      :counties="selectedCounties"
                      :forecast="getForecastData('new_infectious', forecastDays)"
                      :key="`epidemic_new_${getHash}_${forecastLength}`"
                      :start-date="getStartDate"
                      help-text="New infectious cases refers to the number of individuals who are entering the infectious stage of illness on a given day. This includes asymptomatic and symptomatic individuals."
              >
                <template v-slot:help-content>
                  <p class="text-secondary tw-text-xs my-1">
                    <b>New infectious cases</b> refers to the number of individuals who are entering the infectious stage of illness on a given day. This includes asymptomatic and symptomatic individuals.
                  </p>
                </template>
              </SplineChart>
              <b-card-footer>
                <p class="text-secondary tw-text-xs">
                  Counties in {{ selectedRegion }} are assumed to have started lockdown/stay-at-home orders on {{ getShelterDateString }}.
                  Near-term predictions (up to 2 weeks ahead) are the most accurate. Beyond this, there is more uncertainty in the forecasts.
                  Please see the methodology described on <b-link href="https://covid.crc.nd.edu/methodology.html">https://covid.crc.nd.edu/methodology.html</b-link> for a full description of the COVID-19 SEIR model structure and underlying parameter assumptions.
                </p>
                <p class="text-secondary tw-text-xs">
                  Confirmed cases are given as reported in the COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University.
                </p>
              </b-card-footer>
            </b-tab>
            <b-tab title="Daily Symptomatic Cases">
              <SplineChart
                      title="Active Infectious Symptomatic Cases"
                      :counties="selectedCounties"
                      :forecast="getForecastData('I_confirmed', forecastDays)"
                      :key="`symptomatic_${getHash}_${forecastLength}`"
                      :start-date="getStartDate"
                      help-text="Active infectious symptomatic cases refers to the total number of individuals who are capable of transmitting the virus on a given day and have developed symptoms."
              >
                <template v-slot:help-content>
                  <p class="text-secondary tw-text-xs my-1">
                    <b>Active infectious symptomatic cases</b> refers to the total number of individuals who are capable of transmitting the virus on a given day and have developed symptoms.
                  </p>
                </template>
              </SplineChart>
              <SplineChart
                      title="New Infectious Symptomatic Cases"
                      :counties="selectedCounties"
                      :forecast="getForecastData('daily_cases', forecastDays)"
                      :key="`symptomatic_new_${getHash}_${forecastLength}`"
                      :start-date="getStartDate"
                      help-text="New infectious symptomatic cases refers to the number of individuals who are entering the infectious stage of illness on a given day and have developed symptoms."
              >
                <template v-slot:help-content>
                  <p class="text-secondary tw-text-xs my-1">
                    <b>New infectious symptomatic cases</b> refers to the number of individuals who are entering the infectious stage of illness on a given day and have developed symptoms.
                  </p>
                </template>
              </SplineChart>
              <b-card-footer>
                <p class="text-secondary tw-text-xs">
                  Counties in {{ selectedRegion }} are assumed to have started lockdown/stay-at-home orders on {{ getShelterDateString }}.
                  Near-term predictions (up to 2 weeks ahead) are the most accurate. Beyond this, there is more uncertainty in the forecasts.
                  Please see the methodology described on <b-link href="https://covid.crc.nd.edu/methodology.html">https://covid.crc.nd.edu/methodology.html</b-link> for a full description of the COVID-19 SEIR model structure and underlying parameter assumptions.
                </p>
                <p class="text-secondary tw-text-xs">
                  Confirmed cases are given as reported in the COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University.
                </p>
              </b-card-footer>
            </b-tab>
            <b-tab title="Hospitalized Cases">
              <SplineChart
                      title="Hospitalized Cases"
                      :counties="selectedCounties"
                      :forecast="getForecastData('Hospitalized', forecastDays)"
                      :key="`hospitalized_${getHash}_${forecastLength}`"
                      :start-date="getStartDate"
                      help-text="Hospitalized cases refers to the total number of individuals requiring a hospital bed on a given day. This does not include those requiring an ICU bed."
              >
                <template v-slot:help-content>
                  <p class="text-secondary tw-text-xs my-1">
                    <b>Hospitalized cases</b> refers to the total number of individuals requiring a hospital bed on a given day. This does not include those requiring an ICU bed.
                  </p>
                </template>
              </SplineChart>
              <b-card-footer>
                <p class="text-secondary tw-text-xs">
                  Counties in {{ selectedRegion }} are assumed to have started lockdown/stay-at-home orders on {{ getShelterDateString }}.
                  Near-term predictions (up to 2 weeks ahead) are the most accurate. Beyond this, there is more uncertainty in the forecasts.
                  Please see the methodology described on <b-link href="https://covid.crc.nd.edu/methodology.html">https://covid.crc.nd.edu/methodology.html</b-link> for a full description of the COVID-19 SEIR model structure and underlying parameter assumptions.
                </p>
                <p class="text-secondary tw-text-xs">
                  Confirmed cases are given as reported in the COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University.
                </p>
              </b-card-footer>
            </b-tab>
            <b-tab title="ICU Cases">
              <SplineChart
                      title="ICU Cases"
                      :counties="selectedCounties"
                      :forecast="getForecastData('ICU', forecastDays)"
                      :key="`icu_${getHash}_${forecastLength}`"
                      :start-date="getStartDate"
                      help-text="ICU cases refers to the total number of individuals who are requiring an ICU bed on a given day."
              >
                <template v-slot:help-content>
                  <p class="text-secondary tw-text-xs my-1">
                    <b>ICU cases</b> refers to the total number of individuals who are requiring an ICU bed on a given day.
                  </p>
                </template>
              </SplineChart>
              <b-card-footer>
                <p class="text-secondary tw-text-xs">
                  Counties in {{ selectedRegion }} are assumed to have started lockdown/stay-at-home orders on {{ getShelterDateString }}.
                  Near-term predictions (up to 2 weeks ahead) are the most accurate. Beyond this, there is more uncertainty in the forecasts.
                  Please see the methodology described on <b-link href="https://covid.crc.nd.edu/methodology.html">https://covid.crc.nd.edu/methodology.html</b-link> for a full description of the COVID-19 SEIR model structure and underlying parameter assumptions.
                </p>
                <p class="text-secondary tw-text-xs">
                  Confirmed cases are given as reported in the COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University.
                </p>
              </b-card-footer>
            </b-tab>
          </b-tabs>
          </b-card>
        </b-col>
        <b-col cols="3" class="py-1">
          <ForecastSlider v-model="forecastLength" :maximum-days="getMetadata.model_defaults.sim_length" ></ForecastSlider>
          <ModelControls
                  v-model="model_controls"
                  :disable-button="!selectedTableRows.length"
                  @button-clicked="countiesUpdated(selectedTableRows)"
          ></ModelControls>
          <!-- TODO dynamically scale table height based on chart height -->
          <CountiesTable
                  v-if="getCounties(selectedRegion)"
                  :title="`${selectedRegion} Counties`"
                  @table-rows-selected="selectedTableRows=$event"
                  :counties="getCounties(selectedRegion)"
                  :table-height="tableHeight"
                  :initial-selected="region.default_counties"
                  :state="selectedRegion"
          />
        </b-col>
      </b-form-row>
    </b-container>
  </div>
</template>

<script>
import ScatterSplineChart from "@/components/charts/ScatterSplineChart";
import SplineChart from "@/components/charts/SplineChart";
import CountiesTable from "@/components/charts/CountiesTable";

import {
  // mapState,
  mapActions,
  mapMutations,
  mapGetters
} from 'vuex';
import BaseDialogMixin from "@/components/mixins/BaseDialogMixin";
import BaseAlertMixin from "@/components/mixins/BaseAlertMixin";
import ForecastSlider from "@/components/slider/ForecastSlider";
import ModelControls from "@/components/panel/ModelControls";

export default {
  mixins: [BaseDialogMixin, BaseAlertMixin],
  components: {
    ModelControls,
    ForecastSlider,
    ScatterSplineChart,
    SplineChart,
    CountiesTable
  },
  data: function () {
    return {
      active: false,
      loading: true,
      tableHeight: '27.1rem',
      selectedTableRows: [],
      error: {
        show: false,
        variant: 'danger',
        message: ''
      }
    }
  },
  computed: {
    selectedCounties: {
      get () {
        return this.$store.state.covid.ui.selectedCounties;
      },
      set (value) {
        this.setSelectedCounties(value);
      }
    },
    forecastLength: {
      get () {
        return this.$store.state.covid.ui.forecastLength;
      },
      set (value) {
        this.setForecastLength(value);
      }
    },
    model_controls: {
      get () {
        return this.$store.state.covid.ui.model_controls;
      },
      set (value) {
        this.setModelControls(value);
      }
    },
    selectedRegion: {
      get () {
        return this.$store.state.covid.ui.selectedRegion;
      },
      set (value) {
        this.setSelectedRegion(value);
      }
    },
    ...mapGetters('covid', [
      'getStates',
      'getCounties',
      'getReported',
      'getForecastData',
      'getStartDate',
      'getMetadata',
      'generateEpidemicCSV',
      'getHash',
      'hasPredictions',
      'getShelterDateString'
    ]),
    ...mapGetters(['isAuthenticated']),
    forecastDays () {
      return this.getReported.time + this.forecastLength;
    },
    region () {
      return this.getMetadata.states.find(entry => entry.name === this.selectedRegion);
    }
  },
  mounted: async function () {
    const self = this;
    // try {
    //   if (!this.hasPredictions) {
    //     self.showLoadingDialog('Loading model. This may take a few minutes. This page will automatically refresh when the model has completed.');
    //     const metadata = await self.fetchMetadata();
    //     self.setMetadata(metadata);
    //     // Check if selectedRegion is not already set
    //     if (!this.selectedRegion) {
    //       this.selectedRegion = metadata.default_state;
    //     }
    //     const region = metadata.states.find(entry => entry.name === self.selectedRegion);
    //     self.selectedCounties = region.default_counties;
    //     self.model_controls = {
    //       shelter_release_start_date: region.shelter_release_start_date,
    //       shelter_release_end_date: region.shelter_release_end_date,
    //       social_distancing: region.social_distancing,
    //       quarantine_percent: region.quarantine_percent,
    //       social_distancing_end_date: region.social_distancing_end_date,
    //       quarantine_start_date: region.quarantine_start_date
    //     };
    //     const statesCounties = await self.fetchStatesCounties();
    //     self.setStatesCounties(statesCounties);
    //     // Set initial selected counties
    //     const selectedRows = self.getCounties(self.selectedRegion).reduce((acc, county, index) => {
    //       if (self.selectedCounties.includes(county)) {
    //         acc.push({county, index});
    //       }
    //       return acc;
    //     }, []);
    //     self.setSelectedTableRows(selectedRows);
    //     // TODO parameterize resource capacities by region
    //     const resourceCapacities = await self.fetchResourceCapacities();
    //     self.setResourceCapacities(resourceCapacities);
    //     const options = {
    //       country: region.country,
    //       state: self.selectedRegion,
    //       counties: self.selectedCounties,
    //       ...self.model_controls,
    //       shelter_date: region.shelter_date
    //     };

    //     const predictions = self.isAuthenticated ? await self.fetchPredictions(options) : await self.fetchPrecomputedPredictions(options);
    //     self.setPredictions(predictions);

    //     try {
    //         const query = await self.fetchURLQuery(options);
    //         self.$router.replace({name: 'dashboard', query: query});
    //     } catch (error) {
    //         self.loading = false;
    //     }

    //     self.loading = false;
    //   } else {
    //     this.loading = false;
    //   }
    // } catch (error) {
    //   if (error.response && error.response.data.status === 'maximum jobs running') {
    //     self.error.variant = 'danger';
    //     self.error.message = 'Maximum number of jobs running on server. Please try again later.';
    //   } else if (error.response && error.response.data.status === 'does not exist') {
    //     self.error.variant = 'info';
    //   } else {
    //     self.error.variant = 'danger';
    //     self.error.message = 'Data for this configuration does not exist yet. Please try again later.'
    //   }
    //   self.error.show = true;
    // } finally {
    //   self.hideLoadingDialog();
    // }

    // console.log('charts.mounted.this.$route.name', this.$route.name)
    self.fetch(self.$route);
  },
  activated () {
    this.active = true;
  },
  deactivated () {
    this.active = false;
  },
  watch : {
    selectedRegion () {
        // don't listen for changes while loading
      if (!this.loading) {
        this.regionUpdated();
      }
    }
  },
  methods: {
    ...mapActions('covid', [
            'fetchStatesCounties',
            'fetchMetadata',
            'fetchPredictions',
            'fetchResourceCapacities',
            'fetchPrecomputedPredictions',
            'fetchRegions',
            'fetchURLQuery'
    ]),
    ...mapMutations('covid', [
            'setStatesCounties',
            'setMetadata',
            'setResourceCapacities',
            'setPredictions',
            'setSelectedCounties',
            'setForecastLength',
            'setModelControls',
            'setSelectedTableRows',
            'setSelectedRegion'
    ]),
    async countiesUpdated (items) {
      const self = this;

      this.loading = true;

      const selected_counties_for_run = items.map(entry => entry.county); // set the counties for run here, but leave updating the vue object data until a successful response
        self.error.show = false;
        self.showLoadingDialog('Updating model. This may take a few minutes. This page will automatically refresh when the model has completed.');
        const options = {
          country: self.region.country,
          state: self.selectedRegion,
          counties: selected_counties_for_run,
          ...self.model_controls,
          shelter_date: self.region.shelter_date
        };

        const query = await self.fetchURLQuery(options);
      self.$router.replace({name: 'dashboard', query: query}, function() {}, function() {
          self.hideLoadingDialog();
      });
    },
    async regionUpdated () {
        // console.log('charts.regionUpdated.this.$route.name', this.$route.name)
        // console.log('charts.regionUpdated.loading', this.loading)
      const self = this;

      if(this.loading) {
          return;
      }

      this.loading = true;

    self.error.show = false;
        self.forecastLength = 30;
        self.selectedCounties = self.region.default_counties;
        self.model_controls = {
          shelter_release_start_date: self.region.shelter_release_start_date,
          shelter_release_end_date: self.region.shelter_release_end_date,
          social_distancing: self.region.social_distancing,
          quarantine_percent: self.region.quarantine_percent,
          social_distancing_end_date: self.region.social_distancing_end_date,
          quarantine_start_date: self.region.quarantine_start_date,
          lockdown_strength: (self.region.lockdown_strength === undefined) ? 0.5 : self.region.lockdown_strength,
          social_distancing_strength: (self.region.social_distancing_strength === undefined) ? 0.5 : self.region.social_distancing_strength
        };
        const options = {
          country: self.region.country,
          state: self.selectedRegion,
          counties: self.selectedCounties,
          ...self.model_controls,
          shelter_date: self.region.shelter_date
        };

      const query = await self.fetchURLQuery(options);
      self.$router.replace({name: 'dashboard', query: query}, function() {}, function() {});
    },
    async fetch (route) {
    const self = this;
    try {
        // Hide error if any.
        self.loading = true;
        self.error.show = false;

        // Show loading dialog.
        self.showLoadingDialog('Loading model. This may take a few minutes. This page will automatically refresh when the model has completed.');

        // Check for metadata, otherwise, fetch it.
        let metadata = self.getMetadata;
        if(!metadata.country) {
            metadata = await self.fetchMetadata();
            self.setMetadata(metadata);
        }

        // Check if selectedRegion is not already set
        if(!self.selectedRegion) {
            self.selectedRegion = route.query.state ? route.query.state : metadata.default_state;
        }
        // self.selectedRegion = route.query.state ? route.query.state : metadata.default_state;

        // Get the region data for the selected region.
        const region = metadata.states.find(entry => entry.name === self.selectedRegion);

        // Set the def
        self.selectedCounties = route.query.county ? route.query.county.split(',') : region.default_counties;

        let lockdown_strength = (region.lockdown_strength === undefined) ? 0.5 : region.lockdown_strength;
        let social_distancing_strength = (region.social_distancing_strength === undefined) ? 0.5 : region.social_distancing_strength;

        // Set the model control variables.
        self.model_controls = {
          shelter_release_start_date: route.query.shelter_release_start_date ? route.query.shelter_release_start_date : region.shelter_release_start_date,
          shelter_release_end_date: route.query.shelter_release_end_date ? route.query.shelter_release_end_date : region.shelter_release_end_date,
          social_distancing: route.query.social_distancing ? route.query.social_distancing : region.social_distancing,
          quarantine_percent: route.query.quarantine_percent ? route.query.quarantine_percent : region.quarantine_percent,
          social_distancing_end_date: route.query.social_distancing_end_date ? route.query.social_distancing_end_date : region.social_distancing_end_date,
          quarantine_start_date: route.query.quarantine_start_date ? route.query.quarantine_start_date : region.quarantine_start_date,
          lockdown_strength: route.query.lockdown_strength ? route.query.lockdown_strength : lockdown_strength,
          social_distancing_strength: route.query.social_distancing_strength ? route.query.social_distancing_strength : social_distancing_strength
        };

        // Not optimal.
        const statesCounties = await self.fetchStatesCounties();
        self.setStatesCounties(statesCounties);
        
        // Set initial selected counties
        const selectedRows = self.getCounties(self.selectedRegion).reduce((acc, county, index) => {
          if (self.selectedCounties.includes(county)) {
            acc.push({county, index});
          }
          return acc;
        }, []);
        self.setSelectedTableRows(selectedRows);

        // TODO parameterize resource capacities by region
        const resourceCapacities = await self.fetchResourceCapacities();
        self.setResourceCapacities(resourceCapacities);
        const options = {
          country: region.country,
          state: self.selectedRegion,
          counties: self.selectedCounties,
          ...self.model_controls,
          shelter_date: region.shelter_date
        };

        const predictions = self.isAuthenticated ? await self.fetchPredictions(options) : await self.fetchPrecomputedPredictions(options);
        if(!predictions) {
            throw {};
        }

        self.setPredictions(predictions);

    } catch (error) {
      if (error.response && error.response.data.status === 'maximum jobs running') {
        self.error.variant = 'danger';
        self.error.message = 'Maximum number of jobs running on server. Please try again later.';
      } else if (error.response && error.response.data.status === 'does not exist') {
        self.error.variant = 'info';
      } else {
        self.error.variant = 'danger';
        self.error.message = 'Data for this configuration does not exist yet. Please try again later.'
      }
      self.error.show = true;
    } finally {
      self.loading = false;
      self.hideLoadingDialog();
    }
  },
    generateCSV () {
      const blob = new Blob([this.generateEpidemicCSV], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `epidemic-${new Date().toISOString().slice(0,10)}.csv`;
      link.click();
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.fetch(to);
    next();
  },
}
</script>
