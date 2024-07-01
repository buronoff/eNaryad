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
    onUpload() {
      this.$toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
    },
    onFileSelect(event) {
      let list = []
      list = this.selectedFiles
      list.push(event.files)
      console.log(list)
      this.selectedFiles = event.files
      console.log(this.selectedFiles)
    },
    onUploadSuccess(event) {
      console.log('Файл загружен', event.xhr.response);
    },
    formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  }

}
</script>

<template>
<div>
  <Toast />

  <div class="grid">
    <div class="col-7">
      <FileUpload name="demo[]"  @upload="onUpload" :multiple="true" accept=".xls,.xlsx" :maxFileSize="1000000">
        <template #empty>
          <p>Drag and drop files to here to upload.</p>
        </template>
      </FileUpload>
      <!--
      <Panel >

                <template #header>
                  <div class="flex justify-content-between align-items-center w-full h-2rem">
                    <span style="font-weight: bold">Загрузка файлов</span>
                    <FileUpload name="demo[]"
                                :multiple="true"
                                accept=".xls,.xlsx"
                                :auto="true" chooseLabel="Добавить" />
                  </div>
                </template>
                <div>
                  <div v-if="selectedFiles.length > 0">
                    <ul>
                      <li v-for="(file, index) in selectedFiles" :key="index">
                        {{ file.name }} ({{ formatBytes(file.size) }})
                      </li>
                    </ul>
                  </div>
                </div>
      </Panel>
      -->
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
</style>
