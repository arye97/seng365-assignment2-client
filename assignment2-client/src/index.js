import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import UserProfile from './components/Profile'
import About from './components/About'
import Petitions from './components/Petitions'
import EditProfile from './components/EditProfile'


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
        {path: '/about', component: About},
        {path: '/petitions', component: Petitions},
        {path: '/profile/edit', component: EditProfile},
        // otherwise redirect to home
        { path: '*', redirect: '/login' }
    ]
});