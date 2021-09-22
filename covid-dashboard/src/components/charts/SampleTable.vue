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
        <h6 class="tw-font-bolder tw-mb-0">Title of Sample Table</h6>
        <p class="text-secondary tw-text-xs">Subheader for sample table, if needed</p>
        <b-table striped borderless :items="items" :fields="fields" class="table-sm tw-text-sm"></b-table>
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
  data() {
    return {
      fields: [
        {
          key: "property",
          label: "Label, if needed"
        },
        {
          key: "value",
          class: "tw-text-right"
        },
      ],
      items: [
        { property: "Some of these may have longer names", value: 234 },
        {
          property: "Some of these may have longer names or much longer",
          value: 461
        },
        { property: "Some of these may have short", value: 54 },
        { property: "Some of these may have longer names", value: 1008 },
        { property: "Some of these may have longer names", value: 67 }
      ]
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