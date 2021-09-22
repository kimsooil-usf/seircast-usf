import {
    HTTP
} from '@/utilities/http-common';

export default {
    namespaced: true,
    state: {
        user: {},
        myGroups: []
    },
    getters: {},
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setMyGroups(state, groups) {
            state.myGroups = groups;
        }
    },
    actions: {
        setUser({
            commit
        }, user) {
            commit('setUser', user);
        },
        getUser() {
            return HTTP.get('/users/api/me/');
        },
        getMyGroups() {
            return HTTP.get('/users/api/user-groups/');
        },
        setMyGroups({ commit }, groups) {
            commit('setMyGroups', groups);
        }
    },
}