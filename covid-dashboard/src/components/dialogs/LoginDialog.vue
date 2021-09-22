<template>
    
    <b-modal v-model="loginDialog" centered no-close-on-esc no-close-on-backdrop hide-header-close hide-footer>
        <template v-slot:modal-header>
            <h5>Sign In</h5>
            <b-button
                    variant="secondary"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSd1d7KcUyPwQ4veb79sGFM8au7TqPGeCYdSrC_gsnvIuS8ceg/viewform?usp=sf_link"
            >
                Apply for an Account
            </b-button>
        </template>
        <b-container fluid>

            <b-row class="my-3">
                <b-col sm="12">
                    <b-form-input size="lg" v-model="payload.username" placeholder="Identity"></b-form-input>
                </b-col>
            </b-row>

            <b-row class="my-3">
                <b-col sm="12">
                    <b-form-input type="password" size="lg" v-model="payload.password" placeholder="Password" @keypress.enter="login()"></b-form-input>
                </b-col>
            </b-row>

        </b-container>

        <b-button class="mt-3" variant="primary" block size="lg" @click="login()">Sign In</b-button>
        <b-button class="mt-2" variant="outline-primary" block size="lg" @click="cancel()">Cancel</b-button>
        
        <div class="mt-3 text-center">
            <b-link class="mt-2" @click="forgotPassword()">Forgot Password</b-link>
        </div>
    </b-modal>
</template>

<script>
    import {
        HTTP
    } from '@/utilities/http-common';

    import HandleErrors from "@/utilities/handle-errors";

    import {
        mapGetters,
        mapActions,
        mapState,
        mapMutations
    } from 'vuex';

    export default {
        props: {
            next: {
                type: String,
                default: ''
            }
        },
        data: () => ({
            payload: {
                username: '',
                password: '',
                grant_type: process.env.VUE_APP_GRANT_TYPE,
                client_id: process.env.VUE_APP_CLIENT_ID,
                client_secret: process.env.VUE_APP_CLIENT_SECRET
            },
            dialog: true,
            alert: false
        }),
        computed: {
            ...mapState('dialog', ['loginDialog']),
            ...mapGetters([
                'getAuthorizationToken',
                'getAuthorizationHeader',
                'hasAuthorizationToken'
            ])
        },
        methods: {
            ...mapActions(['setAuthorizationToken', 'setBaseComponent']),
            ...mapActions('dialog', ['hideLoginDialog']),
            ...mapActions('alert', ['setSuccess', 'setError']),
            ...mapActions('user', ['setUser', 'getUser', 'setMyGroups', 'getMyGroups']),
            ...mapMutations('covid', ['clearPredictions']),
            login: function () {
                let that = this;
                that.alert = false;

                if (!that.$data.payload.username.trim() || !that.$data.payload.password.trim()) {
                    that.alert = true;
                    return;
                }

                // Attempt a login
                HTTP.post('/users/api/token/', that.$data.payload).then(response => {
                    // Set token, updated HTTP with the Authorization token and set the base component to the 'Back' template.
                    that.setAuthorizationToken(response.data);
                    that.clearPredictions();
                    
                    that.$notify({
                        text: 'You have been logged in',
                        duration: 10000,
                        type: 'success'
                    });

                    // HTTP.defaults.headers.common['Authorization'] = 'test';
                    that.getUser().then(res => {
                        that.setUser(res.data);
                    }).catch(() => {}).finally(() => {
                        that.hide();

                        // Navigate to next if set, otherwise, go to user page.
                        if (that.$route.query.next) {
                            that.$router.push({
                                path: that.$route.query.next
                            });
                        } else {
                            that.$router.go();// Reload the page.
                        }
                    });
                that.getMyGroups().then(response => {
                    that.setMyGroups(response.data)
                }).catch(error => {
                    HandleErrors.HandleErrors(error);
                });
                }).catch(() => {
                    that.alert = true;
                    that.payload.password = "";
                });
            },
            hide: function () {
                this.payload.username = "";
                this.payload.password = "";
                this.alert = false;
                this.hideLoginDialog()
            },
            cancel: function () {
                this.hide();
                this.$router.go(-1);
            },
            forgotPassword: function () {
                this.hide();

                this.$router.push({
                    name: 'forgot-password'
                });
            },
            
        }
    }
</script>