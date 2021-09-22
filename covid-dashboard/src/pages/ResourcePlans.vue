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
      <h3>Hospital Resource Planning</h3>
      <span v-if="!loading && !error.show" class="mx-2"><b-button @click="generateCSV" size="sm" variant="primary">Download Data</b-button></span>
    </div>

    <b-container fluid class="px-0">
      <b-form-row v-if="!loading && !error.show">
        <b-col md="9" lg="9" xl="9" class="py-1">
          <b-card no-body class="border-0">
            <b-tabs card>
              <b-tab title="Med/Surg & PCU Bed Capacity">
                <SplineChart
                        title="Hospital Bed Requirements"
                        :counties="selectedCounties"
                        :forecast="getForecastData('Hospitalized', forecastDays)"
                        :key="`hospitalized_${getHash}_${forecastLength}`"
                        :start-date="getStartDate"
                        :capacity="getResourceCapacities(selectedCounties).hospital_bed_capacity"
                        help-text="Hospitalized bed requirements refers to the total number of hospital beds required on a given day for covid-19 patients. This does not include ICU bed requirements. Capacity refers to an estimate of the total number of hospital beds available in the selected counties."
                >
                  <template v-slot:help-content>
                    <p class="text-secondary tw-text-xs my-1">
                      <b>Hospitalized bed requirements</b> refers to the total number of hospital beds required on a given day for covid-19 patients. This does not include ICU bed requirements.
                    </p>
                    <p class="text-secondary tw-text-xs my-1">
                      <b>Capacity</b> refers to an estimate of the total number of hospital beds available in the selected counties.
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
                  <p v-if="selectedRegion === 'Florida'" class="text-secondary tw-text-xs">
                    Available hospital beds reflects the availability reported by the Florida Agency for Health Care Administration (AHCA) on April 5th, 2020.
                  </p>
                </b-card-footer>
              </b-tab>
              <b-tab title="ICU Bed Capacity">
                <SplineChart
                        title="ICU Bed Requirements"
                        :counties="selectedCounties"
                        :forecast="getForecastData('ICU', forecastDays)"
                        :key="`icu_${getHash}_${forecastLength}`"
                        :start-date="getStartDate"
                        :capacity="getResourceCapacities(selectedCounties).icu_bed_capacity"
                        help-text="ICU bed requirements refers to the total number of ICU beds required on a given day for covid-19 patients. Capacity refers to an estimate of the total number of ICU beds available in the selected counties."
                >
                  <template v-slot:help-content>
                    <p class="text-secondary tw-text-xs my-1">
                      <b>ICU bed requirements</b> refers to the total number of ICU beds required on a given day for covid-19 patients.
                    </p>
                    <p class="text-secondary tw-text-xs my-1">
                      <b>Capacity</b> refers to an estimate of the total number of ICU beds available in the selected counties.
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
                  <p v-if="selectedRegion === 'Florida'" class="text-secondary tw-text-xs">
                    Available ICU beds reflects the availability reported by the Florida Agency for Health Care Administration (AHCA) on April 5th, 2020.
                  </p>
                </b-card-footer>
              </b-tab>
              <b-tab title="Ventilator Capacity">
                <SplineChart
                        title="Ventilator Requirements"
                        :counties="selectedCounties"
                        :forecast="scaleForecastData('ICU', forecastDays, 0.7)"
                        :key="`ventilators_${getHash}_${forecastLength}`"
                        :start-date="getStartDate"
                        :capacity="getResourceCapacities(selectedCounties).ventilator_capacity"
                        help-text="Ventilator requirements refers to the total number of ventilators required on a given day for covid-19 patients. Capacity refers to an estimate of the total number of ventilators available in the selected counties."
                >
                  <template v-slot:help-content>
                    <p class="text-secondary tw-text-xs my-1">
                      <b>Ventilator requirements</b> refers to the total number of ventilators required on a given day for covid-19 patients.
                    </p>
                    <p class="text-secondary tw-text-xs my-1">
                      <b>Capacity</b> refers to an estimate of the total number of ventilators available in the selected counties.
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
                  <p v-if="selectedRegion === 'Florida'" class="text-secondary tw-text-xs">
                    Available ventilators reflects the availability reported by the Florida Agency for Health Care Administration (AHCA) on April 5th, 2020.
                  </p>
                </b-card-footer>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
        <b-col md="3" lg="3" xl="3" class="py-1">
          <ForecastSlider v-model="forecastLength" :maximum-days="getMetadata.model_defaults.sim_length"></ForecastSlider>
          <ModelControls
                  v-model="model_controls"
                  :disable-button="!selectedTableRows.length"
                  @button-clicked="countiesUpdated(selectedTableRows)"
          ></ModelControls>
          <CountiesTable
                  v-if="getCounties(selectedRegion)"
                  :title="`${selectedRegion} Counties`"
                  :table-height="tableHeight"
                  @table-rows-selected="selectedTableRows=$event"
                  :counties="getCounties(selectedRegion)"
                  :initial-selected="getMetadata.model_defaults.counties"
                  :state="selectedRegion"
          />
        </b-col>
      </b-form-row>
    </b-container>

  </div>
</template>

<script>

import CountiesTable from "@/components/charts/CountiesTable";
import SplineChart from "@/components/charts/SplineChart";

import {
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
    CountiesTable,
    SplineChart
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
      'scaleForecastData',
      'getMetadata',
      'getStartDate',
      'hasPredictions',
      'getResourceCapacities',
      'generateEpidemicCSV',
      'getHash',
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
    // console.log('plans.mounted.this.$route.name', this.$route.name)
    self.fetch(self.$route);

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
    // async countiesUpdated (items) {
    //   const self = this;
    //   try {
    //     const selected_counties_for_run = items.map(entry => entry.county); // set the counties for run here, but leave updating the vue object data until a successful response
    //     self.error.show = false;
    //     self.showLoadingDialog('Updating model. This may take a few minutes. This page will automatically refresh when the model has completed.');
    //     const options = {
    //       country: self.region.country,
    //       state: self.selectedRegion,
    //       counties: selected_counties_for_run,
    //       ...self.model_controls,
    //       shelter_date: self.region.shelter_date
    //     };
    //     const predictions = self.isAuthenticated ? await self.fetchPredictions(options) : await self.fetchPrecomputedPredictions(options);
    //     self.setPredictions(predictions);
    //     self.selectedCounties = items.map(entry => entry.county); // now set the actual selected counties for the chart label.
    //   } catch (error) {
    //     if (error.response && error.response.data.status === 'maximum jobs running') {
    //       self.error.variant = 'danger';
    //       self.error.message = 'Maximum number of jobs running on server. Please try again later.';
    //     } else if (error.response && error.response.data.status === 'does not exist') {
    //       self.error.variant = 'info';
    //     } else {
    //       self.error.variant = 'danger';
    //       self.error.message = 'Data for this configuration does not exist yet. Please try again later.'
    //     }
    //     self.error.show = true;
    //   } finally {
    //     self.hideLoadingDialog();
    //   }
    // },
    // async regionUpdated () {
    //   const self = this;
    //   try {
    //     self.error.show = false;
    //     self.showLoadingDialog('Updating model. This may take a few minutes. This page will automatically refresh when the model has completed.');
    //     self.forecastLength = 30;
    //     self.selectedCounties = self.region.default_counties;
    //     self.model_controls = {
    //       shelter_release_start_date: self.region.shelter_release_start_date,
    //       shelter_release_end_date: self.region.shelter_release_end_date,
    //       social_distancing: self.region.social_distancing,
    //       quarantine_percent: self.region.quarantine_percent,
    //       social_distancing_end_date: self.region.social_distancing_end_date,
    //       quarantine_start_date: self.region.quarantine_start_date
    //     };
    //     const options = {
    //       country: self.region.country,
    //       state: self.selectedRegion,
    //       counties: self.selectedCounties,
    //       ...self.model_controls,
    //       shelter_date: self.region.shelter_date
    //     };
    //     const predictions = self.isAuthenticated ? await self.fetchPredictions(options) : await self.fetchPrecomputedPredictions(options);
    //     self.setPredictions(predictions);
    //     // Set initial selected counties
    //     const selectedRows = self.getCounties(self.selectedRegion).reduce((acc, county, index) => {
    //       if (self.selectedCounties.includes(county)) {
    //         acc.push({county, index});
    //       }
    //       return acc;
    //     }, []);
    //     self.setSelectedTableRows(selectedRows);
    //   } catch (error) {
    //     if (error.response && error.response.data.status === 'maximum jobs running') {
    //       self.error.variant = 'danger';
    //       self.error.message = 'Maximum number of jobs running on server. Please try again later.';
    //     } else if (error.response && error.response.data.status === 'does not exist') {
    //       self.error.variant = 'info';
    //     } else {
    //       self.error.variant = 'danger';
    //       self.error.message = 'Data for this configuration does not exist yet. Please try again later.'
    //     }
    //     self.error.show = true;
    //   } finally {
    //     if (self.active) {
    //       self.hideLoadingDialog();
    //     }
    //   }
    // },
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
    //   self.$router.replace({name: 'plans', query: query});
        self.$router.replace({name: 'plans', query: query}, function() {}, function() {
            self.hideLoadingDialog();
        });
    },
    async regionUpdated () {
        // console.log('plans.regionUpdated.this.$route.name', this.$route.name)
        // console.log('plans.regionUpdated.loading', this.loading)
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
      self.$router.replace({name: 'plans', query: query}, function() {}, function() {});
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
        // self.selectedRegion = route.query.state ? route.query.state : metadata.default_state;
        if(!self.selectedRegion) {
            self.selectedRegion = route.query.state ? route.query.state : metadata.default_state;
        }

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
