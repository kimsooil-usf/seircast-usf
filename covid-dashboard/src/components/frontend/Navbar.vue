<template>
  <b-navbar toggleable="md" fixed="top" type="dark" variant="dark">
    <b-container>
      <b-navbar-brand :to="{name: 'home'}">CRC BVCC</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{name: 'about'}">About</b-nav-item>
          <b-nav-item :to="{name: 'dashboard'}">Data Portal</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right :no-caret="true">
            <template slot="button-content">
              <i class="fas fa-user-circle tw-text-2xl"></i>
            </template>
            <b-dropdown-item
              :to="{name: 'login', query: { next: '/dashboard'}}"
              v-if="!user.email"
            >Sign In</b-dropdown-item>
            <b-dropdown-item :to="{name: 'register'}" v-if="!user.email">Sign Up</b-dropdown-item>
            <b-dropdown-item :to="{name: 'dashboard'}" v-if="user.email">Data Portal</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("user", ["user"])
  },
  methods: {
    toggle: function() {
      this.drawer = !this.drawer;
    }
  }
};
</script>

<style>
</style>