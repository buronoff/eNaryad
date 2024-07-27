<template>
  <div>
      <Toast/>

    <Dialog header="Переадресация автосамовала" :visible.sync="modal_pereadresaciya_show" :containerStyle="{width: '30vw'}" :modal="true" :closable="false">
      <div class="flex flex-row justify-content-between align-items-center">
        <div style="font-size: 1.1em"><span>Пункт погрузки № </span><span class="font-bold">{{drop_ekg}}</span></div>
        <div style="font-size: 1.1em"><span>=></span>  </div>
        <div style="font-size: 1.1em"><span>Автосамосвал № </span><span class="font-bold">{{drag_ac}}</span>  </div>

        <div>
          <InputText type="time" class="p-inputtext-sm" placeholder="Small" autofocus/>
        </div>
      </div>

<!--      <div class="grid">-->
<!--        <div class="col"><span>Пункт погрузки № </span><span class="font-bold">{{drop_ekg}}</span></div>-->
<!--        <div class="col"><span>Автосамосвал № </span><span class="font-bold">{{drag_ac}}</span></div>-->
<!--        <div class="col"><InputText type="time" class="p-inputtext-sm" placeholder="Small" /></div>-->
<!--        <div class="col"><Button label="Small" icon="pi pi-check" class="p-button-sm"/></div>-->
<!--      </div>-->


      <template #footer>
        <Button label="No" icon="pi pi-times" @click="to_hide_modal_pereadresaciya_show" class="p-button-sm p-button-text"/>
        <Button label="Yes" icon="pi pi-check" @click="" class="p-button-sm" />
      </template>
    </Dialog>


      <div v-if="sxod_vrn_unix === 0" @drop="onDrop($event, ekg_numb)" @dragover.prevent  @dragenter.prevent>
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
          <div class="active_ac shadow-1" v-for="ac in ac_list" v-if="ac !== null" draggable="true" @dragstart="startDrag($event, ac)" @dragend="endDrag($event, ac)">
            <span>{{ ac }}</span>
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
                  <circle fill="transparent" stroke="#F8EDED" stroke-width="6" cx=30 cy="30" r="22" style="z-index: -7;" />
                  <circle class="progress-ring_circle" :style="knob_style" fill="transparent" :stroke="knob_stroke_color" stroke-width="6" cx=30 cy="30" r="22" />
                  <text x="14" y="35" class="progress-ring_circle_label">{{knob_label}}</text>
                  <!--radius = (width/2) - (stroke-width * 2)-->
                </svg>

              </div>
            </div>
            <div class="pl-2 pr-2 pb-2">
              <span style="font-size: 0.9em; color: indianred">{{ sxod }}</span>
            </div>
           </div>
        </div>
      </div>



</template>

<script>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';

export default {

  components: {
    Dialog,
    Button,
    Toast,
    InputText

  },

  data(){
    return{
      knob_value: 0,
      knob_label: null,
      knob_style: null,
      knob_stroke_color: '#FF0000',
      drag_ac: null,
      drop_ekg: null,

      modal_pereadresaciya_show: false,

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

    startDrag (event, ac) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('ac_numb', ac);
    },

    endDrag (event, ac) {
      this.drag_ac = event.dataTransfer.getData('ac_numb')
      this.modal_pereadresaciya_show = true
      // let index = this.ac_list.indexOf(ac)
      // this.ac_list.splice(index, 1)
    },

    onDrop(event, ekg) {
      this.drop_ekg = ekg
//      this.ac_list.push(this.drag_ac)

    },

    to_hide_modal_pereadresaciya_show(){
      this.modal_pereadresaciya_show = false
    },

    timeDuration() {
      let val = 0
      let label = ''

      let t_end = Math.floor(new Date().getTime() / 1000);
      let t_start = this.sxod_vrn_unix
      let diff = (t_end - t_start) - 675640
      let hh = diff/3600
      if (hh < 1 ) {
        val = (hh*100).toFixed(0)
        label = String((hh*60).toFixed(0)) + 'м.'
      } else {
        val = 100
        label = String(hh.toFixed(1)) + 'ч.'
      }

      const percent = this.knob_value

      const circle = document.querySelector('.progress-ring_circle');
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      const offset = circumference - percent/100 * circumference;

      this.knob_style = "stroke-dashoffset: "+offset

      if (this.knob_value > 0 && this.knob_value <= 25) {this.knob_stroke_color = '#FFCAD4'}
      if (this.knob_value > 25 && this.knob_value <= 50) {this.knob_stroke_color = '#E78895'}
      if (this.knob_value > 50 && this.knob_value <= 75) {this.knob_stroke_color = '#FF6868'}
      if (this.knob_value > 75 && this.knob_value <= 100) {this.knob_stroke_color = '#FC4100'}

      this.knob_value = val
      this.knob_label = label

    },

  },

  created(){
    setInterval(this.timeDuration, 1000);
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
  transition: stroke-dashoffset 0.1s;
}

.progress-ring_circle_label {
  font-size: 0.8em
}


</style>
