<template>
  <b-container fluid class="h-100">
    <div class="h-25"></div>

    <b-row class="my-3">
      <b-col sm="12" md="6" offset-md="3">
        <b-form-input
          type="password"
          size="lg"
          v-model="form.new_password1"
          placeholder="New Password"
        ></b-form-input>
      </b-col>
    </b-row>

    <b-row class="my-3">
      <b-col sm="12" md="6" offset-md="3">
        <b-form-input
          type="password"
          size="lg"
          v-model="form.new_password2"
          placeholder="Confirm Password"
        ></b-form-input>
      </b-col>
    </b-row>

    <b-row class="my-3">
      <b-col sm="6" md="3" offset-md="3">
        <b-button class="mt-2" variant="primary" block size="lg" @click="changePassword()">Change</b-button>
      </b-col>
      <b-col sm="6" md="3">
        <b-button class="mt-2" variant="warning" block size="lg" @click="cancel()">Cancel</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { HTTP } from "@/utilities/http-common";

// import { mapGetters, mapActions, mapState } from "vuex";

import DashboardBaseTemplate from "@/layouts/DashboardBaseTemplate.vue";

export default {
  mixins: [DashboardBaseTemplate],
  data: () => ({
    form: {
      new_password1: "",
      new_password2: "",
      uid: "",
      token: ""
    }
  }),
  methods: {
    changePassword: function() {
      let that = this;

      // Check that there is a password and that they match.
      if (!that.$data.form.new_password1.trim() && that.$data.form.new_password1.trim() !== that.$data.form.new_password2.trim()) {
        that.$notify({
          text: "New passwords do not match.",
          duration: 10000,
          type: "error"
        });

        return;
      }

      // Get the uid and token from the query parameters.
      that.$data.form.uid = that.$route.query.uidb64;
      that.$data.form.token = that.$route.query.token;

      HTTP.post("/users/api/reset-password/", that.$data.form).then(() => {
          that.$notify({
            text: "Password reset.",
            duration: 10000,
            type: "success"
          });

          that.$router.push({ name: "user" });
        }).catch(error => {
          // If: An error has been reported by the token.
          // ElseIf: Password errors from Django come from new_password2.
          // Else: Unknown error.
          if ("token" in error.response.data) {
            that.$notify({
              text: "Token is not valid.",
              duration: 10000,
              type: "error"
            });
          } else if ("new_password2" in error.response.data) {
            error.response.data.new_password2.forEach(function(item) {
              that.$notify({
                text: item,
                duration: 10000,
                type: "error"
              });
            });
          } else {
            that.$notify({
              text: "Unknown error occurred.",
              duration: 10000,
              type: "error"
            });
          }
        });
    },
    cancel: function() {
      this.$router.push({
        name: "user"
      });
    }
  }
};
</script>