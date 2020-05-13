import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import UserProfile from './components/Profile'
//import Home from './components/Home'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(Router);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

export default new Router({
    mode: 'history',
    routes: [
        //{path: '/', component: Home},
        {path: '/login', component: Login},
        {path: '/register', component: Register},
        {path: '/profile', component: UserProfile},
        // otherwise redirect to home
        { path: '*', redirect: '/login' }
    ]
});