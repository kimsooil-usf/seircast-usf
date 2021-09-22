<template>
    <div class="tw-bg-orange-100 tw-border-l-4 tw-border-orange-200 tw-text-orange-dark tw-p-4" role="alert">
        <p class="tw-font-bold">{{title}}</p>
        <p>{{text}}</p>
    </div>
</template>

<script>
    // import {
    //     HTTP
    // } from '@/utilities/http-common';
    // import HandleErrors from '@/utilities/handle-errors';

    // import {
    //     mapState, mapGetters, mapActions
    // } from 'vuex';
    
    export default {
        mixins: [

        ],
        components: {

        },
        props: {
            title: {
                type: String,
                required: false,
                default: "Sample Component"
            }
        },
        data: function () {
            return {
                text: 'This is an example of a component.'
            }
        },
        computed: {
            // ...mapState('sample', ['sample'])
        },
        created: function () {

        },
        mounted: function () {

        },
        methods: {
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
    }
</script>
