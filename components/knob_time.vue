<template>
  <div>
      <svg width="60" height="60">
         <circle class="progress-ring_circle" fill="transparent" stroke="red" stroke-width="6" cx=30 cy="30" r="22" />
         <text x="16" y="34" class="text">text</text>
         <!--radius = (width/2) - (stroke-width * 2)-->
      </svg>
  </div>
</template>

<script>
export default {
  props:{
    val_label: { type: String, required: false, default: '' },
    value: { type: Number, required: false, default: 0 },
  },

  data() {
    return{
      v_class:''
    }
  },

  methods: {

    setprogress(){

      //const percent = this.value
      const percent = 75

      const circle = document.querySelector('.progress-ring_circle');
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;

      circle.style.strokeDasharray = `${circumference} ${circumference}`;

      const offset = circumference - percent/100 * circumference;
      circle.style.strokeDashoffset = offset

    }


  //   async renderKnob(){
  //     const progressElements = document.querySelectorAll('.progressbar');
  //     progressElements.forEach(elem => {
  //       const value = this.value;
  //       if(value >= 50){
  //         elem.classList.add('over_50');
  //       }else{
  //         elem.classList.remove('over_50');
  //       }
  //       const deg = (360 * value / 100) + 180;
  //       elem.querySelector('.piece.right').style.transform = `rotate(${deg}deg)`;
  //     })
  //   },
  },

  watch: {
    value(){
     this.setprogress()
    }
  }
}
</script>

<style>
.progress-ring_circle {
  transform-origin: center;
  transform: rotate(-90deg);
  transition: stroke-dashoffset 0.5s;
}

</style>
