<template>
    <b-container fluid class="h-100">
        <div class="h-25"></div>

        <b-row class="my-3">
            <b-col sm="12" md="6" offset-md="3">
                <b-form-input type="password" size="lg" v-model="form.old_password" placeholder="Password"></b-form-input>
            </b-col>
        </b-row>

        <b-row class="my-3">
            <b-col sm="12" md="6" offset-md="3">
                <b-form-input type="password" size="lg" v-model="form.new_password1" placeholder="New Password">
                </b-form-input>
            </b-col>
        </b-row>

        <b-row class="my-3">
            <b-col sm="12" md="6" offset-md="3">
                <b-form-input type="password" size="lg" v-model="form.new_password2"
                    placeholder="Confirm Password"></b-form-input>
            </b-col>
        </b-row>

        <b-row class="my-3">
            <b-col sm="6" md="3" offset-md="3">
                <b-button class="mt-3" variant="primary" block size="lg" @click="changePassword()">Change</b-button>
            </b-col>
            <b-col sm="6" md="3">
                <b-button class="mt-3" variant="outline-primary" block size="lg" @click="cancel()">Cancel</b-button>
            </b-col>
        </b-row>

    </b-container>
</template>

<script>
    import {
        HTTP
    } from '@/utilities/http-common';
    
    import DashboardBaseTemplate from '@/layouts/DashboardBaseTemplate.vue'

    export default {
        mixins: [DashboardBaseTemplate],
        data: () => ({
            form: {
                old_password: '',
                new_password1: '',
                new_password2: ''
            }
        }),
        methods: {
            changePassword: function () {
                let that = this;

                if (!that.$data.form.old_password.trim()) {
                    that.$notify({
                        text: 'Please enter your current password.',
                        duration: 10000,
                        type: 'error'
                    });

                    return;
                }

                if (!that.$data.form.new_password1.trim() && (that.$data.form.new_password1.trim() !== that.$data.form.new_password2.trim())) {
                    that.$notify({
                        text: 'New passwords do not match.',
                        duration: 10000,
                        type: 'error'
                    });

                    return;
                }

                HTTP.post('/users/api/change-password/', that.$data.form).then(() => {
                    that.$notify({
                        text: 'Password changed.',
                        duration: 10000,
                        type: 'success'
                    });

                    that.$router.push({
                        name: 'dashboard'
                    });
                }).catch((error) => {
                    if ("old_password" in error.response.data) {
                        that.$notify({
                            text: "Your old password was entered incorrectly. Please enter it again.",
                            duration: 10000,
                            type: "error"
                        });
                    } else if ("new_password2" in error.response.data) {
                        error.response.data.new_password2.forEach(function(item) {
                            that.$notify({
                                text: item,
                                duration: 10000,
                                type: "error"
                            });
                        });
                    } else {
                        that.$notify({
                            text: "Unknown error occurred.",
                            duration: 10000,
                            type: "error"
                        });
                    }
                });
            },
            cancel: function () {
                this.$router.push({
                    name: 'dashboard'
                });
            }
        }
    }
</script>