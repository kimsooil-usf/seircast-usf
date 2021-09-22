import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'

import Register from './pages/Register.vue'
import ForgotPassword from './pages/ForgotPassword.vue'

import DashboardRoot from './pages/dashboard/DashboardRoot.vue';
import Dashboard from './pages/dashboard/Dashboard.vue';
import UserProfile from './pages/user/UserProfile.vue';
import ChangePassword from './pages/user/ChangePassword.vue';
import ResetPassword from '@/pages/ResetPassword.vue';
import EditUser from './pages/user/admin/EditUser.vue';
// import Users from './pages/user/admin/Users.vue';

// import Sample from '@/pages/sample/Sample.vue'
import Components from '@/pages/Components.vue'
import Map from '@/pages/Map.vue'
import Charts from '@/pages/Charts.vue'
import ResourcePlans from "@/pages/ResourcePlans.vue";

import PageNotFound from './pages/PageNotFound.vue';

import store from './store/store';

Vue.use(Router)

store.dispatch('initApp');

/*store.dispatch('user/getUser').then(res => {
  store.dispatch('user/setUser', res.data);
});

store.dispatch('user/getMyGroups').then(res => {
  store.dispatch('user/setMyGroups', res.data);
});*/

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/oldhome',
      name: 'oldhome',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( /* webpackChunkName: "about" */ './pages/About.vue')
    },
    {
      path: '/login/',
      name: 'login',
      component: Login
    },
    {
      path: '/register/',
      name: 'register',
      component: Register
    },
    {
      path: '/forgot-password/',
      name: 'forgot-password',
      component: ForgotPassword
    },
    {
      path: '/reset-password/',
      name: 'reset-password',
      component: ResetPassword
    },
    /*{
      path: '/sample/',
      name: 'sample',
      component: Sample
    },*/
    {
      path: '/',
      // name: 'home',
      component: DashboardRoot,
      /*meta: {
        requiresAuth: true
      },*/
      children: [{
          path: '',
          name: 'dashboard',
          component: Charts
        },
        {
          path: 'user',
          name: 'user',
          component: UserProfile
        },
        {
          path: 'components',
          name: 'components',
          component: Components
        },
        {
          path: 'plans',
          name: 'plans',
          component: ResourcePlans
        },
        {
          path: 'map',
          name: 'map',
          component: Map
        },
        {
          path: 'charts',
          name: 'charts',
          component: Dashboard
        },
        {
          path: 'edit-user/:userId',
          name: 'edit-user',
          component: EditUser
        },
        /*{
          path: 'users',
          name: 'users',
          component: Users
        },*/
        {
          path: 'change-password',
          name: 'change-password',
          component: ChangePassword
        }
      ]
    },
    {
      path: '*',
      name: 'not-found',
      component: PageNotFound
    }
  ]
});

/*router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next();
    } else {
      next({
        name: 'login',
        query: {
          next: to.fullPath
        }
      });
    }
  } else {
    next();
  }
});*/

export default router;