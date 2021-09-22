<template>

  <b-modal v-model="loadingDialog" centered no-close-on-esc no-close-on-backdrop hide-header hide-header-close hide-footer>
    <div class="text-center">
      <div><b-spinner style="width: 3rem; height: 3rem;" class="mb-2" :variant="spinnerVariant" label="Text Centered"></b-spinner></div>
      <b-progress v-if="provisionProgressBar" height="2px">
        <b-progress-bar variant="warning" :value="provisionPercent * 0.2"></b-progress-bar>
        <b-progress-bar variant="primary" :value="loadingDialogPercent * 0.8"></b-progress-bar>
      </b-progress>
      <b-progress v-else height="2px" :value="loadingDialogPercent"></b-progress>
      <div>{{loadingDialogMessage}}</div>
      <br>
      <b-container fluid>
          <b-button class="mt-3" block @click="backToFlorida()">
              This is taking too long. Take me back!
          </b-button>
      </b-container>
    </div>
  </b-modal>

</template>

<script>
  import {
      mapMutations,
    mapState
  } from 'vuex';

  export default {
    data() {
      return {
        dialog: false,
      }
    },
    computed: {
      ...mapState('dialog', ['loadingDialog', 'loadingDialogMessage', 'loadingDialogPercent', 'provisionProgressBar', 'provisionPercent']),
      spinnerVariant () {
        return this.provisionProgressBar && this.loadingDialogPercent <= 0 ? 'warning' : 'primary';
      }
    },
    methods: {
        ...mapMutations('dialog', ['hideLoadingDialog']),
        backToFlorida() {
            window.location.assign(`http://${window.location.host}${window.location.pathname}`);
        }
    }
  }
</script>