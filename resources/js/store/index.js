import Vuex from 'vuex'
import Vue from 'vue'
import axios from "axios"

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    contacts: [],
    token: localStorage.getItem('token') || '',
    status:'',
    loader:false
   
  },

  mutations:{
      setContacts(state,contacts){
          state.contacts=contacts;

      },
      authSuccess(state,token){
          state.token=token;
          state.status='success';
      },
      LOADER(state,payload){
        state.loader=payload;
      },
      
      authError(state){
          state.token='';
          state.status='error';
          localStorage.removeItem("user_id");
      },
      authLogout(state){
        state.token='';
        localStorage.removeItem("user_id");
      }
  },

  actions: {
      fetchContacts(context){
        axios.get('/contact')
          .then(response=>{
            context.commit('setContacts',response.data.data)
            // this.contacts=response.data.data;
          })

      },
      login(context, payload) {

        return new Promise((resolve,reject)=>{

          axios.post('/auth/login', payload)
            .then((response) => {
              console.log(response.data);
              let accessToken = response.data.access_token;
              let user_id = response.data.user_id;
              context.commit('authSuccess', accessToken)
              localStorage.setItem('token', accessToken);
              localStorage.setItem('user_id', user_id)
              axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;

              resolve(response);

            })
            .catch((error) => {
              localStorage.removeItem('token');
              context.commit('authError')
              reject(error);
            })

        })
         
      },
     
      register(context, payload) {

        return new Promise((resolve,reject)=>{

          axios.post('/auth/signup', payload)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              localStorage.removeItem('token');
              context.commit('authError')
              reject(error);
            })

        })
         
      },

      logout(context){
        return new Promise((resolve)=>{
            context.commit('authLogout')
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'] ;

            resolve();


        })
      }

  },


  getters: {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    menus:(state,getters)=>{
      if(getters.isAuthenticated){
        return [
          {name: "Users", route: "Users"},
          {name: "Logout", route: "Logout"},
        ]
      }
      return [
        { name: "Signup", route: "Signup" },
        { name: "Login", route: "Login" },
      ];
    }
  }




})