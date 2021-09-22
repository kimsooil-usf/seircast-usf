<template>
    <div class="h-100">
        <h1>{{title}}</h1>

        <div class="text-left">
            <SampleComponent title="Sample Component called with method 1." />
            <hr>
            <sample-component title="Sample Component called with method 2."></sample-component>
        </div>
    </div>
</template>

<script>
    // import {
    //     HTTP
    // } from '@/utilities/http-common';
    // import HandleErrors from '@/utilities/handle-errors';
    
    import {
        mapState,
        // mapGetters,
        // mapActions
    } from 'vuex';
    import SampleComponent from '@/components/SampleComponent.vue';

    export default {
        mixins: [
            // BaseTemplate,
            // DashboardBaseTemplate
        ],
        components: {
            SampleComponent
        },
        data: function () {
            return {
                title: 'Example Component Page'
            }
        },
        computed: {
            ...mapState('sample', ['sample']),
            // ...mapGetters('sample', ['nameOfGetter'])
        },
        created: function () {

        },
        mounted: function () {

        },
        methods: {
            // ...mapActions('sample', ['nameOfAction']),
            get: function () {
                // HTTP.get('/').then((response) => {
                //     let something = response.data;
                // }).catch((error) => {
                //     HandleErrors.HandleErrors(error);
                // });
            },
            find: function () {

            },
            create: function () {

            },
            patch: function () {

            },
            update: function () {

            },
            delete: function () {

            }
        }
        // beforeRouteEnter(to, from, next) {
        //     // called before the route that renders this component is confirmed.
        //     // does NOT have access to `this` component instance,
        //     // because it has not been created yet when this guard is called!
        // },
        // beforeRouteUpdate(to, from, next) {
        //     // called when the route that renders this component has changed,
        //     // but this component is reused in the new route.
        //     // For example, for a route with dynamic params `/foo/:id`, when we
        //     // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
        //     // will be reused, and this hook will be called when that happens.
        //     // has access to `this` component instance.
        // },
        // beforeRouteLeave(to, from, next) {
        //     // called when the route that renders this component is about to
        //     // be navigated away from.
        //     // has access to `this` component instance.
        // },
    }
</script>
