<template>
<div>
  <v-row align="center">
    <v-card
      class="mx-auto"
      max-width="400"
      tile
    >
      <v-list>
        <v-subheader>REPORTS</v-subheader>
        <v-list-item-group v-model="count" color="primary">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
          >
            <v-list-item-content>
              <v-list-item-title v-html="item.name" @click="handleClick(item.id)"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-row>
  <v-row align="center">
  <v-card
    class="mx-auto"
    max-width="400"
  >
    <v-img
      class="white--text align-end"
      height="200px"
      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
    >
      <v-card-title>{{title}}</v-card-title>
    </v-img>

    <v-card-subtitle class="pb-0">{{subtitle}}</v-card-subtitle>

    <v-card-text class="text--primary">
      <div>Group Id</div>

      <div>{{text}}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="orange"
        text
      >
        Share
      </v-btn>

      <v-btn
        color="orange"
        text
      >
        Explore
      </v-btn>
    </v-card-actions>
  </v-card>
  </v-row>
</div>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            items: [],
            count: 0,
            title: '',
            subtitle: '',
            text: ''
        }
    },
    mounted() {
        axios.get("http://localhost:8000/users")
            .then(response => {
                console.log(response.data);
                this.items = response.data;
                this.count = this.items.length;
            })
    },
    methods: {
        handleClick(id) {
            /*axios.get(`http://localhost:8000/users/${id}`)
                .then(response => {
                    console.log(response.data.team_id);
                    this.title = response.data.name;
                    this.subtitle = response.data.email;
                    this.text = response.data.team_id;
                })*/
            const user = this.items.find(user => user.id === id);
            this.title = user.name;
            this.subtitle = user.email;
            this.text = user.team.name;
            localStorage.setItem("user_id", user.id);
        }
    }
}
</script>