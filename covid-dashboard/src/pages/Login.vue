<template>
    <BlankBaseTemplate>
        
    </BlankBaseTemplate>
</template>

<script>
    import BaseDialogMixin from '@/components/mixins/BaseDialogMixin.vue';

    export default {
        mixins: [BaseDialogMixin],
        components: {},
        mounted: function () {
            this.showLoginDialog();
        },
        beforeRouteLeave: function (to, from, next) {
          // Hide the dialog if the user presses the browser back button
          this.hideLoginDialog();
          next();
        }
    }
</script>

<style>

</style>