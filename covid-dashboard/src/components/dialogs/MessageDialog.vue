<template>
  <!-- <v-layout justify-center>
    <v-dialog v-model="messageDialog" max-width="350">
      <template v-slot:activator="{ on }">
      </template>
      

      <v-card>
        <v-card-title class="headline">Error</v-card-title>
        <v-card-text>{{messageDialogMessage}}</v-card-text>
        <v-card-actions>
          <v-btn color="primary" block text @click="hideMessageDialog">Dismiss</v-btn>
        </v-card-actions>
      </v-card>


      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          <span v-if="messageType == 'success'" Class="green--text">Success</span>
          <span v-if="messageType == 'info'" Class="aqua--text">Info</span>
          <span v-if="messageType == 'warning'" Class="yellow--text">Warning</span>
          <span v-if="messageType == 'error'" Class="red--text">Danger</span>
        </v-card-title>

        <v-card-text>
          {{messageDialogMessage}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog = false">
            I accept
          </v-btn>
          <v-btn color="primary" block text @click="hideMessageDialog">Dismiss</v-btn>
        </v-card-actions>
      </v-card>




    </v-dialog>
    <div></div>
  </v-layout> -->
  <div></div>


  <!-- <b-modal id="modal-no-backdrop" hide-backdrop content-class="shadow" title="BootstrapVue">
    <p class="my-2">
      We've added the utility class <code>'shadow'</code>
      to the modal content for added effect.
    </p>
  </b-modal> -->
</template>

<script>
  import {
    mapState,
    mapActions
  } from 'vuex';

  export default {
    data() {
      return {
        dialog: false,
      }
    },
    computed: {
      ...mapState('dialog', ['messageType','messageDialog', 'messageDialogMessage'])
    },
    methods: {
      ...mapActions('dialog', ['hideMessageDialog'])
    }
  }
</script>