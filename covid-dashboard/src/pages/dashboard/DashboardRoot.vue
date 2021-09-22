<template>
  <DashboardBaseTemplate>
    <!-- <keep-alive> -->
      <router-view></router-view>
    <!-- </keep-alive> -->
  </DashboardBaseTemplate>
</template>

<script>
import DashboardBaseTemplate from "@/layouts/DashboardBaseTemplate.vue";

export default {
  mixins: [DashboardBaseTemplate],
  components: {
    DashboardBaseTemplate
  }
};
</script>

<style>
</style>
