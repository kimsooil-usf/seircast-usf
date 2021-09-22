export default {
  namespaced: true,
  state: {
    loginDialog: false,

    messageTypes: ['success', 'info', 'warning', 'error'],
    messageDialog: false,
    messageType: '',
    messageDialogMessage: 'An error occured!',

    loadingDialog: false,
    loadingDialogMessage: 'Loading',
    loadingDialogPercent: 0,
    provisionProgressBar: false,
    provisionPercent: 0

  },
  getters: {

  },
  mutations: {
    showLoginDialog(state) {
      state.loginDialog = true;
    },
    hideLoginDialog(state) {
      state.loginDialog = false;
    },

    showMessageDialog(state, payload) {
      state.messageDialogMessage = payload.message;
      
      if(state.messageTypes.indexOf(payload.messageType) >= 0) {
        state.messageType = payload.messageType;
      } else {
        state.messageType = state.messageTypes[1];
      }

      state.messageDialog = true;
    },
    hideMessageDialog(state) {
      state.messageDialog = false;
      state.messageDialogMessage = '';
    },

    showLoadingDialog(state, message = '') {
      state.loadingDialogMessage = message;
      state.loadingDialog = true;
      state.loadingDialogPercent = 0;
      state.provisionProgressBar = false;
      state.provisionPercent = 0;
    },
    hideLoadingDialog(state) {
      state.loadingDialogPercent = 100;
      state.loadingDialog = false;
      state.loadingDialogMessage = '';
      state.loadingDialogPercent = 0;
      state.provisionProgressBar = false;
      state.provisionPercent = 0;
    },
    updateLoadingDialog(state, percent) {
      state.loadingDialogPercent = percent;
    },
    showProvisionProgressBar(state) {
      state.provisionProgressBar = true;
    },
    hideProvisionProgressBar(state) {
      state.provisionProgressBar = false;
    },
    updateProvisionPercent(state, percent) {
      state.provisionPercent = percent;
    },
    updateLoadingDialogMessage(state, message) {
      state.loadingDialogMessage = message;
    }
  },
  actions: {
    showLoginDialog({
      commit
    }) {
      commit('showLoginDialog');
    },
    hideLoginDialog({
      commit
    }) {
      commit('hideLoginDialog');
    },

    showMessageDialog({commit}, payload) {
      commit('showMessageDialog', payload);
    },
    hideMessageDialog({
      commit
    }) {
      commit('hideMessageDialog');
    },

    showLoadingDialog({
      commit
    }, message = 'Please stand by...') {
      commit('showLoadingDialog', message);
    },
    hideLoadingDialog({
      commit
    }) {
      setTimeout(() => {
        commit('hideLoadingDialog');
      }, 500);
    }

  }
}