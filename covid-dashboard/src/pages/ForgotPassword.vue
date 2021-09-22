<template>
    <b-container fluid class="h-100">
        <div class="h-25"></div>
        <b-row class="my-3">
            <b-col sm="12" md="6" offset-md="3">
                <b-form-input type="email" size="lg" v-model="form.email" placeholder="Email"></b-form-input>
            </b-col>
        </b-row>

        <b-row>
            <b-col sm="6" md="3" offset-md="3">
                <b-button class="mt-2" variant="primary" block size="lg" @click="sendEmail()">Send Email</b-button>
            </b-col>
            <b-col sm="6" md="3">
                <b-button class="mt-2" variant="warning" block size="lg" @click="cancel()">Cancel</b-button>
            </b-col>
        </b-row>

    </b-container>
</template>

<script>
    import {
        HTTP
    } from '@/utilities/http-common';
    
    import store from '@/store/store';
    import BaseTemplate from '@/layouts/BaseTemplate.vue'

    export default {
        mixins: [BaseTemplate],
        beforeRouteEnter(to, from, next) {
            if (store.getters.isAuthenticated) {
                next({
                    name: 'dashboard'
                });
            } else {
                next();
            }
            next();
        },
        data: () => ({
            form: {
                email: ''
            }
        }),
        methods: {
            sendEmail: function () {
                let that = this;

                if (!that.$data.form.email.trim()) {
                    that.$notify({
                        text: 'Please enter valid email.',
                        duration: 10000,
                        type: 'success'
                    });

                    return;
                }

                HTTP.post('/users/api/forgot-password/', that.$data.form).then(() => {
                    that.$notify({
                        text: 'Email sent. Check your email for reset code.',
                        duration: 10000,
                        type: 'success'
                    });

                    that.$router.push({
                        name: 'home'
                    });
                }).catch(() => {
                    that.$notify({
                        text: 'Account with email not found.',
                        duration: 10000,
                        type: 'success'
                    });
                });
            },
            cancel: function () {
                this.$router.push({
                    name: 'home'
                });
            }
        }
    }
</script>