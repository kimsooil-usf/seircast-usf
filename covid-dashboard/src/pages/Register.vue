<template>
    <b-container fluid class="h-100">
        <div class="h-25"></div>
        <b-row class="my-3">
            <b-col sm="12" md="6" offset-md="3">
                <b-form-input size="lg" v-model="form.name" placeholder="Name"></b-form-input>
            </b-col>
        </b-row>

        <b-row class="my-3">
            <b-col sm="6" md="3" offset-md="3">
                <b-form-input size="lg" v-model="form.email" placeholder="Email"></b-form-input>
            </b-col>
            <b-col sm="6" md="3">
                <b-form-input size="lg" v-model="form.username" placeholder="Username"></b-form-input>
            </b-col>
        </b-row>

        <b-row class="my-3">
            <b-col sm="6" md="3" offset-md="3">
                <b-form-input type="password" size="lg" v-model="form.password" placeholder="Password"></b-form-input>
            </b-col>
            <b-col sm="6" md="3">
                <b-form-input type="password" size="lg" v-model="form.confirm_password" placeholder="Confirm Password">
                </b-form-input>
            </b-col>
        </b-row>

        <b-row class="my-3">
            <b-col sm="6" md="3" offset-md="3">
                <b-button class="mt-2" variant="primary" block size="lg" @click="register()">Sign Up</b-button>
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
    
    import BaseTemplate from '@/layouts/BaseTemplate.vue'

    export default {
        mixins: [BaseTemplate],
        data: () => ({
            form: {
                name: '',
                email: '',
                username: '',
                password: '',
                confirm_password: ''
            }
        }),
        methods: {
            register: function () {
                let that = this;
                that.alert = false;

                if (!that.$data.form.email.trim()) {
                    that.$notify({
                        text: 'Please enter a valid email.',
                        duration: 10000,
                        type: 'error'
                    });

                    return;
                }

                if (!that.$data.form.username.trim()) {
                    that.$notify({
                        text: 'Please enter a username 3.',
                        duration: 10000,
                        type: 'error'
                    });

                    return;
                }

                if (!that.$data.form.password.trim() && (that.$data.form.password.trim() !== that.$data.form
                        .confirm_password.trim())) {
                    that.$notify({
                        text: 'Passwords do not match.',
                        duration: 10000,
                        type: 'error'
                    });

                    return;
                }

                HTTP.post('/users/api/register/', that.$data.form).then(() => {
                    that.$notify({
                        text: 'You have been registered. Please sign in.',
                        duration: 10000,
                        type: 'success'
                    });
                }).catch(() => {
                    that.$notify({
                        text: 'Could not sign you up.',
                        duration: 10000,
                        type: 'error'
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