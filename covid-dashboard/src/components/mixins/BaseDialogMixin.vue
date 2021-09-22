<script>
    /**
     * Purpose of this file is to include the actions for login/message/loading dialogs and alerts.
     * Any class that extends this one has those functions already included and don't need to include them individually.
     */

    import {
        mapActions
    } from 'vuex';

    export default {
        methods: {
            ...mapActions('dialog', [
                'showLoginDialog',
                'hideLoginDialog',
                'showMessageDialog',
                'hideMessageDialog',
                'showLoadingDialog',
                'hideLoadingDialog'
            ])
        }
    }
</script>