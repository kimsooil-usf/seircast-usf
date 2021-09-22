<template>
  <!-- <div class="vw-100 min-vw-100 vh-100 min-vh-100 p-0 m-0">
    <notifications position="bottom left" />

    <LoginDialog />
    <LoadingDialog />
    <component :is="getBaseComponent"></component>
  </div> -->

  <router-view></router-view>
</template>

<script>
  /**
   * Entry point of VJS.
   * Dynamically accepts a 'view' (base component) that effectively acts as a template for a given view.
   * Contains global components that are used throughout the application.
   */

  // Include the base templates that will replace the 'getBaseComponent'.
  // import BaseTemplate from '@/layouts/BaseTemplate.vue';
  // import DashboardBaseTemplate from '@/layouts/DashboardBaseTemplate.vue';
  

  // Include the global Login/Message/Loading dialogs.
  // import LoginDialog from '@/components/dialogs/LoginDialog.vue';
  // import MessageDialog from '@/components/dialogs/MessageDialog.vue';
  // import LoadingDialog from '@/components/dialogs/LoadingDialog.vue';

  import {
    mapGetters,
    mapActions
  } from 'vuex';

  export default {
    // Set the base templates and dialogs as components.
    components: {
      // BaseTemplate,
      // DashboardBaseTemplate,
      // BlankBaseTemplate,
      // LoginDialog,
      // MessageDialog,
      // LoadingDialog
    },
    computed: {
      // Map the base component getters and is authenticated getters.
      ...mapGetters([
        'getBaseComponent',
        'isAuthenticated'
      ])
    },
    methods: {
      // Map the base template actions.
      ...mapActions([
        'setBaseComponent'
      ])
    }
  }
</script>


<style lang="scss">
@import 'assets/css/custom.scss';
</style>