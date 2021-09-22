<template>
  <div>
    <b-card header-tag="nav">
      <template v-slot:header>
        <b-nav card-header tabs fill>
          <b-nav-item active>BASE</b-nav-item>
          <b-nav-item>COHORT 1</b-nav-item>
          <b-nav-item>COHORT 2</b-nav-item>
        </b-nav>
      </template>
      <b-card-text>
        <h6 class="tw-font-bolder tw-mb-0">Title of Sample Bar Chart</h6>
        <!-- <p class="text-secondary tw-text-sm">Out of 1800 selected for Baseline</p> -->
        <p class="text-secondary tw-text-xs">
          Subheader for sample bar, if needed
        </p>
        <bar-chart
          :chartdata="clinicVisits.chartdata"
          :options="clinicVisits.options"
        ></bar-chart>
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

import BarChart from "@/components/base-charts/BarChart.vue";

export default {
  mixins: [],
  components: {
    BarChart
  },
  props: {},
  data() {
    return {
      clinicVisits: {
        chartdata: {
          datasets: [
            {
              label: "Core",
              backgroundColor: "#37B1CA",
              data: [45, 23]
            },
            {
              label: "Buffer",
              backgroundColor: "#a3d2e0",
              data: [42, 20]
            },
            {
              label: "Total",
              backgroundColor: "#18487c",
              data: [87, 43]
            }
          ],
          labels: ["Sub Comps", "Ento Comps"]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 18
            }
          },
          title: {
            display: false,
            text: "Clinic Visits"
          },
          animation: {
            animateScale: true,
            animateRotate: true
          },
          scales: {
            xAxes: [
              {
                stacked: false,
                gridLines: {
                  display: false
                }
              }
            ],
            yAxes: [
              {
                stacked: false,
                gridLines: {
                  display: false
                },
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      }
    };
  },
  computed: {
    // ...mapState('sample', ['sample'])
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

#bar-chart {
    height: 240px!important;
}
</style>
