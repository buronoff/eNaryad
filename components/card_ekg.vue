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
          <div style="padding: 5px">
              <span>{{ sxod_vrn }}</span>
              <br>
              <span>
                    <Knob v-model="knob_value" valueTemplate="{value}ч." :min="0" :max="1" :step="0.1" :size="50" />
              </span>
              <br>
              <span>{{ sxod }}</span>
          </div>
        </div>
      </div>



</template>

<script>
import Knob from 'primevue/knob';
export default {
  components: {
    Knob
  },

  data(){
    return{
      knob_value: 0,
      knob_value_toView: 0,

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
      let diff = t_end - t_start
      let hh = diff/3600
      this.knob_value = hh.toFixed(1)
    },





  },

  created(){
    this.timeDuration()
    //setInterval(this.timeDuration, 1000)
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

</style>
