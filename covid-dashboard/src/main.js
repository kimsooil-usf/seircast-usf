import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import Notifications from 'vue-notification'
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsMaps from 'highcharts/modules/map.js';
import HighchartsExporting from 'highcharts/modules/exporting';
import AllowNegativeLog from '@/plugins/allow-negative-log';
import VueHighcharts  from 'vue-highcharts';
import VueGtag from 'vue-gtag';

import BaseTemplate from '@/layouts/BaseTemplate.vue';
import BlankBaseTemplate from '@/layouts/BlankBaseTemplate.vue';
import DashboardBaseTemplate from '@/layouts/DashboardBaseTemplate.vue';

Vue.config.productionTip = false;

Vue.use(Notifications);
AllowNegativeLog(Highcharts);
HighchartsMore(Highcharts);
HighchartsMaps(Highcharts);
HighchartsExporting(Highcharts);
Vue.use(VueHighcharts);
Vue.use(VueGtag, { config: { id: process.env.VUE_APP_GTAG }}, router);

// export default function (Vue, { head, router, isServer }) {
  
// }

Vue.component('BaseTemplate', BaseTemplate);
Vue.component('BlankBaseTemplate', BlankBaseTemplate);
Vue.component('DashboardBaseTemplate', DashboardBaseTemplate);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
