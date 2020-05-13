import Vue from 'vue'
import App from './App.vue'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import router from './index';
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)

Vue.config.productionTip = false;


new Vue({
  render: h => h(App),
  router
}).$mount('#app');

/* Token for authentication */
export const tokenStore = {
  state: {
    token: null
  },
  setToken(newToken) {
    tokenStore.state.token = newToken
  }
};