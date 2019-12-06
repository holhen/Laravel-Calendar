import Vue from 'vue'
import App from './Main'
import router from './router/index'
import Vuetify from 'vuetify'
import axios from 'axios'
import 'vuetify/dist/vuetify.min.css';
import store from './store/index'
import vuetify from './plugins/vuetify';

window.axios=axios

window.token= localStorage.getItem('token');
window.user= localStorage.getItem('user');

axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.headers.common['Authorization'] = "Bearer " + window.token;

axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.use(Vuetify)

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app")
