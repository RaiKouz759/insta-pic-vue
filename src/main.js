import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'




let app = createApp(App).use(store).use(router).use(VueAxios, axios).mount('#app')

const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

app.axios.interceptors.response.use(undefined, (err) => {
    return new Promise((resolve, reject) => {
    //   console.log('error is below')
      console.log(typeof(err))
      const parseErr = {err};
      if (parseErr.err.response.status === 401) {
        // console.log(err)
        // console.log('hello there')
        app.$store.dispatch('logout')
        .then(app.$router.push('/login'));
      }
      reject(err);
    })
  })