<template>
  <div class="w-100 h-100 p-0 m-0">
    <div class="container-fluid w-100 h-100 m-0 p-0">
      <div class="h-100 row no-gutters">
        <div :class="{'col-sm-3': sidebar, 'col-md-2': sidebar, '': !sidebar}" v-if="sidebar">
          <SideNavbar />
        </div>
        <div :class="{'col-sm-9': sidebar, 'col-md-10': sidebar, 'col-12': !sidebar}">
          <TopNavbar />
          <div class="w-100 h-100 p-3">
            <!-- <router-view></router-view> -->
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
/**
 * Use this template for Authenticated views.
 * NOTE: See BaseTemplate.vue for further explanation.
 */

import SideNavbar from "@/components/dashboard/SideNavbar.vue";
import TopNavbar from "@/components/dashboard/TopNavbar.vue";
import Footer from "@/components/dashboard/Footer.vue";

import BaseDialogMixin from "@/components/mixins/BaseDialogMixin.vue";
import BaseAlertMixin from "@/components/mixins/BaseAlertMixin.vue";

import { mapActions, mapState } from "vuex";

import store from "@/store/store";

export default {
  mixins: [BaseDialogMixin, BaseAlertMixin],
  components: {
    SideNavbar,
    TopNavbar,
    Footer
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch("setBaseComponent", "DashboardBaseTemplate");
    next();
  },
  beforeRouteUpdate(to, from, next) {
    this.setBaseComponent("DashboardBaseTemplate");
    next();
  },
  created: function() {
    this.setBaseComponent("DashboardBaseTemplate");
  },
  computed: {
    ...mapState(["sidebar"])
  },
  methods: {
    ...mapActions(["setBaseComponent"])
  }
};
</script>

<style>
</style>
