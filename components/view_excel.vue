<script>
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import Panel from 'primevue/panel';
import Listbox from 'primevue/listbox';

export default  {

components: {
  FileUpload,
  Toast,
  Panel,
  Listbox
},

  data(){
  return {
    selectedFiles: [],

  }
  },

  methods: {
    async onUpload() {
      try {
        this.$toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
        // Здесь можно обработать ответ от сервера, например, обновить состояние компонента
      } catch (error) {
        console.error('Error uploading file:', error);
      }

    },

  }

}
</script>

<template>
<div>
  <Toast />

  <div class="grid">
    <div class="col-7">
      <FileUpload mode="advanced" name="file" url="upload" @upload="onUpload" :multiple="true" accept=".xls,.xlsx" />
    </div>
    <div class="col-5">
      <Panel header="Log">
        <template #header>
          <div class="flex justify-content-between align-items-center w-full h-2rem">
            <span style="font-weight: bold">Лог</span>
          </div>
        </template>
      </Panel>
    </div>
  </div>



</div>
</template>

<style>
.p-panel-content {
  height: 90vh;

}

.p-fileupload-content {
  height: 90vh;
  overflow-y: auto
}

.p-fileupload .p-fileupload-content {
  padding: 0;
}
.p-fileupload-row {
  align-content: flex-start;
  border-bottom: 1px solid #F8F9F9 ;
  padding: 0;
}

.p-fileupload-row > div {
  flex: auto;
}

.p-fileupload-row > div:first-child {
  width: 0;
}
.p-fileupload-row > div:last-child {
  width: 10%;
}


</style>
