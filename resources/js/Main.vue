<template>
  <v-app>
    <v-container fluid>
    <v-toolbar>
    <v-toolbar-title><v-btn text :to="{name:'Home'}">{{title}}</v-btn></v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text exact  v-for="(menu,index) in menus" :key='index' :to={name:menu.route}>
         {{menu.name}}
       </v-btn>


    </v-toolbar-items>
  </v-toolbar>
    </v-container>

  <router-view></router-view>

  <loader></loader>
  </v-app>
</template>

<script>
import Loader from './components/partials/_loader'
import {mapGetters} from 'vuex'
import axios from "axios"
export default {
  components:{Loader},
  data () {
    return {
      title:"Calendar",
      loader:true

    }
  },
  name: 'App',
  computed:mapGetters(['isAuthenticated','menus']),

  created(){

    axios.interceptors.request.use( (config)=> {
    // Do something before request is sent
    this.$store.commit('LOADER',true);
    return config;
  },  (error)=> {
    // Do something with request error
    this.$store.commit('LOADER',false);

    return Promise.reject(error);
  });

    axios.interceptors.response.use((response)=>{
       this.$store.commit('LOADER',false);
      return response;

      }, (err)=> {
    return new Promise( ()=> {
        this.$store.dispatch('logout').then(()=>{
          this.$router.push('/login')
        })
      throw err;
    });
  });

  }


}
</script>
