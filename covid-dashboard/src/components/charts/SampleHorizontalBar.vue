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
        <h6 class="tw-font-bolder tw-mb-0">Title of Sample Horizontal Bar Chart</h6>
        <!-- <p class="text-secondary tw-text-sm">Out of 1800 selected for Baseline</p> -->
        <p class="text-secondary tw-text-xs">
          Subheader for sample horizontal bar, if needed
        </p>
        <horizontal-bar
          :chartdata="clinicVisits.chartdata"
          :options="clinicVisits.options"
        ></horizontal-bar>
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

import HorizontalBar from "@/components/base-charts/HorizontalBarChart.vue";

export default {
  mixins: [],
  components: {
    HorizontalBar
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
              barThickness: 20,
              barPercentage: 0.5,
              stack: "Stack 0",
              data: [5, 10, 8, 5, 6, 4, 8, 6]
            },
            {
              label: "Buffer",
              backgroundColor: "#ddd",
              barThickness: 20,
              barPercentage: 0.5,
              stack: "Stack 0",
              data: [10, 4, 8, 5, 6, 4, 8, 6]
            },
          ],
        labels: ["Ento1", "Ento2", "Ento3", "Ento4", "Ento5", "Ento6", "Ento7", "Ento8"]
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
                  stacked: true,
                gridLines: {
                  display: false
                }
              }
            ],
            yAxes: [
              {
                
                stacked: true,
                gridLines: {
                  display: false
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
</style>
