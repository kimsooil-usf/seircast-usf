<template>
  <!-- <div class="h-100 sidebar">
        <div class="sidebar-sticky">
            <ul class="nav flex-column">
                <li class="nav-item">
                    <b-link class="nav-link" :to="{name: 'dashboard'}">
                        <b-img src="../../assets/crc-logo-full.png" fluid alt="logo"></b-img>
                    </b-link>
                </li>
            </ul>
            <hr>
           <ul class="nav flex-column">
               <li class="nav-item">
                    <b-dropdown-header class="sidebar-heading pl-3">
                        <i class="fas fa-user"></i>
                        Account
                    </b-dropdown-header>
                </li>
                <li class="nav-item">
                    <b-link class="nav-link" :to="{name: 'user'}">
                        Profile
                    </b-link>
                </li>
                <li class="nav-item">
                    <b-link class="nav-link" :to="{name: 'change-password'}">
                        Change Password
                    </b-link>
                </li>
            </ul>
        </div>
    </div> -->

  <div class="sidebar" :class="{ expanded: sidebar }">
    <div class="sidebar-sticky">
      <b-link :to="{ name: 'home' }">
        <b-img
          v-if="sidebar"
          src="../../assets/logo-full.png"
          fluid
          alt="logo"
        ></b-img>
        <b-img v-else src="../../assets/logo.png" fluid alt="logo"></b-img>
      </b-link>
      <br />

      <div v-for="(section, section_index) in menu" :key="section.title">
        <ul class="nav flex-column" v-if="sidebar">
          <li class="nav-item">
            <b-dropdown-header class="sidebar-heading">
              <span style="font-size: 100%" v-if="section.icon">
                  <i class="fas" :class="[section.icon]"></i>
              </span>
              <span v-if="sidebar">
                  {{ section.title }}
              </span>
            </b-dropdown-header>
          </li>
          <li class="nav-item" v-for="link in section.links" :key="link.title">
            <b-link class="nav-link" :to="{ name: link.name }">
              {{ link.title }}
            </b-link>
          </li>
        </ul>

        <ul class="nav flex-column" v-if="!sidebar">
          <li class="nav-item">
            <b-dropdown-header class="sidebar-heading">
              <i class="fas fa-2x" :class="[section.icon]"></i>
            </b-dropdown-header>
          </li>
        </ul>

        <hr v-if="section_index < menu.length - 1" />
      </div>

      <div class="container-fluid m-0 p-0">
          <div class="row m-0 p-0" v-for="(section/*, section_index*/) in menu" :key="section.title">
              <div class="text-center" :class="{'col': sidebar, 'col mx-0 py-1 border-top p-0': !sidebar}">
                  <i class="fas fa-lg" :class="[section.icon]"></i>
              </div>
              <div class="col" v-if="sidebar">
                  {{ section.title }}
              </div>
          </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      drawer: true,
      menu: [
        {
          title: "Dashboard",
          icon: "fa-th-large",
          collapsible: true,
          links: [{ title: "Main", name: "dashboard", params: {}, query: {} }]
        },
        {
          title: "Examples",
          icon: "fa-th-large",
          collapsible: true,
          links: [
            { title: "Components", name: "components", params: {}, query: {} },
            { title: "Map", name: "map", params: {}, query: {} },
            { title: "Charts", name: "charts", params: {}, query: {} }
          ]
        },
        {
          title: "User",
          icon: "fa-user",
          collapsible: true,
          links: [{ title: "Profile", name: "user", params: {}, query: {} }]
        },
        {
          title: "Manage",
          icon: "fa-users",
          collapsible: false,
          links: [{ title: "Users", name: "users", params: {}, query: {} }]
        }
      ]
    };
  },
  computed: {
    ...mapState("user", ["user"]),
    ...mapState(["sidebar"])
  },
  methods: {
    ...mapActions(["setBaseComponent", "clearAuthorizationToken"]),
    ...mapActions("user", ["setUser"]),
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

      this.$router.push({
        name: "home"
      });
    }
  }
};
</script>

<style>
.sidebar {
  /* width: 250px;
        max-width: 250px; */
  min-width: 50px;
  max-width: 50px;
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: white;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
  padding: 2px;
  /* transition: all 0.6s cubic-bezier(0.945, 0.02, 0.27, 0.665);
  transform-origin: bottom left; */
  -webkit-transition: all 2s; /* For Safari 3.1 to 6.0 */
  transition: all 2s;
  transform-origin: bottom left;
}
.sidebar.expanded {
  min-width: 250px;
  max-width: 250px;
  /* transform: rotateY(100deg); */
}
.sidebar .nav-link {
  font-size: 0.9rem;
  font-weight: 400;
  color: #666;
  line-height: 1.3;
  outline: 0;
}

.sidebar .nav-link .feather {
  margin-right: 4px;
  color: #999;
}

.sidebar .nav-link.router-link-active {
  color: #333; /* #007bff; */
  font-weight: 500;
  background: rgba(0, 0, 0, 0.075);
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
  color: inherit;
}

.sidebar-heading {
  font-size: 0.9rem;
  text-transform: uppercase;
  color: #333;
  font-weight: 600;
  text-align: center;
}

.dynamic-list-items {
    width: 250px;
}

@media (max-width: 767.98px) { 
  .dynamic-list-items {
    width: 50px;
}
}
</style>
