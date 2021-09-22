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
        <h6 class="tw-font-bolder tw-mb-0 text-center">Title of Single Number</h6>
        <p class="text-secondary tw-text-xs text-center">Subheader for single number, if needed</p>
        <h1
          class="tw-text-5xl tw-font-bolder text-center tw-mb-0"
        >234</h1>
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