import axios from 'axios';
import { createStore } from 'vuex'

export default createStore({
  state: {
    status : '',
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) ||
     {'username': 'null', 'user_id': 'null'}
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state, {token, user}) {
      state.status = 'success';
      state.token = token;
      state.user.username = user.username;
      state.user.user_id = user.user_id; 

    },
    auth_error(state) {
      state.status = 'error';
    },
    logout(state) {
      state.status = '';
      state.token = '';
    }
  },
  actions: {
    login({commit}, user){
      return new Promise((resolve, reject) => {
        commit('auth_request');
        // console.log(process.env.VUE_APP_LOGIN);
        axios({url: process.env.VUE_APP_LOGIN,
               data: user,
               method: 'POST'})
        .then(resp => {
          console.log(resp)
          console.log(resp.data)
          const token = resp.data.token;
          const user = resp.data.user;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
          commit('auth_success', {token, user});
          resolve(resp);
        })
        .catch(err => {
          commit('auth_error', err);
          localStorage.removeItem('token');
          err.statusCode = 401;
          console.log(err)
          reject(err);
        })
      })
    },
    logout({commit}) {
      return new Promise((resolve) => {
        commit('logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        resolve()
      })
    },
    register({commit}, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        axios({url: process.env.VUE_APP_REGISTER,
               data: user,
               method: 'POST'})
        .then(resp => {
          const token = resp.data.token;
          const user = resp.data.user;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
          commit('auth_success', {token, user});
          resolve(resp);
        })
        .catch(err => {
          commit('auth_error', err);
          localStorage.removeItem('token');
          err.statusCode = 401;
          reject(err);
        })
      })      
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    currentUser: state => state.user,
  },
  modules: {
  }
})
