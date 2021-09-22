<template>
    <div class="w-100 h-100 p-0 m-0 mx-auto">
        <Navbar />
        <router-view style="margin-top:60px"></router-view>
        <Footer />
    </div>
</template>

<script>
    /**
     * Represents the base template for a given view.
     * Sets itself as the base component used in App.vue 'getBaseComponent'.
     * Use this template for Frontend (i.e. views that don't require login) views.
     * NOTE: This view structucture can be replicated however many times to create different base templates (see DashboardBaseTemplate.vue).
     * 
     * Includes the Alert component to set alerts at the desired spot.
     * 
     * Includes BaseDialogMixin that adds the dialog functions to this view and children (inherited) views.
     * Includes BaseAlertMixin that adds the alert functions to this view and children (inherited) views.
     */

    import Navbar from '@/components/frontend/Navbar.vue'
    import Footer from '@/components/frontend/Footer.vue'

    import BaseDialogMixin from '@/components/mixins/BaseDialogMixin.vue';
    import BaseAlertMixin from '@/components/mixins/BaseAlertMixin.vue';

    import store from '@/store/store';
    
    import {
        mapActions
    } from 'vuex';

    export default {
        mixins: [BaseDialogMixin, BaseAlertMixin],
        components: {
            Navbar,
            Footer
        },
        beforeRouteEnter(to, from, next) {
            // this.setBaseComponent('BaseTemplate.vue');
            store.dispatch('setBaseComponent', 'BaseTemplate');
            next();
        },
        beforeRouteUpdate(to, from, next) {
            this.setBaseComponent('BaseTemplate');
            next();
        },
        created: function () {
            this.setBaseComponent('BaseTemplate');
        },
        methods: {
            ...mapActions(['setBaseComponent'])
        }
    }
</script>

<style>

</style>