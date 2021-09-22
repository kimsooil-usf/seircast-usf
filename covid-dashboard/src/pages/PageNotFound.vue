<template>
    <div class="h-75 mx-auto text-center">
        <div class="h-25"></div>
        <h1 class="title-404">404</h1>
        <h1 class="display-4 font-weight-bold text-uppercase">Page Not Found!</h1>
        <p class="text-muted text-uppercase">
            You must have taken a wrong turn.
        </p>

        <b-container>
            <b-row>
                <b-col class="col-12 col-md-8 offset-md-2">
                    <b-button size="lg" variant="secondary" class="mx-5 w-25" @click="goBack()">Go Back</b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import BlankBaseTemplate from '@/layouts/BlankBaseTemplate.vue'

    export default {
        mixins: [BlankBaseTemplate],
        methods: {
            goBack: function () {
                this.$router.go(-1);
            }
        }
    }
</script>

<style>
    .title-404 {
        font-size: 210px;
        font-weight: 900;
        line-height: 210px;
    }
</style>
