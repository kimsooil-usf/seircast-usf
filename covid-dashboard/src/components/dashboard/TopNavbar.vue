<template>
  <!-- <div class="m-0 t-0 border-bottom border-bottom-dark">
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav>
        <b-nav-item @click="toggleSidebar()">
          <i class="fas tw-text-2xl" :class="{'fa-bars': !sidebar, 'fa-angle-double-left': sidebar, }"></i>
        </b-nav-item>
      </b-navbar-nav>
      <b-navbar-brand :to="{name: 'home'}" href="#" class="tw-ml-3">CRC BVCC</b-navbar-brand>
        <b-navbar-nav>
          <b-nav-item>About</b-nav-item>
          <b-nav-item :to="{name: 'dashboard'}" active="true">Data Portal</b-nav-item>
        </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right no-caret="true">
          <template slot="button-content">
            <i class="fas fa-user-circle tw-text-2xl"></i>
          </template>
          <b-dropdown-item :to="{name: 'user'}">Profile</b-dropdown-item>
          <b-dropdown-item @click="logout()">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
  </div> -->

  <div class="m-0 t-0 border-bottom border-bottom-dark">
    <b-navbar type="light" variant="light">
      <b-navbar-nav>
        <b-nav-item @click="toggleSidebar()" class="side-bar-toggle">
          <i
            class="fas tw-text-2xl"
            :class="{'fa-bars': !sidebar, 'fa-angle-double-left': sidebar, }"
          ></i>
        </b-nav-item>
        <b-nav-form v-if="!loading">
          <label class="h3 text-secondary mx-md-2" for="inline-select-region"><i class="fas fa-globe-americas"></i></label>
          <b-form-select
                  id="inline-select-region"
                  :options="getRegions.regions"
                  v-model="selectedRegion"
          ></b-form-select>
        </b-nav-form>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown v-if="isAuthenticated" right :no-caret="true">
          <template slot="button-content">
            <i class="fas fa-user-circle tw-text-2xl"></i>
          </template>
          <b-dropdown-item :to="{name: 'change-password'}">Change Password</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item @click="logout()">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item v-else :to="{ name: 'login', query: { next: $route.path } }">
            <b-button size="sm" variant="outline-secondary">Sign In</b-button>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      drawer: true,
    };
  },
  computed: {
    ...mapState("user", ["user"]),
    ...mapState(["sidebar"]),
    ...mapGetters(['isAuthenticated']),
    ...mapGetters('covid', ['getRegions', 'getMetadata']),
    loading () {
      return Object.keys(this.getMetadata).length === 0;
    },
    selectedRegion: {
      get () {
        return this.$store.state.covid.ui.selectedRegion;
      },
      set (value) {
        this.setSelectedRegion(value);
      }
    }
  },
  watch: {
    // loading (newValue) {
    //   if (!newValue) {
    //     this.selectedRegion = this.getRegions.default_region;
    //   }
    // }
  },
  methods: {
    ...mapActions([
      "setBaseComponent",
      "clearAuthorizationToken",
      "toggleSidebar"
    ]),
    ...mapActions("user", ["setUser"]),
    ...mapMutations('covid', ['setSelectedRegion']),
    goTo(route) {
      this.$router.push(route);
    },
    toggle: function() {
      this.drawer = !this.drawer;
    },
    logout: function() {
      this.clearAuthorizationToken();
      this.setUser({});

      this.$notify({
        text: "You have been logged out",
        duration: 10000,
        type: "warn"
      });

      /*this.$router.push({
        name: "home"
      });*/
      window.location.href = window.location.origin;
    }
  }
};
</script>

<style>
.side-bar-toggle {
  display: inline-block;
}

@media (max-width: 767.98px) { 
  .side-bar-toggle {
    display: none;
  }
}
</style>
