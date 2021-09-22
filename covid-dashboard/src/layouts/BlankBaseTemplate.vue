<template>
  <!-- <div class="w-75 h-100 p-0 m-0 mx-auto">
        
  </div>-->

  <div class="vw-100 min-vw-100 vh-100 min-vh-100 p-0 m-0">
    <notifications position="bottom left" />

    <LoginDialog />
    <LoadingDialog />
    <MessageDialog />

    <slot />
  </div>
</template>

<script>
/**
 * Use this template for views that just need a blank page..
 * NOTE: See BaseTemplate.vue for further explanation.
 */

import BaseDialogMixin from "@/components/mixins/BaseDialogMixin.vue";
import BaseAlertMixin from "@/components/mixins/BaseAlertMixin.vue";

import LoginDialog from "@/components/dialogs/LoginDialog.vue";
import MessageDialog from "@/components/dialogs/MessageDialog.vue";
import LoadingDialog from "@/components/dialogs/LoadingDialog.vue";

import { mapActions } from "vuex";

import store from "@/store/store";

export default {
  mixins: [BaseDialogMixin, BaseAlertMixin],
  components: {
    LoginDialog,
    MessageDialog,
    LoadingDialog
  },
  beforeRouteEnter(to, from, next) {
    // this.setBaseComponent('BlankBaseTemplate.vue');
    store.dispatch("setBaseComponent", "BlankBaseTemplate");
    next();
  },
  beforeRouteUpdate(to, from, next) {
    this.setBaseComponent("BlankBaseTemplate");
    next();
  },
  created: function() {
    this.setBaseComponent("BlankBaseTemplate");
  },
  methods: {
    ...mapActions(["setBaseComponent"])
  }
};
</script>

<style>
</style>