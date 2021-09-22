<template>

  <div class="vw-100 min-vw-100 vh-100 min-vh-100 p-0 m-0">
    <notifications position="bottom left" />

    <LoginDialog />
    <LoadingDialog />
    <MessageDialog />

    <div class="container-fluid h-100 m-0 p-0" v-resize:throttle="onResize">
      
      <div class="h-100 row no-gutters">
        <!-- <div :class="{'col-sm-3': sidebar, 'col-md-2': sidebar, 'col-1': !sidebar}">
          <SideNavbar />
        </div>
        <div :class="{'col-sm-9': sidebar, 'col-md-10': sidebar, 'col-11': !sidebar}">
          <TopNavbar />
          <div class="w-100 h-100 p-3">
            <slot />
            <Footer />
          </div>
        </div> -->

        <div class="col-auto">
          <SideNavbar />
        </div>
        <div class="col">
          <TopNavbar />
          <div class="w-100 h-100 p-3">
            <slot />
            <Footer />
          </div>
        </div>

        <!-- <SideNavbar />
        <div class="d-inline-flex align-items-start" :class="{'': sidebar, '': !sidebar}">
          <TopNavbar />
          <div class="w-100 h-100 p-3">
            <slot />
            <Footer />
          </div>
        </div> -->
      </div>
    </div>
  </div>

</template>

<script>
/**
 * Use this template for Authenticated views.
 * NOTE: See BaseTemplate.vue for further explanation.
 */

import SideNavbar from "@/components/dashboard/SideNavbar.vue";
// import TopNavbar from "@/components/dashboard/TopNavbar.vue";
import Footer from "@/components/dashboard/Footer.vue";

import BaseDialogMixin from "@/components/mixins/BaseDialogMixin.vue";
import BaseAlertMixin from "@/components/mixins/BaseAlertMixin.vue";

import LoginDialog from "@/components/dialogs/LoginDialog.vue";
import MessageDialog from "@/components/dialogs/MessageDialog.vue";
import LoadingDialog from "@/components/dialogs/LoadingDialog.vue";

import resize from 'vue-resize-directive';

import { mapState, mapActions } from "vuex";

// import store from "@/store/store";

export default {
  mixins: [BaseDialogMixin, BaseAlertMixin],
  directives: {
    resize
  },
  components: {
    SideNavbar,
    // TopNavbar,
    // async component load
    TopNavbar: () => import('@/components/dashboard/TopNavbar.vue'),
    Footer,
    LoginDialog,
    MessageDialog,
    LoadingDialog
  },
  // beforeRouteEnter(to, from, next) {
  //   store.dispatch("setBaseComponent", "DashboardBaseTemplate");
  //   next();
  // },
  // beforeRouteUpdate(to, from, next) {
  //   this.setBaseComponent("DashboardBaseTemplate");
  //   next();
  // },
  created: function() {
    // this.setBaseComponent("DashboardBaseTemplate");
  },
  computed: {
    ...mapState(["sidebar"])
  },
  methods: {
    ...mapActions([
      "toggleSidebar"
    ]),
    // ...mapActions(["setBaseComponent"])
    onResize: function() {
      if(this.sidebar && window.outerWidth < 768) {
        this.toggleSidebar();
      } else if(!this.sidebar && window.outerWidth >= 768) {
        this.toggleSidebar();
      }
    }
  }
};
</script>

<style>
.drawer {
    display: block;
    background-color: white;
    color: #ccc;
    border-right: 1px solid gray;
    min-height: 1px;
    height: 100%;
    width: 25%;
    top: 0;
    left: 0;
    position: fixed;
    z-index: 20;
    box-shadow: 0 1px 1px rgba(0,0,0,.05);
}
</style>
