<template>
  <div>
    <b-card header-tag="nav" v-if="ready">
      <template v-slot:header>
        <b-nav card-header tabs fill>
          <b-nav-item active>BASE</b-nav-item>
          <b-nav-item>COHORT 1</b-nav-item>
          <b-nav-item>COHORT 2</b-nav-item>
        </b-nav>
      </template>
      <b-card-text>
        <h6 class="tw-font-bolder tw-mb-0">Title of this graph</h6>
        <p class="text-secondary tw-text-xs">{{totalSubjects}} count</p>
        <doughnut-chart class="k-test" :chartdata="chartdata" :options="options"></doughnut-chart>
        <div id="enrollment-label">
          <h1 class="tw-text-4xl tw-font-bolder text-center tw-mb-0">{{ chartdata.datasets[0].data[0] }}</h1>
          <h5 class="tw-font-bolder text-center">Five</h5>
        </div>
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

import DoughnutChart from "@/components/base-charts/DoughnutChart.vue";

export default {
  mixins: [],
  components: {
    DoughnutChart
  },
  props: {},
  data: function() {
    return {
      ready: true,
      totalSubjects: 26,
      chartdata: {
        datasets: [
          {
            data: [5, 6, 7, 8],
            backgroundColor: ["#37B1CA", "#EB513E", "#fcb414", "#555"]
          }
        ],
        labels: ["Five","Six", "Seven", "Eight"]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutoutPercentage: 65,
        circumference: Math.PI,
        rotation: -Math.PI,
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 18
          }
        },
        title: {
          display: false,
          text: "Title"
        },
        tooltips: {
          bodyFontSize: 14
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
#enrollment-label {
  position: absolute;
  top: 68%;
  left: 50%;
  transform: translate(-50%, -50%);
}
nav.card-header {
  border-bottom: none;
  padding: 0.5rem 0 0 0;
}
ul.nav.nav-tabs {
  padding: 0 .5rem;
}
ul.nav.nav-tabs li.nav-item {
  font-size: 0.7rem;
}
ul.nav.nav-tabs a.nav-link {
  padding: .35rem .5rem;
}
</style>