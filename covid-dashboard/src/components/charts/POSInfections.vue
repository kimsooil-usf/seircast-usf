<template>
  <b-card tag="article" class="mb-2 tw-shadow">
    <b-card-title class="tw-text-xl d-flex justify-content-between align-items-center">
      POS Infections
      <b-button variant="link" class="pr-0">DETAILS</b-button>
    </b-card-title>
    <b-card-text>
      <doughnut-chart :chartData="chartdata" :options="options" class="k-test"></doughnut-chart>
      <h1 class="tw-text-5xl tw-font-semibold text-center">
        95
        <span class="tw-text-2xl tw-font-normal">of 1055</span>
      </h1>
    </b-card-text>
  </b-card>
</template>

<script>
// import { HTTP } from "@/utilities/http-common";
// import HandleErrors from "@/utilities/handle-errors";

// import {
//     mapState, mapGetters, mapActions
// } from 'vuex';

import DoughnutChart from "@/components/base-charts/DoughnutChart.vue";

export default {
  mixins: [],
  components: {
    DoughnutChart
  },
  props: {},
  data: function() {
    return {
      chartdata: {
        datasets: [
          {
            data: [95, 960],
            backgroundColor: ["red", "gray"]
          }
        ],
        labels: ["Infected", "Remaining"]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        circumference: Math.PI,
        rotation: -Math.PI,
        legend: {
          position: ""
        },
        title: {
          display: false,
          text: "POS Infections"
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    };
  },
  computed: {
    // ...mapState('sample', ['sample'])
  },
  created: function() {},
  mounted: function() {},
  methods: {
    get: function() {
      // HTTP.get('/').then((response) => {
      //     let something = response.data;
      // }).catch((error) => {
      //     HandleErrors.HandleErrors(error);
      // });
    },
    find: function() {},
    create: function() {},
    patch: function() {},
    update: function() {},
    delete: function() {}
  }
};
</script>