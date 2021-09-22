<template>
  <BaseTemplate>
    <b-jumbotron header="About" lead="A template VueJS + Bootstrap for quickly starting up new VueJS." :fluid="true"></b-jumbotron>

  </BaseTemplate>
</template>

<script>
// @ is an alias to /src
import BaseTemplate from "@/layouts/BaseTemplate.vue";

export default {
  name: "about",
  mixins: [BaseTemplate],
  components: {
    BaseTemplate
  }
};
</script>