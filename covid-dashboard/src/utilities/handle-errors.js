import store from '@/store/store';

export default {
    HandleErrors (error, message = 'Error occured!') {
        if(error.response) {
            if(error.response.status === 401 || error.response.status === 403) {
                store.dispatch('dialog/showLoginDialog');
            } else if(error.response.status === 404) {
                store.dispatch({
                    type: 'dialog/showMessageDialog',
                    messageType: 'error',
                    message: 'Resource not found!'
                });
            } else if(error.response.data && 'message' in error.response.data) {
                store.dispatch({
                    type: 'dialog/showMessageDialog',
                    messageType: 'error',
                    message: error.response.data['message']
                });
            } else {
                store.dispatch({
                    type: 'dialog/showMessageDialog',
                    messageType: 'error',
                    message: message
                });
            }
        } else if(error.request) {
            store.dispatch({
                type: 'dialog/showMessageDialog',
                messageType: 'error',
                message: 'Request error!'
            });
        } else {
            store.dispatch({
                type: 'dialog/showMessageDialog',
                messageType: 'error',
                message: 'Unknown error occured!'
            });
        }
    },
}