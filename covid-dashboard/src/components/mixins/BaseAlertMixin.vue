<script>
    /**
     * Purpose of this file is to include the actions for login/message/loading dialogs and alerts.
     * Any class that extends this one has those functions already included and don't need to include them individually.
     * 
     * NOTE: NOT BEING USED AT THE MOMENT. WILL BE REMOVED IN THE FUTURE.
     */

    import {
        mapActions
    } from 'vuex';

    export default {
        methods: {
            ...mapActions('alert', [
                'setSuccess',
                'setInfo',
                'setWarning',
                'setError',
                'removeAlert',
                'clearAlerts',
                'recalculateAlerts'
            ])
        }
    }
</script>