<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import huLocale from '@fullcalendar/core/locales/hu'
import moment from "moment"
import axios from "axios"

export default {
  components: {
    FullCalendar 
  },
  data() {
    return {
      calendarPlugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin ],
      events:[],
      header: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
      },
      locales: [huLocale],
      dialog: false,
      id: 0,
      title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      allDay: false,
      startDateMenu: false,
      startTimeMenu: false,
      endDateMenu: false,
      endTimeMenu: false,
      creating: false
    }
  },
  methods: {
    handleSelect(info) {
      this.id = 0;
      this.title = '';
      this.creating = true;
      this.startDate = moment(info.start).format("YYYY-MM-DD");
      this.endDate = moment(info.end).format("YYYY-MM-DD");
      this.startTime = moment(info.start).format("hh:mm");
      this.endTime = moment(info.end).format("hh:mm");
      this.allDay = info.allDay;
      this.dialog = true;
    },
    handleSave() {
      this.dialog = false;
      const user_id = localStorage.getItem("user_id");
      if(this.creating){
        axios.post(`/fullcalendar/create/${user_id}`, {
          title: this.title,
          start: `${this.startDate} ${this.startTime}`,
          end: `${this.endDate} ${this.endTime}`,
          allDay: this.allDay
        })
        .then(response => {
          console.log(response.data);
          this.events.push(response.data);
        })
        .catch(error => console.log(error));
      }
      else {
        axios.post(`/fullcalendar/update/${user_id}`, {
          id: this.id,
          title: this.title,
          start: `${this.startDate} ${this.startTime}`,
          end: `${this.endDate} ${this.endTime}`,
          allDay: this.allDay
        })
        .then(response => {
          console.log(response);
          const calendarApi = this.$refs.calendar.getApi();
          const event = calendarApi.getEventById(this.id);
          event.setDates(`${this.startDate}T${this.startTime}`, `${this.endDate}T${this.endTime}`, this.allDay);
          event.setProp('title', this.title);
        })
        .catch(error => console.log(error));
      }
    },
    handleEventClick(info) {
      this.id = info.event.id;
      this.title = info.event.title;
      this.allDay = info.event.allDay;
      this.creating = false;
      this.startDate = moment(info.event.start).format("YYYY-MM-DD");
      this.endDate = moment(info.event.end).format("YYYY-MM-DD");
      this.startTime = moment(info.event.start).format("hh:mm");
      this.endTime = moment(info.event.end).format("hh:mm");
      this.dialog = true;
    },
    handleDelete() {
      this.dialog=false;
      const user_id = localStorage.getItem("user_id");
      axios.post(`/fullcalendar/delete/${user_id}`, {
        id: this.id
      })
      .then(() => {
          const calendarApi = this.$refs.calendar.getApi();
          const event = calendarApi.getEventById(this.id);
          event.remove();
      })
    }
  },
  mounted() {
    const user_id = localStorage.getItem("user_id");
    axios.get(`/fullcalendar/${user_id}`)
          .then(response => {
            //this.events = response;
            console.log(response);
            this.events = response.data;
          });
  }
}

</script>


<template>
  <div>
  <FullCalendar 
    defaultView="dayGridMonth" 
    :plugins="calendarPlugins" 
    :events="events" 
    eventTextColor="black" 
    :header="header"
    editable=true
    selectable=true
    selectMirror=true
    @select="handleSelect"
    :locales="locales"
    locale="hu"
    @eventClick="handleEventClick"
    ref="calendar"/>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Event details</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Title" v-model="title"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-menu
                    v-model="startDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                    v-if="!allDay"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="startDate"
                        label="Start date"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="startDate" @input="startDateMenu = false"></v-date-picker>
                  </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                  <v-menu
                    ref="startTimeMenu"
                    v-model="startTimeMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="startTime"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                    v-if="!allDay"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="startTime"
                        label="Start time"
                        prepend-icon="access_time"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="startTimeMenu"
                      v-model="startTime"
                      full-width
                      @click:minute="$refs.startTimeMenu.save(startTime)"
                    ></v-time-picker>
                  </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <v-menu
                    v-model="endDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                    v-if="!allDay"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="endDate"
                        label="End date"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="endDate" @input="endDateMenu = false"></v-date-picker>
                  </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                  <v-menu
                    ref="endTimeMenu"
                    v-model="endTimeMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="endTime"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                    v-if="!allDay"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="endTime"
                        label="End time"
                        prepend-icon="access_time"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="endTimeMenu"
                      v-model="endTime"
                      full-width
                      @click:minute="$refs.endTimeMenu.save(endTime)"
                    ></v-time-picker>
                  </v-menu>
              </v-col>
              <v-col cols="12">
                <v-checkbox
                    v-model="allDay"
                    label="All Day Event">
                </v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="red darken-1" text v-if="!creating" @click="handleDelete">Delete</v-btn>
          <v-btn color="blue darken-1" text @click="handleSave">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  </div>
</template>

<style lang='scss'>

@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';

</style>