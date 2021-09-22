<template>
  <div class="w-100 h-100">
    <b-table striped hover :fields="fields" :items="users">
      <template slot="[name]" slot-scope="data">
        <b-link :to="{name: 'edit-user', params: {userId: data.item.id}}">{{ data.value ? data.value : data.item.email }}</b-link>
      </template>
    </b-table>
  </div>
</template>

<script>
import { HTTP } from "@/utilities/http-common";
// import HandleErrors from "@/utilities/handle-errors";

import DashboardBaseTemplate from "@/layouts/DashboardBaseTemplate.vue";

// import { mapActions, mapState } from "vuex";

export default {
  mixins: [DashboardBaseTemplate],
  data: function() {
    return {
      fields: [
        { key: "name" },
        { key: "email" },
        { key: "username" },
        { key: "is_staff", label: "Admin" }
      ],
      users: []
    };
  },
  computed: {},
  mounted: function() {
    let that = this;
    HTTP.get("/users/api/admin-users/").then(response => {
      that.users = response.data;
    });
  },
  methods: {}
};
</script>

<style>
</style>