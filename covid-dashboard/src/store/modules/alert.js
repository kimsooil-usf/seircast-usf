/**
 * NOTE: NOT BEING USED AT THE MOMENT. WILL BE REMOVED IN THE FUTURE.
 */

function AlertMessage(id, type, message, life) {
    this.id = id;
    this.type = type;
    this.message = message;
    this.life = life;
}

export default {
    namespaced: true,
    state: {
        alerts: []
    },
    getters: {},
    mutations: {
        setAlerts(state, alerts) {
            state.alerts = alerts;
        },
        setAlert(state, alert) {
            state.alerts.push(alert['id']);
            // console.log(JSON.stringify(alert));
        },
        updateAlerts(state, payload) {
            state.alerts[payload.index].life = payload.life;
        },
        removeAlert(state, index) {
            if(state.alerts.length >= index) {
                state.alerts.splice(index, 1);
            }
        },
        clearAlerts(state) {
            state.alerts = [];
        }
    },
    actions: {
        setSuccess({ commit }, payload) {
            // console.log(payload);
            commit('setAlert', new AlertMessage({
                id: (new Date()).getTime(),
                type: 'success',
                message: payload.message,
                life: payload.life ? payload.life : 30
            }));
        },
        setInfo({ commit }, payload) {
            commit('setAlert', new AlertMessage({
                id: (new Date()).getTime(),
                type: 'info',
                message: payload.message,
                life: payload.life ? payload.life : 30
            }));
        },
        setWarning({ commit }, payload) {
            commit('setAlert', new AlertMessage({
                id: (new Date()).getTime(),
                type: 'warning',
                message: payload.message,
                life: payload.life ? payload.life : 30
            }));
        },
        setError({ commit }, payload) {
            commit('setAlert', new AlertMessage({
                id: (new Date()).getTime(),
                type: 'error',
                message: payload.message,
                life: payload.life ? payload.life : 30
            }));
        },
        removeAlert({commit}, index) {
            commit('removeAlert', index);
        },
        clearAlerts({ commit }) {
            commit('clearAlerts');
        },
        recalculateAlerts({commit, state}) {
            const ids = [];
            state.alerts.map((alert, index) => {
                if(alert.life !== -9999) {
                    commit('updateAlert', {index: index, life: alert.life -= 1});
                }

                if(alert.life > -9999 && alert.life <= 0) {
                    ids.push(alert.id);
                }
            });
            var alerts = state.alerts.filter(alert => ids.indexOf(alert.id) > -1);
            commit('setAlerts', alerts);
        }
    },
}