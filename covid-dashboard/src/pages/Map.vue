<template>
  <div class="h-100">
    <b-alert
            v-model="error.show"
            variant="danger"
            fade
            dismissible
    >
      ERROR: {{ error.message }}
    </b-alert>
    <b-row>
      <b-col cols="7">
        <h3><span v-if="!loading">{{ selectedRegion }} </span>Map</h3>
      </b-col>
      <b-col cols="5" class="border rounded bg-light">
        <p class="text-secondary tw-text-xs my-1">
          <b>New infectious cases</b> refers to the number of individuals who entered the infectious stage of illness yesterday. This includes asymptomatic and symptomatic individuals.
        </p>
        <p class="text-secondary tw-text-xs my-1">
          <b>New infectious cases detected</b> refers to the number of individuals who entered the infectious stage of illness yesterday and were detected by surveillance. This includes a proportion of symptomatic individuals.
        </p>
      </b-col>
    </b-row>

    <b-container fluid class="px-0">
      <b-form-row v-if="!loading">
        <b-col cols="1"></b-col>
        <b-col cols="9">
          <b-card class="border-0">
            <Map :map-data="getMapData" :selected-region="selectedRegion" :key="`${selectedRegion}_map`"/>
            <b-card-footer>
              <p class="text-secondary tw-text-xs">
                Please see the methodology described on <b-link href="https://seircast.org/methodology.html">https://seircast.org/methodology.html</b-link> for a full description of the COVID-19 SEIR model structure and underlying parameter assumptions.
              </p>
              <p class="text-secondary tw-text-xs">
                Confirmed cases are given as reported in the COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University.
              </p>
            </b-card-footer>
          </b-card>
        </b-col>
        <b-col cols="2"></b-col>
      </b-form-row>
    </b-container>
  </div>
</template>

<script>

import {
  mapActions,
  mapGetters,
  mapMutations
} from "vuex";

import Map from "@/components/map/Map.vue";
import BaseDialogMixin from "@/components/mixins/BaseDialogMixin";
import BaseAlertMixin from "@/components/mixins/BaseAlertMixin";

export default {
  mixins: [BaseDialogMixin, BaseAlertMixin],
  components: {
    Map
  },
  data: function() {
    return {
      active: false,
      title: "State Map",
      loading: true,
      error: {
        show: false,
        message: ''
      }
    };
  },
  computed: {
    ...mapGetters('covid', ['getMetadata', 'getMapData']),
    selectedRegion: {
      get () {
        return this.$store.state.covid.ui.selectedRegion;
      },
      set (value) {
        this.setSelectedRegion(value);
      }
    },
  },
  async mounted () {
    const self = this;
    try {
      self.loading = true;
      self.showLoadingDialog("Loading model. This may take a few minutes. This page will automatically refresh when the model has completed.");
      const metadata = await self.fetchMetadata();
      self.setMetadata(metadata);
      // Check if selectedRegion is not already set
      if(!self.selectedRegion) {
        self.selectedRegion = self.route.query.state ? self.route.query.state : metadata.default_state;
      }
      const mapData = await self.fetchMapData();
      self.setMapData(mapData);
      const statesCounties = await self.fetchStatesCounties();
      self.setStatesCounties(statesCounties);
      const predictions = await self.fetchPredictionsAllCounties();
      self.setPredictionsAllCounties(predictions);
      self.loading = false;
    } catch (error) {
      if (error.response && error.response.data.status === 'maximum jobs running') {
        self.error.message = 'Maximum number of jobs running on server. Please try again later.';
      } else {
        self.error.message = 'Data for this configuration does not exist yet. Please try again later.'
      }
      self.error.show = true;
    } finally {
      self.hideLoadingDialog();
    }
  },
  activated () {
    this.active = true;
    if (this.loading) {
      this.showLoadingDialog('Loading model. This may take a few minutes. This page will automatically refresh when the model has completed.');
    }
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
    ...mapActions('covid', ['fetchMetadata', 'fetchStatesCounties', 'fetchPredictionsAllCounties', 'fetchMapData']),
    ...mapMutations('covid', ['setMetadata', 'setStatesCounties', 'setPredictionsAllCounties', 'setMapData', 'setSelectedRegion']),
    async regionUpdated () {
      const self = this;
      try  {
        self.loading = true;
        self.showLoadingDialog("Loading model. This may take a few minutes. This page will automatically refresh when the model has completed.");
        const mapData = await self.fetchMapData();
        self.setMapData(mapData);
        const predictions = await self.fetchPredictionsAllCounties();
        self.setPredictionsAllCounties(predictions);
      } catch (error) {
        if (error.response && error.response.data.status === 'maximum jobs running') {
          self.error.message = 'Maximum number of jobs running on server. Please try again later.';
        } else {
          self.error.message = 'Data for this configuration does not exist yet. Please try again later.'
        }
        self.error.show = true;
      } finally {
        if (self.loading) {
          self.hideLoadingDialog();
        }
        self.loading = false;
      }
    }
  }
};
</script>
