<template>
  <div>

      <div v-if="sxod_vrn === null">
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
              <span>{{ timeDuration_val }}</span>
              <br>
              <span>{{ sxod }}</span>
          </div>
        </div>
      </div>



</template>

<script>

export default {
  data(){
    return{
      timeDuration_val: 'sss'
    }
  },

  props: {
    ekg_numb: { type: String, required: true },
    skl_list: { type: Array, required: false, default: []},
    ac_list: { type: Array, required: false, default: []},
    sxod_vrn: { type: String, required: false, default: ''},
    sxod: { type: String, required: false, default: ''}
  },



  computed: {

  },

  methods: {
    timeDuration(){
      let dt = new Date()
      let vr = dt.getTime()
      this.timeDuration_val = dt.toLocaleTimeString()
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

</style>
