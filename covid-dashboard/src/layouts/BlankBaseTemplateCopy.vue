<template>
    <div class="w-75 h-100 p-0 m-0 mx-auto">
        <router-view></router-view>
    </div>
</template>

<script>
    /**
     * Use this template for views that just need a blank page..
     * NOTE: See BaseTemplate.vue for further explanation.
     */

    import BaseDialogMixin from '@/components/mixins/BaseDialogMixin.vue';
    import BaseAlertMixin from '@/components/mixins/BaseAlertMixin.vue';

    import {
        mapActions
    } from 'vuex';

    import store from '@/store/store';

    export default {
        mixins: [BaseDialogMixin, BaseAlertMixin],
        components: {},
        beforeRouteEnter(to, from, next) {
            // this.setBaseComponent('BlankBaseTemplate.vue');
            store.dispatch('setBaseComponent', 'BlankBaseTemplate');
            next();
        },
        beforeRouteUpdate(to, from, next) {
            this.setBaseComponent('BlankBaseTemplate');
            next();
        },
        created: function () {
            this.setBaseComponent('BlankBaseTemplate')
        },
        methods: {
            ...mapActions(['setBaseComponent'])
        }
    }
</script>

<style>

</style>