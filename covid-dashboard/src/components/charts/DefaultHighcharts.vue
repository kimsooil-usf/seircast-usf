<template>
  <div>
    <b-card header-tag="nav">
      <!--<template v-slot:header>
        <b-nav card-header tabs fill>
          <b-nav-item active>BASE</b-nav-item>
          <b-nav-item>COHORT 1</b-nav-item>
          <b-nav-item>COHORT 2</b-nav-item>
        </b-nav>
      </template>-->
      <b-card-text>
        <h6 class="tw-font-bolder tw-mb-0">{{ title }}</h6>
        <!-- <p class="text-secondary tw-text-sm">Out of 1800 selected for Baseline</p> -->
        <p class="text-secondary tw-text-xs">
          COVID-19 cases forecast
        </p>
        <Highcharts :options="options"></Highcharts>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
// import { HTTP } from "@/utilities/http-common";
// import HandleErrors from "@/utilities/handle-errors";

// import {
//     mapState, mapGetters, mapActions
// } from 'vuex';

export default {
  mixins: [],
  components: {
  },
  // todo accept starting date
  props: {
    counties: {
      type: Array,
      default: () => []
    },
    // reported: Object,
    reported: {
      type: Object,
      default: () => ({
        confirmed: [],
        positive: [],
        deceased: []
      })
    },
    forecast: {
      type: Object,
      default: () => ({
        confirmed: [],
        positive: [],
        deceased: []
      })
    },
    // loading: Boolean
  },
  data() {
    return {
      options: {
        title: {
          text: undefined
        },

        yAxis: {
          title: {
            text: 'Number of Cases'
          }
        },

        xAxis: {
          title: {
            text: 'Date'
          },
          type: 'datetime',
          accessibility: {
            rangeDescription: 'Range: 2010 to 2017'
          }
        },

        /*legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },*/

        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            pointStart: Date.UTC(2020, 2, 19),
            pointInterval: 24 * 3600 * 1000 // one day
          }
        },

        series: [{
          type: 'spline',
          name: 'Tested positive: Q+R+D (fitted)',
          marker: {
            enabled: false
          },
          pointInterval: 24 * 3600 * 1000 / 10, // tenth of a day
          data: this.forecast.confirmed
        },
        {
          type: 'spline',
          name: 'Tested positive minus Deceased: Q+R (fitted)',
          marker: {
            enabled: false
          },
          pointInterval: 24 * 3600 * 1000 / 10, // tenth of a day
          data: this.forecast.confirmed
        },
        {
          type: 'spline',
          name: 'Deceased (fitted)',
          marker: {
            enabled: false
          },
          pointInterval: 24 * 3600 * 1000 / 10, // tenth of a day
          data: this.forecast.deceased
        },
        {
          type: 'scatter',
          name: 'Tested positive (reported)',
          data: this.reported.confirmed
        }, {
          type: 'scatter',
          name: 'Tested positive minus deceased (reported)',
          data: this.reported.positive
        }, {
          type: 'scatter',
          name: 'Deceased (reported)',
          data: this.reported.deceased
        }],

        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        },

        credits: {
          enabled: false
        }
      }
    };
  },
  computed: {
    // ...mapState('sample', ['sample'])
    title () {
      if (this.counties.length > 1) {
        return `${this.counties.join(', ')} Counties`;
      } else if (this.counties.length) {
        return `${this.counties.join()} County`;
      }
      return 'All Counties';
    }
  },
  created: function() {},
  mounted: function() {
    this.get();
  },
  methods: {
    get: function() {},
    find: function() {},
    create: function() {},
    patch: function() {},
    update: function() {},
    delete: function() {}
  }
};
</script>

<style>
nav.card-header {
  border-bottom: none;
  padding: 0.5rem 0 0 0;
}
ul.nav.nav-tabs {
  padding: 0 0.5rem;
}
ul.nav.nav-tabs li.nav-item {
  font-size: 0.7rem;
}
ul.nav.nav-tabs a.nav-link {
  padding: 0.35rem 0.5rem;
}
</style>
