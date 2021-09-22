<template>
  <div class="w-100 h-100 text-center">
    <h1 class="display-2">{{title}}</h1>
    <p>{{sample}}</p>
    <p>{{prop}}</p>
  </div>
</template>

<script>
// import {
//     HTTP
// } from '@/utilities/http-common';
// import HandleErrors from '@/utilities/handle-errors';

import BaseTemplate from "@/layouts/BaseTemplate.vue";
import { mapState } from "vuex";
// import DashboardBaseTemplate from '@/layouts/DashboardBaseTemplate.vue'

export default {
  mixins: [
    BaseTemplate
    // DashboardBaseTemplate
  ],
  components: {},
  props: {
    prop: {
      type: String,
      required: false,
      default: "Sample prop"
    }
  },
  data: function() {
    return {
      title: "Sample Page"
    };
  },
  computed: {
    ...mapState("sample", ["sample"])
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
    patch: function() {},
    delete: function() {}
  }
  // beforeRouteEnter(to, from, next) {
  //     // called before the route that renders this component is confirmed.
  //     // does NOT have access to `this` component instance,
  //     // because it has not been created yet when this guard is called!
  // },
  // beforeRouteUpdate(to, from, next) {
  //     // called when the route that renders this component has changed,
  //     // but this component is reused in the new route.
  //     // For example, for a route with dynamic params `/foo/:id`, when we
  //     // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
  //     // will be reused, and this hook will be called when that happens.
  //     // has access to `this` component instance.
  // },
  // beforeRouteLeave(to, from, next) {
  //     // called when the route that renders this component is about to
  //     // be navigated away from.
  //     // has access to `this` component instance.
  // },
};
</script>
