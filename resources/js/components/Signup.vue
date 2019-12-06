<template>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Signup form</v-toolbar-title>
                <v-spacer></v-spacer>
               
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" v-model="name" label="Name" type="text"></v-text-field>
                  <v-text-field prepend-icon="email" v-model="email" label="Email" type="email"></v-text-field>
                  <v-text-field prepend-icon="group" v-model="group" label="Group" type="text"></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" v-model="password" label="Password" type="password"></v-text-field>
                  <v-text-field id="password_confimation" prepend-icon="lock" v-model="password_confirmation" label="Confirm Password" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" type='submit' @click='registerUser'>Signup</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
</template>

<script>  
export default {
    data(){
      return {
        email:null,
        name:null,
        password:null,
        password_confirmation: null,
        group:null
      }
    },
    methods: {
      registerUser(){
        this.$store.dispatch('register',{name:this.name,email:this.email,password:this.password,password_confirmation:this.password_confirmation,group:this.group}).then(()=>{
            this.$router.push('/');
        })
        
      }
    }
}
</script>