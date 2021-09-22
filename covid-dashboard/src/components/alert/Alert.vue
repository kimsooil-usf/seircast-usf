<template>
    <div>
        <v-alert v-for="alert in alerts" :key="alert.id" :value="alert.message" :type="alert.type" dismissible>
            {{alert.message}}
        </v-alert>
    </div>
</template>

<script>
    import {
        mapState,
        mapActions
    } from 'vuex'
import { setInterval } from 'timers';

    export default {
        data() {
            return {}
        },
        computed: {
            ...mapState('alert',
                ['alerts']
            )
        },
        mounted() {
            var that = this;
            
            setInterval(function() {
                that.recalculateAlerts();
                // console.log(JSON.stringify(that.alerts[0]));
            }, 5000)
        },
        methods: {
            ...mapActions('alert', ['clearAlerts', 'recalculateAlerts'])
        }
    }
</script>

<style>

</style>
