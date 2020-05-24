import Vue from 'vue'
import App from './App.vue'

import router from './index';
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import VueSocialSharing from 'vue-social-sharing'

Vue.use(VueSocialSharing);
Vue.use(Buefy);

Vue.config.productionTip = false;


new Vue({
  render: h => h(App),
  router,
  methods: {
    methodThatForcesUpdate() {
      this.$forceUpdate();
    }
  }
}).$mount('#app');
