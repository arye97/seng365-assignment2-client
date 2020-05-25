import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import UserProfile from './components/Profile'
import About from './components/About'
import Petitions from './components/Petitions'
import EditProfile from './components/EditProfile'
import PetitionDetails from './components/PetitionDetails'
import CreatePetition from "./components/CreatePetition";
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import VueSocialSharing from 'vue-social-sharing'
import EditPetition from "./components/EditPetition";

Vue.use(VueSocialSharing);
Vue.use(Buefy);
Vue.use(Router);


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
        {path: '/petitions/create', component: CreatePetition},
        {path: '/petitions/:id', component: PetitionDetails},
        {path: '/petitions/:id/edit', component: EditPetition},


        // otherwise redirect to home
        { path: '*', redirect: '/login' }
    ]
});