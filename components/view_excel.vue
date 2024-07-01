<script>
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
export default  {

components: {
  FileUpload,
  Toast
},

  data(){
  return {
    uploadedFiles: [],
  }
  },

  methods: {
    onUpload() {
      this.$toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
    }
  }

}
</script>

<template>
<div>
  <Toast />
  <FileUpload v-model=" uploadedFiles"  mode="basic" name="files[]" @upload="onUpload" :auto="true" chooseLabel="Browse" />
</div>
</template>

<style>

</style>
