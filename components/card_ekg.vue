<template>
  <div>

      <div v-if="sxod_vrn_unix === 0">
        <div class="flex flex-row justify-content-between align-items-center p-1 h-2rem" style="background-color: #37B7C3; height: 2rem">
          <span>{{ ekg_numb }}</span>
        </div>

        <div class="flex align-items-center flex-wrap text-xs p-1" style="background-color: #eef6fb; border-bottom: 1px solid #088395; height: 3rem">
          <div v-for="skl in skl_list">
              <span class="skl_label_deactiv" v-if="skl.vrk !== null" >
                <b>{{ skl.skl }}</b><sup>&nbsp;{{ skl.vrn }}-{{ skl.vrk }}</sup>
              </span>
            <span class="skl_label" v-else>
                <b>{{ skl.skl }}</b><sup>&nbsp;{{ skl.vrn }}-</sup>
              </span>
          </div>
        </div>

        <div class="flex flex-wrap mt-1" >
          <div class="active_ac shadow-1" v-for="ac in ac_list" v-if="ac !== null">
            <span> {{ ac }}</span>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="flex flex-row justify-content-between align-items-center p-1 h-2rem" style="background-color: #FF7777; height: 2rem">
          <span>{{ ekg_numb }}</span>
        </div>

        <div class="flex align-items-center flex-wrap text-xs p-1" style="background-color: #e0f6f8; border-bottom: 1px solid #088395; height: 3rem">
          <div v-for="skl in skl_list">
              <span class="skl_label_deactiv" v-if="skl.vrk !== null" >
                <b>{{ skl.skl }}</b><sup>&nbsp;{{ skl.vrn }}-{{ skl.vrk }}</sup>
              </span>
              <span class="skl_label" v-else>
                <b>{{ skl.skl }}</b><sup>&nbsp;{{ skl.vrn }}-</sup>
              </span>
          </div>
          </div>
          <div class="flex flex-column">
            <div class="flex justify-content-around align-items-center">
              <div><span style="color: red">{{ sxod_vrn }}</span></div>
              <div>

                <svg width="60" height="60">
                  <circle class="progress-ring_circle" :style="knob_style" fill="transparent" stroke="red" stroke-width="6" cx=30 cy="30" r="22" />
                  <text x="16" y="34" class="progress-ring_circle_label">{{knob_label}}</text>
                  <!--radius = (width/2) - (stroke-width * 2)-->
                </svg>

              </div>
            </div>
            <div>
              <span style="font-size: 0.9em; color: indianred">{{ sxod }}</span>
            </div>
           </div>
        </div>
      </div>



</template>

<script>
import Knob from 'primevue/knob';
import knob_time from '@/components/knob_time'

export default {
  components: {
    Knob,
    knob_time
  },

  data(){
    return{
      knob_value: null,
      knob_label: null,
      knob_style: null
    }
  },

  props: {
    ekg_numb: { type: String, required: true },
    skl_list: { type: Array, required: false, default: []},
    ac_list: { type: Array, required: false, default: []},
    sxod_vrn: { type: String, required: false, default: ''},
    sxod_vrn_unix: { type: Number, required: false, default: 0},
    sxod: { type: String, required: false, default: ''}

  },


  methods: {
    timeDuration() {
      let t_end = Math.floor(new Date().getTime() / 1000);
      let t_start = this.sxod_vrn_unix
      let diff = (t_end - t_start) - 444470
      let hh = diff/3600
      if (hh < 1 ) {
        this.knob_value = (hh*100).toFixed(0)
        this.knob_label = String((hh*60).toFixed(0)) + 'м.'
      } else {
        this.knob_value = 100
        this.knob_label = String(hh.toFixed(1)) + 'ч.'
      }

      const percent = this.knob_value

      const circle = document.querySelector('.progress-ring_circle');
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      const offset = circumference - percent/100 * circumference;
      this.knob_style = "stroke-dashoffset: "+offset
    },

  },

  created(){
    setInterval(this.timeDuration, 1000)
  }

}
</script>

<style>


.skl_label {
  padding: 2px 4px;
  color: #4F6F52;
  font-family: 'Tahoma'
}

.skl_label_deactiv {
  padding: 2px 4px;
  color: #B5C0D0;
  font-family: 'Tahoma'
}

.active_ac {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #36BA98;
  border: 1px solid #379777;
  color: white;
  font-weight: normal;
  width:40px;
  height:40px;
  border-radius: 20px;
  margin: 5px;
}

.progress-ring_circle {
  transform-origin: center;
  transform: rotate(-90deg);
  transition: stroke-dashoffset 0.5s;
}

.progress-ring_circle_label {
  font-size: 0.8em
}


</style>
